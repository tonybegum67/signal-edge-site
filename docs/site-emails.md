# Emails the site sends

Besides Supabase's sign-in emails, the site sends one email of its own: a thank-you after someone sends the session prep form. It goes once to each address, from the signal-edge.ai Gmail account, with the session time from `prepSession` in `lib/site.ts` and a sign-in button.

Nothing is sent until the three steps below are done. Until then the form works exactly as before.

## Switch it on (once)

1. **Make an app password.** Signed in to Google as tony@signal-edge.ai, open myaccount.google.com/apppasswords and create one named "Signal-Edge site". Copy it; you'll paste it once in the next step.

2. **Store it in Google Cloud.** In Cloud Shell, run this. When it pauses, paste the app password and press Enter. Nothing shows while you paste, and it isn't saved in your history.

   ```bash
   gcloud config set project signal-edge-ai
   gcloud services enable secretmanager.googleapis.com
   gcloud secrets create smtp-password --replication-policy=automatic
   read -rs P && printf '%s' "$P" | gcloud secrets versions add smtp-password --data-file=- ; unset P
   PROJECT_NUMBER=$(gcloud projects describe signal-edge-ai --format='value(projectNumber)')
   gcloud secrets add-iam-policy-binding smtp-password \
     --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
     --role=roles/secretmanager.secretAccessor
   ```

3. **Tell GitHub which account sends.** In the repository on GitHub: Settings, then Secrets and variables, then Actions, then the Variables tab. Add `SMTP_USER` with the value `tony@signal-edge.ai`.

The next deploy switches sending on. To redeploy without a code change, open Actions, pick "Deploy to Cloud Run" and press "Run workflow".

## Change the session

Edit `prepSession` in `lib/site.ts` (or set it to `null` to leave the session line out) and merge.

## Switch it off

Delete the `SMTP_USER` variable in GitHub and redeploy.
