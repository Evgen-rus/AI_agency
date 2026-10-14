# Repository Guidelines

## Project Structure & Module Organization

This is a standalone project for a future website. No application source, tests, assets, or dependency manifests exist yet. Do not assume a language, framework, or deployment target. `.agents/skills/impeccable/` contains the project-local Codex frontend skill and its supporting resources.

When adding the first implementation, keep related modules together and document the chosen layout here. Use dedicated source, test, and asset directories only when the implementation needs them. Avoid creating placeholder folders or sample data without a concrete requirement.

## Build, Test, and Development Commands

No build, test, or development commands are configured. Run commands from `D:\My_dev_project\AI_agency`.

- `Get-ChildItem -Force` inspects the workspace, including hidden files.
- `rg --files` lists searchable project files once files exist.

When introducing a runtime or package manager, document exact installation, local startup, build, and test commands in this guide and the project README. Do not present commands such as `npm test` as supported until the corresponding configuration exists.

## Coding Style & Naming Conventions

No language-specific style, formatter, or linter is established. Follow the conventions of the selected language and keep indentation consistent within each file. Use descriptive names that explain purpose; keep Markdown headings concise and examples executable.

Prefer standard libraries and existing project patterns. Add dependencies only when required by the implemented feature. Configure formatting and linting alongside the first source files, and record their commands here.

## Testing Guidelines

No testing framework or coverage threshold is configured. Add focused tests for nontrivial behavior when introducing code, including relevant failure cases. Use the selected framework's test naming convention and document how to run the suite. Report checks actually performed and any checks that remain unavailable.

## Commit & Pull Request Guidelines

Use concise, imperative commit subjects, such as `Initialize website project`.

Pull requests should explain the problem, changes, and validation performed. Link relevant issues when available, and include screenshots for visible UI changes. Keep changes scoped to the requested work.

## Security & Configuration

Never commit credentials, API keys, or private data. When configuration is introduced, provide example files containing placeholders and exclude local secrets and generated artifacts from version control.

## Codex Frontend Skill

Use `$impeccable` for website design and frontend work. This project keeps an independent local copy; changes must not modify the source project or global skills. Follow its `SKILL.md` and use the Windows launcher `scripts/impeccable.cmd` when needed.
