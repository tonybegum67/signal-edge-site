// Signal-Edge Steps lesson content. Each Step on the site matches a Step in the workshop deck.
// Every lesson works for Claude or ChatGPT: the steps are the same, and where the apps differ the lesson shows both.

export type AppSteps = { claude: string; chatgpt: string };

export type Block =
  | { kind: "text"; text: string }
  | { kind: "list"; items: string[] }
  | { kind: "apps"; apps: AppSteps }
  | { kind: "prompt"; label: string; text: string }
  | { kind: "split"; left: { title: string; items: string[] }; right: { title: string; items: string[] } }
  | { kind: "tip"; text: string }
  | { kind: "download"; label: string; href: string; note: string };

export type Part = { title: string; blocks: Block[] };

export type Lesson = {
  step: number;
  title: string;
  headline: string;
  minutes: number;
  free: boolean;
  intro: string;
  parts: Part[];
  // The "you're done when" checklist at the end of the lesson.
  tasks: string[];
};

export type StepSummary = { step: number; title: string; body: string; free: boolean; ready: boolean };

// The five Steps, in order.
export const stepSummaries: StepSummary[] = [
  { step: 1, title: "Set up the house", body: "Where your brain lives and the line between personal notes and client data", free: true, ready: true },
  { step: 2, title: "Teach it who you are", body: "A guided interview on your business, market, sphere and voice", free: false, ready: true },
  { step: 3, title: "Feed it your business", body: "Listings, past deals and scripts, with client details stripped out first", free: false, ready: true },
  { step: 4, title: "Put it to work", body: "Morning brief, listing copy, follow-ups and CMA prep", free: false, ready: true },
  { step: 5, title: "Keep it growing", body: "A weekly review and staying compliant as tools change", free: false, ready: true },
];

// The rulebook is a file in the Second Brain folder that your AI reads and keeps up to date.
// The prompts name AGENTS.md (ChatGPT); Claude users swap in CLAUDE.md.
export const rulebookName: AppSteps = { claude: "CLAUDE.md", chatgpt: "AGENTS.md" };

export const prompts = {
  firstLook:
    "Read the AGENTS.md rulebook in this folder first. Then tell me what's in this folder, and what we should put here first.",
  interview:
    "Interview me so you can help with my real estate business. Ask one question at a time and wait for my answer. Cover where I work and what I sell, the clients I serve best, how I find business and who's in my sphere, how I like to sound in writing, the jobs that eat up my week, and what I want help with first. Don't ask for client names or personal details. When we're done, write it up as a file called About me and save it in the About me folder if there is one. Then suggest a folder layout for this Second Brain and wait for my OK before you make anything.",
  fixAboutMe:
    "Read About me back to me in five short lines. Then change this: [what it got wrong]. Keep everything else.",
  rulebook:
    "Make a rulebook file for this folder called AGENTS.md. Put in: who I am in two lines from About me, our folder layout, how to name files (date first, like 2026-11-16 Showing notes Elm St), that client personal details never go in this folder, and that you ask me before you change or delete any file. Show it to me before you save it.",
  fillRulebook:
    "Update the AGENTS.md rulebook in this folder: fill in Who I am with two lines from About me, and update the folder list to match what we agreed. Show me the changes before you save them.",
  voice:
    "Here are 5 emails I wrote, with client names removed. Write a My voice section in the AGENTS.md in this folder: my tone, how I greet and sign off, and phrases I use. Show me the section before you save it.",
  voiceReview:
    "Read my sent emails from the past 60 days and update the My voice section in the AGENTS.md in this folder. Leave out client names and details. Show me the changes before you save them.",
  addRule: "From now on, file showing notes under Listings. Add that rule to the AGENTS.md rulebook in this folder and show me the line before you save it.",
  fileInbox: "File these where they belong, and tell me three things you learned about how I work.",
  cleanFile:
    "Before you file this, check it for client names, phone numbers, emails, home addresses or loan details. List anything you find and don't save the file until I've taken it out.",
  followUp:
    "Using my About me, the My voice section of the AGENTS.md in this folder, and my follow-up examples, write a short check-in to a past buyer who closed about a year ago. Give me two versions.",
  listingCopy:
    "Here are my notes and photos for a new listing. Using my About me and the listings I've saved, write the listing description in my voice, plus a short social post. Describe the home and the area, not who should live there. Keep it under my MLS character limit: [your MLS limit].",
  cmaPrep:
    "Here are the comps for a listing appointment, with owner names taken out. Give me five talking points for the seller in plain words, and the question they're most likely to ask about price, with how I might answer it.",
  morningBrief:
    "Read today's daily note and anything new in Inbox. Give me a short brief: what's on today, who I owe a follow-up, and one thing to prep.",
  dailyNote:
    "Start today's note in Daily notes. Here's my day: [your appointments and calls]. Add anyone I owe a call, and anything still open from my last note.",
  savePrompt:
    "Save the prompt I just used in Scripts and templates, named [a short name], so I can ask for it by name next time.",
  fixRule:
    "You got this wrong: [what was off]. Add a rule to the AGENTS.md rulebook in this folder so it doesn't happen again, and show me the rule before you save it.",
  privacyCheck:
    "Scan my whole Second Brain for anything that shouldn't be here: client phone numbers, home addresses, ID, bank or loan details, signed contracts or passwords. List what you find and where. Don't change or delete anything until I tell you to.",
  weeklyReview:
    "Weekly review: file everything in Inbox, tell me what's new this week, and suggest one rule to add to the AGENTS.md rulebook in this folder. Add it once I say OK.",
} as const;

export const lessons: Lesson[] = [
  {
    step: 1,
    title: "Set up the house",
    headline: "One folder, one app, one rule",
    minutes: 20,
    free: true,
    intro:
      "Your second brain is one folder on your computer that your AI can read. In this Step you get the folder, make it a project in the ChatGPT desktop app, and set the one rule that keeps client data safe.",
    parts: [
      {
        title: "Pick where it lives",
        blocks: [
          { kind: "text", text: "Your folder can sit on your laptop or in a cloud drive you already use, like Google Drive, Dropbox or OneDrive." },
          {
            kind: "list",
            items: [
              "Work on two computers? A cloud drive is easier, because both see the same folder.",
              "Brokerage strict about where files live? Keep it on your laptop.",
            ],
          },
        ],
      },
      {
        title: "Get your folder",
        blocks: [
          {
            kind: "text",
            text: "Download the starter folder, unzip it, and move the Second Brain folder where you picked. It already has the folders and a rulebook file, AGENTS.md, so there's nothing to make by hand.",
          },
          {
            kind: "download",
            label: "Download the starter folder",
            href: "/steps/starter-folder",
            note: "One small zip. Nothing to install.",
          },
          { kind: "tip", text: "Rather start from scratch? Make an empty folder called Second Brain instead. Your AI will help you fill it in Step 2." },
        ],
      },
      {
        title: "Make it a project",
        blocks: [
          {
            kind: "text",
            text: "Use the ChatGPT desktop app on a paid plan, not the website. The website can't see a folder on your computer; the desktop app can.",
          },
          {
            kind: "list",
            items: [
              "Create a project and name it Second Brain.",
              "Under Source folders, click Add and pick your Second Brain folder.",
              "Start every Second Brain chat inside this project, so it can see your folder.",
              "Stay in the desktop app. A project with a folder lives on your laptop and doesn't show up on the ChatGPT website.",
            ],
          },
          {
            kind: "tip",
            text: "Using Claude instead? Download the Claude desktop app from claude.ai/download, open the Code tab and choose your Second Brain folder. Claude reads the CLAUDE.md rulebook in the folder on its own.",
          },
          {
            kind: "tip",
            text: "When your AI asks to make or change a file, read the line, then say yes or no. It's your seatbelt.",
          },
        ],
      },
      {
        title: "Meet your rulebook",
        blocks: [
          {
            kind: "text",
            text: "AGENTS.md in your folder is your rulebook: a short note on who you are, where files go, how to name them, and what never goes in. Ask ChatGPT to read it at the start of each new chat.",
          },
          {
            kind: "tip",
            text: "Never edit it by hand unless you want to. Ask ChatGPT to update the AGENTS.md in this folder and it changes that file for you, never one anywhere else. You'll fill in Who I am in Step 2.",
          },
        ],
      },
      {
        title: "Set the one rule",
        blocks: [
          {
            kind: "split",
            left: { title: "Goes in", items: ["Notes about you and how you work", "Your scripts, templates and market notes", "Public listing details"] },
            right: { title: "Stays in your CRM", items: ["Client names, phones and home addresses", "ID numbers, bank and loan details", "Signed contracts and disclosures"] },
          },
          { kind: "text", text: "The simple test: if it would be a problem on a stranger's screen, it stays out. Your brokerage's own policy always wins." },
        ],
      },
      {
        title: "Try it",
        blocks: [{ kind: "prompt", label: "Your first message", text: prompts.firstLook }],
      },
    ],
    tasks: [
      "Choose laptop or cloud drive",
      "Get your Second Brain folder",
      "Install the ChatGPT desktop app",
      "Create the Second Brain project and add your folder",
      "Stay in the desktop app for your Second Brain",
      "Send your first message: read the rulebook",
    ],
  },
  {
    step: 2,
    title: "Teach it who you are",
    headline: "Let it interview you",
    minutes: 30,
    free: false,
    intro:
      "Now your AI gets to know you. It asks the questions, you mostly talk, and it writes everything up as an About me file it reads every time. Then you give it a rulebook so it works the same way every day.",
    parts: [
      {
        title: "Talk, don't type",
        blocks: [
          { kind: "text", text: "Answering out loud is faster and sounds more like you. Use your computer's dictation button." },
          { kind: "list", items: ["Mac: press the microphone key, or press Fn twice.", "Windows: press the Windows key and H together."] },
          { kind: "tip", text: "Describe clients without naming them. \"A first-time buyer couple moving from LA\" is plenty." },
        ],
      },
      {
        title: "Run the interview",
        blocks: [
          { kind: "text", text: "Paste this in and answer one question at a time. It takes about 20 minutes." },
          { kind: "prompt", label: "The interview", text: prompts.interview },
        ],
      },
      {
        title: "Read it back",
        blocks: [
          { kind: "text", text: "Open About me and read it. Fix anything that's wrong now, because everything later builds on it." },
          { kind: "prompt", label: "Fix a line", text: prompts.fixAboutMe },
        ],
      },
      {
        title: "Give everything a place",
        blocks: [
          { kind: "text", text: "Your AI suggested a folder layout at the end of the interview. Compare it with this one and keep what fits you." },
          { kind: "list", items: ["About me", "Listings", "Scripts and templates", "Market notes", "Daily notes", "Inbox, where new files land"] },
        ],
      },
      {
        title: "Write the rulebook",
        blocks: [
          {
            kind: "text",
            text: "Your rulebook is the AGENTS.md file in your folder: how you name files, where things go, and what never goes in. Your AI reads it and updates it for you.",
          },
          {
            kind: "apps",
            apps: {
              claude: "Claude reads CLAUDE.md on its own. Swap CLAUDE.md in wherever a prompt says AGENTS.md.",
              chatgpt: "ChatGPT uses AGENTS.md. Start each new chat with: Read the AGENTS.md rulebook in this folder first.",
            },
          },
          { kind: "text", text: "Using the starter folder? Your rulebook is already there. After the interview, have your AI fill in who you are." },
          { kind: "prompt", label: "Fill in the starter rulebook", text: prompts.fillRulebook },
          { kind: "text", text: "No rulebook yet? Have your AI write one." },
          { kind: "prompt", label: "Make the rulebook", text: prompts.rulebook },
          { kind: "text", text: "Then add one rule of your own. You can add more any time, in plain words." },
          { kind: "prompt", label: "Add a rule", text: prompts.addRule },
        ],
      },
      {
        title: "Teach it your voice",
        blocks: [
          {
            kind: "text",
            text: "Pick 5 emails you sent that sound like you. Take out the client names, paste them into your Second Brain chat, and send this.",
          },
          { kind: "prompt", label: "Teach it your voice", text: prompts.voice },
          { kind: "tip", text: "From now on, ask for a draft and it writes like you, not like a robot." },
        ],
      },
    ],
    tasks: [
      "Run the interview",
      "Read and fix About me",
      "Agree on a folder layout",
      "Make your rulebook",
      "Add one rule of your own",
      "Teach it your voice from 5 emails",
    ],
  },
  {
    step: 3,
    title: "Feed it your business",
    headline: "Five to ten files is plenty",
    minutes: 25,
    free: false,
    intro:
      "Your AI knows who you are. Now give it real work to learn from: a handful of your best files, with client details taken out first. This is where it starts to sound like you.",
    parts: [
      {
        title: "Pick your files",
        blocks: [
          {
            kind: "list",
            items: [
              "A recent listing description you liked",
              "Your three best follow-up emails",
              "Your buyer or listing consult script",
              "A past CMA, with client names taken out",
              "Your bio",
            ],
          },
          { kind: "tip", text: "Start small. Five good files teach it more than fifty random ones." },
        ],
      },
      {
        title: "Check before you drop",
        blocks: [
          {
            kind: "split",
            left: { title: "Good to add", items: ["Your own scripts and templates", "Public listing details", "Market notes and stats", "Notes with client names taken out"] },
            right: { title: "Keep out", items: ["ID numbers, bank and loan details", "Signed contracts and disclosures", "Client phone numbers and home addresses", "Anything your brokerage says stays in the CRM"] },
          },
          { kind: "text", text: "Not sure about a file? Ask your AI to check it before it saves anything." },
          { kind: "prompt", label: "Check a file", text: prompts.cleanFile },
        ],
      },
      {
        title: "Drop and file",
        blocks: [
          { kind: "text", text: "Drag your files into Inbox, then let your AI sort them." },
          { kind: "prompt", label: "Ask your AI", text: prompts.fileInbox },
          { kind: "text", text: "Read the three things it learned. If one is off, tell it, and add a rule so it sticks." },
        ],
      },
    ],
    tasks: [
      "Pick five to ten files",
      "Take client details out",
      "Drop them into Inbox",
      "Have your AI file them",
      "Read the three things it learned",
    ],
  },
  {
    step: 4,
    title: "Put it to work",
    headline: "Four jobs to hand off",
    minutes: 25,
    free: false,
    intro:
      "Now your AI pays you back. Everyone starts with a follow-up that sounds like you. Then try listing copy, CMA talking points and a morning brief, and keep the ones that save you time.",
    parts: [
      {
        title: "Your first follow-up",
        blocks: [
          {
            kind: "list",
            items: [
              "Think of one person you owe a check-in.",
              "Describe them without their name. \"A buyer who closed about a year ago\" is plenty.",
              "Ask for it in your voice, then edit one line so it's yours.",
            ],
          },
          { kind: "prompt", label: "Write the follow-up", text: prompts.followUp },
          {
            kind: "tip",
            text: "Nothing gets sent from your AI. Copy the draft into your own email or CRM when you're happy with it, and add the name there.",
          },
          {
            kind: "text",
            text: "Doesn't sound like you yet? Drop two more of your real follow-up emails into Inbox, have your AI file them, and try again.",
          },
        ],
      },
      {
        title: "Listing copy",
        blocks: [
          { kind: "text", text: "Give it your notes and photos, and it writes the description and a social post in your voice." },
          { kind: "prompt", label: "Write the listing copy", text: prompts.listingCopy },
          {
            kind: "tip",
            text: "Describe the home and the area, never who should live there. Read every line before it goes on the MLS.",
          },
        ],
      },
      {
        title: "CMA talking points",
        blocks: [
          { kind: "text", text: "Take owner names out of your comps first, then paste them in or drop the file into Inbox." },
          { kind: "prompt", label: "Get talking points", text: prompts.cmaPrep },
        ],
      },
      {
        title: "Morning brief",
        blocks: [
          {
            kind: "text",
            text: "Your brief reads your daily note, so start one each morning. Type or talk it in, in a minute.",
          },
          { kind: "prompt", label: "Start today's note", text: prompts.dailyNote },
          { kind: "prompt", label: "Get your brief", text: prompts.morningBrief },
        ],
      },
      {
        title: "Keep what works",
        blocks: [
          { kind: "text", text: "When a prompt saves you time, save it, and next time just ask for it by name." },
          { kind: "prompt", label: "Save a prompt", text: prompts.savePrompt },
        ],
      },
    ],
    tasks: [
      "Draft your first follow-up",
      "Edit one line so it sounds like you",
      "Try the listing copy",
      "Try the CMA talking points",
      "Start a daily note and get your brief",
      "Save the prompt you liked best",
    ],
  },
  {
    step: 5,
    title: "Keep it growing",
    headline: "15 minutes on a Friday",
    minutes: 15,
    free: false,
    intro:
      "A second brain gets better the more it knows. Fifteen minutes a week keeps it filed, current and safe, and every fix you make sticks.",
    parts: [
      {
        title: "Block the time",
        blocks: [
          { kind: "text", text: "Put a 15-minute block on your calendar every Friday, now, before you close the laptop." },
        ],
      },
      {
        title: "Run the weekly review",
        blocks: [
          { kind: "text", text: "Drop the week's new files into Inbox, then let your AI do the rest." },
          { kind: "prompt", label: "Weekly review", text: prompts.weeklyReview },
        ],
      },
      {
        title: "Fix it once",
        blocks: [
          {
            kind: "text",
            text: "When your AI gets something wrong, don't just fix the draft. Add a rule, and it won't make the same mistake again.",
          },
          { kind: "prompt", label: "Add a rule", text: prompts.fixRule },
        ],
      },
      {
        title: "Keep it safe",
        blocks: [
          {
            kind: "list",
            items: [
              "Run the privacy check once a month.",
              "Keep the setting that asks before your AI changes files.",
              "Your brokerage's policy always wins. If it changes, add a rule.",
            ],
          },
          { kind: "prompt", label: "Privacy check", text: prompts.privacyCheck },
        ],
      },
      {
        title: "Stay current",
        blocks: [
          {
            kind: "text",
            text: "AI tools change fast. Clear Signal is our free email, twice a month, on what's new and worth your time. Switch it on in My account.",
          },
        ],
      },
      {
        title: "Homework: your voice from 60 days of email",
        blocks: [
          {
            kind: "text",
            text: "Do this at home, and only after your team lead says it's OK to connect your work email and drives to ChatGPT.",
          },
          {
            kind: "list",
            items: [
              "In ChatGPT's settings, connect your email (Gmail or Outlook) and your cloud drive (Google Drive or OneDrive).",
              "Connecting doesn't change the one rule: client details still stay out of your Second Brain files.",
              "Then open your Second Brain project and send the prompt below.",
            ],
          },
          { kind: "prompt", label: "60-day voice review", text: prompts.voiceReview },
          {
            kind: "tip",
            text: "If ChatGPT can't see your mail from inside the project, run the review in a regular chat, then paste the result into your project and ask it to update My voice in the AGENTS.md in this folder.",
          },
        ],
      },
    ],
    tasks: [
      "Block 15 minutes on Fridays",
      "Run your first weekly review",
      "Add a rule when it gets something wrong",
      "Run the privacy check",
      "Switch on Clear Signal",
      "Homework: run the 60-day voice review",
    ],
  },
];

export function getLesson(step: number) {
  return lessons.find((l) => l.step === step) ?? null;
}

// The prompt pack: every ready-made prompt, grouped by Step. The same words work in Claude and ChatGPT.
export type PackGroup = { step: number; title: string; items: { label: string; text: string }[] };

export const promptPack: PackGroup[] = [
  {
    step: 1,
    title: "Set up the house",
    items: [
      { label: "Your first message in a new chat", text: prompts.firstLook },
    ],
  },
  {
    step: 2,
    title: "Teach it who you are",
    items: [
      { label: "The interview", text: prompts.interview },
      { label: "Fix a line in About me", text: prompts.fixAboutMe },
      { label: "Fill in the starter rulebook", text: prompts.fillRulebook },
      { label: "Make the rulebook from scratch", text: prompts.rulebook },
      { label: "Add a rule", text: prompts.addRule },
      { label: "Teach it your voice", text: prompts.voice },
    ],
  },
  {
    step: 3,
    title: "Feed it your business",
    items: [
      { label: "Check a file before it goes in", text: prompts.cleanFile },
      { label: "File your Inbox", text: prompts.fileInbox },
    ],
  },
  {
    step: 4,
    title: "Put it to work",
    items: [
      { label: "Follow-up", text: prompts.followUp },
      { label: "Listing copy", text: prompts.listingCopy },
      { label: "CMA talking points", text: prompts.cmaPrep },
      { label: "Start today's note", text: prompts.dailyNote },
      { label: "Morning brief", text: prompts.morningBrief },
      { label: "Save a prompt", text: prompts.savePrompt },
    ],
  },
  {
    step: 5,
    title: "Keep it growing",
    items: [
      { label: "Friday review", text: prompts.weeklyReview },
      { label: "Add a rule", text: prompts.fixRule },
      { label: "Privacy check", text: prompts.privacyCheck },
      { label: "Homework: 60-day voice review", text: prompts.voiceReview },
    ],
  },
];
