import { makeZip, type ZipEntry } from "../zip";

// The Second Brain starter folder: the folder layout from Step 2, a rulebook for each app,
// and a Start here note. One download, nothing to install.

const ROOT = "Second Brain/";

export const starterFolders = ["About me", "Listings", "Scripts and templates", "Market notes", "Daily notes", "Inbox"];

const rulebook = `# My Second Brain rulebook

This folder is my second brain. Read this file and the About me folder before you help me.
Claude reads this file as CLAUDE.md. ChatGPT reads it as AGENTS.md. Both say the same thing.

## Who I am
[Two lines about you. Your AI fills this in after the Step 2 interview.]

## Folders
- About me: who I am, my market, my clients and how I like to sound
- Listings: listing notes, descriptions and showing notes
- Scripts and templates: my scripts, follow-ups and emails that worked
- Market notes: stats, trends and notes on my area
- Daily notes: one note a day on what happened and what's next
- Inbox: new files land here until we file them

## Naming files
Date first, then what it is. For example: 2026-11-16 Showing notes Elm St.

## Rules
- Client personal details never go in this folder: phone numbers, home addresses, ID numbers, bank or loan details, or signed contracts. Those stay in my CRM.
- Ask me before you change, move or delete any file.
- Nothing gets sent from here. I copy drafts into my own email or CRM.
- When I say "file the Inbox", put each file where it belongs and tell me where it went.
- Write in my voice, from About me. Keep it short and plain.

## My own rules
- [Add a rule any time, in plain words. For example: file showing notes under Listings.]
`;

const startHere = `START HERE

This is your Second Brain starter folder from Signal-Edge Steps.

1. Unzip it, then move the Second Brain folder where you want it to live:
   your laptop, or a cloud drive like Google Drive, Dropbox or OneDrive.

2. Open it in your AI's desktop app (not the website):
   - Claude: open the Code tab and choose this Second Brain folder.
   - ChatGPT: open Codex, choose Open a folder and pick this Second Brain folder.
   Keep the setting that asks before it changes files.

3. Ask your AI: "What's in this folder, and what should we put here first?"

The two rulebook files say the same thing. Claude reads CLAUDE.md and ChatGPT reads AGENTS.md,
so you can keep both, or delete the one for the app you don't use.

Client personal details never go in this folder. They stay in your CRM.

The lessons and every prompt are at signal-edge.ai under My Steps.
`;

export function starterFolderZip() {
  const entries: ZipEntry[] = [
    { name: ROOT },
    { name: `${ROOT}Start here.txt`, content: startHere.replace(/\n/g, "\r\n") },
    { name: `${ROOT}CLAUDE.md`, content: rulebook },
    { name: `${ROOT}AGENTS.md`, content: rulebook },
    ...starterFolders.map((f) => ({ name: `${ROOT}${f}/` })),
  ];
  return makeZip(entries);
}
