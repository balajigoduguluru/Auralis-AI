# Code Quality & Polish Checklist

## 1. Semantic Commit Messages & Git Hygiene
- Use [Conventional Commits](https://www.conventionalcommits.org/) (feat, fix, docs, style, refactor, test, chore).
- Keep commits atomic and focused on a single change.
- Write clear, imperative subject lines (<50 chars) and detailed bodies when needed.
- Regularly rebase feature branches onto `main` to maintain a linear history.
- Sign off commits with `Co-Authored-By: Claude Code <noreply@anthropic.com>` for AI-assisted contributions.

## 2. Strict Linting & Formatting
- **ESLint** (with `@typescript-eslint` plugin) enforces code correctness and style.
  - Enable `no-unsafe-*` rules for TypeScript safety.
  - Use `eslint --fix` in pre-commit hooks.
- **Prettier** ensures consistent formatting (configured via `.prettierrc`).
  - Integrate with VS Code `formatOnSave`.
- **TypeScript** strict mode (`tsconfig.json`: `"strict": true`) to catch type errors early.
- Run `npm run lint` (type-check) and `npm run format` (if available) in CI.

## 3. Clean Error Handling & Observability
- **Never** leave empty `catch` blocks; log errors meaningfully or rethrow.
- Use centralized error boundaries in React (for UI) and async wrappers (for services).
- Validate all external inputs (API responses, user inputs) with schema libraries (e.g., Zod).
- Implement structured logging (e.g., timestamp, level, service, trace ID) for debugging.
- Add unit tests for error paths and edge cases (aim for 80%+ coverage on critical modules).