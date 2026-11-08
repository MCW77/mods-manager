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

<!--VITE PLUS START-->

# Using Vite+, the Unified Toolchain for the Web

This project is using Vite+, a unified toolchain built on top of Vite, Rolldown, Vitest, tsdown, Oxlint, Oxfmt, and Vite Task. Vite+ wraps runtime management, package management, and frontend tooling in a single global CLI called `vp`. Vite+ is distinct from Vite, and it invokes Vite through `vp dev` and `vp build`. Run `vp help` to print a list of commands and `vp <command> --help` for information about a specific command.

Docs are local at `node_modules/vite-plus/docs` or online at https://viteplus.dev/guide/.

## Built-in Commands vs Scripts

`vp <name>` runs a built-in command. `vp run <name>` runs a `package.json` script or a `vite.config.ts` task. Scripts cannot overwrite built-ins, so `vp dev` and `vp run dev` may do different things. Check `package.json` and `vite.config.ts` first, and run `vp run <name>` when the project defines a script or task with that name.

## Running Scripts

Run TypeScript and JavaScript files with `vpx <file>`, for example `vpx ./scripts/seed.ts --dry-run`. It handles enums, decorators, JSX, and tsconfig `paths`, so do not add `tsx` or `ts-node` to run scripts. `vpx --watch <file>` reruns the file when a file it uses changes, in place of `tsx watch`. `vp node <file>` runs plain Node.js.

## Tool Versions

Run `vp toolchain` to show versions and relationships in the active Vite+
release. Add a tool name to select part of the graph. For example, run
`vp toolchain vite`. Use `--global` to ignore the local `vite-plus` package. Use
`vp why <package>` to show the package-manager dependency graph.

## Review Checklist

- [ ] Run `vp install` after pulling remote changes and before getting started.
- [ ] Run `vp check` and `vp test` to format, lint, type check and test changes.
- [ ] Check if there are `vite.config.ts` tasks or `package.json` scripts necessary for validation, run via `vp run <script>`.
- [ ] If setup, runtime, or package-manager behavior looks wrong, run `vp env doctor` and include its output when asking for help.

<!--VITE PLUS END-->
