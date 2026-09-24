---
name: testing
description: Testing conventions for migration and backup compatibility work.
applyTo: "tests/**/*.ts"
---

## Testing

Only unit tests are used (no integration or e2e tests).

Use Vitest framework.

Only testing the migration of data structures persisted in indexeddb or im-/exported as JSON to ensure compatibility between versions.

indexeddb migration tests are in `tests/migrations/database-migrations.test.ts`

There are 2 types of backups that can be imported/exported as JSON:
- Full backups: include everything (settings, data, etc.)
- Template backups: include only templates and related data

Full backup tests are in `tests/migrations/app-state-migrations.test.ts`

Template backup tests are in `tests/migrations/template-migrations.test.ts`

## Testing Structure

Unit tests: `tests/<test category>/`

Test files: `<filename>.test.ts`

Fixtures: `tests/<test category>/fixtures/`
Inside that fixtures folder, the fixtures can be grouped by subfolder if needed.

For the migrations tests, the fixtures are grouped in 'backup', 'db' and 'templates' subfolders.

Test utilities: `tests/<test category>/`
