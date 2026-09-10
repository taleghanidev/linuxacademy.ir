const aiAgentCourseEn = {
  eyebrow: "Live online workshop",
  title: "Build an AI agent, from scratch",
  subtitle:
    "Ten Fridays, two hours each. When the last session ends you have an agent you built yourself, running on a server.",
  ctaEnroll: "Enroll in the course",
  ctaSyllabus: "See the syllabus",

  proof: {
    heading: "This is genuinely all an agent is",
    body: "No framework, no classes, no intricate code. A folder with a few text files: one says what the agent should do, the others define its tools, and the keys sit somewhere safe. You can keep that in git, review it, and hand it to someone else.",
    caption: "The structure of a real agent. There is nothing more to it.",
  },

  format: {
    heading: "How the sessions run",
    items: [
      {
        title: "Live and two-way",
        desc: "Nothing is pre-recorded. When you have a question you ask it there and then.",
      },
      {
        title: "On your own machine",
        desc: "Everything you see, you run on your own laptop in the same session.",
      },
      {
        title: "A small group",
        desc: "Places are limited so there is time for everyone's questions.",
      },
      {
        title: "Every session recorded",
        desc: "Miss one, or want to go back over it, and the recording is there.",
      },
    ],
  },
  ctaConsult: "Talk before you enroll",

  quickFacts: {
    heading: "At a glance",
    format: { label: "Format", value: "Live online, two-way" },
    when: { label: "When", value: "Fridays, 12:00 to 14:00 Tehran time" },
    starts: { label: "Starts", value: "" },
    duration: { label: "Length", value: "10 sessions, 20 hours" },
    content: { label: "Content", value: "12 modules, 93 lessons" },
    seats: { label: "Seats", value: "12 per cohort" },
    language: { label: "Language", value: "Persian, with English terminology" },
    level: { label: "Level", value: "Beginner to intermediate, no programming required" },
    recording: { label: "Recordings", value: "Every session, kept for good" },
  },

  overview: {
    heading: "What actually happens here",
    paragraphs: [
      "A folder-based agent really is just that: a folder of text files saying what the agent should do, what tools it has, and how it should be set up. No heavy framework, no intricate code. That is why it is the quickest way to start.",
      "The sessions are workshops. I am not talking while you listen. You work on your own machine, you ask whenever you get stuck, and in the last session we build a complete agent together and put it on a server.",
    ],
  },

  outcomes: {
    heading: "What you will be able to do",
    items: [
      "Build an agent from scratch, test it, and deploy it",
      "Tell a model, an agent and a workflow apart, and pick the right one",
      "Write a prompt like a program rather than a request",
      "Define tools for an agent and keep its keys safe",
      "Work Claude Code properly",
      "Schedule an agent to run without you",
    ],
  },

  audience: {
    heading: "Who it is for",
    forHeading: "Probably worth your time if you are",
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

  curriculum: {
    heading: "The full syllabus, module by module",
    note: "12 modules, 93 lessons. About 16 hours of teaching, with the rest of each session given to hands-on work and questions. Open a module to see its lessons.",
    lessonsLabel: "lessons",
    modules: [
      {
        n: "1",
        title: "Getting started",
        summary: "What you will build, who this is for, and what to have ready before session one.",
        lessons: "3 lessons",
        duration: "15 min",
        lessonList: [
          "What you will have built by the end",
          "Who this course is for",
          "Getting your laptop ready before session one",
        ],
      },
      {
        n: "2",
        title: "Foundations: agents and models",
        summary:
          "Before any code, understand what an agent is made of and what a language model really does.",
        lessons: "6 lessons",
        duration: "45 min",
        lessonList: [
          "What an AI agent is, with real examples",
          "The three parts of every agent: model, loop, tools",
          "The kinds of AI and where agents fit",
          "How a language model works, in plain language",
          "Parameters, and why model size matters",
          "Tokens: how text is counted and billed",
        ],
      },
      {
        n: "3",
        title: "Linux, the terminal and curl",
        summary:
          "The foundation the rest of the course sits on. You make your first requests here, with curl.",
        lessons: "8 lessons",
        duration: "1h 15m",
        lessonList: [
          "Installing Linux or WSL on your machine",
          "The terminal commands you actually need",
          "Working with files: cat, grep, sed and an editor",
          "Package managers: apt, npm and pip",
          "Making HTTP requests with curl",
          "Reading and filtering JSON with jq",
          "Environment variables, and keeping keys out of your code",
          "Enough git that you never lose work",
        ],
      },
      {
        n: "4",
        title: "Working with model APIs, hands on",
        summary:
          "Every API format in use in 2026, first with curl and then with an SDK, so you can work with any provider.",
        lessons: "11 lessons",
        duration: "1h 50m",
        lessonList: [
          "What an API is, and your first request with curl",
          "OpenAI Chat Completions: the older format still everywhere",
          "OpenAI Responses API: the modern one",
          "The Anthropic Messages API",
          "Gemini models via Google AI Studio and Vertex AI",
          "Reading HTTP status codes and handling errors",
          "Rate limits, 429s and retrying with backoff",
          "Temperature, top_p and response length",
          "Reasoning models, and when they earn their cost",
          "Streaming responses",
          "Comparing providers on price and speed",
        ],
      },
      {
        n: "5",
        title: "Running models on your own machine",
        summary: "Installing Ollama and running a local model, step by step.",
        lessons: "7 lessons",
        duration: "1h 10m",
        lessonList: [
          "Installing Ollama and running your first local model",
          "Pulling and managing models with Ollama",
          "Model files: GGUF, safetensors and quantisation",
          "Working out the RAM and VRAM a model needs",
          "llama.cpp and vLLM: what each is good for",
          "Serving a local model on an OpenAI-compatible endpoint",
          "Local or hosted: cost, privacy and speed",
        ],
      },
      {
        n: "6",
        title: "Inside an agent",
        summary:
          "The loop, the context, the prompt and the tools. You write a simple agent yourself by the end.",
        lessons: "12 lessons",
        duration: "1h 45m",
        lessonList: [
          "Why a model has no memory, and what follows from it",
          "The context window and how to manage it",
          "The agent loop, step by step",
          "Writing a prompt that behaves like a program",
          "Defining tools the model can call",
          "Tools, skills, memory and knowledge compared",
          "RAG: retrieve instead of sending everything",
          "Keyword search versus semantic search",
          "Whether you need to fine-tune at all",
          "Tool authentication: keys, tokens and OAuth",
          "Storing secrets safely",
          "Exercise: write a simple agent loop yourself",
        ],
      },
      {
        n: "7",
        title: "The web and outside data",
        summary: "For when what you need has no API.",
        lessons: "6 lessons",
        duration: "50 min",
        lessonList: [
          "Why curl isn't enough: static pages versus rendered ones",
          "Four jobs a browser does: read, extract, capture, drive",
          "Using session cookies instead of automating login",
          "The five kinds of captcha and what to do about each",
          "Playwright, hands on",
          "What to build and what to buy",
        ],
      },
      {
        n: "8",
        title: "Coding agents, fully hands on",
        summary: "Install and work with Claude Code, Codex and opencode on your own machine.",
        lessons: "9 lessons",
        duration: "2h 00m",
        lessonList: [
          "Installing Claude Code and your first run",
          "Claude Code: modes and permissions",
          "Claude Code: CLAUDE.md, memory and skills",
          "Claude Code: subagents, hooks and MCP",
          "Claude Code: unattended runs and shipping work",
          "Codex, hands on",
          "opencode, hands on",
          "Agents in the editor: Cursor and others",
          "All three compared: one idea, different names",
        ],
      },
      {
        n: "9",
        title: "Safety, cost and control",
        summary: "Make sure the agent neither wastes your money nor causes trouble.",
        lessons: "8 lessons",
        duration: "1h 10m",
        lessonList: [
          "Where the cost of a run comes from",
          "Prompt caching, and cutting the bill",
          "What data leaves your organisation",
          "Grading how far you trust each tool",
          "Prompt injection, and designing against it",
          "Where human approval belongs",
          "Git as your safety net",
          "Common failure modes and how to avoid them",
        ],
      },
      {
        n: "10",
        title: "No-code automation and orchestration patterns",
        summary:
          "See what the off-the-shelf tools can do first, then learn how to arrange several agents together.",
        lessons: "9 lessons",
        duration: "1h 15m",
        lessonList: [
          "What Zapier, Make and n8n are, and what they do",
          "When a no-code tool is enough, and when it isn't",
          "Orchestration patterns: single agent, chained, router",
          "Further patterns: supervisor and worker, parallel, reflection",
          "The planner and executor pattern",
          "Building a workflow or an agent",
          "Triggers: cron schedules and webhooks",
          "Run traces and observability",
          "Measuring output quality",
        ],
      },
      {
        n: "11",
        title: "Building on foldrun",
        summary: "The same ideas, this time as a folder you can keep in git and deploy.",
        lessons: "10 lessons",
        duration: "1h 40m",
        lessonList: [
          "The folder structure of an agent",
          "Defining the model independently of the provider",
          "Writing a flow as numbered steps",
          "Getting structured output",
          "Writing evals to measure quality",
          "Running locally and checking before deploy",
          "Deploying to a server",
          "Working with the foldrun CLI",
          "Using the API instead of the CLI",
          "Workspaces, git and team access",
        ],
      },
      {
        n: "12",
        title: "The capstone",
        summary:
          "We build one complete agent together, from an empty folder to a scheduled run on a server.",
        lessons: "4 lessons",
        duration: "2h 05m",
        lessonList: [
          "Choosing what to build",
          "Building a complete agent live, from scratch",
          "Deploying it and putting it on a schedule",
          "Where to take this after the course",
        ],
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
      "20 hours of live sessions in a room of no more than 12",
      "A recording of every session, with no expiry on access",
      "Slides and full notes for all 93 lessons",
      "A private question and answer channel for the ten weeks",
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
    priceIran: "Inside Iran",
    priceIntl: "Outside Iran",
    originalLabel: "Course price",
    residencyWarning:
      "Given the situation in Iran at the moment, this price is offered to people living there. If you live outside Iran, the course fee is payable in Australian dollars.",
    priceNote: "A flat price for all 10 sessions, with nothing else to pay.",
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
