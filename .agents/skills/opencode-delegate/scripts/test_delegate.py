"""Offline regression checks; no model requests."""
import json
import os
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest
from unittest.mock import patch

import delegate as d


class DelegateTests(unittest.TestCase):
    def test_price_gate(self):
        name = d.SETTINGS['primary'].split('/', 1)[1]
        entry = {'cost': {'input': 0, 'output': 0, 'cache_read': 0}}
        catalog = {'opencode': {'models': {name: entry}}}
        self.assertEqual(d.check_price(d.SETTINGS['primary'], catalog)['cost']['input'], 0)
        for cost in [{'input': 1, 'output': 0}, {'input': 0}, {'input': 0, 'output': 0, 'cache_read': 1}]:
            entry['cost'] = cost
            with self.assertRaises(ValueError):
                d.check_price(d.SETTINGS['primary'], catalog)
        with self.assertRaises(ValueError):
            d.check_price('opencode/paid', catalog)
        entry['cost'] = {'input': 0, 'output': 0}
        catalog['opencode']['models']['another-free'] = entry
        self.assertEqual(d.check_price('opencode/another-free', catalog)['cost']['input'], 0)
        with self.assertRaises(ValueError):
            d.check_price('other/another-free', catalog)

    def test_credentials_not_inherited(self):
        with patch.dict(os.environ, {'OPENAI_API_KEY': 'synthetic', 'OPENCODE_API_KEY': 'synthetic', 'OPENCODE_CONFIG': 'unsafe', 'PROGRAMFILES': 'C:/Program Files', 'PROGRAMFILES(X86)': 'C:/Program Files (x86)'}):
            env = d.environment(Path('runtime').resolve())
            self.assertNotIn('OPENAI_API_KEY', env)
            self.assertNotIn('OPENCODE_API_KEY', env)
            self.assertNotIn('OPENCODE_CONFIG', env)
            self.assertIn('XDG_DATA_HOME', env)
            self.assertEqual(env['PROGRAMFILES'], 'C:/Program Files')
            self.assertEqual(env['PROGRAMFILES(X86)'], 'C:/Program Files (x86)')

    def test_analysis_and_edit_policies(self):
        analysis = d.configuration(d.SETTINGS['primary'], 'analysis')
        edit = d.configuration(d.SETTINGS['primary'], 'edit')
        def permits(config, action, resource):
            import fnmatch
            rules = config['policies']
            matching = [r for r in rules if r['action'] == 'tool.use' and fnmatch.fnmatchcase(f'{action}:{resource}', r['resource'])]
            return matching[-1]['effect'] == 'allow'
        self.assertTrue(permits(analysis, 'read', 'src/AgencyApp.tsx'))
        self.assertFalse(permits(analysis, 'edit', 'src/AgencyApp.tsx'))
        self.assertFalse(permits(analysis, 'shell', 'npm run build'))
        self.assertTrue(permits(edit, 'edit', 'src/AgencyApp.tsx'))
        self.assertFalse(permits(edit, 'external_directory', 'C:/Users/other/*'))
        self.assertFalse(permits(edit, 'shell', 'git push'))
        self.assertFalse(permits(edit, 'shell', 'npm run build && git push'))
        self.assertTrue(permits(edit, 'shell', 'npm run typecheck'))
        self.assertTrue(permits(edit, 'shell', 'node --test total.test.mjs'))
        self.assertFalse(permits(edit, 'edit', 'D:/project/.git/config'))
        self.assertFalse(permits(edit, 'edit', '.agents/skills/test/SKILL.md'))

    def test_json_results(self):
        text = json.dumps({'type': 'text', 'part': {'text': 'Evidence'}})
        error = json.dumps({'type': 'error', 'error': {'type': 'provider.auth', 'message': 'free tier can only be used from within OpenCode'}})
        self.assertEqual(d.parse_result(text, 0, False)['status'], 'completed')
        self.assertEqual(d.parse_result(error, 0, False)['status'], 'free_tier_rejected')
        self.assertEqual(d.parse_result('', 0, False)['status'], 'cli_error')
        self.assertEqual(d.parse_result('not json', 0, False)['status'], 'cli_error')
        self.assertEqual(d.parse_result('null', 0, False)['status'], 'cli_error')
        partial = text + '\n' + json.dumps({'type': 'step_finish', 'part': {'reason': 'tool-calls'}})
        self.assertEqual(d.parse_result(partial, 0, False)['status'], 'cli_error')
        self.assertEqual(d.parse_result(text, 0, True)['status'], 'timeout')
        exhausted = json.dumps({'type': 'text', 'part': {'text': 'The maximum number of steps allowed for this agent have been reached.'}})
        self.assertEqual(d.parse_result(exhausted, 0, False)['status'], 'incomplete')
        limited = text + '\n' + json.dumps({'type': 'step_finish', 'part': {'reason': 'length'}})
        self.assertEqual(d.parse_result(limited, 0, False)['status'], 'incomplete')
        self.assertEqual(d.parse_result(text, 0, False, True)['status'], 'terminal_closed')
        self.assertEqual(d.parse_result(text, 0, True, False)['status'], 'timeout')

    def test_evidence_extraction(self):
        def tool(name, status='completed', command=None, path=None, exit_code=None,
                 error=None, output=''):
            state = {'status': status, 'input': {}, 'metadata': {}, 'output': output}
            if command is not None:
                state['input']['command'] = command
            if path is not None:
                state['input']['filePath'] = path
            if exit_code is not None:
                state['metadata']['metadata'] = {'exit': exit_code}
            if error is not None:
                state['error'] = error
            return json.dumps({'type': 'tool_use', 'part': {'tool': name, 'state': state}})

        stdout = '\n'.join([
            tool('shell', command='npm run typecheck', exit_code=0),
            tool('shell', command='npm run test:ui', status='error', exit_code=1,
                 error='exit status 1', output='X' * 5000),
            tool('read', path='.opencode-lab/ui-smoke.png', output='data:image/png;base64,QUJD'),
            tool('shell', command='git push', status='error',
                 error={'name': 'PermissionDenied', 'message': 'denied by policy'}),
            json.dumps({'type': 'text', 'part': {'text': 'Report'}}),
            json.dumps({'type': 'step_finish', 'part': {'reason': 'stop'}}),
        ])
        report = d.parse_result(stdout, 0, False)
        # A completed CLI with a failed check is not a passing check: it stays visible.
        self.assertEqual(report['status'], 'completed')
        evidence = report['evidence']
        self.assertEqual(evidence[0], {'tool': 'shell', 'status': 'completed',
                                       'exit': 0, 'command': 'npm run typecheck'})
        self.assertEqual(evidence[1]['exit'], 1)
        self.assertEqual(evidence[1]['error'], 'exit status 1')
        self.assertEqual(evidence[2]['path'], '.opencode-lab/ui-smoke.png')
        self.assertIsNone(evidence[2]['exit'])
        # Denied command and missing exit stay unknown instead of passing.
        self.assertEqual(evidence[3]['error'], 'denied by policy')
        self.assertIsNone(evidence[3]['exit'])
        # Compact: no tool payload or image data leaks into evidence.
        rendered = json.dumps(evidence)
        self.assertNotIn('base64', rendered)
        self.assertNotIn('XXXX', rendered)
        self.assertLess(len(rendered), 1000)
        # Unexpected/partial tool events stay usable rather than crashing.
        self.assertEqual(d.parse_result(json.dumps({'type': 'tool'}), 0, False)['evidence'],
                         [{'tool': 'unknown', 'status': 'unknown', 'exit': None}])

    def test_ui_verb_patterns_reject_lookalikes(self):
        import fnmatch
        ui = d.configuration(d.SETTINGS['primary'], 'analysis', ui=True)
        allows = [r['resource'] for r in ui['policies']
                  if r['action'] == 'tool.use' and r['effect'] == 'allow']

        def permits(command):
            matches = [r for r in allows if fnmatch.fnmatchcase(f'shell:{command}', r)]
            return bool(matches)

        cli = '.opencode/skills/impeccable/scripts/impeccable.cmd'
        self.assertTrue(permits(f'{cli} detect --json src'))
        self.assertFalse(permits(f'{cli} detection --json src'))
        self.assertFalse(permits(f'{cli} contextx --target src/AgencyApp.tsx'))
        self.assertFalse(permits(f'{cli} live-server-evil --background'))
        # One reviewed allow rule per resource: the execute duplicate is gone.
        self.assertEqual(len(allows), len(set(allows)))

    def test_unicode_and_quotes_without_shell(self):
        with tempfile.TemporaryDirectory(prefix='delegate test ') as directory:
            prompt = 'Русский "текст" & $value `x`\nnext'
            result = d.execute([sys.executable, '-c', 'import sys; print(sys.stdin.read())'],
                               directory, os.environ.copy(), 10, prompt)
            self.assertEqual(result[0], 0)
            self.assertEqual(result[1].strip(), prompt)

    def test_timeout(self):
        result = d.execute([sys.executable, '-c', 'import time; time.sleep(30)'],
                           '.', os.environ.copy(), 0.1)
        self.assertTrue(result[3])
        self.assertLess(result[4], 10)

    def test_secret_prompt_rejected(self):
        with self.assertRaises(ValueError):
            d.safe_text('-----BEGIN PRIVATE KEY-----')

    def test_ui_configuration(self):
        import fnmatch
        analysis = d.configuration(d.SETTINGS['primary'], 'analysis')
        ui = d.configuration(d.SETTINGS['primary'], 'analysis', ui=True)
        edit = d.configuration(d.SETTINGS['primary'], 'edit')
        ui_edit = d.configuration(d.SETTINGS['primary'], 'edit', ui=True)

        def permits(config, action, resource, raw=None):
            key = raw if raw is not None else f'{action}:{resource}'
            policy_action = 'integration.use' if raw is not None else 'tool.use'
            rules = [r for r in config['policies'] if r['action'] == policy_action and fnmatch.fnmatchcase(key, r['resource'])]
            return bool(rules) and rules[-1]['effect'] == 'allow'

        # Default deny survives UI mode; analysis still cannot edit the app.
        self.assertFalse(permits(ui, 'shell', 'rm -rf /'))
        self.assertFalse(permits(ui, 'edit', 'src/AgencyApp.tsx'))
        self.assertFalse(permits(ui, 'read', 'D:/project/.git/config'))
        self.assertFalse(permits(ui, 'edit', 'opencode.json'))
        # Skill is UI-only.
        self.assertTrue(permits(ui, None, None, raw='skill:impeccable'))
        self.assertTrue(permits(ui, 'skill', 'impeccable'))
        self.assertFalse(permits(analysis, None, None, raw='skill:impeccable'))
        # Narrow CLI verbs with arguments; hooks/install/generate stay denied.
        cli = '.opencode/skills/impeccable/scripts/impeccable.cmd'
        self.assertTrue(permits(ui, 'shell', f'{cli} context --target src/AgencyApp.tsx'))
        self.assertTrue(permits(ui, 'shell', '.opencode/skills/impeccable/scripts/impeccable detect --json src'))
        self.assertTrue(permits(ui, 'shell', f'{cli} critique-storage trend "src/App.tsx" 5'))
        self.assertTrue(permits(ui, 'shell', f'{cli} live-server --background'))
        self.assertFalse(permits(ui, 'shell', f'{cli} hooks on'))
        self.assertFalse(permits(ui, 'shell', f'{cli} install'))
        self.assertFalse(permits(ui, 'shell', f'{cli} generate 3'))
        # Only the official Playwright MCP and only its tools.
        self.assertTrue(permits(ui, None, None, raw='mcp:playwright'))
        self.assertFalse(permits(ui, None, None, raw='mcp:other'))
        self.assertTrue(permits(ui, 'playwright_browser_navigate', 'url'))
        self.assertFalse(permits(ui, 'other_tool', 'url'))
        self.assertTrue(permits(ui, 'execute', '*'))
        # Evidence-only writes in UI analysis; full edits in UI edit mode.
        self.assertTrue(permits(ui, 'edit', '.impeccable/critique/run.md'))
        self.assertTrue(permits(ui, 'edit', '.opencode-lab/scratch.txt'))
        self.assertFalse(permits(ui, 'edit', '.impeccable/other.md'))
        self.assertTrue(permits(ui_edit, 'edit', 'src/AgencyApp.tsx'))
        # Main may call only the two critics; critics cannot recurse.
        self.assertTrue(permits(ui, 'subagent', 'critic-design'))
        self.assertTrue(permits(ui, 'subagent', 'critic-evidence'))
        self.assertFalse(permits(ui, 'subagent', 'general'))
        critics = d.CRITICS
        critic_permissions = ui['agents']['critic-design']['permissions']
        def child_allows(action, resource):
            rules = ui_edit['permissions'] + ui_edit['agents']['critic-design']['permissions']
            matches = [r for r in rules if fnmatch.fnmatchcase(action, r['action']) and fnmatch.fnmatchcase(resource, r['resource'])]
            return matches[-1]['effect'] == 'allow'
        self.assertFalse(child_allows('edit', 'src/AgencyApp.tsx'))
        self.assertTrue(child_allows('edit', '.impeccable/critique/run.md'))
        self.assertFalse(any(r['action'] == 'subagent' and r['effect'] == 'allow' for r in critic_permissions))
        self.assertEqual(ui['agents']['critic-evidence']['mode'], 'subagent')
        # Model pinning reaches built-ins and both critics; the model never changes.
        name = d.SETTINGS['primary'].split('/', 1)[1]
        model_ref = {'providerID': 'opencode', 'model': name}
        for agent in [*d.SERVICE_AGENTS, *critics]:
            self.assertEqual(ui['agents'][agent]['model'], model_ref)
        # Exact MCP config shape; absent unless UI mode is on.
        self.assertEqual(ui['mcp'], {'servers': {'playwright': {
            'type': 'local', 'command': d.PLAYWRIGHT_COMMAND, 'codemode': False}}})
        self.assertNotIn('mcp', analysis)
        self.assertNotIn('mcp', edit)

    def test_visible_terminal_autoclose(self):
        # Offline guard: no Read-Host keystroke and the exit code is written last.
        self.assertNotIn('Read-Host', d.VISIBLE_SCRIPT)
        self.assertIn('exit.txt', d.VISIBLE_SCRIPT)
        self.assertLess(d.VISIBLE_SCRIPT.index('stderr.txt'), d.VISIBLE_SCRIPT.index('exit.txt'))


if __name__ == '__main__':
    unittest.main()
