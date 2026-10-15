"""Free-only OpenCode V2 subagent working in the specified project."""
import argparse
import json
import os
from pathlib import Path
import re
import shutil
import subprocess
import sys
import tempfile
import time
import urllib.request

SETTINGS = json.loads((Path(__file__).resolve().parents[1] / 'models.json').read_text())
SECRET = re.compile(r'-----BEGIN .*PRIVATE KEY-----|\b(?:sk-(?:proj-)?[A-Za-z0-9_-]{16,}|AKIA[A-Z0-9]{16})\b|(?i:(?:api[_-]?key|password|secret|access[_-]?token)\s*[:=]\s*[\"\x27]?[A-Za-z0-9_/-]{12,})')


def safe_text(text):
    if SECRET.search(text):
        raise ValueError('Potential secret detected; redact locally before delegation')
    return text


def check_price(model, catalog):
    if model not in [SETTINGS['primary'], *SETTINGS['backups']]:
        raise ValueError('Model is outside the explicit free allowlist')
    entry = catalog['opencode']['models'].get(model.split('/', 1)[1])
    if not entry or entry.get('status') == 'deprecated':
        raise ValueError('Model missing or deprecated in live catalog')
    cost = entry.get('cost', {})
    if cost.get('input') != 0 or cost.get('output') != 0 or any(
        value != 0 for value in cost.values()
    ):
        raise ValueError('Model pricing is nonzero or unknown')
    return {'cost': cost, 'limit': entry.get('limit'), 'source': SETTINGS['pricing_url']}


def configuration(model, mode):
    permissions = [{'action': '*', 'resource': '*', 'effect': 'deny'}]
    policies = [
        {'action': 'provider.use', 'resource': '*', 'effect': 'deny'},
        {'action': 'provider.use', 'resource': 'opencode', 'effect': 'allow'},
        {'action': 'integration.use', 'resource': 'mcp:*', 'effect': 'deny'},
        {'action': 'integration.use', 'resource': 'skill:*', 'effect': 'deny'},
        {'action': 'tool.use', 'resource': '*', 'effect': 'deny'},
    ]
    for action in ['read', 'glob', 'grep', *(['edit'] if mode == 'edit' else [])]:
        permissions.append({'action': action, 'resource': '*', 'effect': 'allow'})
        policies.append({'action': 'tool.use', 'resource': f'{action}:*', 'effect': 'allow'})
    # The model may run project checks, not arbitrary host shell commands.
    for command in (['npm run typecheck', 'npm run check', 'npm run build', 'npm test', 'node --test', 'node --test *'] if mode == 'edit' else []):
        permissions.append({'action': 'shell', 'resource': command, 'effect': 'allow'})
        policies.append({'action': 'tool.use', 'resource': f'shell:{command}', 'effect': 'allow'})
    for pattern in ['.git/*', '*/.git/*', '.env', '.env.*', '*/.env', '*/.env.*', '*.pem', '*.key']:
        for action in ['read', 'edit']:
            policies.append({'action': 'tool.use', 'resource': f'{action}:{pattern}', 'effect': 'deny'})
    for pattern in ['opencode.json*', '*/opencode.json*', '.opencode/*', '*/.opencode/*', '.agents/*', '*/.agents/*', '.codex/*', '*/.codex/*', '.cursor/*', '*/.cursor/*', 'AGENTS.md', '*/AGENTS.md']:
        policies.append({'action': 'tool.use', 'resource': f'edit:{pattern}', 'effect': 'deny'})
    # Pin service agents as well as the main agent to the selected free model.
    model_ref = {'providerID': 'opencode', 'model': model.split('/', 1)[1]}
    return {
        '$schema': 'https://opencode.ai/config.json', 'model': model,
        'default_agent': 'build', 'snapshots': False, 'formatter': False,
        'lsp': False, 'warming': False, 'compaction': {'auto': False},
        'permissions': permissions, 'policies': policies,
        'agents': {name: {'model': model_ref, 'permissions': permissions, 'steps': 20}
                   for name in ['build', 'title', 'summary', 'compaction']},
    }


def environment(runtime):
    # Allowlist inherited OS variables; never inherit API keys or provider config.
    keep = {'PATH', 'PATHEXT', 'SYSTEMROOT', 'WINDIR', 'COMSPEC', 'TEMP', 'TMP',
            'USERPROFILE', 'APPDATA', 'LOCALAPPDATA', 'PROGRAMDATA', 'SYSTEMDRIVE'}
    env = {k: v for k, v in os.environ.items() if k.upper() in keep}
    for kind in ['CONFIG', 'DATA', 'CACHE', 'STATE']:
        env[f'XDG_{kind}_HOME'] = str(runtime / kind.lower())
    return env


def cli_path():
    found = shutil.which('opencode.exe') or shutil.which('opencode.cmd') or shutil.which('opencode')
    if not found:
        raise ValueError('Install official OpenCode V2 first: npm install -g @opencode/cli')
    path = Path(found)
    if path.suffix.lower() in {'.cmd', '.ps1'}:
        path = path.parent / 'node_modules/@opencode/cli/bin/opencode.exe'
    if not path.is_file():
        raise ValueError('Native OpenCode executable not found')
    return str(path)


def execute(command, cwd, env, timeout, input_text=None):
    started = time.monotonic()
    process = subprocess.Popen(command, cwd=cwd, env=env, stdin=subprocess.PIPE,
                               stdout=subprocess.PIPE, stderr=subprocess.PIPE,
                               text=True, encoding='utf-8', errors='replace', shell=False)
    timed_out = False
    try:
        stdout, stderr = process.communicate(input_text, timeout=timeout)
    except subprocess.TimeoutExpired:
        timed_out = True
        if os.name == 'nt':
            subprocess.run(['taskkill', '/PID', str(process.pid), '/T', '/F'],
                           capture_output=True, check=False)
        process.kill()
        stdout, stderr = process.communicate()
    return process.returncode, stdout, stderr, timed_out, round(time.monotonic() - started, 3)


def parse_result(stdout, code, timeout):
    events, malformed = [], []
    for line in stdout.splitlines():
        if not line.strip():
            continue
        try:
            event = json.loads(line)
            if not isinstance(event, dict):
                malformed.append(line)
                continue
            events.append(event)
        except json.JSONDecodeError:
            malformed.append(line)
    errors = [e.get('error') for e in events if e.get('type') == 'error']
    answer = '\n'.join(e.get('part', {}).get('text', '') for e in events if e.get('type') == 'text')
    # V2.0.29 can emit the final text without a final step_finish event.
    final_text = bool(events) and events[-1].get('type') == 'text'
    final_stop = bool(events) and events[-1].get('type') == 'step_finish' and events[-1].get('part', {}).get('reason') == 'stop'
    status = 'completed' if code == 0 and answer.strip() and (final_text or final_stop) and not errors and not malformed else 'cli_error'
    if timeout:
        status = 'timeout'
    elif 'FreeTierError' in json.dumps(errors) or 'free tier can only' in json.dumps(errors):
        status = 'free_tier_rejected'
    elif any('auth' in str(e.get('type', '')) for e in errors if isinstance(e, dict)):
        status = 'auth_error'
    elif any('no-route' in str(e) for e in errors):
        status = 'model_unavailable'
    usage = [e.get('part') for e in events if e.get('type') == 'step_finish']
    return {'status': status, 'errors': errors, 'answer': answer, 'usage_events': usage,
            'events': events, 'unparsed_stdout': malformed, 'acceptance': 'requires_codex_review'}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--root', type=Path, required=True)
    parser.add_argument('--task', type=Path, required=True)
    parser.add_argument('--mode', choices=['analysis', 'edit'], default='analysis')
    parser.add_argument('--model', default=SETTINGS['primary'])
    parser.add_argument('--output', type=Path, required=True)
    parser.add_argument('--timeout', type=int, default=180)
    args = parser.parse_args()
    report = {'status': 'preflight_error', 'model': args.model, 'mode': args.mode,
              'reported_cost': None, 'acceptance': 'requires_codex_review'}
    output = None
    started = time.monotonic()
    try:
        if args.timeout < 1 or args.timeout > 600:
            raise ValueError('Timeout must be 1..600 seconds')
        root = args.root.resolve(strict=True)
        task = safe_text(args.task.read_text(encoding='utf-8-sig'))
        if len(task.encode('utf-8')) > 50000:
            raise ValueError('Task exceeds 50000 bytes')
        exe = cli_path()
        request = urllib.request.Request(SETTINGS['pricing_url'], headers={'User-Agent': 'OpenCode-Agent-Lab/1.0', 'Accept': 'application/json'})
        with urllib.request.urlopen(request, timeout=20) as response:
            catalog = json.load(response)
        pricing = check_price(args.model, catalog)
        destination = args.output.resolve()
        destination.mkdir(parents=True, exist_ok=False)
        output = destination
        workspace = root
        config = configuration(args.model, args.mode)
        with tempfile.TemporaryDirectory(prefix='opencode-delegate-') as temp:
            runtime = Path(temp)
            env = environment(runtime)
            # Use the same official catalog for CLI discovery and the price gate.
            catalog_file = runtime / 'models.json'
            catalog_file.write_text(json.dumps(catalog), encoding='utf-8')
            env['OPENCODE_MODELS_PATH'] = str(catalog_file)
            config_dir = runtime / 'config/opencode'
            config_dir.mkdir(parents=True)
            (config_dir / 'opencode.json').write_text(json.dumps(config, indent=2), encoding='utf-8')
            version = execute([exe, '--version'], workspace, env, 15)
            if version[0] or not version[1].strip().startswith('opencode v2.'):
                raise ValueError('This wrapper requires official OpenCode V2')
            # Anonymous catalog must expose the exact selected model before any call.
            available = execute([exe, 'models', '--standalone'], workspace, env, 30)
            report['available_models'] = available[1].splitlines()
            if available[0] or args.model not in report['available_models']:
                report['status'] = 'model_unavailable'
                raise ValueError('Selected model unavailable in fresh anonymous CLI catalog')
            prompt = ('Task from Codex. Work in the current project only. '
                      + ('Analyze only. ' if args.mode == 'analysis' else 'Implement the requested changes. ')
                      + '\n' + task)
            result = execute([exe, 'run', '--standalone', '--agent', 'build', '--model', args.model,
                              '--format', 'json', '--title', 'Codex delegation lab'],
                             workspace, env, args.timeout, prompt)
            code, stdout, stderr, timeout, elapsed = result
            report.update(parse_result(stdout, code, timeout))
            report.update(exit_code=code, duration_seconds=elapsed, stderr=stderr,
                          cli_version=version[1].strip(), pricing=pricing, root=str(root))
            costs = [p['cost'] for p in report['usage_events'] if isinstance(p, dict) and isinstance(p.get('cost'), (int, float))]
            report['reported_cost'] = sum(costs) if costs else None
    except (OSError, ValueError, KeyError) as error:
        report['error'] = str(error)
    report['total_duration_seconds'] = round(time.monotonic() - started, 3)
    if output:
        (output / 'report.json').write_text(json.dumps(report, indent=2, ensure_ascii=False), encoding='utf-8')
    summary = {k: v for k, v in report.items() if k not in {'events', 'answer', 'usage_events', 'unparsed_stdout'}}
    summary['report'] = str(output / 'report.json') if output else None
    print(json.dumps(summary, ensure_ascii=True))
    return 0 if report['status'] == 'completed' else 1


if __name__ == '__main__':
    sys.exit(main())
