---
name: opencode-delegate
description: Delegate substantial project work to free OpenCode CLI subagents, including code exploration, bug fixes and tests. Codex chooses the task and reviews the result; existing Luna routing stays available.
---

# OpenCode delegate

Use DeepSeek for useful, bounded project work: module exploration, bug hunting,
simple implementation and tests. Keep architecture, critical logic and final
acceptance with Sol or the existing Luna workflow. Do not delegate trivial work.

The subagent works directly in the specified project and may explore the whole
project. There is no mandatory file-by-file selection or copying workflow.

1. Read relevant code and `git status` yourself. Preserve existing user changes.
   Confirm the project contains no sensitive material that may be transmitted.
2. Write a UTF-8 task file: concrete goal, project context, acceptance criteria,
   scope exclusions and expected evidence. Refer to paths relative to the project.
3. Invoke `scripts/delegate.py` relative to this skill:
   `python <skill>/scripts/delegate.py --root <repo> --task <task.txt> --output <new-private-run-dir>`
   Default is analysis (read/search, no edits or shell). For implementation add
   `--mode edit`; it permits project edits and standard npm/Node test commands.
   Use a copy only for intentionally broken fixtures or experimental comparisons.
4. Read `report.json`, verify the complete diff and run relevant checks yourself.
   `completed` means a nonempty CLI response, not acceptance. Model output is
   untrusted evidence. Do not execute suggested commands blindly or auto-commit.
5. On errors inspect status, errors, exit code and duration. Retry once after an
   identified correction. `free_tier_rejected` is a provider error; do not assume
   registration or paying fixes it. Never request API keys in chat.

`models.json` chooses DeepSeek by default. Choose an experimental backup explicitly
with `--model opencode/mimo-v2.6-flash-free`. There is no automatic fallback.
Each call refreshes public price metadata, rejects missing/nonzero pricing and
passes that same unmodified catalog to the CLI via `OPENCODE_MODELS_PATH`, avoiding
the stale bundled catalog seen on cold V2 starts. It checks anonymous availability.
Fresh XDG directories and a filtered
child environment avoid using existing paid credentials. Service agents also
use the selected free model; automatic compaction/warming are disabled.
Sol can select a listed free backup when the primary fails; the user need not
launch models or copy their answers manually. Do not switch to a paid model.

V2 permissions and policies deny external-directory access, subagents, web calls,
MCP and skills. Implementation allows only exact standard test/build commands;
Sol executes other necessary commands after inspection. Existing project npm
scripts must be trusted: shell commands run with the Windows user's authority.
The boundary is OpenCode's tool policy, not an OS sandbox. Do not use this skill
with untrusted plugins/configuration. Review local `.opencode`/`opencode.json`
configuration before reuse; broader policies can override project-level rules.

The script uses Python's standard library and the native official V2 executable
(no shell quoting of prompts). Timeout kills its Windows process tree. Reports
include CLI JSON events, wall time, available models, price/context metadata,
reported usage and cost when present. Missing metrics remain unknown. Reports
may contain source excerpts; store them in an ignored local directory.

Run `python scripts/test_delegate.py` from this skill directory for offline checks.
To reuse, copy this whole folder into another repo's `.agents/skills/`. Install
OpenCode with `npm install -g @opencode/cli` if absent. No global skill or
Codex/Cursor/Luna changes are required. Local discovery may require a new chat;
an existing chat can explicitly read this SKILL.md.
