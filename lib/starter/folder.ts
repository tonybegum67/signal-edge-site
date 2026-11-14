import { makeZip, type ZipEntry } from "../zip";

// The Second Brain starter folder: the folder layout from Step 2, one rulebook as AGENTS.md (ChatGPT and Claude),
// a CLAUDE.md that only points Claude to it, and a Start here note. One download, nothing to install.

const ROOT = "Second Brain/";

export const starterFolders = ["About me", "Listings", "Scripts and templates", "Market notes", "Daily notes", "Inbox"];

export const starterRulebook = `# My Second Brain rulebook

This folder is my second brain. Follow these rules and read the About me folder before you help me.
This AGENTS.md is the one rulebook for this folder, for ChatGPT and Claude alike.

## Who I am
[Two lines about you. Your AI fills this in after the Step 2 interview.]

## My voice
[How I sound in writing: my tone, how I greet and sign off, and phrases I use. Your AI fills this in from five of your emails in Step 2.]

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
- Write in my voice, from My voice in this file and About me. Keep it short and plain.
- When I ask you to change a rule, update this file and show me the change before you save it.
- The only file you edit for rules is this AGENTS.md in this folder. Never change CLAUDE.md, or any other AGENTS.md, CLAUDE.md or settings file on this computer.

## My own rules
- [Add a rule any time, in plain words. For example: file showing notes under Listings.]
`;

// Claude reads CLAUDE.md on its own; this pulls in AGENTS.md so there's only one rulebook to keep.
export const claudePointer = `@AGENTS.md

The rulebook for this folder is the AGENTS.md file in this folder. Read it and follow it.
When I ask you to change a rule, edit AGENTS.md, not this file.
`;

const startHere = `START HERE

This is your Second Brain starter folder from Signal-Edge Steps.

1. Unzip it, then move the Second Brain folder where you want it to live:
   your laptop, or a cloud drive like Google Drive, Dropbox or OneDrive.

2. Make it a project in the ChatGPT desktop app (not the website):
   - Create a project and name it Second Brain.
   - Under Source folders, click Add and pick this Second Brain folder.
   Stay in the desktop app. A project with a folder lives on your laptop
   and doesn't show up on the ChatGPT website.
   Using Claude instead? Open the Code tab and choose this folder.

3. Start a chat in the project and send:
   "Read the AGENTS.md rulebook in this folder first. Then tell me what's
   in this folder, and what we should put here first."

AGENTS.md is your one rulebook. CLAUDE.md only points Claude to it, so leave it be.
Ask your AI to update it any time; you don't have to edit it by hand.

Client personal details never go in this folder. They stay in your CRM.

The lessons and every prompt are at signal-edge.ai under My Steps.
`;

export function starterFolderZip() {
  const entries: ZipEntry[] = [
    { name: ROOT },
    { name: `${ROOT}Start here.txt`, content: startHere.replace(/\n/g, "\r\n") },
    { name: `${ROOT}CLAUDE.md`, content: claudePointer },
    { name: `${ROOT}AGENTS.md`, content: starterRulebook },
    ...starterFolders.map((f) => ({ name: `${ROOT}${f}/` })),
  ];
  return makeZip(entries);
}
