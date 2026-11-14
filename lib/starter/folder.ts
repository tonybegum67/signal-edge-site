import { makeZip, type ZipEntry } from "../zip";

// The Second Brain starter folder: the folder layout from Step 2, the rulebook and a Start here note.
// In ChatGPT the rulebook goes in the project's Instructions (Step 1 shows it ready to copy).
// The CLAUDE.md and AGENTS.md copies are for Claude's Code tab and, as a bonus, Codex.

const ROOT = "Second Brain/";

export const starterFolders = ["About me", "Listings", "Scripts and templates", "Market notes", "Daily notes", "Inbox"];

export const starterRulebook = `# My Second Brain rulebook

This folder is my second brain. Follow these rules and read the About me folder before you help me.
(In ChatGPT these rules live in the project's Instructions. In Claude they live in the CLAUDE.md file.)

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

2. Make it a project in the ChatGPT desktop app (not the website):
   - Create a project and name it Second Brain.
   - Under Source folders, click Add and pick this Second Brain folder.
   - Open the project's Instructions and paste in the starter rulebook.
     Copy it from Step 1 at signal-edge.ai, under My Steps.
   Using Claude instead? Open the Code tab and choose this folder.
   Claude reads the rulebook from CLAUDE.md, so there's nothing to paste.

3. Start a chat in the project and ask:
   "What's in this folder, and what should we put here first?"

CLAUDE.md and AGENTS.md are the same rulebook as a file, for Claude and for Codex.
You can leave them, or delete the ones for apps you don't use.

Client personal details never go in this folder. They stay in your CRM.

The lessons and every prompt are at signal-edge.ai under My Steps.
`;

export function starterFolderZip() {
  const entries: ZipEntry[] = [
    { name: ROOT },
    { name: `${ROOT}Start here.txt`, content: startHere.replace(/\n/g, "\r\n") },
    { name: `${ROOT}CLAUDE.md`, content: starterRulebook },
    { name: `${ROOT}AGENTS.md`, content: starterRulebook },
    ...starterFolders.map((f) => ({ name: `${ROOT}${f}/` })),
  ];
  return makeZip(entries);
}
