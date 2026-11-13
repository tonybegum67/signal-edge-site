# Announcements

An announcement is a one-off marketing email to the list: a workshop, a new offer, a launch. It goes out in the same branded Live Signal design as Clear Signal (Signal-Edge AI header, colors, fonts, the postal address, a personal unsubscribe link) and through the same automatic send. See `clear-signal-sending.md` for how sending works and how it's switched on.

## Who gets it

The list is everyone in `newsletter_subscribers` who hasn't unsubscribed: the people who signed up for Clear Signal on the site. Unsubscribing from one email takes them off the list for both Clear Signal and announcements.

The file's `audience` decides who gets it, exactly as for an issue:

| `audience` | Who gets it |
|---|---|
| `"test"` | Only tony@signal-edge.ai, marked [Test]. A new test goes out each time the words change. |
| `"everyone"` | Everyone on the list. |

So an announcement goes out in two merges:

1. A pull request adds `content/announcements/<name>.json` with `"audience": "test"`. Merging it sends Tony a branded test copy.
2. Once it looks right, a one-line pull request changes `"test"` to `"everyone"`. Merging that sends it to the list.

Each announcement goes to each person once, however many times the site deploys. Someone who joins the list after it went out doesn't get it.

## The file

Name it with 3 to 40 lowercase letters, digits and dashes, like `content/announcements/workshop-dec.json`. The name can't be reused for a later announcement.

```json
{
  "audience": "test",
  "subject": "Bring your team to a hands-on AI workshop",
  "preheader": "Half a day, real work, everyone leaves with prompts they'll use on Monday.",
  "label": "Workshop",
  "heading": "Your team, hands on with AI",
  "paragraphs": [
    "One or two plain, friendly sentences per paragraph.",
    "Up to six paragraphs."
  ],
  "highlight": { "label": "When", "value": "Tuesday, December 2, 10 AM PT" },
  "button": { "text": "Save a seat", "href": "https://signal-edge.ai/" },
  "ps": "Optional last line."
}
```

`highlight`, `button` and `ps` are optional. The button's address must start with `https://`. Everything else is required. A broken file fails the build, so it can't stop a send halfway.

Tone: fun and approachable, not technical (see the brand voice guide). Keep it to one ask per email.
