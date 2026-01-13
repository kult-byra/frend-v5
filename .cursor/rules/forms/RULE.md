---
description: When building forms, handling form validation, or working with server actions
globs:
alwaysApply: false
---

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

## Complete Example

### 1. Schema (shared)

```typescript
// lib/schemas/contact.schema.ts
import { z } from 'zod'

export const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

export type ContactFormData = z.infer<typeof contactSchema>
```

### 2. Server Action

```typescript
// server/actions/contact.action.ts
'use server'

import { contactSchema, type ContactFormData } from '@/lib/schemas/contact.schema'

type ActionResult = 
  | { success: true; message: string }
  | { success: false; error: string }

export async function submitContact(data: ContactFormData): Promise<ActionResult> {
  // Validate on server (never trust client)
  const result = contactSchema.safeParse(data)
  
  if (!result.success) {
    return { success: false, error: 'Invalid form data' }
  }
  
  try {
    // Process form (send email, save to DB, etc.)
    await sendEmail(result.data)
    return { success: true, message: 'Message sent!' }
  } catch (error) {
    return { success: false, error: 'Failed to send message' }
  }
}
```

### 3. Form Component

```tsx
// components/contact-form.component.tsx
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTransition, useState } from 'react'
import { contactSchema, type ContactFormData } from '@/lib/schemas/contact.schema'
import { submitContact } from '@/server/actions/contact.action'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

export const ContactForm = () => {
  const [isPending, startTransition] = useTransition()
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  })

  const onSubmit = (data: ContactFormData) => {
    startTransition(async () => {
      const response = await submitContact(data)
      if (response.success) {
        setResult({ success: true, message: response.message })
        form.reset()
      } else {
        setResult({ success: false, message: response.error })
      }
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Your name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="you@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea placeholder="Your message..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {result && (
          <p className={result.success ? 'text-green-600' : 'text-red-600'}>
            {result.message}
          </p>
        )}

        <Button type="submit" disabled={isPending}>
          {isPending ? 'Sending...' : 'Send Message'}
        </Button>
      </form>
    </Form>
  )
}
```

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

