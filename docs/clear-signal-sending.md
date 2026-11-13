# Sending Clear Signal

Clear Signal sends itself. Merging an issue to `main` deploys the site, and the deploy then asks the site to send whatever is due. Nobody keeps a mailing list by hand: each send reads the subscribers from Supabase at that moment, so new sign-ups are included and anyone who unsubscribed is skipped.

Every email is the branded Live Signal design (header image, colors, fonts), with a plain-text version alongside for mail apps that want one.

## What gets sent, and to whom

Each issue has two files:

- `content/clear-signal/NNN.json`: the issue page, with the Prompt of the week and homework. See `clear-signal-issues.md`.
- `content/clear-signal/email/NNN.json`: the rest of the email, plus who it goes to.

The email file's `audience` decides who gets it:

| `audience` | Who gets it |
|---|---|
| `"test"` | Only tony@signal-edge.ai, marked [Test]. A new test goes out each time the issue's words change. |
| `"everyone"` | Every subscriber in `newsletter_subscribers` who hasn't unsubscribed. |

So an issue goes out in two merges:

1. The issue pull request adds both files with `"audience": "test"`. Merging it publishes the page and sends Tony a branded test copy.
2. Once the test looks right, a one-line pull request changes `"test"` to `"everyone"`. Merging that sends the issue to the list.

Every send is written to `newsletter_sends` before the email goes, so a redeploy, a retry or a second merge never sends anyone the same issue twice. Someone who subscribes after an issue went out starts with the next issue, rather than getting an old one weeks later.

## The email file

```json
{
  "number": "002",
  "audience": "test",
  "subject": "Clear Signal 002: the headline of the one thing",
  "preheader": "The grey line inboxes show after the subject.",
  "hello": "A short hello from Tony.",
  "oneThing": {
    "title": "The one change worth knowing",
    "points": [
      { "label": "What it is", "text": "One or two plain sentences." },
      { "label": "Try this", "text": "Something to do today." },
      { "label": "The fine print", "text": "The catch, if there is one." }
    ]
  },
  "field": { "question": "\"A question readers ask\"", "answer": "The answer." },
  "quickHits": [{ "title": "Short name", "text": "One or two sentences." }],
  "ps": "The P.S. line."
}
```

`oneThing.points` takes 1 to 4 items and `quickHits` 1 to 6. Every field is required. A file with a missing field, or a number with no matching page file, fails the build with a message naming the file, so a broken issue never ships.

## The unsubscribe link

Each subscriber has a random `unsubscribe_token` in `newsletter_subscribers`. The send puts their own link in the footer:

```
https://signal-edge.ai/clear-signal/unsubscribe?t=TOKEN
```

The link holds no email address, and a token can't be guessed. Opening it shows a branded page with an **Unsubscribe** button. After that the page says "You're unsubscribed" and offers **Resubscribe** in case it was a mistake. Nobody is unsubscribed just by opening the link, so a mail scanner that opens links can't unsubscribe anyone.

The send also adds the headers Gmail, Apple Mail and Outlook use for their own Unsubscribe button:

```
List-Unsubscribe: <https://signal-edge.ai/api/clear-signal/unsubscribe?t=TOKEN>, <mailto:tony@signal-edge.ai?subject=unsubscribe>
List-Unsubscribe-Post: List-Unsubscribe=One-Click
```

If someone replies "unsubscribe", set `unsubscribed_at` on their row by hand.

## Every email also has

- The mailing address in the footer (`mailingAddress` in `lib/site.ts`). CAN-SPAM requires a real postal address.
- A plain line on why they're getting it: "You signed up for Clear Signal at signal-edge.ai."
- The issue's exercise button: `https://signal-edge.ai/clear-signal/NNN`.

## Switch it on (once)

Sending uses the site's Gmail sign-in from `site-emails.md`, so that has to be on first. Then:

1. **Make the sends table.** In Supabase, open SQL Editor, New query, paste `supabase/migrations/20261113_clear_signal_sends.sql`, and Run.

2. **Store two secrets in Google Cloud.** Copy the Supabase secret key first: in Supabase, Project Settings, then API Keys, then the secret (service role) key. Then in Cloud Shell, run this. When it pauses, paste the key and press Enter. Nothing shows while you paste, and it isn't saved in your history.

   ```bash
   gcloud config set project signal-edge-ai
   PROJECT_NUMBER=$(gcloud projects describe signal-edge-ai --format='value(projectNumber)')
   RUNTIME="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com"
   DEPLOYER="serviceAccount:github-deployer@signal-edge-ai.iam.gserviceaccount.com"

   # The Supabase secret key, so the site can read the subscriber list
   gcloud secrets create supabase-service-role --replication-policy=automatic
   read -rs K && printf '%s' "$K" | gcloud secrets versions add supabase-service-role --data-file=- ; unset K
   gcloud secrets add-iam-policy-binding supabase-service-role --member="$RUNTIME" --role=roles/secretmanager.secretAccessor

   # A random key the deploy uses to start a send. Nobody needs to see or copy it.
   gcloud secrets create clear-signal-send-key --replication-policy=automatic
   openssl rand -hex 32 | tr -d '\n' | gcloud secrets versions add clear-signal-send-key --data-file=-
   gcloud secrets add-iam-policy-binding clear-signal-send-key --member="$RUNTIME" --role=roles/secretmanager.secretAccessor
   gcloud secrets add-iam-policy-binding clear-signal-send-key --member="$DEPLOYER" --role=roles/secretmanager.secretAccessor
   ```

3. **Turn it on in GitHub.** In the repository: Settings, then Secrets and variables, then Actions, then the Variables tab. Add `CLEAR_SIGNAL_SENDING` with the value `on`.

The next deploy switches sending on and sends anything due. To run it without a code change, open Actions, pick "Deploy to Cloud Run" and press "Run workflow". The "Send due Clear Signal emails" step shows how many went out.

## Switch it off

Change `CLEAR_SIGNAL_SENDING` to anything but `on` (or delete it). Deploys then skip the send step.

## Limits

Mail goes out through the tony@signal-edge.ai Gmail account, which Google Workspace caps at about 2,000 emails a day. Past a few hundred subscribers, move sending to a mail service; only `lib/mail.ts` needs to change.
