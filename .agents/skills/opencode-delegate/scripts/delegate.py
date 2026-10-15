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
# UI mode resource allowlists. Playwright MCP version change belongs here only.
PLAYWRIGHT_COMMAND = ['npx.cmd', '-y', '@playwright/mcp@0.0.83', '--browser', 'msedge', '--isolated']
IMPECCABLE_LAUNCHERS = ['.opencode/skills/impeccable/scripts/impeccable.cmd',
                        '.opencode/skills/impeccable/scripts/impeccable']
IMPECCABLE_VERBS = ['context', 'detect', 'critique-storage', 'live-server']
EVIDENCE_PATHS = ['.impeccable/critique/*', '.opencode-lab/*']
SERVICE_AGENTS = ['build', 'general', 'explore', 'title', 'summary', 'compaction']
CRITICS = {
    'critic-design': 'Independent design critic: review UI work with the impeccable skill and report findings; never edits app code.',
    'critic-evidence': 'Independent evidence critic: verify UI claims with real browser and CLI tool evidence; never edits app code.',
}
UI_RULES = (
    ' UI shell calls must be single allowed CLI commands: never append Write-Output, echo, cd or discovery. '
    'Do not echo exit codes; the harness reads them from tool events. UI mode: load the project Impeccable skill for real, opening only the reference that matches this task, and use only its shell commands context, detect, '
    'critique-storage and live-server (hooks/install/generate denied); drive the browser through the playwright_* MCP '
    'tools on the isolated msedge profile; do not probe the unavailable native browser namespace. '
    'If a screenshot returns a file link, use read on that saved PNG to receive the image before judging it. Write evidence reports only under .impeccable/critique/* or .opencode-lab/*. '
    'When a critique is requested, name and use the two independent critics critic-design and critic-evidence; never run '
    'them for ordinary tasks. Each critic starts in a fresh independent context that does not inherit this prompt or the '
    'other critic: send a self-contained prompt with the UI, browser and image instructions it needs, and share no '
    'findings between them until synthesis. Back every claim with real tool output; if the browser or skill is unsupported, state the '
    'degradation explicitly and never claim to understand a screenshot without actual support. Call browser_close before '
    'the report. Never submit forms, buy, log in, upload or write real data unless the user explicitly authorized it. '
    'Never switch model and never use paid APIs or keys.'
)
# Visible worker terminal. The CLI output is teed to stdout.txt; the window closes
# itself when the CLI exits (no Read-Host) so the temp directory is never removed
# while the terminal is still open.
VISIBLE_SCRIPT = r"""$ErrorActionPreference = 'Stop'
[Console]::OutputEncoding = [Text.UTF8Encoding]::new()
$OutputEncoding = [Console]::OutputEncoding
Set-Location -LiteralPath $env:OPENCODE_VISIBLE_CWD
$command = Get-Content -LiteralPath "$PSScriptRoot/command.json" -Raw -Encoding UTF8 | ConvertFrom-Json
$exe = $command[0]
$cliArgs = $command[1..($command.Count - 1)]
$code = 1
try {
  Get-Content -LiteralPath "$PSScriptRoot/prompt.txt" -Raw -Encoding UTF8 | & $exe @cliArgs 2> "$PSScriptRoot/stderr.txt" | Tee-Object -FilePath "$PSScriptRoot/stdout.txt"
  $code = $LASTEXITCODE
} catch { $_ | Out-File -LiteralPath "$PSScriptRoot/stderr.txt" -Encoding utf8 }
$code | Out-File -LiteralPath "$PSScriptRoot/exit.txt" -Encoding ascii
"""


def safe_text(text):
    if SECRET.search(text):
        raise ValueError('Potential secret detected; redact locally before delegation')
    return text


def check_price(model, catalog):
    if not model.startswith('opencode/'):
        raise ValueError('Only explicitly selected opencode provider models are supported')
    entry = catalog['opencode']['models'].get(model.split('/', 1)[1])
    if not entry or entry.get('status') == 'deprecated':
        raise ValueError('Model missing or deprecated in live catalog')
    cost = entry.get('cost', {})
    if cost.get('input') != 0 or cost.get('output') != 0 or any(
        value != 0 for value in cost.values()
    ):
        raise ValueError('Model pricing is nonzero or unknown')
    return {'cost': cost, 'limit': entry.get('limit'), 'source': SETTINGS['pricing_url']}


def configuration(model, mode, ui=False):
    permissions = [{'action': '*', 'resource': '*', 'effect': 'deny'}]
    policies = [
        {'action': 'provider.use', 'resource': '*', 'effect': 'deny'},
        {'action': 'provider.use', 'resource': 'opencode', 'effect': 'allow'},
        {'action': 'integration.use', 'resource': 'mcp:*', 'effect': 'deny'},
        {'action': 'integration.use', 'resource': 'skill:*', 'effect': 'deny'},
        {'action': 'tool.use', 'resource': '*', 'effect': 'deny'},
    ]

    def allow(action, resource, policy=None):
        permissions.append({'action': action, 'resource': resource, 'effect': 'allow'})
        policies.append({'action': 'tool.use', 'resource': policy or f'{action}:{resource}', 'effect': 'allow'})

    for action in ['read', 'glob', 'grep', *(['edit'] if mode == 'edit' else [])]:
        allow(action, '*')
    # The model may run project checks, not arbitrary host shell commands.
    for command in (['npm run typecheck', 'npm run check', 'npm run build', 'npm run test:ui', 'npm test', 'node --test', 'node --test *'] if mode == 'edit' else []):
        allow('shell', command)
    if ui:
        # Opt-in UI mode: impeccable skill, narrow CLI verbs, Playwright MCP and named critics.
        allow('skill', 'impeccable')
        policies.append({'action': 'integration.use', 'resource': 'skill:impeccable', 'effect': 'allow'})
        policies.append({'action': 'integration.use', 'resource': 'mcp:playwright', 'effect': 'allow'})
        permissions.append({'action': 'playwright_*', 'resource': '*', 'effect': 'allow'})
        policies.append({'action': 'tool.use', 'resource': 'playwright_*:*', 'effect': 'allow'})
        allow('execute', '*')
        # Verb takes arguments as a separate word: `verb *` (not `verb*`, which would
        # also allow lookalikes such as `contextx` or `detection`).
        for launcher in IMPECCABLE_LAUNCHERS:
            for path in [launcher, f'./{launcher}']:
                for verb in IMPECCABLE_VERBS:
                    allow('shell', f'{path} {verb} *')
        for path in EVIDENCE_PATHS:
            allow('edit', path)
        for agent_id in CRITICS:
            allow('subagent', agent_id)
    for pattern in ['.git/*', '*/.git/*', '.env', '.env.*', '*/.env', '*/.env.*', '*.pem', '*.key']:
        for action in ['read', 'edit']:
            policies.append({'action': 'tool.use', 'resource': f'{action}:{pattern}', 'effect': 'deny'})
    for pattern in ['opencode.json*', '*/opencode.json*', '.opencode/*', '*/.opencode/*', '.agents/*', '*/.agents/*', '.codex/*', '*/.codex/*', '.cursor/*', '*/.cursor/*', 'AGENTS.md', '*/AGENTS.md']:
        policies.append({'action': 'tool.use', 'resource': f'edit:{pattern}', 'effect': 'deny'})
    # Pin service agents and the two critics to the selected free model.
    model_ref = {'providerID': 'opencode', 'model': model.split('/', 1)[1]}
    agents = {name: {'model': model_ref, 'permissions': permissions, 'steps': 40 if name == 'build' else 20}
              for name in SERVICE_AGENTS}
    config = {
        '$schema': 'https://opencode.ai/config.json', 'model': model,
        'default_agent': 'build', 'snapshots': False, 'formatter': False,
        'lsp': False, 'warming': False, 'compaction': {'auto': False},
        'permissions': permissions, 'policies': policies, 'agents': agents,
    }
    if ui:
        config['mcp'] = {'servers': {'playwright': {'type': 'local', 'command': PLAYWRIGHT_COMMAND, 'codemode': False}}}
        # Critics mirror UI mode but keep app code read-only and cannot spawn further subagents.
        critic_permissions = [r for r in permissions
                              if not (r['action'] == 'edit' and r['resource'] == '*') and r['action'] != 'subagent']
        critic_permissions.extend([{'action': 'edit', 'resource': '*', 'effect': 'deny'},
                                   *[{'action': 'edit', 'resource': path, 'effect': 'allow'} for path in EVIDENCE_PATHS],
                                   {'action': 'subagent', 'resource': '*', 'effect': 'deny'}])
        for agent_id, description in CRITICS.items():
            agents[agent_id] = {'description': description, 'mode': 'subagent', 'model': model_ref,
                                'permissions': critic_permissions, 'steps': 20}
    return config


def environment(runtime):
    # Allowlist inherited OS variables; never inherit API keys or provider config.
    keep = {'PATH', 'PATHEXT', 'SYSTEMROOT', 'WINDIR', 'COMSPEC', 'TEMP', 'TMP',
            'USERPROFILE', 'APPDATA', 'LOCALAPPDATA', 'PROGRAMDATA', 'SYSTEMDRIVE',
            'PROGRAMFILES', 'PROGRAMFILES(X86)', 'PROGRAMW6432'}
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



def execute_visible(command, cwd, env, timeout, input_text=None):
    if os.name != 'nt':
        raise ValueError('Visible terminal launcher currently requires Windows; no hidden fallback')
    started = time.monotonic()
    with tempfile.TemporaryDirectory(prefix='opencode-terminal-') as directory:
        runtime = Path(directory)
        (runtime / 'prompt.txt').write_text(input_text or '', encoding='utf-8')
        (runtime / 'command.json').write_text(json.dumps(command), encoding='utf-8')
        script = runtime / 'run.ps1'
        # No Read-Host: the worker terminal closes itself when the CLI exits so the
        # temporary directory can be removed without racing a live window.
        script.write_text(VISIBLE_SCRIPT, encoding='utf-8-sig')
        child_env = {**env, 'OPENCODE_VISIBLE_CWD': str(cwd)}
        process = subprocess.Popen(['powershell.exe', '-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', str(script)],
                                   cwd=cwd, env=child_env, creationflags=subprocess.CREATE_NEW_CONSOLE)
        early = timed_out = False
        while not (runtime / 'exit.txt').exists():
            if process.poll() is not None:
                early = True
                break
            if time.monotonic() - started > timeout:
                timed_out = True
                subprocess.run(['taskkill', '/PID', str(process.pid), '/T', '/F'], capture_output=True, check=False)
                break
            time.sleep(0.2)
        # Let the process fully exit before TemporaryDirectory cleanup removes its files.
        try:
            process.wait(timeout=15)
        except subprocess.TimeoutExpired:
            subprocess.run(['taskkill', '/PID', str(process.pid), '/T', '/F'], capture_output=True, check=False)
            try:
                process.wait(timeout=15)
            except subprocess.TimeoutExpired:
                pass

        def read_output(name):
            path = runtime / name
            data = path.read_bytes() if path.exists() else b''
            return data.decode('utf-16' if data.startswith(b'\xff\xfe') else 'utf-8-sig', errors='replace')

        code = int(read_output('exit.txt').strip() or 1)
        stderr = read_output('stderr.txt')
        if early:
            stderr = (stderr + '\nVisible terminal closed before the CLI wrote a result').strip()
        elif timed_out:
            stderr = (stderr + '\nVisible terminal timed out').strip()
        return code, read_output('stdout.txt'), stderr, timed_out, round(time.monotonic() - started, 3), early


def compact(value, limit=200):
    """One-line, length-capped text so evidence never carries payloads or base64."""
    if value is None:
        return None
    text = ' '.join(str(value).split())
    return text if len(text) <= limit else text[:limit] + '...'


def tool_evidence(events):
    """Compact evidence from tool events: name, command/path, numeric exit, short error.

    Exits stay None when the event carries none (missing or non-numeric). Failed and
    denied calls are listed here as such and never mean a check passed.
    """
    items = []
    for event in events:
        if event.get('type') not in {'tool_use', 'tool'}:
            continue
        part = event.get('part') if isinstance(event.get('part'), dict) else {}
        state = part.get('state') if isinstance(part.get('state'), dict) else {}
        inputs = state.get('input') if isinstance(state.get('input'), dict) else {}
        metadata = state.get('metadata') if isinstance(state.get('metadata'), dict) else {}
        nested = metadata.get('metadata') if isinstance(metadata.get('metadata'), dict) else {}
        exit_code = nested.get('exit', metadata.get('exit'))
        if isinstance(exit_code, bool) or not isinstance(exit_code, int):
            exit_code = None
        error = state.get('error') or metadata.get('error')
        if isinstance(error, dict):
            error = error.get('message') or error.get('name')
        item = {'tool': compact(part.get('tool') or part.get('name'), 60) or 'unknown',
                'status': compact(state.get('status'), 40) or 'unknown', 'exit': exit_code}
        command = inputs.get('command')
        if command is not None:
            item['command'] = compact(command)
        path = inputs.get('filePath') or inputs.get('path') or inputs.get('file_path')
        if path is not None:
            item['path'] = compact(path)
        if error:
            item['error'] = compact(error)
        items.append(item)
    return items


def parse_result(stdout, code, timeout, early_close=False):
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
    elif early_close:
        status = 'terminal_closed'
    elif 'FreeTierError' in json.dumps(errors) or 'free tier can only' in json.dumps(errors):
        status = 'free_tier_rejected'
    elif any('auth' in str(e.get('type', '')) for e in errors if isinstance(e, dict)):
        status = 'auth_error'
    elif any('no-route' in str(e) for e in errors):
        status = 'model_unavailable'
    if code == 0 and answer.strip() and not errors and not malformed and not timeout and (
        re.search(r'maximum (?:number of )?steps|maximum number of steps allowed', answer, re.I)
        or any(e.get('part', {}).get('reason') in {'max_steps', 'max-steps', 'length'} for e in events if e.get('type') == 'step_finish')
    ):
        status = 'incomplete'
    usage = [e.get('part') for e in events if e.get('type') == 'step_finish']
    return {'status': status, 'errors': errors, 'answer': answer, 'usage_events': usage,
            'events': events, 'evidence': tool_evidence(events),
            'unparsed_stdout': malformed, 'acceptance': 'requires_codex_review'}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--root', type=Path, default=Path.cwd())
    parser.add_argument('--task', type=Path)
    parser.add_argument('--mode', choices=['analysis', 'edit'], default='analysis')
    parser.add_argument('--model', default=SETTINGS['primary'])
    parser.add_argument('--output', type=Path)
    parser.add_argument('--list-models', action='store_true', help='List anonymous zero-price models; no generation')
    parser.add_argument('--timeout', type=int, default=180)
    parser.add_argument('--ui', action='store_true', help='Opt in to UI mode: impeccable skill, Playwright MCP and named critics')
    args = parser.parse_args()
    if not args.list_models and (args.task is None or args.output is None):
        parser.error('--task and --output are required for a model run')
    report = {'status': 'preflight_error', 'model': args.model, 'mode': args.mode, 'ui': args.ui,
              'reported_cost': None, 'acceptance': 'requires_codex_review'}
    output = None
    started = time.monotonic()
    try:
        if args.timeout < 1 or args.timeout > 600:
            raise ValueError('Timeout must be 1..600 seconds')
        root = args.root.resolve(strict=True)
        task = '' if args.list_models else safe_text(args.task.read_text(encoding='utf-8-sig'))
        if len(task.encode('utf-8')) > 50000:
            raise ValueError('Task exceeds 50000 bytes')
        exe = cli_path()
        request = urllib.request.Request(SETTINGS['pricing_url'], headers={'User-Agent': 'OpenCode-Agent-Lab/1.0', 'Accept': 'application/json'})
        with urllib.request.urlopen(request, timeout=20) as response:
            catalog = json.load(response)
        pricing = None if args.list_models else check_price(args.model, catalog)
        if not args.list_models:
            destination = args.output.resolve()
            destination.mkdir(parents=True, exist_ok=False)
            output = destination
        workspace = root
        config = configuration(args.model, args.mode, args.ui)
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
            if available[0]:
                raise ValueError('Anonymous CLI model discovery failed')
            if args.list_models:
                free_models = []
                for model in report['available_models']:
                    try:
                        metadata = check_price(model, catalog)
                    except (ValueError, KeyError):
                        continue
                    free_models.append({'id': model, 'limit': metadata['limit']})
                print(json.dumps({'free_models': free_models}, ensure_ascii=True))
                return 0
            if args.model not in report['available_models']:
                report['status'] = 'model_unavailable'
                raise ValueError('Selected model unavailable in fresh anonymous CLI catalog')
            tools = ('Read/search only: read lists directories, glob finds files, grep searches text. No app edits; UI tools below are the only exceptions.'
                     if args.mode == 'analysis' else
                     'Use read/glob/grep, edit existing files, write new files. Shell ONLY: npm run typecheck, npm run check, npm run build, npm run test:ui, npm test, node --test [test paths]. No shell discovery or file deletion; report exact deletion paths for Codex.')
            action = 'Return the requested analysis.' if args.mode == 'analysis' else 'Implement the requested change without a separate reconnaissance report.'
            prompt = ('Task from Codex. Work in the current project only. ' + tools + (UI_RULES if args.ui else '')
                      + ' Read only relevant files. ' + action + ' '
                      + 'End with a compact report: changed paths and purpose; exact check commands with pass/fail '
                      + 'counts; remaining blockers. Do not echo exit codes and do not claim unrun tests passed.\n' + task)
            result = execute_visible([exe, 'run', '--standalone', '--agent', 'build', '--model', args.model,
                              '--format', 'json', '--title', 'Codex delegation lab'],
                             workspace, env, args.timeout, prompt)
            code, stdout, stderr, timeout, elapsed, early = result
            report.update(parse_result(stdout, code, timeout, early))
            report.update(exit_code=code, duration_seconds=elapsed, stderr=stderr,
                          cli_version=version[1].strip(), pricing=pricing, root=str(root))
            costs = [p['cost'] for p in report['usage_events'] if isinstance(p, dict) and isinstance(p.get('cost'), (int, float))]
            report['reported_cost'] = sum(costs) if costs else None
    except (OSError, ValueError, KeyError) as error:
        report['error'] = str(error)
    report['total_duration_seconds'] = round(time.monotonic() - started, 3)
    if output:
        (output / 'report.json').write_text(json.dumps(report, indent=2, ensure_ascii=False), encoding='utf-8')
    summary = {k: report[k] for k in ('status', 'model', 'reported_cost', 'exit_code', 'duration_seconds', 'total_duration_seconds', 'error') if k in report}
    summary['evidence'] = report.get('evidence', [])
    if report.get('answer'):
        summary['answer'] = report['answer'][-2500:]
    summary['report'] = str(output / 'report.json') if output else None
    print(json.dumps(summary, ensure_ascii=True))
    return 0 if report['status'] == 'completed' else 1


if __name__ == '__main__':
    sys.exit(main())
