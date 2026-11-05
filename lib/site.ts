// Names and copy settings used across the site. Change them here, in one place.
export const site = {
  name: "Signal-Edge AI",
  shortName: "Signal-Edge",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://signal-edge.ai",
  description:
    "An AI consulting company that delivers real AI results with your data.",
  // Working name; Tony hasn't settled it yet.
  newsletterName: "The Weekly Signal",
  // Tony, Nov 4: the newsletter goes out twice a month.
  newsletterCadence: "Two short emails a month",
  // Forms show a preview message until Supabase is connected.
  formsLive: false,
  // Shows the preview ribbon everywhere except the production site.
  isPreview: process.env.NEXT_PUBLIC_SITE_ENV !== "production",
} as const;
