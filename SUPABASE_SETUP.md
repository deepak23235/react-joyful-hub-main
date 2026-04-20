# Supabase Setup Guide

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up
2. Create a new project
3. Wait for the database to be provisioned

## 2. Get Your Project Credentials

1. Go to your project settings
2. Find the API settings
3. Copy your **Project URL** and **anon/public key**

## 3. Configure Environment Variables

1. Open `.env.local` file in the root directory
2. Replace the placeholder values with your actual credentials:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## 4. Set Up Your Database Schema

Once you have your schema models ready, you can:

1. Use the Supabase Dashboard SQL Editor to create tables
2. Or use the Supabase CLI for local development

## 5. Generate TypeScript Types (Optional)

After setting up your schema, generate types:

```bash
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/supabase.ts
```

## Project Structure

- `src/lib/supabase.ts` - Supabase client initialization
- `src/hooks/useAuth.ts` - Authentication hook
- `src/types/supabase.ts` - TypeScript type definitions
- `.env.local` - Environment variables (not committed)
- `.env.example` - Example environment variables

## Usage Example

```typescript
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';

// Using the auth hook
const { user, signIn, signOut } = useAuth();

// Querying the database
const { data, error } = await supabase
  .from('your_table')
  .select('*');
```
