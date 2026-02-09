# Copilot Instructions

## Environment Context
- **OS**: Windows
- **Default Shell**: PowerShell (`powershell.exe`)
- **Command Chaining**: Use `;` for PowerShell, NOT `&&` (bash syntax)
- **Package Manager**: pnpm
- **Project**: TypeScript/React application with Vitest for testing

## Terminal Command Guidelines
When generating terminal commands:
- Use PowerShell syntax (`;` for chaining commands)
- Use `pnpm` instead of `npm` when applicable
- Change directory first, then run commands separately if needed
- Example: `cd path; pnpm test` NOT `cd path && pnpm test`

## Code Style Preferences
- Use TypeScript strict mode
- Prefer explicit types over `any`
- Use proper error handling with detailed error messages
- Follow existing patterns in the codebase

## Testing
- Only unit tests are used (no integration or e2e tests)
- Use Vitest framework
- Only testing the migration of data structures persisted in indexeddb or im-/exported as JSON to ensure compatibility between versions
- indexeddb migration tests are in `tests/migrations/database-migrations.test.ts`
- There are 2 types of backups that can be imported/exported as JSON:
  - Full backups: include everything (settings, data, etc.)
  - Template backups: include only templates and related data
- Full backup tests are in `tests/migrations/app-state-migrations.test.ts`
- Template backup tests are in `tests/migrations/template-migrations.test.ts`

## Testing Structure
- Unit tests: `tests/<test category>/`
- Test files: `<filename>.test.ts`
- Fixtures: `tests/<test category>/fixtures/`
Inside that fixtures folder, the fixtures can be grouped by subfolder if needed.
- For the migrations tests, the fixtures are grouped in 'backup', 'db' and 'templates' subfolders.
- Test utilities: `tests/<test category>/`

## File Editing Guidelines
- When using `replace_string_in_file`: Include 3-5 lines of context before and after changes
- Always check current file content before making edits

## Project Structure
- Main source code in `src/`
- Shared domain logic in `src/domain/`
- Modules in `src/modules/`
- Domain logic specific to modules in `src/modules/<module_name>/domain/`
- Shared components in `src/components/`
- Module-specific components in `src/modules/<module_name>/components/`
- If a module has a main view component, it is located in `src/modules/<module_name>/pages/`
- Shared hooks in `src/hooks/`
- Utils in `src/utils/`

## Techstack
- **Languages**: TypeScript, React
- **Testing Framework**: Vitest
- **Package Manager**: pnpm
- **Build Tool**: Vite
- **Linting**: Biome
- **Formatting**: Biome
- **State Management**: legend-state
- **Routing**: None (Single Page Application)
- **Styling**: unocss
- **Deployment**: Cloudflare Pages
- **CI/CD**: GitHub Actions

## Legend State Patterns

### Two-way linking with computed observables
- A computed function that returns an observable creates a two-way link
- This works both when defined inside an `observable()` object AND with `useObservable(() => someObservable)`

### Reactive access
- Calling `.get()` or `.peek()` on a computed returns the **value**, not the linked observable
- To maintain the link, access properties on the computed without calling `.get()`

## Requirements
- Node.js: 19+
- pnpm: 10+
- TypeScript: 5.9.3+
- React: 19.0.0+

## Version Control Rules
- Never use any git commands directly unless instructed
- Always ask before using git commands
- Commit messages have to follow the conventional commits format

## Additional Notes
- Use `pnpm` for all package management tasks
- Ensure all code adheres to TypeScript strict mode
- Use Vitest for all testing tasks
- Follow the existing code patterns and structure
- Always check for existing tests and patterns before writing new code
- Only add/update/remove packages one at a time. If you want to do several packages, after changing one,ask me to commit and wait for my response before continuing with the next package.
- Use `pnpm run build` to build the project
- Use `pnpm run dev` to start the development server