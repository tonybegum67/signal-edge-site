// Names and copy settings used across the site. Change them here, in one place.
export const site = {
  name: "Signal-Edge AI",
  shortName: "Signal-Edge",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://signal-edge.ai",
  description:
    "An AI consulting company that delivers real AI results with your data.",
  // Tony chose the name Nov 6, 2026.
  newsletterName: "Clear Signal",
  newsletterTagline: "AI made clear, twice a month.",
  // Tony, Nov 4: the newsletter goes out twice a month.
  newsletterCadence: "Two short emails a month",
  // The next session people fill the prep form for. Shown in the thank-you email; set to null between sessions.
  prepSession: { when: "Monday, November 16, 10 AM to 12 PM Pacific" } as { when: string } | null,
  // Shows the preview ribbon everywhere except the production site.
  isPreview: process.env.NEXT_PUBLIC_SITE_ENV !== "production",
} as const;
