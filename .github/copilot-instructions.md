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

## Testing Guidance
See [testing.instructions.md](instructions/testing.instructions.md) for testing conventions and structure.

## File Editing Guidelines
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

## Legend State Guidance
See [legend-state.instructions.md](instructions/legend-state.instructions.md) for observable linking and reactive access patterns.

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
- Only add/update/remove packages one at a time. If you want to do several packages, after changing one,ask me to commit and wait for my response before continuing with the next package.
- Use `pnpm run build` to build the project
- Use `pnpm run dev` to start the development server