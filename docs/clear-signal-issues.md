# Clear Signal issue pages

Every Clear Signal issue has a page on the site with its Prompt of the week, a Copy button, the homework and a link into the right Signal-Edge Steps lesson. The page lives at:

```
https://signal-edge.ai/clear-signal/NNN
```

`NNN` is the issue number in three digits, so issue 1 is `https://signal-edge.ai/clear-signal/001`. `https://signal-edge.ai/clear-signal` lists every published issue, newest first. Both are free to view, no sign-in.

## One file per issue

Each issue is one JSON file in `content/clear-signal/`, named by its number: `001.json`, `002.json` and so on. Adding the file is the whole change. Nothing else in the code needs to move.

```json
{
  "number": "002",
  "date": "November 2026",
  "title": "Short name for the Prompt of the week",
  "intro": "One line on how to use the prompt.",
  "prompt": "The prompt itself. Use \n for a new line.",
  "promptNote": "What you'll get back: one line.",
  "homework": "One or two sentences on what to do with it this week.",
  "step": 1
}
```

| Field | What it holds |
|---|---|
| `number` | Three digits, the same as the file name |
| `date` | How the date shows on the page, like `November 2026` |
| `title` | The Prompt of the week's name, which is the page heading |
| `intro` | One line above the prompt |
| `prompt` | The text the Copy button copies |
| `promptNote` | One line under the prompt on what comes back |
| `homework` | The exercise for the week |
| `step` | The Signal-Edge Steps lesson to point to, 1 to 5. Step 1 is free, so the page says so. |

Every field is required. A file with a missing field, a wrong number or a step that doesn't exist fails the build with a message naming the file, so a broken page never ships.

Write it in the Live Signal voice: plain, friendly, no jargon, no em dashes. The prompt never asks for client names or private details.

## How an issue goes out

The page and the email go out together:

1. The newsletter run drafts the issue.
2. The same run adds `content/clear-signal/NNN.json` on a new branch and opens a pull request with just that file.
3. Tony reads the draft and the page, and merges the pull request when he approves the issue.
4. The merge deploys the site. The page is live a few minutes later at `/clear-signal/NNN`.
5. The email goes out with its "Try this week's exercise" link pointing at that page.

Until the pull request is merged, the issue appears nowhere on the site: not on its own address and not in the list. So an unsent issue is never public.

## Linking to the page from the email

Use the page address exactly as above, for example `https://signal-edge.ai/clear-signal/002`. Each email also needs its own unsubscribe link: see `clear-signal-sending.md`.
