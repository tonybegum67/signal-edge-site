// Public Supabase settings. Both values are safe to ship to the browser.
// They come from GitHub repository variables at build time (see .github/workflows/deploy.yml).
export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

// False in CI and on a fresh checkout, so the site still builds and sign-in shows a friendly note.
export const supabaseConfigured = Boolean(supabaseUrl && supabaseKey);
