# Anti-Kit CLI

CLI for installing and safely updating [Anti-Kit](https://github.com/mohamedzajith/anti-kit), a collection of agents, skills, workflows, rules, memory conventions, and validation tools for Google Antigravity.

## Installation

```bash
npx @mohamedzajith/anti-kit init
```

Or install globally:

```bash
npm install -g @mohamedzajith/anti-kit
anti-kit init
```

## Commands

| Command | Description |
|---|---|
| `anti-kit init` | Install `.agents`; safely merges when an installation already exists |
| `anti-kit update` | Update managed files while preserving local changes |
| `anti-kit rollback` | Restore the newest or a selected pre-update backup |
| `anti-kit status` | Show installation, manifest, toolkit version, backups, and CLI status |

## Safe update model

Anti-Kit records SHA-256 baselines in `.agents/.anti-kit/manifest.json`. During an update it compares the previous upstream version, the current local file, and the new upstream file.

- Clean managed files are updated automatically.
- Files changed only locally are preserved.
- User-created files are preserved.
- Files changed both locally and upstream are reported as conflicts.
- Incoming conflict copies are written under `.agents/.anti-kit/conflicts/`.
- A full pre-update backup is stored under `.anti-kit-backups/` by default.

```bash
anti-kit update --dry-run
anti-kit update --strategy merge
anti-kit update --strategy replace
anti-kit rollback
anti-kit rollback --backup 20260712-090000-000
```

`merge` is the default strategy. `replace` is intentionally explicit and still creates a backup unless `--no-backup` is supplied.

## Common options

```bash
anti-kit init --path ./myapp
anti-kit init --branch dev
anti-kit update --force
anti-kit update --quiet --force
anti-kit update --conflict-report ./anti-kit-update.json
anti-kit rollback --dry-run
```

When `--quiet` is used against an existing installation, `--force` is required because the CLI cannot safely ask for confirmation.

## Included toolkit

- **20 specialist agents**
- **47 skills**
- **13 workflows**
- Shared rules, persistent memory conventions, MCP configuration, and validation scripts

## Exit codes

| Code | Meaning |
|---:|---|
| `0` | Success or no changes required |
| `1` | Download, validation, filesystem, or configuration failure |
| `2` | Update completed, but one or more conflicts require manual review |
| `130` | Interrupted by the user |

## License

MIT
