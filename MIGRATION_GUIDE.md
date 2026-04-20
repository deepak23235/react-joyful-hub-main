# 🗄️ Database Setup (Simplified)

**No CLI required!** Just copy-paste SQL in Supabase Dashboard.

👉 **Follow the complete guide**: [DATABASE_SETUP.md](./DATABASE_SETUP.md)

## Quick Steps

1. **Create Tables**: Run `supabase/01-create-schema.sql` in SQL Editor
2. **Seed Data** (optional): Run `supabase/02-seed-data.sql` in SQL Editor
3. **Create Admin**: Add user via Dashboard → Auth → Users

## Files

```
supabase/
├── 01-create-schema.sql      # All tables + security
├── 02-seed-data.sql          # Sample data
└── 03-create-admin.sql       # Admin instructions
```

## Making Changes

Create new SQL files in `supabase/` directory and run them in SQL Editor.

That's it! No migrations, no CLI, no complexity.
