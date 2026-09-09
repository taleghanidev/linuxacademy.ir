const aiAgentCourseEn = {
  eyebrow: "Live online workshop",
  title: "Folder-Based AI Agents",
  subtitle:
    "A folder-based agent is the most modern and the easiest way to build an AI agent: one folder, a few text files, and an agent that works. Eight Fridays, two live hours each, a small room, and a working project in your hands at the end.",
  ctaEnroll: "Enroll in the course",
  ctaSyllabus: "See the syllabus",
  ctaConsult: "Talk before you enroll",

  quickFacts: {
    heading: "At a glance",
    format: { label: "Format", value: "Live online, two-way" },
    when: { label: "When", value: "Fridays, 12:00 to 14:00 Tehran time" },
    duration: { label: "Length", value: "8 sessions, 16 hours of teaching" },
    content: { label: "Content", value: "12 modules, 104 lessons" },
    seats: { label: "Seats", value: "12 per cohort" },
    language: { label: "Language", value: "Persian, with English terminology" },
    level: { label: "Level", value: "Beginner to intermediate, no programming required" },
    recording: { label: "Recordings", value: "Every session, kept for good" },
  },

  overview: {
    heading: "What this is",
    paragraphs: [
      "Most AI training either stops at a tour of the tools or drops you straight into code that is hard to follow. This course takes a third route. First you understand what an agent is actually made of, then you build one with your own hands.",
      "The method you learn is folder-based. An agent is nothing more than a folder holding a few text files: its instructions, its tools, its settings. No heavy framework, no intricate code. That simplicity is what makes it the most modern and the fastest way to build one, because a folder can be read, kept in git, reviewed and handed to someone else.",
      "Every concept arrives exactly when you need it for the next step. Tokens, context, the loop, tools, keys, webhooks and evals are never taught as vocabulary. Each one shows up at the point where you cannot go further without it.",
      "It is a workshop, not a lecture. You work on your own machine during the session, you ask questions and get answers, and in the final session we build a complete agent together and put it on a server.",
    ],
  },

  outcomes: {
    heading: "What you will be able to do",
    items: [
      "Build an agent from an empty folder, test it, and deploy it",
      "Tell a model, an agent and a workflow apart, and pick the right one for a job",
      "Call any provider's API and handle replies, errors and rate limits properly",
      "Run an open-weight model on your own machine and know what will fit",
      "Write a prompt like a program rather than a request",
      "Define tools for an agent and keep keys out of logs and output",
      "Make web pages readable to an agent, and know where to stop",
      "Work Claude Code properly: modes, context, skills, subagents, hooks and MCP",
      "Estimate what a run costs and bring that cost down with caching",
      "Recognise prompt injection and design against it",
      "Schedule an agent to run without you and leave a trace you can audit",
      "Write tests for something that guesses, and measure whether it improved",
    ],
  },

  audience: {
    heading: "Who it is for",
    forHeading: "A good fit if you are",
    forItems: [
      "A developer or infrastructure engineer who wants to hand real work to an agent",
      "A technical lead or founder who needs to know where this pays off and where it does not",
      "An analyst, marketer or anyone with a lot of repetitive work across the web and other tools",
      "Someone who has used the off-the-shelf tools and now wants to see under the hood",
    ],
    notForHeading: "Probably not for you if you",
    notForItems: [
      "Are looking for a course on using a chatbot",
      "Want the mathematics of training a neural network from scratch",
    ],
  },

  prerequisites: {
    heading: "What you need",
    note: "No formal background is required. This is what should be ready before the first session.",
    items: [
      "A laptop with admin rights to install software (Linux, macOS, or Windows with WSL)",
      "A stable connection for the live session and access to services outside the country",
      "An account with one model provider and a small amount of credit for the exercises",
    ],
  },

  schedule: {
    heading: "The eight Fridays",
    note: "Each session is two live hours. Modules do not always end on a session boundary. Wherever we stop, we pick up there the following week.",
    weekLabel: "Session",
    weeks: [
      {
        week: "1",
        focus: "Foundations: what an agent is, what a model is",
        detail: "The three parts of an agent, kinds of AI, neural networks, parameters and tokens.",
      },
      {
        week: "2",
        focus: "Models, providers and the API",
        detail:
          "Hosted or open weights, the shape of a request, status codes, retries, the knobs that matter.",
      },
      {
        week: "3",
        focus: "Running a model yourself",
        detail:
          "Model file formats, working out what fits, llama.cpp and vLLM, one shape for every provider.",
      },
      {
        week: "4",
        focus: "Inside an agent",
        detail:
          "Context, the loop, the prompt as a program, tools and skills and memory, auth and keys.",
      },
      {
        week: "5",
        focus: "The open web and your working machine",
        detail:
          "Fetching versus reading a page, signing in without a password, captchas, Linux, the terminal, package managers.",
      },
      {
        week: "6",
        focus: "Claude Code up close",
        detail:
          "Modes, managed context, CLAUDE.md and memory and skills, subagents and hooks and MCP, unattended runs.",
      },
      {
        week: "7",
        focus: "Safety, cost and running without you",
        detail:
          "Caching, what leaves the building, tool trust levels, prompt injection, git, triggers, webhooks and traces.",
      },
      {
        week: "8",
        focus: "Building on foldrun, and the capstone",
        detail:
          "An agent as a folder, flows, structured output, evals, deployment, and one complete agent built live.",
      },
    ],
  },

  curriculum: {
    heading: "The full syllabus, module by module",
    note: "12 modules, 104 lessons, 16 hours. The times are real teaching time, not slide length.",
    lessonsLabel: "lessons",
    modules: [
      {
        n: "1",
        title: "Getting your bearings",
        summary: "What this is, who it is for, and what to have open on your machine.",
        lessons: "3 lessons",
        duration: "15 min",
      },
      {
        n: "2",
        title: "What an agent is",
        summary:
          "The idea, the three parts an agent is built from, the kinds of AI, and what a model, a neural network, a parameter and a token actually are.",
        lessons: "9 lessons",
        duration: "1h 00m",
      },
      {
        n: "3",
        title: "Models, providers and the API",
        summary:
          "Hosted or open weights, the three dialects of plain text, what an API is, the verdict on every reply, retries, the knobs that matter, reasoning models, and where models live.",
        lessons: "11 lessons",
        duration: "1h 18m",
      },
      {
        n: "4",
        title: "Running a model yourself",
        summary:
          "One pass and one token, what you actually downloaded, whether it fits your hardware, llama.cpp against vLLM, and one endpoint for every provider.",
        lessons: "8 lessons",
        duration: "1h 02m",
      },
      {
        n: "5",
        title: "How an agent really works",
        summary:
          "The model remembers nothing, what context is, the loop, the prompt as a program, tools and skills and memory and knowledge, semantic search, and where the secret goes.",
        lessons: "13 lessons",
        duration: "1h 43m",
      },
      {
        n: "6",
        title: "The open web",
        summary:
          "Fetching a page is not reading it. Signing in without a password, the five captchas you will meet, the four jobs a browser does for an agent, and what to buy instead of building.",
        lessons: "5 lessons",
        duration: "42 min",
      },
      {
        n: "7",
        title: "Your machine, and the tools on it",
        summary:
          "Compiled or interpreted, Linux and how to get one, enough terminal to begin, package managers three layers deep, runtime and library and framework, SDKs, and installing your first coding agent.",
        lessons: "11 lessons",
        duration: "1h 44m",
      },
      {
        n: "8",
        title: "Claude Code",
        summary:
          "The one you will use that day: modes and how much rope, managed context, CLAUDE.md and memory and skills, subagents and hooks and MCP, unattended runs, and shipping with it.",
        lessons: "9 lessons",
        duration: "1h 58m",
      },
      {
        n: "9",
        title: "Doing it safely",
        summary:
          "Why agents cost more than chat, paying once for the same words, what leaves the building, tool trust, prompt injection, keeping a human in the loop, git, and eight ways this breaks.",
        lessons: "10 lessons",
        duration: "1h 29m",
      },
      {
        n: "10",
        title: "Without you, and designing the work",
        summary:
          "Triggers, webhooks, the same trigger meaning two different things, run traces, vague in and vague out, workflow or agent, and eight patterns for arranging the work.",
        lessons: "9 lessons",
        duration: "1h 11m",
      },
      {
        n: "11",
        title: "Building on foldrun",
        summary:
          "An agent is a folder, any model in one block, proving the model can drive, a flow as a numbered list, structured output, evals, deployment, the CLI and the API.",
        lessons: "11 lessons",
        duration: "1h 42m",
      },
      {
        n: "12",
        title: "The landscape, and building yours",
        summary:
          "Zapier, Make and n8n, six ways to buy this, which one is yours, and then ninety minutes building one complete agent together, live.",
        lessons: "5 lessons",
        duration: "1h 56m",
      },
    ],
  },

  capstone: {
    heading: "The capstone",
    desc: "The last session is not a lecture. We build a real agent together from an empty folder to a deployed service: defining tools, writing the flow, wiring the keys, writing evals, scheduling the run and reading the trace. The code you finish with is yours and goes straight to real work.",
  },

  includes: {
    heading: "What you get",
    items: [
      "16 hours of live teaching in a room of no more than 12",
      "A recording of every session, with no expiry on access",
      "Slides and full notes for all 104 lessons",
      "A private question and answer channel for the eight weeks",
    ],
  },

  tools: {
    heading: "Tools you will use",
    note: "All of them are installed and set up during the sessions. None are required to enroll.",
    items: [
      "Claude Code",
      "Python and Node.js",
      "Linux and the terminal",
      "Git and GitHub",
      "llama.cpp and vLLM",
      "Hugging Face",
      "Playwright",
      "foldrun",
    ],
  },

  instructor: {
    heading: "Your instructor",
    name: "Amir Mahdi Taleghani",
    role: "Founder, Linux Academy",
    bio: "More than fifteen years in DevOps, cloud architecture and AI implementation, across more than fifty delivered projects. This course came out of that work. Every pattern taught here has been run in a real environment and its result observed.",
    points: [
      "15+ years in infrastructure and DevOps",
      "50+ delivered projects",
      "Author of foldrun, an agent runtime",
    ],
  },

  pricing: {
    heading: "Price",
    priceLabel: "Full course fee",
    priceNote: "A flat price for all 8 sessions, with nothing else to pay.",
    guaranteeHeading: "Refund guarantee",
    guarantee:
      "If by the end of session two you decide this is not what you expected, you get the full amount back, no questions asked.",
  },

  enroll: {
    heading: "How to enroll",
    steps: [
      {
        title: "Transfer the fee",
        desc: "Send the course fee to the account shown on the registration page.",
      },
      {
        title: "Fill the form and attach the receipt",
        desc: "Give your name, email and phone, and attach a picture of your payment receipt.",
      },
      {
        title: "Seat confirmed",
        desc: "We check the receipt and email you the confirmation.",
      },
      {
        title: "Before session one",
        desc: "You get the setup guide and the session link.",
      },
    ],
    cta: "Start registering",
    ctaNote: "Each cohort is capped at 12 people.",
  },

  faq: {
    heading: "Common questions",
    items: [
      {
        question: "What if I miss a session?",
        answer:
          "The recording reaches you within 24 hours and your access to it does not expire. You can also put your questions in the course channel and get them answered in the next session.",
      },
      {
        question: "Can I take this without programming experience?",
        answer:
          "Yes. Module 7 covers the terminal and the tooling from the ground up, and the exercises are built to be completable without prior experience. Knowing how to program means you move faster, but it is not a condition of entry.",
      },
      {
        question: "Are the sessions recorded?",
        answer: "Yes, every session is recorded and your access is permanent.",
      },
      {
        question: "What language is it taught in?",
        answer:
          "Teaching is in Persian. Technical terms are spoken in their original English so that you recognise the same words when you read the documentation. Slides are bilingual.",
      },
      {
        question: "What hardware do I need?",
        answer:
          "An ordinary laptop is enough. For the local model work, small models run on that same laptop and we use a cloud server for anything larger. A dedicated graphics card is not required.",
      },
      {
        question: "Is model usage charged separately?",
        answer:
          "Yes. The exercises need a small amount of credit with one model provider, usually no more than a few hundred thousand Toman across the whole course. Module 9 teaches you exactly how to estimate and reduce that cost.",
      },
      {
        question: "What if the course is not for me?",
        answer:
          "You can withdraw up to the end of session two and the full amount you paid is returned, no questions asked.",
      },
      {
        question: "Do you run this for teams?",
        answer:
          "Yes. The same course runs privately for company teams, with examples drawn from your own work. Ask through the contact page.",
      },
    ],
  },

  returnHome: "Back to home",
  allCourses: "All courses",
};

export default aiAgentCourseEn;
