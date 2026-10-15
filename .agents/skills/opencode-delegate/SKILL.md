---
name: opencode-delegate
description: Delegate substantial code exploration, implementation and tests to a user-selected free OpenCode CLI model. Codex scopes the work and accepts the result.
---

# OpenCode delegate

1. For a new model choice, run `python <skill>/scripts/delegate.py --list-models`.
   Show the returned free model IDs and context limits, then wait for the user's choice.
   Reuse an already selected model until the user changes it; never switch automatically.
   `models.json` holds the current default. Always pass the agreed ID with `--model`.
2. Check git status and local configuration/secrets before sharing the project. Let the
   worker explore the code, implement the change and run relevant existing checks.
   Send a short UTF-8 task: goal, known context, constraints and acceptance criteria;
   do not first read the same modules yourself. Keep a coherent scope, not a repo tour.
3. Run `python <skill>/scripts/delegate.py --root <repo> --task <task.txt> --output <new-ignored-run-dir> --model <selected-id> --mode edit --timeout 600`.
   Model runs always open a visible Windows terminal with live output; never use a hidden fallback.
   Omit `--mode edit` for read-only analysis. The worker owns implementation and permitted checks.
   Read/glob/grep work in both modes. Edit adds text editing/creation and the exact npm/Node
   checks listed in the generated prompt. No arbitrary shell, deletion, deploy or push.
   Codex handles requested file deletions from the worker's path list.
4. Request a compact report: changed paths and purpose; exact test commands, exit codes
   and pass/fail counts; remaining work or blockers. Read that report and diff statistics,
   then inspect only the changes needed to verify the result, with closer review for risky
   logic. Do not load large raw logs or reread unchanged files. Repeat only missing checks
   or checks invalidated by later edits; a claim of passing tests without evidence is insufficient.
   On `incomplete`, timeout or denied tools, narrow the continuation using existing findings;
   do not restart exploration. Retry once after correcting the cause. While CLI runs, wait
   on its process; no separate polling agent, scheduled wakeups or repeated status reads.

The wrapper verifies live zero pricing and anonymous CLI availability, pins the selected
model for service agents, and isolates provider credentials. No paid or automatic fallback.
Permissions are OpenCode policy, not an OS sandbox: trust project test scripts and plugins.
Do not expose secrets or send them to the worker. Reports may contain source excerpts.

Offline validation: `python <skill>/scripts/test_delegate.py`. Keep this folder portable;
change the selected default in `models.json` only after user choice. No global skill edits.
