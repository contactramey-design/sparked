import type { HomeworkJob } from '../types/homework'

/** Static demo job for "Try a demo" — no API calls. */
export const DEMO_JOB_ID = 'demo-sparki-homework'

export function buildDemoHomeworkJob(): HomeworkJob {
  return {
    jobId: DEMO_JOB_ID,
    createdAt: Date.now(),
    mode: 'story',
    language: 'en',
    gradeBand: 'K–2',
    isDemo: true,
    analysis: {
      subject: 'Math',
      topic: 'Addition within 10',
      gradeBand: 'K–2',
      language: 'en',
      extractedText: '3 + 4 = __   2 + 5 = __   1 + 6 = __',
      learningObjective: 'Practice adding small numbers and understanding that addition puts groups together.',
      confidence: 0.92,
      needsReview: false,
    },
    explanation: {
      childExplanation:
        'These problems ask you to find how many you have when you put two small groups together. You can use your fingers, draw dots, or count out loud—Sparki loves trying!',
      steps: [
        'Look at the first number—that is one group.',
        'Look at the second number—that is another group.',
        'Count all the way from 1 through both groups to find the total.',
        'Check: does your answer feel like a little more than the bigger number?',
      ],
      practiceQuestions: [
        'If you see 4 + 2, what story could you tell with toys or snacks?',
        'Try 3 + 3 without writing—what total do you get?',
      ],
      parentNotes: 'Encourage counting strategies rather than memorization pressure at this age.',
    },
    story: {
      title: 'Sparki and the Friendly Number Train',
      scenes: [
        {
          sceneNumber: 1,
          summary: 'Sparki lines up colorful cars.',
          narration:
            'Sparki chugged into Math Station and saw three shiny blue train cars waiting on the track.',
          teachingPoint: 'The first number tells you how many are in the first group.',
        },
        {
          sceneNumber: 2,
          summary: 'More cars join.',
          narration:
            'Four happy green cars rolled up to couple on behind. “We’re going to ride together!” they whistled.',
          teachingPoint: 'The second number adds another group to the first.',
        },
        {
          sceneNumber: 3,
          summary: 'Counting the whole train.',
          narration:
            'Sparki walked the length of the train, tapping each car: 1, 2, 3… all the way to the caboose. Seven cars meant seven friends riding as one big train.',
          teachingPoint: 'Addition means finding the total of both groups.',
        },
      ],
      recap: 'Whenever you see a + sign, imagine Sparki coupling train cars: count every car once to find the total!',
    },
  }
}
