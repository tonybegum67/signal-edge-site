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

// The five Steps, in order. Lessons for Steps 4 and 5 come after the Nov 16 session.
export const stepSummaries: StepSummary[] = [
  { step: 1, title: "Set up the house", body: "Where your brain lives and the line between personal notes and client data", free: true, ready: true },
  { step: 2, title: "Teach it who you are", body: "A guided interview on your business, market, sphere and voice", free: false, ready: true },
  { step: 3, title: "Feed it your business", body: "Listings, past deals and scripts, with client details stripped out first", free: false, ready: true },
  { step: 4, title: "Put it to work", body: "Morning brief, listing copy, follow-ups and CMA prep", free: false, ready: false },
  { step: 5, title: "Keep it growing", body: "A weekly review and staying compliant as tools change", free: false, ready: false },
];

// The rulebook is the file your AI reads every time it opens your folder. The name depends on the app.
export const rulebookName: AppSteps = { claude: "CLAUDE.md", chatgpt: "AGENTS.md" };

export const prompts = {
  firstLook: "What's in this folder, and what should we put here first?",
  interview:
    "Interview me so you can help with my real estate business. Ask one question at a time and wait for my answer. Cover where I work and what I sell, the clients I serve best, how I find business and who's in my sphere, how I like to sound in writing, the jobs that eat up my week, and what I want help with first. Don't ask for client names or personal details. When we're done, write it up as a file called About me and save it in the About me folder if there is one. Then suggest a folder layout for this Second Brain and wait for my OK before you make anything.",
  fixAboutMe:
    "Read About me back to me in five short lines. Then change this: [what it got wrong]. Keep everything else.",
  rulebook:
    "Make a rulebook file for this folder called [CLAUDE.md for Claude, AGENTS.md for ChatGPT]. Put in: who I am in two lines from About me, our folder layout, how to name files (date first, like 2026-11-16 Showing notes Elm St), that client personal details never go in this folder, and that you ask me before you change or delete any file. Show it to me before you save it.",
  fillRulebook:
    "Read the rulebook in this folder. Fill in Who I am with two lines from About me, and update the folder list to match what we agreed. Show me the changes before you save them.",
  addRule: "From now on, file showing notes under Listings. Add that to the rulebook.",
  fileInbox: "File these where they belong, and tell me three things you learned about how I work.",
  cleanFile:
    "Before you file this, check it for client names, phone numbers, emails, home addresses or loan details. List anything you find and don't save the file until I've taken it out.",
  followUp:
    "Using my About me and my follow-up examples, write a short check-in to a past buyer who closed about a year ago. Sound like me. Give me two versions.",
  listingCopy:
    "Here are my notes and photos for a new listing. Using my About me and the listings I've saved, write the listing description in my voice, plus a short social post. Describe the home and the area, not who should live there. Keep it under my MLS character limit: [your MLS limit].",
  cmaPrep:
    "Here are the comps for a listing appointment, with owner names taken out. Give me five talking points for the seller in plain words, and the question they're most likely to ask about price, with how I might answer it.",
  morningBrief:
    "Read today's daily note and anything new in Inbox. Give me a short brief: what's on today, who I owe a follow-up, and one thing to prep.",
  weeklyReview:
    "Weekly review: file everything in Inbox, tell me what's new this week, and suggest one thing to add to my rulebook.",
} as const;

export const lessons: Lesson[] = [
  {
    step: 1,
    title: "Set up the house",
    headline: "One folder, one app, one rule",
    minutes: 20,
    free: true,
    intro:
      "Your second brain is one folder on your computer that your AI reads every time you open it. In this Step you make the folder, open it in your AI's desktop app, and set the one rule that keeps client data safe.",
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
            text: "Download the starter folder, unzip it, and move the Second Brain folder where you picked. It already has the folders and a rulebook your AI reads, so there's nothing to set up by hand.",
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
        title: "Open it in your AI",
        blocks: [
          {
            kind: "text",
            text: "Use the desktop app on a paid plan, not the website. The website can't open a folder on your computer; the desktop app can.",
          },
          {
            kind: "apps",
            apps: {
              claude:
                "Download the Claude desktop app from claude.ai/download and sign in. Open the Code tab and choose your Second Brain folder.",
              chatgpt:
                "Download the ChatGPT desktop app from the ChatGPT website and sign in. Open Codex, choose Open a folder and pick your Second Brain folder.",
            },
          },
          {
            kind: "tip",
            text: "Keep the setting that asks before it changes files. It's your seatbelt. When your AI asks to make or change a file, read the line, then say yes or no.",
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
        blocks: [{ kind: "prompt", label: "Ask your AI", text: prompts.firstLook }],
      },
    ],
    tasks: [
      "Choose laptop or cloud drive",
      "Get your Second Brain folder",
      "Install your AI's desktop app",
      "Open the folder in the app",
      "Keep the ask-before-changing setting on",
      "Ask your first question",
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
            text: "The rulebook is one file your AI reads every time it opens your folder: how you name files, where things go, and what never goes in. Its name depends on your app.",
          },
          { kind: "apps", apps: { claude: "Claude reads a file called CLAUDE.md.", chatgpt: "ChatGPT reads a file called AGENTS.md." } },
          { kind: "text", text: "Using the starter folder? Your rulebook is already there. Have your AI fill in who you are." },
          { kind: "prompt", label: "Fill in the starter rulebook", text: prompts.fillRulebook },
          { kind: "text", text: "Started from scratch? Have your AI write one." },
          { kind: "prompt", label: "Make the rulebook", text: prompts.rulebook },
          { kind: "text", text: "Then add one rule of your own. You can add more any time, in plain words." },
          { kind: "prompt", label: "Add a rule", text: prompts.addRule },
        ],
      },
    ],
    tasks: [
      "Run the interview",
      "Read and fix About me",
      "Agree on a folder layout",
      "Make your rulebook",
      "Add one rule of your own",
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
];

export function getLesson(step: number) {
  return lessons.find((l) => l.step === step) ?? null;
}

// The prompt pack: every ready-made prompt, grouped by Step. The same words work in Claude and ChatGPT.
export type PackGroup = { step: number; title: string; items: { label: string; text: string }[] };

export const promptPack: PackGroup[] = [
  { step: 1, title: "Set up the house", items: [{ label: "First look at your folder", text: prompts.firstLook }] },
  {
    step: 2,
    title: "Teach it who you are",
    items: [
      { label: "The interview", text: prompts.interview },
      { label: "Fix a line in About me", text: prompts.fixAboutMe },
      { label: "Fill in the starter rulebook", text: prompts.fillRulebook },
      { label: "Make the rulebook from scratch", text: prompts.rulebook },
      { label: "Add a rule", text: prompts.addRule },
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
      { label: "Morning brief", text: prompts.morningBrief },
    ],
  },
  { step: 5, title: "Keep it growing", items: [{ label: "Friday review", text: prompts.weeklyReview }] },
];
