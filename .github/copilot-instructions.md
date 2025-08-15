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
- Tests are in `tests/` directory
- Use Vitest for testing
- Migration tests are in `tests/migrations/`
- Template tests use fixtures from `tests/migrations/fixtures.ts`

## File Editing Guidelines
- When using `insert_edit_into_file`: Use `// ...existing code...` comments instead of repeating code
- When using `replace_string_in_file`: Include 3-5 lines of context before and after changes
- Always check current file contents before making edits

## Project Structure
- Main source code in `src/`
- Shared domain logic in `src/domain/`
- Modules in `src/modules/`
- Domain logic specific to modules in `src/modules/<module_name>/domain/`
- Shared components in `src/components/`
- Module-specific components in `src/modules/<module_name>/components/`
- Shared hooks in `src/hooks/`
- Utils in `src/utils/`
- Tests mirror source structure in `tests/`

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
## Additional Notes
- Use `pnpm` for all package management tasks
- Ensure all code adheres to TypeScript strict mode
- Use Vitest for all testing tasks
- Follow the existing code patterns and structure
- Always check for existing tests and patterns before writing new code
- Use `pnpm` for installing dependencies, running scripts, and managing packages
- Use `pnpm run` for running scripts defined in `package.json`
- Use `pnpm add` for adding new dependencies
- Use `pnpm remove` for removing dependencies
- Use `pnpm update` for updating dependencies
- Use `pnpm install` for installing dependencies from `package.json`
- Only add/remove packages one at a time, waiting for me to commit before continuing with the next package
- Use `pnpm list` to check installed packages and their versions
- Use `pnpm outdated` to check for outdated packages
- Use `pnpm audit` to check for vulnerabilities in dependencies
- Use `pnpm run build` to build the project
- Use `pnpm run dev` to start the development server