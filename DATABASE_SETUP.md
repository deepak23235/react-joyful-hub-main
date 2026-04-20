# 🗄️ Database Setup Guide

Complete setup in **3 simple steps**. No CLI required!

## 🚀 Quick Start (5 Minutes)

### Step 1: Create Database Tables

1. Open Supabase Dashboard: https://supabase.com/dashboard/project/sjmmvksyesuidgxkumbr/sql/new
2. Copy the entire contents of `supabase/01-create-schema.sql`
3. Paste into SQL Editor
4. Click **RUN** (or Ctrl+Enter)

✅ **Done!** All tables, security policies, and indexes are created.

---

### Step 2: Seed Sample Data (Optional)

1. In SQL Editor: https://supabase.com/dashboard/project/sjmmvksyesuidgxkumbr/sql/new
2. Copy contents of `supabase/02-seed-data.sql`
3. Paste and click **RUN**

✅ **Done!** Sample locations, areas, and models are added.

---

### Step 3: Create Admin User

1. Go to: https://supabase.com/dashboard/project/sjmmvksyesuidgxkumbr/auth/users
2. Click **Add user** button
3. Fill in:
   - **Email**: `admin@joyfulhub.com`
   - **Password**: `Admin@123456`
4. Click **Create user**

✅ **Done!** Admin account created.

---

## 🎉 You're All Set!

### Start Your App

```bash
npm run dev
```

### Access Points

- **Public Site**: http://localhost:5173/
- **Admin Login**: http://localhost:5173/login
- **Admin Credentials**: See `ADMIN_CREDENTIALS.md`

---

## 📋 What Was Created?

### Tables (4)

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `locations` | Cities/regions | id, name, slug, image, description |
| `areas` | Areas within locations | id, location_id (FK), name, slug |
| `models` | Products in areas | id, area_id (FK), name, price, features[], specifications (JSON) |
| `enquiries` | User enquiries | id, model_id (FK), name, email, phone, message |

### Security (Row Level Security)

- ✅ **Public**: Can read locations, areas, models
- ✅ **Public**: Can submit enquiries
- ✅ **Authenticated**: Can modify locations, areas, models
- ✅ **Authenticated**: Can view all enquiries

### Features

- ✅ Automatic `updated_at` timestamps
- ✅ UUID primary keys
- ✅ Indexes for fast lookups
- ✅ Cascade deletes (location → areas → models)
- ✅ Unique constraints on slugs

---

## 🔄 Making Database Changes

When you need to modify the schema:

1. Create a new SQL file in `supabase/` directory
2. Write your SQL (ALTER TABLE, CREATE TABLE, etc.)
3. Run it in SQL Editor
4. Commit the file to git

**Example: Adding a rating column**

```sql
-- supabase/04-add-rating-to-models.sql
ALTER TABLE models ADD COLUMN rating NUMERIC DEFAULT 0;
```

---

## 🐛 Troubleshooting

### "Table already exists"
Tables were already created. You can skip this step or the errors are safe to ignore.

### "Permission denied"
Make sure you're logged into Supabase with admin access to the project.

### "No data showing on website"
Run the seed data SQL (`supabase/02-seed-data.sql`).

### "Can't login to admin"
- Make sure admin user exists (Step 3)
- Check `.env.local` has correct credentials
- Clear browser cookies/localStorage and try again

---

## 📚 File Structure

```
supabase/
├── 01-create-schema.sql      # Creates all tables + security
├── 02-seed-data.sql          # Sample data (optional)
└── 03-create-admin.sql       # Admin user instructions
```

---

## 🔗 Useful Links

- **SQL Editor**: https://supabase.com/dashboard/project/sjmmvksyesuidgxkumbr/sql/new
- **Auth Users**: https://supabase.com/dashboard/project/sjmmvksyesuidgxkumbr/auth/users
- **Table Editor**: https://supabase.com/dashboard/project/sjmmvksyesuidgxkumbr/editor
- **API Settings**: https://supabase.com/dashboard/project/sjmmvksyesuidgxkumbr/settings/api
