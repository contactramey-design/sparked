/**
 * Curriculum: tracks and units. Unit video: add videoUrl to a unit (file in public/).
 * Track intro video: add introVideoUrl to a track. See VIDEOS.md.
 *
 * Pilot note: several units share `/coding_intro.mp4` or `/safety_into.mp4` until per-unit MP4s exist in `public/`.
 */
import type { AgeBandId } from './ageBand'
import { ALL_AGE_BANDS } from './ageBand'

export type AgeGroupId = 'age2'

export type TrackId = 'ai-coding' | 'early-foundations' | 'social-safety'

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

export interface ThinkPrompt {
  label: string
  text: string
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
  /** Optional video: URL to MP4/WebM or YouTube embed (e.g. https://www.youtube.com/embed/...) */
  videoUrl?: string
  /** Optional Spanish video: same as videoUrl but for locale es */
  videoUrlEs?: string
  /** Optional "Think about this!" prompts shown during material */
  thinkPrompts?: ThinkPrompt[]
  /** Which age bands see this unit (default: all). Omit to include every band. */
  ageBands?: AgeBandId[]
}

export interface TrackConfig {
  id: TrackId
  title: string
  description: string
  order: number
  /** Optional intro video for the track overview page. Put file in public/ and use path from root (e.g. '/safetyAppIntro.mp4'). */
  introVideoUrl?: string
  /** Optional Spanish intro video for locale es */
  introVideoUrlEs?: string
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
      introVideoUrl: '/coding_intro.mp4',
    },
    {
      id: 'early-foundations',
      title: 'Sparki Tots — Foundational Learning',
      description:
        'Ages 3–5: colors, shapes, counting, letters, and patterns through play — built for real developmental growth (no social apps).',
      order: 2,
      introVideoUrl: '/coding_intro.mp4',
    },
    {
      id: 'social-safety',
      title: 'Social Media Safety & Kindness',
      description:
        'SpArki helps you practice safe watching, kind comments, and healthy screen time.',
      order: 3,
      introVideoUrl: '/safety_into.mp4',
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
      videoUrl: '/coding_intro.mp4',
      thinkPrompts: [
        { label: 'Think about this!', text: 'Look around the room. Can you find 3 things you could sort into groups? (e.g. toys, books, crayons)' },
        { label: 'Think about this!', text: 'SpArki learns from examples, not magic. What is one example you could show a friend so they learn something new?' },
      ],
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
      videoUrl: '/coding_intro.mp4',
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
      videoUrl: '/coding_intro.mp4',
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
      videoUrl: '/coding_intro.mp4',
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
      videoUrl: '/coding_intro.mp4',
    },
    {
      id: 'found-1-colors-sorting',
      trackId: 'early-foundations',
      title: 'Colors & Sorting',
      summary:
        'Sparki plays with red, blue, yellow, and green — sorting colors makes our brains super smart!',
      estMinutes: 15,
      ageGroup: 'age2',
      ageBands: ['tots'],
      isFree: true,
      sparklesReward: 10,
      contentBlocks: [
        'Story: Hey little friends! I’m Sparki! Today we’re playing with colors! Red, blue, yellow, green — so many beautiful colors! Watch me sort the red blocks into the red basket. Now you try!',
        'Idea: We can sort things by color. Sorting makes our brain stronger.',
        'Rule: Parent guide: Play color sorting with toys at home. Say “You sorted the blue ones so well!” to build confidence.',
      ],
      quizQuestions: [
        {
          id: 'found-1-q1',
          prompt: 'Which basket is for RED blocks?',
          options: ['The red basket', 'The snack bowl', 'The shoe box'],
          correctIndex: 0,
        },
        {
          id: 'found-1-q2',
          prompt: 'Sorting by color helps…',
          options: ['Our brain grow stronger', 'Blocks disappear', 'Colors become invisible'],
          correctIndex: 0,
        },
        {
          id: 'found-1-q3',
          prompt: 'After you sort, Sparki…',
          options: ['Cheers for you!', 'Takes a nap', 'Hides the blocks'],
          correctIndex: 0,
        },
      ],
      activity: {
        id: 'found-1-act',
        title: 'Color sort at home',
        description:
          'With a grown-up, sort toys or socks by color into piles. Cheer each time you match!',
      },
      unlocksUnitId: 'found-2-shapes-matching',
      videoUrl: '/coding_intro.mp4',
      thinkPrompts: [
        { label: 'Try it!', text: 'Point to something red in the room. Point to something blue.' },
        { label: 'Try it!', text: 'Tell a grown-up: “Sorting makes my brain strong!”' },
      ],
    },
    {
      id: 'found-2-shapes-matching',
      trackId: 'early-foundations',
      title: 'Shapes & Matching',
      summary:
        'Circle, square, triangle — shapes are everywhere! Match each shape to its outline with Sparki.',
      estMinutes: 15,
      ageGroup: 'age2',
      ageBands: ['tots'],
      isFree: true,
      sparklesReward: 10,
      contentBlocks: [
        'Story: Hi little friends! Sparki here! Today we’re learning shapes! Circle, square, triangle — they are everywhere! Watch me find all the circles. Now you find the squares!',
        'Idea: We can find and match shapes. Shapes are all around us.',
        'Rule: Parent guide: Point out shapes at home (plates are circles, doors are rectangles). Make it a game.',
      ],
      quizQuestions: [
        {
          id: 'found-2-q1',
          prompt: 'Which one is usually round like a plate?',
          options: ['Circle', 'Triangle', 'Square'],
          correctIndex: 0,
        },
        {
          id: 'found-2-q2',
          prompt: 'Matching shapes helps us…',
          options: ['See the world better', 'Lose our toys', 'Skip bedtime'],
          correctIndex: 0,
        },
        {
          id: 'found-2-q3',
          prompt: 'A door is often shaped like a…',
          options: ['Rectangle', 'Circle only', 'Star only'],
          correctIndex: 0,
        },
      ],
      activity: {
        id: 'found-2-act',
        title: 'Shape scavenger hunt',
        description: 'Find a circle, a square, and a triangle in your home with a grown-up.',
      },
      unlocksUnitId: 'found-3-numbers-counting',
      videoUrl: '/coding_intro.mp4',
      thinkPrompts: [
        { label: 'Try it!', text: 'Trace a circle in the air with your finger.' },
        { label: 'Try it!', text: 'Find one square shape near you right now.' },
      ],
    },
    {
      id: 'found-3-numbers-counting',
      trackId: 'early-foundations',
      title: 'Numbers & Counting',
      summary:
        'Count 1, 2, 3, 4, 5 with Sparki — numbers tell us how many!',
      estMinutes: 15,
      ageGroup: 'age2',
      ageBands: ['tots'],
      isFree: true,
      sparklesReward: 10,
      contentBlocks: [
        'Story: Wow, you’re doing so good! Today we’re learning numbers! One, two, three — let’s count together! Watch me count the blocks. One… two… three! Now you count with me.',
        'Idea: We can count things. Numbers tell us how many.',
        'Rule: Parent guide: Count steps, snacks, or toys together every day. Make counting fun and silly.',
      ],
      quizQuestions: [
        {
          id: 'found-3-q1',
          prompt: 'How many fingers on one hand? (Count!)',
          options: ['5', '2', '10'],
          correctIndex: 0,
        },
        {
          id: 'found-3-q2',
          prompt: 'Numbers help us know…',
          options: ['How many', 'What color the sky is', 'Only grown-up names'],
          correctIndex: 0,
        },
        {
          id: 'found-3-q3',
          prompt: 'After counting, Sparki…',
          options: ['Cheers with you!', 'Forgets numbers', 'Hides the toys'],
          correctIndex: 0,
        },
      ],
      activity: {
        id: 'found-3-act',
        title: 'Count everything',
        description: 'Count 5 things in a row with a grown-up (toys, crackers, stairs).',
      },
      unlocksUnitId: 'found-4-letters-sounds',
      videoUrl: '/coding_intro.mp4',
      thinkPrompts: [
        { label: 'Try it!', text: 'Clap once for 1, twice for 2, three times for 3!' },
        { label: 'Try it!', text: 'How many people are in the room right now? Count together.' },
      ],
    },
    {
      id: 'found-4-letters-sounds',
      trackId: 'early-foundations',
      title: 'Letters & Sounds',
      summary:
        'A says “ah”, B says “buh” — letters make words someday. Find letters A, B, and C with Sparki!',
      estMinutes: 15,
      ageGroup: 'age2',
      ageBands: ['tots'],
      isFree: true,
      sparklesReward: 10,
      contentBlocks: [
        'Story: Hi friends! Today we’re learning letters! A says “ah”, B says “buh” — letters make words! Watch me find the letter A. Now you find the letter B!',
        'Idea: Letters make sounds. Letters help us read someday.',
        'Rule: Parent guide: Point out letters on signs and toys. Sing the alphabet song together.',
      ],
      quizQuestions: [
        {
          id: 'found-4-q1',
          prompt: 'Which letter makes the “ah” sound like apple?',
          options: ['A', 'B', 'C'],
          correctIndex: 0,
        },
        {
          id: 'found-4-q2',
          prompt: 'Letters help us…',
          options: ['Read stories someday', 'Only eat snacks', 'Skip talking'],
          correctIndex: 0,
        },
        {
          id: 'found-4-q3',
          prompt: 'B says…',
          options: ['buh', 'ah', 'kuh'],
          correctIndex: 0,
        },
      ],
      activity: {
        id: 'found-4-act',
        title: 'Letter hunt',
        description: 'Find the letters in your name on a paper with a grown-up and trace them.',
      },
      unlocksUnitId: 'found-5-patterns-sequences',
      videoUrl: '/coding_intro.mp4',
      thinkPrompts: [
        { label: 'Try it!', text: 'Say the “ah” sound and think of something that starts with A.' },
        { label: 'Try it!', text: 'Sing the ABC song’s first three letters with a grown-up.' },
      ],
    },
    {
      id: 'found-5-patterns-sequences',
      trackId: 'early-foundations',
      title: 'Patterns & Sequences',
      summary:
        'Red-blue-red-blue — that’s a pattern! Finish what comes next with Sparki.',
      estMinutes: 15,
      ageGroup: 'age2',
      ageBands: ['tots'],
      isFree: true,
      sparklesReward: 10,
      contentBlocks: [
        'Story: You are getting so smart! Today we’re learning patterns! Red-blue-red-blue — that’s a pattern! Watch me make a pattern with blocks. Now you finish the pattern!',
        'Idea: Patterns are repeating things. Patterns help us think.',
        'Rule: Parent guide: Make patterns with snacks, socks, or blocks. Praise your child for noticing patterns.',
      ],
      quizQuestions: [
        {
          id: 'found-5-q1',
          prompt: 'A pattern is something that…',
          options: ['Repeats', 'Happens only once', 'Has no colors'],
          correctIndex: 0,
        },
        {
          id: 'found-5-q2',
          prompt: 'Patterns help our brain…',
          options: ['Think and solve problems', 'Turn off', 'Forget colors'],
          correctIndex: 0,
        },
        {
          id: 'found-5-q3',
          prompt: 'In red-blue-red-blue, what might come next?',
          options: ['Red (it keeps repeating)', 'Only green forever', 'Nothing'],
          correctIndex: 0,
        },
      ],
      activity: {
        id: 'found-5-act',
        title: 'Pattern snack line',
        description: 'Line up snack pieces: cracker, berry, cracker, berry — what comes next?',
      },
      videoUrl: '/coding_intro.mp4',
      thinkPrompts: [
        { label: 'Try it!', text: 'Clap-soft-clap-soft — keep the pattern two more times!' },
        { label: 'Try it!', text: 'Make a color pattern with two crayons and show a grown-up.' },
      ],
    },
    {
      id: 'safety-instagram',
      trackId: 'social-safety',
      title: 'Staying Safe on Instagram',
      summary:
        'SpArki shows how to share photos safely, keep your account private, and always ask a grown-up first.',
      estMinutes: 20,
      ageGroup: 'age2',
      ageBands: ['kids', 'crew'],
      isFree: true,
      sparklesReward: 10,
      contentBlocks: [
        'Story: A classmate wants to post a photo of the whole class. SpArki helps them ask a grown-up before sharing.',
        'Rule: Keep your account private so only people you and a grown-up know can follow you.',
        'Rule: Never put your full name, school, or address in your bio.',
        'Pause: Think of one grown-up you can ask if you see a strange message online.',
      ],
      quizQuestions: [
        {
          id: 'safety-instagram-q1',
          prompt: 'Who should you ask before posting a picture online?',
          options: ['No one', 'A trusted grown-up', 'A stranger'],
          correctIndex: 1,
        },
        {
          id: 'safety-instagram-q2',
          prompt: 'What should your account settings be?',
          options: ['Public to everyone', 'Private to people you and a grown-up know', 'Shared with all strangers'],
          correctIndex: 1,
        },
        {
          id: 'safety-instagram-q3',
          prompt: 'Which information should you keep off your profile?',
          options: ['Your favorite color', 'Your school and address', 'Your favorite animal'],
          correctIndex: 1,
        },
        {
          id: 'safety-instagram-q4',
          prompt: 'If a stranger sends you a message, what do you do?',
          options: ['Reply and make a new friend', 'Ignore, block, and tell a grown-up', 'Send them your name'],
          correctIndex: 1,
        },
        {
          id: 'safety-instagram-q5',
          prompt: 'Who decides what you can post?',
          options: ['Only you', 'You and a trusted grown-up together', 'Whoever comments first'],
          correctIndex: 1,
        },
      ],
      activity: {
        id: 'safety-instagram-act',
        title: 'Design a Safe Profile',
        description:
          'Draw a pretend profile page that shows fun things (like pets or hobbies) but no private info. Share it with a grown-up.',
      },
      unlocksUnitId: 'safety-tiktok',
        // Dedicated file not in repo yet; use safety track intro so production does not 404.
        videoUrl: '/safety_into.mp4',
      thinkPrompts: [
        { label: 'Think about this!', text: 'Who is one grown-up you could ask before posting a photo? Talk to them about it!' },
        { label: 'Think about this!', text: 'What would you never put in your profile? (Hint: school name, address, phone number)' },
      ],
    },
    {
      id: 'safety-tiktok',
      trackId: 'social-safety',
      title: 'Kind & Safe TikTok',
      summary:
        'SpArki explains how to keep videos private, turn off strangers, and handle mean comments kindly and safely.',
      estMinutes: 20,
      ageGroup: 'age2',
      ageBands: ['kids', 'crew'],
      isFree: true,
      sparklesReward: 10,
      contentBlocks: [
        'Rule: Only post videos with a grown-up’s permission.',
        'Safety: Turn off “everyone” so only friends you and a grown-up know can see your videos.',
        'Kindness: You never have to reply to mean comments. It is okay to block and report.',
        'Pause: Practice what you would say to a grown-up if you see something that feels yucky online.',
      ],
      quizQuestions: [
        {
          id: 'safety-tiktok-q1',
          prompt: 'Before posting a video, you should…',
          options: ['Ask a trusted grown-up', 'Post it fast', 'Show it to strangers'],
          correctIndex: 0,
        },
        {
          id: 'safety-tiktok-q2',
          prompt: 'Who should be able to see your videos?',
          options: ['Everyone in the world', 'Only people you and a grown-up know', 'Only strangers'],
          correctIndex: 1,
        },
        {
          id: 'safety-tiktok-q3',
          prompt: 'If someone leaves a mean comment, you can…',
          options: ['Be mean back', 'Block, report, and tell a grown-up', 'Share it with more people'],
          correctIndex: 1,
        },
        {
          id: 'safety-tiktok-q4',
          prompt: 'What information should stay private?',
          options: ['Dance moves', 'School name and address', 'Pet’s nickname'],
          correctIndex: 1,
        },
        {
          id: 'safety-tiktok-q5',
          prompt: 'When something online feels wrong, you should…',
          options: ['Keep it secret', 'Tell a trusted grown-up right away', 'Try to fix it alone'],
          correctIndex: 1,
        },
      ],
      activity: {
        id: 'safety-tiktok-act',
        title: 'Kind Comment Practice',
        description:
          'With a grown-up, write 3 kind comments you could leave on someone’s video that are safe and encouraging.',
      },
      unlocksUnitId: 'safety-snapchat',
      videoUrl: '/safety_into.mp4',
    },
    {
      id: 'safety-snapchat',
      trackId: 'social-safety',
      title: 'Snaps, Streaks & Safety',
      summary:
        'SpArki teaches that snaps do not really “disappear” and that streaks are never more important than feelings or safety.',
      estMinutes: 20,
      ageGroup: 'age2',
      ageBands: ['kids', 'crew'],
      isFree: true,
      sparklesReward: 10,
      contentBlocks: [
        'Myth-buster: Snaps can be screenshotted or saved, so treat them like any other picture.',
        'Rule: Never send pictures you would not want a teacher or grown-up to see.',
        'Feelings: It is okay to break a streak if you need a break or feel uncomfortable.',
        'Pause: Think of one safe snap you could send, like a pet or a drawing.',
      ],
      quizQuestions: [
        {
          id: 'safety-snapchat-q1',
          prompt: 'Do snaps always disappear forever?',
          options: ['Yes, always', 'No, they can be saved or screenshotted', 'Only if you are careful'],
          correctIndex: 1,
        },
        {
          id: 'safety-snapchat-q2',
          prompt: 'What is a safe kind of picture to send?',
          options: ['Your address', 'Your school ID', 'Your pet wearing a silly hat'],
          correctIndex: 2,
        },
        {
          id: 'safety-snapchat-q3',
          prompt: 'If someone asks for a picture that feels wrong, you should…',
          options: ['Send it quickly', 'Say no and tell a grown-up', 'Hide your feelings'],
          correctIndex: 1,
        },
        {
          id: 'safety-snapchat-q4',
          prompt: 'Streaks are…',
          options: ['More important than safety', 'Fun, but never more important than feelings or safety', 'Required homework'],
          correctIndex: 1,
        },
        {
          id: 'safety-snapchat-q5',
          prompt: 'Who can help you decide what is okay to send?',
          options: ['A trusted grown-up', 'A stranger online', 'No one'],
          correctIndex: 0,
        },
      ],
      activity: {
        id: 'safety-snapchat-act',
        title: 'Safe Snap Ideas',
        description:
          'Draw or list 5 silly but safe snap ideas you could share with friends, then check them with a grown-up.',
      },
      unlocksUnitId: 'safety-roblox',
      videoUrl: '/safety_into.mp4',
    },
    {
      id: 'safety-roblox',
      trackId: 'social-safety',
      title: 'Safe Play on Roblox',
      summary:
        'SpArki shows how to use chat filters, block strangers, and never share private info while playing games.',
      estMinutes: 20,
      ageGroup: 'age2',
      ageBands: ['kids', 'crew'],
      isFree: true,
      sparklesReward: 10,
      contentBlocks: [
        'Rule: Use in-game safety settings and let a grown-up help set them up.',
        'Safety: Never share your real name, age, school, or address in chat.',
        'Boundary: You never have to join voice chat or private games with strangers.',
        'Pause: Practice what you would do if someone in a game makes you feel weird or scared.',
      ],
      quizQuestions: [
        {
          id: 'safety-roblox-q1',
          prompt: 'What is okay to share in game chat?',
          options: ['Your full name', 'Your address', 'A nickname that does not reveal private info'],
          correctIndex: 2,
        },
        {
          id: 'safety-roblox-q2',
          prompt: 'If a stranger invites you to a private game, you should…',
          options: ['Join right away', 'Say no, leave, and tell a grown-up', 'Give them your phone number'],
          correctIndex: 1,
        },
        {
          id: 'safety-roblox-q3',
          prompt: 'Who should help set your safety settings?',
          options: ['No one', 'A trusted grown-up', 'A random player'],
          correctIndex: 1,
        },
        {
          id: 'safety-roblox-q4',
          prompt: 'If someone is mean in chat, you can…',
          options: ['Be mean back', 'Block, report, and take a break', 'Tell no one'],
          correctIndex: 1,
        },
        {
          id: 'safety-roblox-q5',
          prompt: 'Games should make you feel…',
          options: ['Scared and pressured', 'Safe and mostly happy', 'Forced to keep playing'],
          correctIndex: 1,
        },
      ],
      activity: {
        id: 'safety-roblox-act',
        title: 'Family Game Rules',
        description:
          'With your grown-up, write 3 simple family rules for playing games safely online.',
      },
      unlocksUnitId: 'safety-fortnite',
      videoUrl: '/safety_into.mp4',
    },
    {
      id: 'safety-fortnite',
      trackId: 'social-safety',
      title: 'Fortnite & Voice Chat Boundaries',
      summary:
        'SpArki explains how to mute, block, and set kind rules for talking to others in fast-paced games.',
      estMinutes: 20,
      ageGroup: 'age2',
      ageBands: ['kids', 'crew'],
      isFree: true,
      sparklesReward: 10,
      contentBlocks: [
        'Rule: Only use voice chat with people you and a grown-up know.',
        'Safety: You can mute or leave any time a conversation feels bad.',
        'Kindness: Teasing that hurts is not okay, even if it is “just a game.”',
        'Pause: Practice a sentence you could say to a grown-up if someone is yelling at you in a game.',
      ],
      quizQuestions: [
        {
          id: 'safety-fortnite-q1',
          prompt: 'Who is it safest to talk with in voice chat?',
          options: ['People you and a grown-up know', 'Any player', 'Strangers who play well'],
          correctIndex: 0,
        },
        {
          id: 'safety-fortnite-q2',
          prompt: 'If someone is yelling or being mean, you can…',
          options: ['Mute or leave and tell a grown-up', 'Stay and listen', 'Yell back'],
          correctIndex: 0,
        },
        {
          id: 'safety-fortnite-q3',
          prompt: 'Is it okay to tease if someone is upset?',
          options: ['Yes, it is funny', 'No, we should be kind even in games', 'Only if they lose'],
          correctIndex: 1,
        },
        {
          id: 'safety-fortnite-q4',
          prompt: 'Private info you should never share in voice chat includes…',
          options: ['Your favorite snack', 'Your full name and address', 'Your favorite emote'],
          correctIndex: 1,
        },
        {
          id: 'safety-fortnite-q5',
          prompt: 'Who can you talk to if a game makes you feel upset?',
          options: ['A trusted grown-up', 'No one', 'Only other players'],
          correctIndex: 0,
        },
      ],
      activity: {
        id: 'safety-fortnite-act',
        title: 'Voice Chat Plan',
        description:
          'With a grown-up, create a short plan for when you will mute, leave, or take a break from voice chat.',
      },
      unlocksUnitId: 'safety-reddit',
      videoUrl: '/safety_into.mp4',
    },
    {
      id: 'safety-reddit',
      trackId: 'social-safety',
      title: 'Reading Safely on Reddit & Forums',
      summary:
        'SpArki talks about how posts and comments are not always true, and how to avoid grown-up spaces and scary content.',
      estMinutes: 20,
      ageGroup: 'age2',
      ageBands: ['kids', 'crew'],
      isFree: true,
      sparklesReward: 10,
      contentBlocks: [
        'Idea: Anyone can post online, so not everything you read is true or kind.',
        'Rule: Stick to kid-friendly spaces a grown-up has checked first.',
        'Safety: Never click strange links or messages that promise prizes.',
        'Pause: Practice saying “Can you check this with me?” to a grown-up when you are unsure.',
      ],
      quizQuestions: [
        {
          id: 'safety-reddit-q1',
          prompt: 'Are all posts and comments on the internet true?',
          options: ['Yes, always', 'No, anyone can post anything', 'Only if they have many likes'],
          correctIndex: 1,
        },
        {
          id: 'safety-reddit-q2',
          prompt: 'Where should you spend time online?',
          options: ['Kid-friendly spaces a grown-up has checked', 'Any forum you find', 'Secret chats'],
          correctIndex: 0,
        },
        {
          id: 'safety-reddit-q3',
          prompt: 'If you see a scary or confusing post, you should…',
          options: ['Keep reading alone', 'Show a trusted grown-up and talk about it', 'Click every link'],
          correctIndex: 1,
        },
        {
          id: 'safety-reddit-q4',
          prompt: 'Links that promise prizes or money are often…',
          options: ['Safe and real', 'Tricks or scams', 'Only for adults'],
          correctIndex: 1,
        },
        {
          id: 'safety-reddit-q5',
          prompt: 'When something online feels “off”, a good first step is to…',
          options: ['Hide it', 'Talk to a trusted grown-up', 'Pretend it did not happen'],
          correctIndex: 1,
        },
      ],
      activity: {
        id: 'safety-reddit-act',
        title: 'Healthy Online Spaces',
        description:
          'Together with a grown-up, make a list of websites and apps that are “green light” safe for you right now.',
      },
      videoUrl: '/safety_into.mp4',
    },
  ],
}

/** Bands a unit is shown for (defaults to all). */
export function unitAgeBands(unit: UnitConfig): AgeBandId[] {
  return unit.ageBands?.length ? unit.ageBands : ALL_AGE_BANDS
}

export function getUnitsForBand(band: AgeBandId): UnitConfig[] {
  return curriculum.units.filter((u) => unitAgeBands(u).includes(band))
}

export function getUnitsInTrackForBand(trackId: TrackId, band: AgeBandId): UnitConfig[] {
  return curriculum.units.filter((u) => u.trackId === trackId && unitAgeBands(u).includes(band))
}
