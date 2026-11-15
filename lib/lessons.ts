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
  { step: 3, title: "Point it at your business", body: "Your AI finds your best work in Drive and email, with client details kept out", free: false, ready: true },
  { step: 4, title: "Put it to work", body: "A follow-up in your voice, a Daily Briefing, listing copy and CMA prep", free: false, ready: true },
  { step: 5, title: "Keep it growing", body: "A Daily Briefing every morning, a Friday review and staying safe", free: false, ready: true },
];

// The rulebook is one file, AGENTS.md, in the Second Brain folder. ChatGPT and Claude both use it;
// the starter CLAUDE.md only points Claude to it.

export const prompts = {
  firstLook:
    "Read the AGENTS.md rulebook in this folder first. Then tell me what's in this folder, and what we should put here first. Don't create or change anything yet.",
  interview:
    "Interview me so you can help with my real estate business. Ask one question at a time and wait for my answer, about 8 questions in all. Cover where I work and what I sell, the clients I serve best, how I find business and who's in my sphere, the jobs that eat up my week, and what I want help with first. Don't ask for client names or personal details. When we're done, write it up as a file named with today's date and \"About me\", show it to me, and save it in the About me folder once I say OK. Then suggest any changes to the folders and wait for my OK before you change anything.",
  fixAboutMe:
    "Read About me back to me in five short lines. Then change this: [what it got wrong]. Keep everything else.",
  fillRulebook:
    "Update the AGENTS.md rulebook in this folder: fill in Who I am with two lines from About me, and update the folder list to match what we agreed. Show me the changes before you save them.",
  addRule: "From now on, file showing notes under Listings. Add that rule to the AGENTS.md rulebook in this folder and show me the line before you save it.",
  voiceConnected:
    "Read my 10 most recent sent emails and write a My voice section in the AGENTS.md rulebook in this folder. Show me before you save it.",
  voice:
    "Here are 5 emails I wrote, with client names removed. Write a My voice section in the AGENTS.md rulebook in this folder: my tone, how I greet and sign off, and phrases I use. Show me before you save it.",
  bestWork:
    "Search my Google Drive and sent email from the last 90 days for my best work: a listing description, my best follow-ups, my consult script, a CMA and my bio, up to 2 of each. Show me what you found. For each one I pick, write a short note in the right folder on what makes it work, with client names and details taken out. Then add a \"Where my stuff lives\" section to the AGENTS.md rulebook in this folder. Show me before you save anything, and tell me three things you learned about how I work.",
  bestWorkFull:
    "Search my Google Drive and sent email for my best work: a listing description, my best follow-ups, my consult script, a CMA and my bio. Show me what you found. For each one I pick, write a short note in the right folder on what makes it work, with client names and details taken out. Then add a \"Where my stuff lives\" section to the AGENTS.md rulebook in this folder. Show me before you save anything, and tell me three things you learned about how I work.",
  cleanFile:
    "Before you file this, check it for client names, phone numbers, emails, home addresses or loan details. List anything you find and don't save the file until I've taken it out.",
  fileInbox: "File these where they belong, and tell me three things you learned about how I work.",
  followUp:
    "Using my About me, Where my stuff lives and the My voice section of the AGENTS.md in this folder, and my follow-up examples, write a short check-in to this person: [describe them in a sentence, no name]. Keep it under 80 words and end with one clear next step. Give me two versions, then offer to save the one I pick in Scripts and templates.",
  listingCopy:
    "Here are my notes and photos for a new listing. Using my About me, Where my stuff lives, the My voice section of the AGENTS.md in this folder and my listing notes, write the listing description plus a short social post. Describe the home and the area, not who should live there. Keep it under my MLS character limit: [your MLS limit]. If any of these are empty, carry on without them. Then offer to save the one I like in Listings.",
  cmaPrep:
    "Here are the comps for a listing appointment, with owner names taken out. Using my CMA notes, Where my stuff lives and the My voice section of the AGENTS.md in this folder, give me five talking points for the seller in plain words. Say which comps carry the most weight and why, and what could move the price range up or down. Then give me the question they're most likely to ask about price, with how I might answer it. Use only the numbers in the comps. If any of my notes are empty, carry on without them. Offer to save this with my CMA notes.",
  dailyBriefing:
    "Be my chief of staff for today. Read the AGENTS.md in this folder, my notes, my calendar and my inbox. Then search the web for new listings in my market from the past day, our team's listings on caseylesher.com, and the top 3 local and top 3 national real estate news stories. Give me:\n1. My top 3 things to do today\n2. Who's waiting on a reply from me\n3. A quick prep note for each appointment\n4. New listings worth knowing about\n5. The news, one line each, with why it matters to my clients\nDraft any replies in my voice, and don't send anything. If something isn't connected or is empty, skip that part and tell me.",
  savePrompt:
    "Save the prompt I just used in Scripts and templates, named [a short name]. Then add that name to a \"My shortcuts\" list in the AGENTS.md in this folder, with one line on what it does, so I can just say \"run [name]\" next time.",
  weeklyReview:
    "Weekly review: look through my Drive and sent email from this past week. Tell me what's new, and note any of my best work in the right Second Brain folder. Update Where my stuff lives in the AGENTS.md in this folder with anything new. File anything in Inbox into the right Second Brain folder, and ask me if you're not sure where. Don't move or upload anything outside this folder. Then suggest one rule to add to the rulebook. Add it once I say OK.",
  fixRule:
    "You got this wrong: [what was off]. Fix it, then add a rule to the AGENTS.md rulebook in this folder so it doesn't happen again. If it's about how I sound, update My voice instead. If a rule already covers it, tighten that rule rather than adding a new one. Show me the change before you save it.",
  fixRuleExample:
    "You got this wrong: the follow-up was too long and too formal. Fix it, then add a rule to the AGENTS.md rulebook in this folder so it doesn't happen again. If it's about how I sound, update My voice instead. If a rule already covers it, tighten that rule rather than adding a new one. Show me the change before you save it.",
  privacyCheck:
    "Scan my whole Second Brain for anything that shouldn't be here: client phone numbers, home addresses, personal emails, ID, bank or loan details, signed contracts or passwords. List what kind of thing you found and which file it's in, but don't show the details themselves. Don't change or delete anything until I tell you to.",
  voiceReview:
    "Read my sent emails from the past 60 days and update the My voice section in the AGENTS.md in this folder. Leave out client names and details. Show me the changes before you save them.",
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
            text: "Using Claude instead? Download the Claude desktop app from claude.ai/download, open the Code tab and choose your Second Brain folder. Claude reads the same AGENTS.md rulebook, through the small CLAUDE.md file next to it.",
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
      "Now your AI gets to know you. It asks the questions, you mostly talk, and it writes everything up as an About me file it reads every time. Then it fills in your rulebook and learns how you sound.",
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
          { kind: "text", text: "Paste this in and answer one question at a time. It's about 8 questions." },
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
          { kind: "text", text: "At the end of the interview, your AI suggests changes to your folders. Say OK to the ones that fit you." },
          { kind: "list", items: ["About me", "Listings", "Scripts and templates", "Market notes", "Daily notes", "Inbox, where new files land"] },
        ],
      },
      {
        title: "Fill in the rulebook",
        blocks: [
          {
            kind: "text",
            text: "Your rulebook, the AGENTS.md file, is already in your starter folder: how you name files, where things go, and what never goes in. After the interview, have your AI fill in who you are.",
          },
          {
            kind: "apps",
            apps: {
              claude: "Claude uses the same AGENTS.md. The starter folder's CLAUDE.md points Claude to it, so the prompts work as they are.",
              chatgpt: "ChatGPT uses AGENTS.md. Start each new chat with: Read the AGENTS.md rulebook in this folder first.",
            },
          },
          { kind: "prompt", label: "Fill in the rulebook", text: prompts.fillRulebook },
          { kind: "text", text: "Then add one rule of your own. You can add more any time, in plain words." },
          { kind: "prompt", label: "Add a rule", text: prompts.addRule },
        ],
      },
      {
        title: "Teach it your voice",
        blocks: [
          { kind: "text", text: "Two ways to do it. Pick the one that fits." },
          {
            kind: "text",
            text: "Gmail connected? Only connect once your team lead says OK. In ChatGPT, open Plugins and add Gmail and Google Drive, then send this from your Second Brain project.",
          },
          { kind: "prompt", label: "Teach it your voice, Gmail connected", text: prompts.voiceConnected },
          {
            kind: "text",
            text: "Not connected? Pick 5 emails you sent that sound like you. Copy the text of each one, no downloads needed, take out the client names, and paste them in under this.",
          },
          { kind: "prompt", label: "Teach it your voice, paste 5 emails", text: prompts.voice },
          { kind: "tip", text: "From now on, ask for a draft and it writes like you, not like a robot." },
        ],
      },
    ],
    tasks: [
      "Run the interview",
      "Read and fix About me",
      "Agree on your folders",
      "Fill in your rulebook",
      "Add one rule of your own",
      "Teach it your voice",
    ],
  },
  {
    step: 3,
    title: "Point it at your business",
    headline: "Your best work, found for you",
    minutes: 20,
    free: false,
    intro:
      "Your best work already lives in your Google Drive and sent email. Instead of moving files around, your AI finds it, writes down what makes it work, and notes where it lives. The originals stay put, and client details stay out.",
    parts: [
      {
        title: "Connect Gmail and Google Drive",
        blocks: [
          {
            kind: "list",
            items: [
              "Only connect once your team lead says OK.",
              "In ChatGPT, open Plugins and add Gmail and Google Drive.",
              "They work inside your Second Brain project, so stay in it.",
            ],
          },
          { kind: "tip", text: "Can't connect yet? Use Drag it in instead, at the end of this Step." },
        ],
      },
      {
        title: "Find your best work",
        blocks: [
          {
            kind: "text",
            text: "This is the quick version for today: the last 90 days, up to 2 of each. The full search is homework in Step 5.",
          },
          { kind: "prompt", label: "Find your best work", text: prompts.bestWork },
          {
            kind: "list",
            items: [
              "It shows you what it found, and you pick.",
              "For each pick, it writes a short note in the right folder on what makes it work. The originals stay in Drive and Gmail.",
              "It adds a Where my stuff lives section to your AGENTS.md, so every chat knows where to look.",
            ],
          },
        ],
      },
      {
        title: "Check before you say OK",
        blocks: [
          {
            kind: "split",
            left: { title: "Good in a note", items: ["What makes the work good", "Public listing details", "Market notes and stats", "Your own scripts and templates"] },
            right: { title: "Keep out", items: ["Client names, phones and home addresses", "ID numbers, bank and loan details", "Signed contracts and disclosures", "Anything your brokerage says stays in the CRM"] },
          },
          { kind: "text", text: "It shows you each note before it saves. If a client detail slipped in, tell it to take it out." },
        ],
      },
      {
        title: "Read what it learned",
        blocks: [
          { kind: "text", text: "Read the three things it learned about how you work. If one is off, tell it, and add a rule so it sticks." },
        ],
      },
      {
        title: "Not connected? Drag it in instead",
        blocks: [
          { kind: "text", text: "Drag 5 to 10 of your best files into Inbox. Have your AI check them first, then file them." },
          { kind: "prompt", label: "Check a file", text: prompts.cleanFile },
          { kind: "prompt", label: "File your Inbox", text: prompts.fileInbox },
        ],
      },
    ],
    tasks: [
      "Connect Gmail and Google Drive, or drag files into Inbox",
      "Pick your best work from what it found",
      "Check each note before it saves",
      "Read the three things it learned",
    ],
  },
  {
    step: 4,
    title: "Put it to work",
    headline: "A follow-up and your Daily Briefing",
    minutes: 25,
    free: false,
    intro:
      "Now your AI pays you back. In the room, everyone writes a follow-up that sounds like them, then gets their first Daily Briefing. Listing copy and CMA talking points are there for early finishers and homework.",
    parts: [
      {
        title: "Job 01 · Your first follow-up",
        blocks: [
          {
            kind: "list",
            items: [
              "Think of one person you owe a check-in.",
              "Describe them in a sentence, without their name.",
              "Pick the version you like, and let it save it as a template.",
            ],
          },
          { kind: "prompt", label: "Write the follow-up", text: prompts.followUp },
          {
            kind: "tip",
            text: "Nothing gets sent from your AI. Copy the draft into your own email or CRM when you're happy with it, and add the name there.",
          },
        ],
      },
      {
        title: "Job 04 · Your Daily Briefing",
        blocks: [
          {
            kind: "text",
            text: "Your AI as chief of staff: your top 3 for today, who's waiting on you, prep for each appointment, new listings and the news, with replies drafted in your voice.",
          },
          { kind: "prompt", label: "Daily Briefing", text: prompts.dailyBriefing },
          {
            kind: "tip",
            text: "It drafts but never sends. The listings come from public sites, so treat them as a quick scan, not the MLS.",
          },
        ],
      },
      {
        title: "Keep what works",
        blocks: [
          {
            kind: "text",
            text: "Close this Step by saving Follow-up and Daily Briefing as shortcuts. Next time, just say \"run Daily Briefing\".",
          },
          { kind: "prompt", label: "Save it as a shortcut", text: prompts.savePrompt },
        ],
      },
      {
        title: "Early finishers · Job 02 Listing copy",
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
        title: "Early finishers · Job 03 CMA talking points",
        blocks: [
          {
            kind: "text",
            text: "Take owner names out of your comps first, then paste them in or attach the file. No comps handy? Practice with our sample sheet.",
          },
          {
            kind: "download",
            label: "Download the sample comp sheet",
            href: "/samples/sample-comp-sheet.csv",
            note: "Made-up homes and numbers, for practice only.",
          },
          { kind: "prompt", label: "Get talking points", text: prompts.cmaPrep },
        ],
      },
    ],
    tasks: [
      "Draft a follow-up and save the one you pick",
      "Run your first Daily Briefing",
      "Save Follow-up and Daily Briefing as shortcuts",
      "Early finishers: try the listing copy",
      "Early finishers: try the CMA talking points",
    ],
  },
  {
    step: 5,
    title: "Keep it growing",
    headline: "Every morning, and 15 minutes on a Friday",
    minutes: 15,
    free: false,
    intro:
      "A second brain gets better the more it knows. A Daily Briefing each morning and 15 minutes on Friday keep it current and safe, and every fix you make sticks.",
    parts: [
      {
        title: "Every morning",
        blocks: [
          {
            kind: "text",
            text: "Try asking ChatGPT to run Daily Briefing every weekday at 7 AM. If it doesn't offer to schedule it, just open the project each morning and say: run Daily Briefing.",
          },
        ],
      },
      {
        title: "Block the time",
        blocks: [
          { kind: "text", text: "Put a 15-minute block on your calendar every Friday, now, before you close the laptop." },
        ],
      },
      {
        title: "Run the weekly review",
        blocks: [
          {
            kind: "text",
            text: "It looks through your Drive and sent email from the week, notes your best work, keeps Where my stuff lives current and tidies Inbox. Nothing moves outside your Second Brain folder.",
          },
          { kind: "prompt", label: "Weekly review", text: prompts.weeklyReview },
        ],
      },
      {
        title: "Fix it once",
        blocks: [
          {
            kind: "text",
            text: "Correct it once, not every time. One prompt fixes today's draft and updates your rulebook or My voice, so every draft after it comes out right. You see the change and say OK first.",
          },
          { kind: "prompt", label: "Fix it once", text: prompts.fixRule },
          { kind: "text", text: "Here it is filled in, so you can see how it reads:" },
          { kind: "prompt", label: "Example", text: prompts.fixRuleExample },
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
          {
            kind: "text",
            text: "It tells you what kind of thing it found and which file it's in, without showing the details, so nothing private lands on your screen.",
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
        title: "Homework: go deeper",
        blocks: [
          {
            kind: "text",
            text: "Do these at home, once your team lead says it's OK to connect Gmail and Google Drive. Client details still stay out of your Second Brain files.",
          },
          { kind: "text", text: "First, the full best-work search, with no 90-day limit." },
          { kind: "prompt", label: "Full best-work search", text: prompts.bestWorkFull },
          { kind: "text", text: "Then sharpen your voice from 60 days of sent email." },
          { kind: "prompt", label: "60-day voice review", text: prompts.voiceReview },
          { kind: "tip", text: "Didn't get to listing copy or CMA talking points? They're at the end of Step 4." },
        ],
      },
    ],
    tasks: [
      "Ask it to run Daily Briefing every weekday morning",
      "Block 15 minutes on Fridays",
      "Run your first weekly review",
      "Fix one thing once",
      "Run the privacy check",
      "Switch on Clear Signal",
      "Homework: full best-work search and 60-day voice review",
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
      { label: "Fill in the rulebook", text: prompts.fillRulebook },
      { label: "Add a rule", text: prompts.addRule },
      { label: "Teach it your voice, Gmail connected", text: prompts.voiceConnected },
      { label: "Teach it your voice, paste 5 emails", text: prompts.voice },
    ],
  },
  {
    step: 3,
    title: "Point it at your business",
    items: [
      { label: "Find your best work", text: prompts.bestWork },
      { label: "Not connected: check a file", text: prompts.cleanFile },
      { label: "Not connected: file your Inbox", text: prompts.fileInbox },
    ],
  },
  {
    step: 4,
    title: "Put it to work",
    items: [
      { label: "Job 01 · Follow-up", text: prompts.followUp },
      { label: "Job 04 · Daily Briefing", text: prompts.dailyBriefing },
      { label: "Save it as a shortcut", text: prompts.savePrompt },
      { label: "Job 02 · Listing copy", text: prompts.listingCopy },
      { label: "Job 03 · CMA talking points", text: prompts.cmaPrep },
    ],
  },
  {
    step: 5,
    title: "Keep it growing",
    items: [
      { label: "Weekly review", text: prompts.weeklyReview },
      { label: "Fix it once", text: prompts.fixRule },
      { label: "Fix it once, filled in", text: prompts.fixRuleExample },
      { label: "Privacy check", text: prompts.privacyCheck },
      { label: "Homework: full best-work search", text: prompts.bestWorkFull },
      { label: "Homework: 60-day voice review", text: prompts.voiceReview },
    ],
  },
];
