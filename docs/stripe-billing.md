# Stripe billing

Members pay for Pro by card on **My account**: $29 a month or $290 a year (Tony's approved pricing, Nov 4, 2026).
Stripe Checkout takes the card, Stripe's billing page handles changes and cancelling, and a webhook tells the
site when a subscription starts, changes or ends. The webhook is the only thing that turns card Pro on or off.

## How Pro is decided

A member is Pro when either is true:

- **Access code:** they added a code (like `CASEY-LESHER`, 90 days) and its time hasn't run out. No card needed.
- **Card:** they have a Stripe subscription that is `active`, `trialing` or `past_due` (Stripe is retrying a payment).

Code holders who add a card before their code time ends get a free period up to that day, so they're never
charged for days they already have. (Stripe needs at least 48 hours, so with less than two days left they're
charged right away.)

## Prices

The site finds prices in Stripe by lookup key, so the same code works in test and live mode:

| Plan | Lookup key | Amount |
| --- | --- | --- |
| Monthly | `second_brain_pro_monthly` | $29.00 USD a month |
| Yearly | `second_brain_pro_annual` | $290.00 USD a year |

Checkout checks the amount before using a price and refuses one that doesn't match, so an old price can't charge
anyone. To change a price: create the new one in Stripe, move the lookup key to it, archive the old one, and update
`lib/stripe.ts` in a PR.

## Switching it on

Nothing below goes through chat or GitHub. Keys go straight from Stripe into Secret Manager.

1. **Tables:** run `supabase/migrations/20261113_stripe_billing.sql` in the Supabase SQL Editor.
2. **Prices:** in Stripe (test mode), create the $29 and $290 prices with the lookup keys above.
3. **Webhook:** in Stripe, add an endpoint at `https://signal-edge.ai/api/stripe/webhook` for these events:
   `checkout.session.completed`, `customer.subscription.created`, `customer.subscription.updated`,
   `customer.subscription.deleted`. Copy its signing secret (`whsec_...`).
4. **Restricted key:** in Stripe, create a restricted key with write access to Customers, Checkout Sessions,
   Customer portal and Subscriptions, and read access to Prices and Products.
5. **Secrets:** in Cloud Shell (project `signal-edge-ai`), add each value without it showing on screen:

   ```bash
   PROJECT_NUMBER=$(gcloud projects describe signal-edge-ai --format='value(projectNumber)')
   RUNTIME="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com"
   for NAME in stripe-secret-key stripe-webhook-secret; do
     gcloud secrets describe "$NAME" --project signal-edge-ai >/dev/null 2>&1 || gcloud secrets create "$NAME" --project signal-edge-ai --replication-policy=automatic
     echo "Paste the value for $NAME, then press Enter:"
     read -rs K && printf '%s' "$K" | gcloud secrets versions add "$NAME" --project signal-edge-ai --data-file=- ; unset K
     gcloud secrets add-iam-policy-binding "$NAME" --project signal-edge-ai --member="$RUNTIME" --role=roles/secretmanager.secretAccessor
   done
   ```

   `supabase-service-role` already exists if Clear Signal sending is on (docs/clear-signal-sending.md).
6. **Switch:** in GitHub, Settings > Secrets and variables > Actions > Variables, add `STRIPE_BILLING` = `on`,
   then re-run the latest "Deploy to Cloud Run".

## Testing

In test mode, pay with Stripe's test card `4242 4242 4242 4242`, any future date, any CVC. My account should
show "Pro by card" within a few seconds. Cancel from **Manage billing** and the plan shows its end date.

## Going live

Repeat steps 2 to 6 in live mode with live prices, a live webhook and a live restricted key, after a lawyer has
looked at the terms. Stripe Tax is off; it needs a head office address and a registration first.
