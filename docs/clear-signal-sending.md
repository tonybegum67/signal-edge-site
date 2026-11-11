# Sending Clear Signal

Every Clear Signal email needs a working unsubscribe link that is personal to the person it goes to. This page says how a send fills it in.

## The unsubscribe link

Each subscriber has a random `unsubscribe_token` in `newsletter_subscribers`. Their link is:

```
https://signal-edge.ai/clear-signal/unsubscribe?t=TOKEN
```

The link holds no email address, and a token can't be guessed. Opening it shows a branded page with an **Unsubscribe** button. After that the page says "You're unsubscribed" and offers **Resubscribe** in case it was a mistake. Nobody is unsubscribed just by opening the link, so a mail scanner that opens links can't unsubscribe anyone.

In the email draft, write the placeholder where the link goes:

```
{{unsubscribe_url}}
```

The send replaces it for each person with their own link.

## Who to send to

Only people who haven't unsubscribed. Run this in the Supabase SQL Editor, or from any send script that uses the service role:

```sql
select email, unsubscribe_token
from public.newsletter_subscribers
where unsubscribed_at is null
order by created_at;
```

Visitors to the site can't run this. The list is only readable from Supabase itself.

## Mail headers

Gmail and Yahoo ask bulk senders for a one-click unsubscribe in the mail headers too. When the sending tool can set headers, add these for each person (`lib/clear-signal.ts` builds them with `listUnsubscribeHeaders(token, "tony@signal-edge.ai")`):

```
List-Unsubscribe: <https://signal-edge.ai/api/clear-signal/unsubscribe?t=TOKEN>, <mailto:tony@signal-edge.ai?subject=unsubscribe>
List-Unsubscribe-Post: List-Unsubscribe=One-Click
```

The first address unsubscribes on a POST with no page in between, which is what Gmail's own Unsubscribe button sends. The mailto is a fallback: if someone replies "unsubscribe", set `unsubscribed_at` on their row by hand.

When the sending tool can't set headers, the link in the email body is still enough for the law (CAN-SPAM). Add the headers once the list grows past a few hundred, or when sending moves to a mail service.

## Every email also needs

- The sender's mailing address in the footer. CAN-SPAM requires a real postal address.
- A plain line on why they're getting it, like "You signed up for Clear Signal at signal-edge.ai."
- The issue's exercise link: `https://signal-edge.ai/clear-signal/NNN`. See `clear-signal-issues.md`.
