export type AgeGroupId = 'age2'

export type TrackId = 'ai-coding' | 'social-safety'

export interface QuizQuestion {
  id: string
  prompt: string
  options: string[]
  correctIndex: number
}

export interface ActivityConfig {
  id: string
  title: string
  description: string
  worksheetUrl?: string
  parentGuideUrl?: string
}

export interface UnitConfig {
  id: string
  trackId: TrackId
  title: string
  summary: string
  estMinutes: number
  ageGroup: AgeGroupId
  isFree: boolean
  sparklesReward: number
  contentBlocks: string[]
  quizQuestions: QuizQuestion[]
  activity: ActivityConfig
  unlocksUnitId?: string
}

export interface TrackConfig {
  id: TrackId
  title: string
  description: string
  order: number
}

export interface CurriculumConfig {
  ageGroup: AgeGroupId
  tracks: TrackConfig[]
  units: UnitConfig[]
}

export const curriculum: CurriculumConfig = {
  ageGroup: 'age2',
  tracks: [
    {
      id: 'ai-coding',
      title: 'AI, Coding & Software Adventures',
      description:
        'Join SpArki to learn what AI is, how code works, and how software helps people.',
      order: 1,
    },
    {
      id: 'social-safety',
      title: 'Social Media Safety & Kindness',
      description:
        'SpArki helps you practice safe watching, kind comments, and healthy screen time.',
      order: 2,
    },
  ],
  units: [
    {
      id: 'ai-1-what-is-ai',
      trackId: 'ai-coding',
      title: 'What Is AI?',
      summary:
        'SpArki shows how AI can sort and draw by learning from examples instead of magic.',
      estMinutes: 20,
      ageGroup: 'age2',
      isFree: true,
      sparklesReward: 10,
      contentBlocks: [
        'Story: SpArki helps sort toys into boxes using examples.',
        'Idea: AI learns from patterns in examples, not from magic.',
        'Pause: Look around the room and find 3 things you could sort.',
      ],
      quizQuestions: [
        {
          id: 'ai-1-q1',
          prompt: 'AI learns from…',
          options: ['Magic', 'Examples', 'Guessing once'],
          correctIndex: 1,
        },
        {
          id: 'ai-1-q2',
          prompt: 'SpArki uses AI to help…',
          options: ['Sort toys', 'Take naps', 'Hide homework'],
          correctIndex: 0,
        },
        {
          id: 'ai-1-q3',
          prompt: 'A pattern is something that…',
          options: ['Happens one time', 'Repeats again and again', 'Is always random'],
          correctIndex: 1,
        },
      ],
      activity: {
        id: 'ai-1-act',
        title: 'Design Your Own AI Helper',
        description:
          'Draw your own AI helper and label what it sorts for you (toys, snacks, books, or something else).',
      },
      unlocksUnitId: 'ai-2-coding-games',
    },
    {
      id: 'ai-2-coding-games',
      trackId: 'ai-coding',
      title: 'Coding as Games',
      summary:
        'SpArki turns code into silly “if this, then that” games you can act out with your body.',
      estMinutes: 20,
      ageGroup: 'age2',
      isFree: true,
      sparklesReward: 10,
      contentBlocks: [
        'Game: If I clap, you jump. If I stomp, you spin—this is like an if/then rule.',
        'Idea: Code is a list of instructions the computer follows exactly.',
      ],
      quizQuestions: [
        {
          id: 'ai-2-q1',
          prompt: 'Code is like…',
          options: ['Random scribbles', 'A recipe or set of rules', 'A secret language only robots know'],
          correctIndex: 1,
        },
        {
          id: 'ai-2-q2',
          prompt: 'If the code says “if it rains, open umbrella”, the umbrella opens when…',
          options: ['It is sunny', 'It rains', 'It is bedtime'],
          correctIndex: 1,
        },
      ],
      activity: {
        id: 'ai-2-act',
        title: 'Act Out Algorithms',
        description:
          'Create a short “algorithm” for a classmate to follow (like getting from the door to a chair).',
      },
      unlocksUnitId: 'ai-3-software-explorers',
    },
    {
      id: 'ai-3-software-explorers',
      trackId: 'ai-coding',
      title: 'Software Explorers',
      summary:
        'Kids explore what “software” means by looking at apps, games, and tools they already use.',
      estMinutes: 20,
      ageGroup: 'age2',
      isFree: true,
      sparklesReward: 10,
      contentBlocks: [
        'Examples: drawing apps, math games, video chat.',
        'Idea: software is instructions that live inside devices.',
      ],
      quizQuestions: [
        {
          id: 'ai-3-q1',
          prompt: 'Which is software?',
          options: ['A math game app', 'A wooden block', 'A snack'],
          correctIndex: 0,
        },
        {
          id: 'ai-3-q2',
          prompt: 'Software lives inside…',
          options: ['Stories only', 'Devices and computers', 'Shoes'],
          correctIndex: 1,
        },
      ],
      activity: {
        id: 'ai-3-act',
        title: 'Software Scavenger Hunt',
        description:
          'With a grown-up, find 3 examples of helpful software at home or at school and draw them.',
      },
      unlocksUnitId: 'ai-4-ai-in-the-world',
    },
    {
      id: 'ai-4-ai-in-the-world',
      trackId: 'ai-coding',
      title: 'AI in Our World',
      summary:
        'SpArki shows friendly examples of AI in schools, farms, and hospitals, and talks about when AI might be wrong.',
      estMinutes: 20,
      ageGroup: 'age2',
      isFree: true,
      sparklesReward: 10,
      contentBlocks: [
        'Story: AI helps sort mail, suggest songs, and translate languages.',
        'Pause: Think of one place you have seen AI (even if you did not know it yet).',
      ],
      quizQuestions: [
        {
          id: 'ai-4-q1',
          prompt: 'AI can help people by…',
          options: ['Doing every job alone', 'Helping with patterns and guesses', 'Deciding everything for humans'],
          correctIndex: 1,
        },
      ],
      activity: {
        id: 'ai-4-act',
        title: 'AI Around Us',
        description:
          'Make a simple “AI map” of your school or home—mark where AI might live (like in tablets, speakers, or cars).',
      },
      unlocksUnitId: 'ai-5-ethical-coding',
    },
    {
      id: 'ai-5-ethical-coding',
      trackId: 'ai-coding',
      title: 'Kind & Fair Coding',
      summary:
        'Kids talk about fairness, kindness, and how humans are responsible for how AI is used.',
      estMinutes: 20,
      ageGroup: 'age2',
      isFree: true,
      sparklesReward: 10,
      contentBlocks: [
        'Scenario: a game that only shows some kids as heroes.',
        'Idea: we can change the rules to be more fair and kind.',
      ],
      quizQuestions: [
        {
          id: 'ai-5-q1',
          prompt: 'Who is responsible for how AI behaves?',
          options: ['Only the robot', 'The people who design and use it', 'Nobody'],
          correctIndex: 1,
        },
      ],
      activity: {
        id: 'ai-5-act',
        title: 'Fix the Story',
        description:
          'Work with a grown-up to change a short “unfair” story into a kinder, more fair version.',
      },
    },
    {
      id: 'safety-1-kind-comments',
      trackId: 'social-safety',
      title: 'Kind Comments & Online Feelings',
      summary:
        'SpArki helps kids think about how words online can help or hurt, and how to pause before posting.',
      estMinutes: 20,
      ageGroup: 'age2',
      isFree: true,
      sparklesReward: 10,
      contentBlocks: [
        'Story: a kid posts a silly comment that makes a friend sad.',
        'Idea: we can be “kindness editors” before we click send.',
      ],
      quizQuestions: [
        {
          id: 'safety-1-q1',
          prompt: 'Before posting a comment, you should…',
          options: ['Type as fast as you can', 'Pause and think how it might feel', 'Never post anything'],
          correctIndex: 1,
        },
      ],
      activity: {
        id: 'safety-1-act',
        title: 'Comment Sort',
        description:
          'Sort example comments into “kind”, “needs fixing”, and “not okay”, then rewrite the “needs fixing” ones.',
      },
    },
  ],
}
