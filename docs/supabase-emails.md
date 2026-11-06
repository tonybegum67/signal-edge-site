# Branded sign-in emails

Supabase sends the emails for sign-up and sign-in. Out of the box they're plain, they come from Supabase's own address, and they end with "powered by Supabase". Two changes fix that:

1. Paste our Live Signal templates into Supabase.
2. Send from a signal-edge.ai address through Google Workspace.

## 1. Paste the templates

The templates live in `supabase/templates/`. To change the wording or look, edit `scripts/build-email-templates.mjs`, run `npm run emails`, and open a PR like any other change. Then paste the new files in again.

In Supabase, open **Authentication**, then **Emails** (it may say **Email Templates**). For each row below, pick the template, put in the subject, and replace everything in the body box with the whole file. Then press **Save**.

| Supabase template | Subject | File |
|---|---|---|
| Confirm signup | Confirm your email for Signal-Edge Steps | `supabase/templates/confirm-signup.html` |
| Magic link | Your Signal-Edge sign-in link | `supabase/templates/magic-link.html` |
| Change email address | Confirm your new email for Signal-Edge | `supabase/templates/change-email.html` |
| Invite user | You're invited to Signal-Edge Steps | `supabase/templates/invite.html` |

Leave the parts in double curly braces, like `{{ .ConfirmationURL }}`, exactly as they are. Supabase fills them in when it sends.

The site has no passwords, so the **Reset password** and **Reauthentication** templates are never sent. They can stay as they are.

The invite template is ready for when company spaces open. Sending invites from the site comes with that work.

## 2. Send from a signal-edge.ai address

This removes the "powered by Supabase" line and the opt-out link, and lifts Supabase's very low limit on emails from its own address.

**In Google (the account that will send the emails, for example tony@signal-edge.ai):**

1. Make sure 2-Step Verification is on for that account (Google Account, **Security**).
2. Create an app password (Google Account, search for **App passwords**). Name it "Supabase". Google shows a 16-letter password once. Keep that page open for the next part, and don't paste it anywhere else.

If App passwords doesn't show up, the Google Workspace admin settings may have it switched off, or 2-Step Verification isn't on yet.

**In Supabase (Authentication, then Emails, then SMTP Settings):**

1. Switch on **Enable custom SMTP**.
2. Fill in:
   - Sender email: the Google address from above (for example tony@signal-edge.ai). Gmail only sends from that address or a "send mail as" alias already added in Gmail.
   - Sender name: `Signal-Edge AI`
   - Host: `smtp.gmail.com`
   - Port: `465`
   - Username: the same Google address
   - Password: the app password
3. Press **Save**.

Then check **Authentication**, **Rate Limits**. With custom SMTP, Supabase lets you set how many sign-in emails it sends per hour. The starting number is fine for the pilot.

## Test it

Sign out of the site, then sign in again with your email. The email should come from Signal-Edge AI, look like the Live Signal templates, and have no Supabase line at the bottom.
