# Deploying to Google Cloud Run

The site runs on Cloud Run in the Signal-Edge Google Cloud project. GitHub deploys it each time a pull request is merged to `main`. GitHub proves who it is to Google with Workload Identity Federation, so no key file is ever created or stored.

Until the three repository variables below are set, the deploy workflow skips itself and only the CI checks run.

## One-time setup (about 10 minutes)

1. Sign in to the Google Cloud console with the signal-edge.ai Google account.
2. Create a project and link a billing account. (Done Nov 4: project ID `signal-edge-ai`.)
3. Open **Cloud Shell** (the `>_` icon, top right) and paste the block below. It is already set to the `signal-edge-ai` project.

```bash
PROJECT_ID=signal-edge-ai
GH_REPO=tonybegum67/signal-edge-site

gcloud config set project "$PROJECT_ID"
PROJECT_NUMBER=$(gcloud projects describe "$PROJECT_ID" --format='value(projectNumber)')

# Turn on the services the deploy uses
gcloud services enable run.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com \
  iamcredentials.googleapis.com sts.googleapis.com

# A service account that GitHub deploys as
gcloud iam service-accounts create github-deployer --display-name="GitHub deployer"
SA="github-deployer@${PROJECT_ID}.iam.gserviceaccount.com"
for ROLE in roles/run.admin roles/cloudbuild.builds.editor roles/artifactregistry.admin \
            roles/storage.admin roles/iam.serviceAccountUser roles/serviceusage.serviceUsageConsumer; do
  gcloud projects add-iam-policy-binding "$PROJECT_ID" --member="serviceAccount:$SA" --role="$ROLE" --condition=None --quiet >/dev/null
done

# Let Cloud Build build from source
gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
  --role=roles/run.builder --condition=None --quiet >/dev/null

# Trust GitHub Actions, but only from this one repository
gcloud iam workload-identity-pools create github --location=global --display-name="GitHub"
gcloud iam workload-identity-pools providers create-oidc github-repo \
  --location=global --workload-identity-pool=github \
  --issuer-uri="https://token.actions.githubusercontent.com" \
  --attribute-mapping="google.subject=assertion.sub,attribute.repository=assertion.repository" \
  --attribute-condition="assertion.repository=='${GH_REPO}'"
gcloud iam service-accounts add-iam-policy-binding "$SA" --role=roles/iam.workloadIdentityUser \
  --member="principalSet://iam.googleapis.com/projects/${PROJECT_NUMBER}/locations/global/workloadIdentityPools/github/attribute.repository/${GH_REPO}"

# Print the values for GitHub
echo "GCP_PROJECT_ID=$PROJECT_ID"
echo "GCP_WIF_PROVIDER=projects/${PROJECT_NUMBER}/locations/global/workloadIdentityPools/github/providers/github-repo"
echo "GCP_DEPLOY_SA=$SA"
```

4. In GitHub, open the repo's **Settings → Secrets and variables → Actions → Variables** and add the three printed values as repository variables (they are not secrets). Optional: `GCP_REGION` (default `us-west1`) and `CLOUD_RUN_SERVICE` (default `signal-edge-site`).
5. Run the **Deploy to Cloud Run** workflow once from the Actions tab, or merge any pull request. The last step prints the site's `run.app` address.

## Later

- **Custom domain:** point `signal-edge.ai` at the service once the site is ready for launch, then build with `SITE_ENV=production` to remove the preview ribbon and let search engines in.
- **Cost:** at pilot traffic the site should stay inside Cloud Run's free monthly allowance; a budget alert in Billing is a good safety net.
