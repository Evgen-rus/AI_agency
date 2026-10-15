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

    def test_credentials_not_inherited(self):
        with patch.dict(os.environ, {'OPENAI_API_KEY': 'synthetic', 'OPENCODE_API_KEY': 'synthetic', 'OPENCODE_CONFIG': 'unsafe'}):
            env = d.environment(Path('runtime').resolve())
            self.assertNotIn('OPENAI_API_KEY', env)
            self.assertNotIn('OPENCODE_API_KEY', env)
            self.assertNotIn('OPENCODE_CONFIG', env)
            self.assertIn('XDG_DATA_HOME', env)

    def test_analysis_and_edit_policies(self):
        analysis = d.configuration(d.SETTINGS['primary'], 'analysis')
        edit = d.configuration(d.SETTINGS['primary'], 'edit')
        def permits(config, action, resource):
            import fnmatch
            rules = config['policies']
            matching = [r for r in rules if r['action'] == 'tool.use' and fnmatch.fnmatchcase(f'{action}:{resource}', r['resource'])]
            return matching[-1]['effect'] == 'allow'
        self.assertTrue(permits(analysis, 'read', 'src/ConceptNav.tsx'))
        self.assertFalse(permits(analysis, 'edit', 'src/ConceptNav.tsx'))
        self.assertFalse(permits(analysis, 'shell', 'npm run build'))
        self.assertTrue(permits(edit, 'edit', 'src/ConceptNav.tsx'))
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


if __name__ == '__main__':
    unittest.main()
