# Supabase tables

The site's forms save into tables in Supabase. Each change to the tables is a file in `supabase/migrations/`, run once in Supabase's SQL Editor, in date order.

## Run a migration

1. In Supabase, open **SQL Editor**, then **New query**.
2. Paste the whole migration file and press **Run**. It should say "Success. No rows returned."

Each file is safe to run twice.

| File | What it adds |
|---|---|
| `20261106_forms.sql` | `prep_responses` (session prep answers) and `newsletter_subscribers` (Clear Signal list) |
| `20261106_account.sql` | Lets a signed-in member see and switch their own Clear Signal setting on My account |
| `20261106_codes.sql` | Access codes and Pro memberships, plus the CASEY-LESHER code (90 days of Pro) |
| `20261106_prep_more.sql` | Four more prep questions: where files live, CRM, AI comfort (1 to 5), anything to remember. Run before merging the form change. |
| `20261107_prep_thanks.sql` | Remembers which addresses got the prep thank-you email, so each gets it once |
| `20261109_space.sql` | Lets members see which access codes they added, so a company code opens that company's space |
| `20261111_clear_signal_unsubscribe.sql` | Gives each Clear Signal subscriber a private unsubscribe link, and lets the unsubscribe page switch them off or back on. Run before merging the unsubscribe page. |

## Where to see the answers

Open **Table Editor** in Supabase and pick `prep_responses` or `newsletter_subscribers`. Visitors can add rows through the forms but can never read, change or delete them. Only you see them, in Supabase.

## Access codes

Codes live in the `access_codes` table. Members can't see it; they type a code on My account and the site checks it for them.

- **Add a code:** in Table Editor, open `access_codes` and insert a row. Give it a `code` in capitals (like `SPRING-25`), `plan` = `pro` and the number of `days` of Pro it gives.
- **Limit it:** set `max_uses` to cap how many people can use it, or `expires_at` for a last day.
- **Switch it off:** untick `active`.
- **See who used it:** `code_redemptions` lists each member and when they added it; `memberships` shows each member's plan and end date.

A shareable link fills the code in for people: the site address plus `/account?code=CASEY-LESHER`. Anyone signed out signs in first and lands back on the page with the code ready.

## Billing

Card billing uses two tables from `supabase/migrations/20261113_stripe_billing.sql`:

- **`billing_customers`:** each member's Stripe customer. Only the site's server can see it.
- **`stripe_subscriptions`:** each card subscription, copied from Stripe whenever it changes. Members can see their own row. `active`, `trialing` and `past_due` mean Pro.

Don't edit these by hand. Stripe is the record; the site copies it here. To change someone's card plan, do it in the Stripe Dashboard and the site follows.
