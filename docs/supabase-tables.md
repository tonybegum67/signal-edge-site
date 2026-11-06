# Supabase tables

The site's forms save into tables in Supabase. Each change to the tables is a file in `supabase/migrations/`, run once in Supabase's SQL Editor, in date order.

## Run a migration

1. In Supabase, open **SQL Editor**, then **New query**.
2. Paste the whole migration file and press **Run**. It should say "Success. No rows returned."

Each file is safe to run twice.

| File | What it adds |
|---|---|
| `20261106_forms.sql` | `prep_responses` (session prep answers) and `newsletter_subscribers` (Clear Signal list) |

## Where to see the answers

Open **Table Editor** in Supabase and pick `prep_responses` or `newsletter_subscribers`. Visitors can add rows through the forms but can never read, change or delete them. Only you see them, in Supabase.
