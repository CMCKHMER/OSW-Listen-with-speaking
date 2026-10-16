// Worksheet data extracted from OSW_LS3_LT_T1-T6 PDFs (Oxford Skills World: Listening with Speaking 3)
// Each topic is a Listening Test with Parts A/B/C, total /10

export type QuestionType = "mcq" | "ordering" | "yesno" | "check";
export type PartKey = "A" | "B" | "C";

export interface MCQOption {
  id: string; // "a" | "b" | "c"
  label: string;
}

export interface BaseQuestion {
  id: string; // unique within topic
  type: QuestionType;
  prompt: string;
  points: number;
  // optional helper for things like "What do most people use to brush their teeth?"
  context?: string;
}

export interface MCQQuestion extends BaseQuestion {
  type: "mcq";
  options: MCQOption[];
  // multi-line options keep their explicit line breaks
}

export interface OrderingQuestion extends BaseQuestion {
  type: "ordering";
  items: { id: string; label: string }[];
  // correct order is the order shown above; user must arrange them in the same order
}

export interface YesNoQuestion extends BaseQuestion {
  type: "yesno";
}

export interface CheckQuestion extends BaseQuestion {
  type: "check";
  // user picks ✔ or ✘
}

export type Question =
  | MCQQuestion
  | OrderingQuestion
  | YesNoQuestion
  | CheckQuestion;

export interface Part {
  key: PartKey;
  title: string;
  subtitle: string;
  points: number;
  questions: Question[];
}

export interface Topic {
  id: string; // "T1" | "T2" | ...
  number: number;
  title: string;
  passageTitle: string; // "Angelo and the Musician"
  passageIntro: string; // "Listen to the passage..."
  skills: [string, string]; // ["Listen and Take Notes", "Listen for the 5 Ws"]
  totalPoints: number;
  parts: Part[];
  // visual theme
  theme: TopicTheme;
}

export interface TopicTheme {
  // tailwind-friendly hex colors
  primary: string;
  primaryFg: string;
  bg: string; // page tint
  accent: string;
  ring: string;
  emoji: string;
  pattern: string; // small SVG-ish decoration label
  // gradient for header (from -> to)
  gradient: [string, string];
  tagline: string;
}

export const TOPIC_THEMES: Record<string, TopicTheme> = {
  T1: {
    primary: "#B45309",
    primaryFg: "#FFFBEB",
    bg: "#FFFBEB",
    accent: "#F59E0B",
    ring: "#FBBF24",
    emoji: "🎵",
    pattern: "♪ ♫ ♬",
    gradient: ["#F59E0B", "#B45309"],
    tagline: "Listen and Take Notes · Listen for the 5 Ws",
  },
  T2: {
    primary: "#BE185D",
    primaryFg: "#FFF1F8",
    bg: "#FFF1F8",
    accent: "#EC4899",
    ring: "#F472B6",
    emoji: "🎨",
    pattern: "🏳️ 🎨 ✦",
    gradient: ["#EC4899", "#BE185D"],
    tagline: "Listen for Facts · Listen for Opinions",
  },
  T3: {
    primary: "#047857",
    primaryFg: "#ECFDF5",
    bg: "#ECFDF5",
    accent: "#10B981",
    ring: "#34D399",
    emoji: "📚",
    pattern: "📖 ✦ 🌿",
    gradient: ["#10B981", "#047857"],
    tagline: "Listen for Preferences · Listen for Reasons",
  },
  T4: {
    primary: "#9A3412",
    primaryFg: "#FFF7ED",
    bg: "#FFF7ED",
    accent: "#F97316",
    ring: "#FB923C",
    emoji: "🏛️",
    pattern: "🏛️ ✦ ◐",
    gradient: ["#F97316", "#9A3412"],
    tagline: "Listen for Sequence · Listen for Directions",
  },
  T5: {
    primary: "#065F46",
    primaryFg: "#ECFDF5",
    bg: "#F0FDF4",
    accent: "#22C55E",
    ring: "#4ADE80",
    emoji: "🏔️",
    pattern: "🏔️ 🌲 ✦",
    gradient: ["#22C55E", "#065F46"],
    tagline: "Listen for Setting · Listen for Descriptions",
  },
  T6: {
    primary: "#0E7490",
    primaryFg: "#ECFEFF",
    bg: "#ECFEFF",
    accent: "#06B6D4",
    ring: "#22D3EE",
    emoji: "💧",
    pattern: "💧 ✦ ◐",
    gradient: ["#06B6D4", "#0E7490"],
    tagline: "Listen for Similar · Listen for Different",
  },
};

export const TOPICS: Topic[] = [
  {
    id: "T1",
    number: 1,
    title: "Angelo and the Musician",
    passageTitle: "Angelo and the Musician",
    passageIntro: "Listen to the passage Angelo and the Musician.",
    skills: ["Listen and Take Notes", "Listen for the 5 Ws"],
    totalPoints: 10,
    theme: TOPIC_THEMES.T1,
    parts: [
      {
        key: "A",
        title: "Part A",
        subtitle: "Listen to the passage. What is it about? Choose the correct answer.",
        points: 4,
        questions: [
          {
            id: "A-mcq",
            type: "mcq",
            prompt: "What is the passage about?",
            points: 2,
            options: [
              { id: "a", label: "Angelo wants to be a musician." },
              { id: "b", label: "Angelo talks to a musician." },
            ],
          },
          {
            id: "A-order",
            type: "ordering",
            prompt: "Now put the sentences in order.",
            points: 2,
            items: [
              { id: "a", label: "He asks a musician what her favorite song is." },
              { id: "b", label: "Angelo is a news reporter for a newspaper." },
              { id: "c", label: "As the musician talks, Angelo takes notes." },
            ],
          },
        ],
      },
      {
        key: "B",
        title: "Part B",
        subtitle: "Listen to Angelo and the Musician again. Then choose the correct answer.",
        points: 4,
        questions: [
          {
            id: "B-1",
            type: "mcq",
            prompt: "What does Angelo like about his job?",
            points: 1,
            options: [
              { id: "a", label: "taking notes" },
              { id: "b", label: "being on TV" },
              { id: "c", label: "talking to people" },
            ],
          },
          {
            id: "B-2",
            type: "mcq",
            prompt: "What is the question word in Angelo’s second question?",
            points: 1,
            options: [
              { id: "a", label: "where" },
              { id: "b", label: "when" },
              { id: "c", label: "how" },
            ],
          },
          {
            id: "B-3",
            type: "mcq",
            prompt: "When does the musician play?",
            points: 1,
            options: [
              { id: "a", label: "tonight" },
              { id: "b", label: "today" },
              { id: "c", label: "Monday" },
            ],
          },
          {
            id: "B-4",
            type: "mcq",
            prompt: "Why does Angelo take notes?",
            points: 1,
            options: [
              { id: "a", label: "to help him play music" },
              { id: "b", label: "to help him remember" },
              { id: "c", label: "to talk to people" },
            ],
          },
        ],
      },
      {
        key: "C",
        title: "Part C",
        subtitle: "Think about Angelo and the Musician. Then choose the correct answer.",
        points: 2,
        questions: [
          {
            id: "C-1",
            type: "yesno",
            prompt: "“What is your favorite song” is important.",
            points: 1,
          },
          {
            id: "C-2",
            type: "yesno",
            prompt: "Does the musician answer a where question?",
            points: 1,
          },
        ],
      },
    ],
  },
  {
    id: "T2",
    number: 2,
    title: "Showing Your Colors",
    passageTitle: "Showing Your Colors",
    passageIntro: "Listen to the conversation Showing Your Colors.",
    skills: ["Listen for Facts", "Listen for Opinions"],
    totalPoints: 10,
    theme: TOPIC_THEMES.T2,
    parts: [
      {
        key: "A",
        title: "Part A",
        subtitle: "Listen to the conversation. What is it about? Choose the correct answer.",
        points: 4,
        questions: [
          {
            id: "A-mcq",
            type: "mcq",
            prompt: "What is the conversation about?",
            points: 2,
            options: [
              { id: "a", label: "flags of different countries" },
              { id: "b", label: "flags of different sports teams" },
            ],
          },
          {
            id: "A-check",
            type: "check",
            prompt:
              "Which of the following sentences express an opinion? Choose ✔ or ✘.",
            context: "Choose ✔ or ✘ for each sentence.",
            points: 2,
          },
          // the check question above contains the three statements as parts; model them as separate check questions for clarity
        ],
      },
      {
        key: "B",
        title: "Part B",
        subtitle: "Listen to Showing Your Colors again. Then choose the correct answer.",
        points: 4,
        questions: [
          {
            id: "B-1",
            type: "mcq",
            prompt: "What color is the flag from Chile?",
            points: 1,
            options: [
              { id: "a", label: "green, white, blue" },
              { id: "b", label: "red, white, blue" },
              { id: "c", label: "yellow, green, white" },
            ],
          },
          {
            id: "B-2",
            type: "mcq",
            prompt: "Which flag has a picture on it?",
            points: 1,
            options: [
              { id: "a", label: "the flag from Spain" },
              { id: "b", label: "the flag from Sweden" },
              { id: "c", label: "the flag from Australia" },
            ],
          },
          {
            id: "B-3",
            type: "mcq",
            prompt: "Where do students look up the colors of the American flag?",
            points: 1,
            options: [
              { id: "a", label: "on a laptop" },
              { id: "b", label: "in the school yard" },
              { id: "c", label: "on a tablet" },
            ],
          },
          {
            id: "B-4",
            type: "mcq",
            prompt: "How many flags do you hear about?",
            points: 1,
            options: [
              { id: "a", label: "four" },
              { id: "b", label: "six" },
              { id: "c", label: "seven" },
            ],
          },
        ],
      },
      {
        key: "C",
        title: "Part C",
        subtitle: "Think about Showing Your Colors. Then choose the correct answer.",
        points: 2,
        questions: [
          {
            id: "C-1",
            type: "yesno",
            prompt: "“The flag is pretty” is a fact.",
            points: 1,
          },
          {
            id: "C-2",
            type: "yesno",
            prompt: "“The flag is beautiful” is an opinion.",
            points: 1,
          },
        ],
      },
    ],
  },
  {
    id: "T3",
    number: 3,
    title: "How Big Is That Book?",
    passageTitle: "How Big Is That Book?",
    passageIntro: "Listen to the passage How Big Is That Book?",
    skills: ["Listen for Preferences", "Listen for Reasons"],
    totalPoints: 10,
    theme: TOPIC_THEMES.T3,
    parts: [
      {
        key: "A",
        title: "Part A",
        subtitle: "Listen to the passage. What is it about? Choose the correct answer.",
        points: 4,
        questions: [
          {
            id: "A-mcq",
            type: "mcq",
            prompt: "What is the passage about?",
            points: 2,
            options: [
              { id: "a", label: "Liam is studying from his textbook." },
              { id: "b", label: "Liam is looking for a book to read." },
            ],
          },
          {
            id: "A-order",
            type: "ordering",
            prompt: "Now put the sentences in order.",
            points: 2,
            items: [
              { id: "a", label: "Liam tells the librarian what kind of book he wants." },
              { id: "b", label: "The librarian asks Liam what he likes to read." },
              { id: "c", label: "Liam picks up a book about machines but puts it back." },
            ],
          },
        ],
      },
      {
        key: "B",
        title: "Part B",
        subtitle: "Listen to How Big Is That Book? again. Then choose the correct answer.",
        points: 4,
        questions: [
          {
            id: "B-1",
            type: "mcq",
            prompt: "What does Liam want?",
            points: 1,
            options: [
              { id: "a", label: "a book about machines" },
              { id: "b", label: "a book about animals" },
              { id: "c", label: "a thin, light book" },
            ],
          },
          {
            id: "B-2",
            type: "mcq",
            prompt: "Why does Liam want a certain kind of book?",
            points: 1,
            options: [
              { id: "a", label: "to carry it in his backpack" },
              { id: "b", label: "to do a book report" },
              { id: "c", label: "to learn about machines" },
            ],
          },
          {
            id: "B-3",
            type: "mcq",
            prompt: "What does the librarian tell Liam?",
            points: 1,
            options: [
              { id: "a", label: "where to find a book" },
              { id: "b", label: "not to choose a book by size" },
              { id: "c", label: "to go home" },
            ],
          },
          {
            id: "B-4",
            type: "mcq",
            prompt: "What does Liam like to read about?",
            points: 1,
            options: [
              { id: "a", label: "animals" },
              { id: "b", label: "machines" },
              { id: "c", label: "we don’t know" },
            ],
          },
        ],
      },
      {
        key: "C",
        title: "Part C",
        subtitle: "Think about How Big Is That Book? Then choose the correct answer.",
        points: 2,
        questions: [
          {
            id: "C-1",
            type: "yesno",
            prompt: "Liam has a reason for choosing a light book.",
            points: 1,
          },
          {
            id: "C-2",
            type: "yesno",
            prompt: "The librarian helps Liam find a thin book.",
            points: 1,
          },
        ],
      },
    ],
  },
  {
    id: "T4",
    number: 4,
    title: "A Visit to the Museum",
    passageTitle: "A Visit to the Museum",
    passageIntro: "Listen to the story A Visit to the Museum.",
    skills: ["Listen for Sequence", "Listen for Directions"],
    totalPoints: 10,
    theme: TOPIC_THEMES.T4,
    parts: [
      {
        key: "A",
        title: "Part A",
        subtitle: "Listen to the story. What is it about? Choose the correct answer.",
        points: 4,
        questions: [
          {
            id: "A-mcq",
            type: "mcq",
            prompt: "What is the story about?",
            points: 2,
            options: [
              { id: "a", label: "Mr. Peyton’s class sees interesting things at a museum." },
              { id: "b", label: "Mr. Peyton’s class makes a list of things at the museum." },
            ],
          },
          {
            id: "A-check",
            type: "check",
            prompt: "Which sentences give directions? Choose ✔ or ✘.",
            context: "Choose ✔ or ✘ for each sentence.",
            points: 2,
          },
        ],
      },
      {
        key: "B",
        title: "Part B",
        subtitle: "Listen to A Visit to the Museum again. Then choose the correct answer.",
        points: 4,
        questions: [
          {
            id: "B-1",
            type: "mcq",
            prompt: "What do the students see first?",
            points: 1,
            options: [
              { id: "a", label: "paintings" },
              { id: "b", label: "trains" },
              { id: "c", label: "rocks" },
            ],
          },
          {
            id: "B-2",
            type: "mcq",
            prompt: "What kind of trains do they see?",
            points: 1,
            options: [
              { id: "a", label: "old trains" },
              { id: "b", label: "trolleys" },
              { id: "c", label: "toy trains" },
            ],
          },
          {
            id: "B-3",
            type: "mcq",
            prompt: "Who made the baskets at the museum?",
            points: 1,
            options: [
              { id: "a", label: "Native Americans" },
              { id: "b", label: "African Americans" },
              { id: "c", label: "Egyptians" },
            ],
          },
          {
            id: "B-4",
            type: "mcq",
            prompt: "Where do they go before they leave?",
            points: 1,
            options: [
              { id: "a", label: "the bookstore" },
              { id: "b", label: "the bathroom" },
              { id: "c", label: "the office" },
            ],
          },
        ],
      },
      {
        key: "C",
        title: "Part C",
        subtitle: "Think about A Visit to the Museum. Then choose the correct answer.",
        points: 2,
        questions: [
          {
            id: "C-1",
            type: "yesno",
            prompt: "The students see the baskets last.",
            points: 1,
          },
          {
            id: "C-2",
            type: "yesno",
            prompt:
              "The teacher gives the students directions for finding the bathrooms.",
            points: 1,
          },
        ],
      },
    ],
  },
  {
    id: "T5",
    number: 5,
    title: "A National Treasure",
    passageTitle: "A National Treasure",
    passageIntro: "Listen to the passage A National Treasure.",
    skills: ["Listen for Setting", "Listen for Descriptions"],
    totalPoints: 10,
    theme: TOPIC_THEMES.T5,
    parts: [
      {
        key: "A",
        title: "Part A",
        subtitle: "Listen to the passage. What is it about? Choose the correct answer.",
        points: 4,
        questions: [
          {
            id: "A-mcq",
            type: "mcq",
            prompt: "What is the passage about?",
            points: 2,
            options: [
              { id: "a", label: "a pirate’s treasure" },
              { id: "b", label: "a national park" },
            ],
          },
          {
            id: "A-order",
            type: "ordering",
            prompt: "Now put the sentences in order.",
            points: 2,
            items: [
              { id: "a", label: "You have to stay on the paths when you walk in the park." },
              { id: "b", label: "Many people visit Yellowstone on vacation to have fun." },
              { id: "c", label: "It has blue rivers, green forests, and tall mountains." },
            ],
          },
        ],
      },
      {
        key: "B",
        title: "Part B",
        subtitle: "Listen to A National Treasure again. Then choose the correct answer.",
        points: 4,
        questions: [
          {
            id: "B-1",
            type: "mcq",
            prompt: "Where is Yellowstone Park?",
            points: 1,
            options: [
              { id: "a", label: "Maine" },
              { id: "b", label: "California" },
              { id: "c", label: "Wyoming" },
            ],
          },
          {
            id: "B-2",
            type: "mcq",
            prompt: "What is a hot spring?",
            points: 1,
            options: [
              { id: "a", label: "a pool of very hot water" },
              { id: "b", label: "a river that is very warm" },
              { id: "c", label: "a hot tub" },
            ],
          },
          {
            id: "B-3",
            type: "mcq",
            prompt: "Which animal lives in Yellowstone Park?",
            points: 1,
            options: [
              { id: "a", label: "lions" },
              { id: "b", label: "bears" },
              { id: "c", label: "elephants" },
            ],
          },
          {
            id: "B-4",
            type: "mcq",
            prompt: "What can you do with the animals in the park?",
            points: 1,
            options: [
              { id: "a", label: "take their picture" },
              { id: "b", label: "pet them" },
              { id: "c", label: "feed them" },
            ],
          },
        ],
      },
      {
        key: "C",
        title: "Part C",
        subtitle: "Think about A National Treasure. Then choose the correct answer.",
        points: 2,
        questions: [
          {
            id: "C-1",
            type: "yesno",
            prompt: "Yellowstone National Park is in Wyoming, Idaho, and Montana.",
            points: 1,
          },
          {
            id: "C-2",
            type: "yesno",
            prompt: "Hot springs are safe to swim in.",
            points: 1,
          },
        ],
      },
    ],
  },
  {
    id: "T6",
    number: 6,
    title: "Fill It With Water",
    passageTitle: "Fill It With Water",
    passageIntro: "Listen to the passage Fill It With Water.",
    skills: ["Listen for Similar", "Listen for Different"],
    totalPoints: 10,
    theme: TOPIC_THEMES.T6,
    parts: [
      {
        key: "A",
        title: "Part A",
        subtitle: "Listen to the passage. What is it about? Choose the correct answer.",
        points: 4,
        questions: [
          {
            id: "A-mcq",
            type: "mcq",
            prompt: "What is the passage about?",
            points: 2,
            options: [
              { id: "a", label: "a swimming pool" },
              { id: "b", label: "sinks and bathtubs" },
            ],
          },
          {
            id: "A-check",
            type: "check",
            prompt: "What do most people use to brush their teeth? Choose ✔ or ✘.",
            context: "Choose ✔ or ✘ for each item.",
            points: 2,
          },
        ],
      },
      {
        key: "B",
        title: "Part B",
        subtitle: "Listen to Fill It With Water again. Then choose the correct answer.",
        points: 4,
        questions: [
          {
            id: "B-1",
            type: "mcq",
            prompt: "Which is used for washing?",
            points: 1,
            options: [
              { id: "a", label: "a sink" },
              { id: "b", label: "a bathtub" },
              { id: "c", label: "both a sink and a bathtub" },
            ],
          },
          {
            id: "B-2",
            type: "mcq",
            prompt: "Which is smaller?",
            points: 1,
            options: [
              { id: "a", label: "a bathtub" },
              { id: "b", label: "a sink" },
              { id: "c", label: "a pool" },
            ],
          },
          {
            id: "B-3",
            type: "mcq",
            prompt: "What do you use a bathtub for?",
            points: 1,
            options: [
              { id: "a", label: "brushing your teeth" },
              { id: "b", label: "washing dishes" },
              { id: "c", label: "taking a bath" },
            ],
          },
          {
            id: "B-4",
            type: "mcq",
            prompt: "Which of these can you sit in?",
            points: 1,
            options: [
              { id: "a", label: "a sink" },
              { id: "b", label: "a bathtub" },
              { id: "c", label: "both a sink and a bathtub" },
            ],
          },
        ],
      },
      {
        key: "C",
        title: "Part C",
        subtitle: "Think about Fill It With Water. Then choose the correct answer.",
        points: 2,
        questions: [
          {
            id: "C-1",
            type: "yesno",
            prompt: "A sink and a bathtub both hold water.",
            points: 1,
          },
          {
            id: "C-2",
            type: "yesno",
            prompt: "A sink is found only in a bathroom.",
            points: 1,
          },
        ],
      },
    ],
  },
];

// Special: the ✔/✘ (check) questions in T2, T4, T6 have multiple sentences.
// Model them as a "check group" with explicit statements attached.
export interface CheckStatement {
  text: string;
}

export const CHECK_STATEMENTS: Record<string, CheckStatement[]> = {
  // T2: Which of the following sentences express an opinion?
  "T2-A-check": [
    { text: "The flag of Sweden is just blue and yellow." },
    { text: "Red, white, and blue flags are the prettiest." },
    { text: "I like flags that are simple." },
  ],
  // T4: Which sentences give directions?
  "T4-A-check": [
    { text: "Does anyone have any questions?" },
    { text: "At the bottom of the stairs, turn right." },
    { text: "Next, they see toy trains on a track." },
  ],
  // T6: What do most people use to brush their teeth?
  "T6-A-check": [
    { text: "in a bathtub" },
    { text: "in a sink" },
    { text: "in a swimming pool" },
  ],
};

export function getTopic(id: string): Topic | undefined {
  return TOPICS.find((t) => t.id === id);
}

export function getCheckStatements(topicId: string, questionId: string): CheckStatement[] {
  return CHECK_STATEMENTS[`${topicId}-${questionId}`] ?? [];
}

// ===== Project Pages data =====
export interface ProjectPage {
  topicId: string;
  topicNumber: number;
  title: string;
  question: string;
  projectName: string;
  instructions: string[];
  projectNotes: string[];
  materials: string[];
  imagePath: string;
}

export const PROJECT_PAGES: ProjectPage[] = [
  {
    topicId: "T1",
    topicNumber: 1,
    title: "Angelo and the Musician",
    question: "Do you know anyone who does the job you want to do? Who?",
    projectName: "What Do You Want to Be?",
    instructions: [
      "Do an interview. Ask a partner about what job they want. Use the 5 Ws.",
      "Take notes.",
      "Draw a picture of your partner doing the job.",
    ],
    projectNotes: [
      "My partner is ___",
      "The job my partner wants to do is ___",
      "The job is important because ___",
    ],
    materials: ["paper", "markers", "pencil", "crayons"],
    imagePath: "/OSW-Listen-with-speaking/project-pages/topic1.png",
  },
  {
    topicId: "T2",
    topicNumber: 2,
    title: "Showing Your Colors",
    question: "What things do you sometimes have in your backpack? What things do you always have in your backpack?",
    projectName: "Tour of My Backpack",
    instructions: [
      "Make a poster. What do you have in your backpack? Make a list.",
      "Draw your backpack. Then draw and label the things in it.",
      "Color your poster. Then put it on the wall.",
    ],
    projectNotes: [
      "My backpack is ___",
      "In my backpack, I have ___",
      "My favorite thing in my backpack is ___",
    ],
    materials: ["poster paper", "markers", "crayons"],
    imagePath: "/OSW-Listen-with-speaking/project-pages/topic2.png",
  },
  {
    topicId: "T3",
    topicNumber: 3,
    title: "How Big Is That Book?",
    question: "What kinds of clothes do you prefer?",
    projectName: "Your Style",
    instructions: [
      "Make an advertisement. Pretend you own a clothing store. Write a title for your advertisement.",
      "Draw the things your store sells.",
      "Write about the things.",
    ],
    projectNotes: [
      "My store sells ___",
      "People like these things because ___",
      "People shop at my store because ___",
    ],
    materials: ["paper", "markers", "pencil"],
    imagePath: "/OSW-Listen-with-speaking/project-pages/topic3.png",
  },
  {
    topicId: "T4",
    topicNumber: 4,
    title: "A Visit to the Museum",
    question: "What other places do you go to? How do you get there?",
    projectName: "Something to Do",
    instructions: [
      "Make a postcard. Make a list of places you like to go to in your town.",
      "Draw and color one of the places.",
      "Write to a friend. Give details about the place.",
    ],
    projectNotes: [
      "I like to go to ___",
      "I like it because ___",
      "To get there, you have to ___",
    ],
    materials: ["blank postcard or notecard", "paper", "markers", "crayons"],
    imagePath: "/OSW-Listen-with-speaking/project-pages/topic4.png",
  },
  {
    topicId: "T5",
    topicNumber: 5,
    title: "A National Treasure",
    question: "What activities do you want to do? Why?",
    projectName: "Activity Flyer",
    instructions: [
      "Make a flyer. Write a hard or interesting activity you do.",
      "Draw and color the activity.",
      "Write about the activity. Use description words.",
    ],
    projectNotes: [
      "My favorite activity is ___",
      "I like the activity because ___",
      "The activity is ___ because ___",
    ],
    materials: ["paper", "pencil", "crayons"],
    imagePath: "/OSW-Listen-with-speaking/project-pages/topic5.png",
  },
  {
    topicId: "T6",
    topicNumber: 6,
    title: "Fill It With Water",
    question: "What things do you have in your house? Did people have those things 100 years before now?",
    projectName: "My Dream House",
    instructions: [
      "Make a map. Think about a house you want to live in. Draw the shape of the house.",
      "Draw the rooms. Then draw the things in the rooms.",
      "Write the names of the rooms.",
    ],
    projectNotes: [
      "My dream house has ___ rooms.",
      "In these rooms, there are ___",
      "My favorite room is ___",
    ],
    materials: ["paper", "pencil", "ruler", "markers"],
    imagePath: "/OSW-Listen-with-speaking/project-pages/topic6.png",
  },
];
