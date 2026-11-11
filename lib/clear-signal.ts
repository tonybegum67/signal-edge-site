import { site } from "@/lib/site";

// Clear Signal links: issue pages and each subscriber's unsubscribe link.

export function issueUrl(number: string) {
  return `${site.url}/clear-signal/${number}`;
}

// A subscriber's private token from newsletter_subscribers.unsubscribe_token.
export const TOKEN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// The link in the footer of every issue. Opens a page with one Unsubscribe button.
export function unsubscribeUrl(token: string) {
  return `${site.url}/clear-signal/unsubscribe?t=${encodeURIComponent(token)}`;
}

// The headers Gmail, Apple Mail and Outlook use for their own Unsubscribe button.
// The one-click address unsubscribes on POST, without a page.
export function listUnsubscribeHeaders(token: string, mailbox: string) {
  const oneClick = `${site.url}/api/clear-signal/unsubscribe?t=${encodeURIComponent(token)}`;
  return {
    "List-Unsubscribe": `<${oneClick}>, <mailto:${mailbox}?subject=unsubscribe>`,
    "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
  };
}
