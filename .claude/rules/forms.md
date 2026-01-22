# Form Handling with RHF + Zod + Server Actions

## Stack

- **Zod** - Schema validation (shared client/server)
- **react-hook-form** - Form state management
- **@hookform/resolvers** - Zod integration
- **shadcn/ui** - Form components
- **Server Actions** - Form submission

## Pattern Overview

1. Define Zod schema (single source of truth)
2. Create server action that validates with same schema
3. Build form with react-hook-form + zodResolver
4. Use shadcn/ui Form components for UI
5. Handle pending/error states

## Key Principles

1. **Schema-first**: Define Zod schema before anything else
2. **Single source of truth**: Same schema validates client and server
3. **Server validation**: Always validate on server, never trust client
4. **Type inference**: Use `z.infer<typeof schema>` for types
5. **Progressive enhancement**: Forms should work without JS (use `action` prop)
6. **Accessible**: shadcn/ui handles aria attributes automatically

## File Structure

```
lib/schemas/
  contact.schema.ts      # Zod schema + inferred type

server/actions/
  contact.action.ts      # Server action

components/
  contact-form.component.tsx  # Form UI
```
