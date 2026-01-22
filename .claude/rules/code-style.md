# Kult Byrå Coding Standards

## General Principles

- Name elements based on functionality/identity (e.g., `primaryButton`, `userProfile`) rather than appearance
- All code, comments, and commit messages must be in English
- Prefer CSS/Tailwind solutions over JavaScript for styling and interactions
- Use modern CSS features like `:has()` before resorting to JavaScript
- Prioritize code clarity over extreme brevity

## File Structure & Naming

- Use kebab-case for all filenames and directories
- Include content type in filename:
  - Components: `user-profile.component.tsx`
  - Hooks: `use-auth.hook.ts`
  - Schemas: `user.schema.ts`
  - Queries: `fetch-articles.query.ts`

## Data Validation

- ALWAYS validate external data using Zod
- NEVER use type casting (`as`) - validate and infer types instead
- Validate: API responses, form data, URL params, environment variables
- Use `z.infer<typeof schema>` to derive types from schemas
- Share validation schemas between client and server

## TypeScript & JavaScript

- Always enable and adhere to TypeScript's strict mode
- Path aliases: `@/*` for `./src/*`, `@/sanity/*` for `sanity/*`
- Prefer named exports over default exports
- Constants: Use `ALL_CAPS_SNAKE_CASE`
- Booleans: Start with `is`, `has`, `should`, `can`, etc.
- React components: Use arrow function syntax
- Data fetching functions: Start with `fetch`, be async
- Data transformation: Start with `parse` or descriptive verb

## React Specifics

- Use unique and stable keys for list rendering
- For Sanity data: Use `_id` or `_key`
- Never use array indices or `Math.random()` for keys

## CSS / Tailwind CSS

- Use `cn` utility for dynamic class strings
- Prefer `rem` or `em` for typography and spacing
- Use Tailwind's responsive prefixes (`sm:`, `md:`, `lg:`)
- Avoid arbitrary values in square brackets when possible

## Responsive Design (Mobile-First)

- Start with mobile design, then scale up
- Touch targets must be at least 44px
- All functionality must work on mobile devices
- Use container queries for component-level responsiveness

## Comments & Documentation

- Use `// TODO:` for outstanding tasks
- Use `// FIXME:` for known issues requiring fixes

## Task Completion

All tasks must finish with:

```bash
pnpm check && pnpm typecheck
```

Then suggest a commit message following conventional commits format:

```
type(scope): description

Examples:
feat(article): add cover image support
fix(nav): correct mobile menu alignment
refactor(queries): simplify page builder query
```
