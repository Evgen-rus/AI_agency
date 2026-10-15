---
name: opencode-delegate
description: Delegate substantial exploration, implementation and checks to a user-selected free OpenCode CLI model. UI mode supports project Impeccable, Playwright MCP and independent critics; Codex scopes and accepts the result.
---

# OpenCode delegate

1. For a new model choice, run `python <skill>/scripts/delegate.py --list-models`.
   Show free IDs/context limits and wait for the user's choice. Reuse the selected model;
   never switch automatically. Update `models.json` only after user choice; always pass `--model`.
2. Check git status and configuration/secrets before sharing the project. Let the worker
   explore, implement and run relevant checks. Send a short goal, context, constraints and
   acceptance criteria; do not first read the same modules or request a separate repo tour.
3. Run `python <skill>/scripts/delegate.py --root <repo> --task <task.txt> --output <new-ignored-run-dir> --model <selected-id> --mode edit --timeout 600`.
   Windows workers open visibly with live output, close automatically and save the run report.
   Omit `--mode edit` for analysis. Default tools: read/glob/grep; edit adds text writes and the
   listed npm/Node checks. No arbitrary shell, deletion, deploy or push; Codex handles authorised
   deletions from exact paths. Workers must not waste steps on disallowed or unrelated checks.
4. Request changed paths/purpose, check counts and blockers. Read the short summary and
   `evidence` (commands, actual exits, tool failures), then diff statistics and only relevant
   changes. Missing exits are unknown; CLI completion is not acceptance. Run only missing or
   invalidated relevant checks, never accept unsupported test claims. On denial, `incomplete`,
   timeout or early terminal closure, narrow the continuation using existing findings; retry
   once after correcting the cause. Wait on the process; no polling agent or scheduled wakeups.

## Impeccable and MCP (`--ui`)

Add `--ui` for Impeccable work, including read-only audits. The worker loads the real project
skill and only the matching reference. Allowed CLI verbs: `context`, `detect`, `critique-storage`,
`live-server` via `.opencode/skills/impeccable/scripts/impeccable.cmd`. Use single commands;
no exit-code echo, `cd` or shell-discovery retries. Actual exits come from JSON events.
Playwright MCP runs a visible isolated Edge; use `playwright_*`, not the empty native browser
namespace. Read saved screenshot PNGs with `read` to inspect pixels, then close the browser.
Report unavailable tools honestly; do not claim visual inspection from a file link alone.
For critique, use `critic-design` and `critic-evidence`: fresh independent contexts, the same
selected model, read-only app access and no recursion. Give each a self-contained task with
needed skill/browser/image instructions; do not share findings until synthesis. Ordinary
work does not need critics. Evidence writes use `.impeccable/critique/*` or `.opencode-lab/*`.
No submissions, login, uploads, purchases or real data writes without user authorisation.

## Other project skills

Before dispatch, identify the skill's required CLI/MCP tools. Reading `SKILL.md` alone does
not grant executable support. For a missing integration, review its configuration and grant
only the required tools, or report the exact blocker; do not silently skip it or enable all.
UI mode already grants the Impeccable/Playwright integration; others require reviewed setup.

Live zero-price/anonymous availability checks, fixed model routing and credential isolation
remain mandatory. No paid or automatic fallback. Permissions are OpenCode policy, not an OS
sandbox: trust invoked project scripts/plugins and never expose secrets in prompts or reports.
Keep this skill portable; no global skill edits. Offline checks: `python <skill>/scripts/test_delegate.py`.
