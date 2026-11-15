import type { AssetName } from './assets'
import type { Box } from './components/Stage'

export type RegionId = 'sg' | 'usa'
export type Placed = Box & { name: AssetName }

export type JournalStepId = 'feelings' | 'sleep' | 'energy' | 'food' | 'social' | 'tasks'

/**
 * Everything that differs between the Singapore (otter) and USA (eagle) flows.
 * Mascot boxes are where each character sits in the Figma frames. Boxes marked
 * "est." are estimates; adjust them if an exported image looks off.
 */
export type Region = {
  id: RegionId
  bg: AssetName
  /** Speech label, e.g. "OTTie SAYS:" */
  says: string
  /** Label on the Mood Trend card, e.g. "OTTER SAYS:" */
  trendSays: string
  foodQuestion: [string, string]
  catchup: string[]
  mascot: {
    home: Placed
    homeTalk: Placed
    done: Placed
    trend: Placed
    messages: Placed
    stats: Placed
    journal: Record<JournalStepId, Placed>
  }
}

const tasks = ['TASKS DONE: 1/4', 'NEXT UP: TASK 2', 'DUE: 6:00 PM', 'STREAK: 5 DAYS', 'STATUS: KEEP GOING!']
export const TASKS_BODY = tasks

export const REGIONS: Record<RegionId, Region> = {
  sg: {
    id: 'sg',
    bg: 'bg-rainy',
    says: 'OTTie SAYS:',
    trendSays: 'OTTER SAYS:',
    foodQuestion: ['Makan already?', 'What did you eat today?'],
    catchup: ['TODAY // SAT 14 NOV', 'TOP STORY: [HEADLINE]', 'SG: [LOCAL HEADLINE]', 'WORLD: [GLOBAL HEADLINE]', 'MOOD: STAY DRY, STAY SHARP'],
    mascot: {
      home: { name: 'otter-raincoat-wave', x: 777, y: 353, w: 444, h: 434 },
      homeTalk: { name: 'otter-home-talk', x: 880, y: 400, w: 260, h: 345 }, // est.
      done: { name: 'otter-done', x: 945, y: 395, w: 215, h: 330 }, // est.
      trend: { name: 'otter-stats', x: 895, y: 400, w: 225, h: 355 }, // est.
      messages: { name: 'otter-messages', x: 893, y: 410, w: 222, h: 350 }, // est.
      stats: { name: 'otter-stats', x: 895, y: 420, w: 225, h: 335 }, // est.
      journal: {
        feelings: { name: 'otter-feelings', x: 934, y: 413, w: 226, h: 345 },
        sleep: { name: 'otter-sleep', x: 872, y: 532, w: 385, h: 201 },
        energy: { name: 'otter-energy', x: 934, y: 391, w: 284, h: 356 },
        food: { name: 'otter-food', x: 960, y: 399, w: 235, h: 345 }, // est.
        social: { name: 'otter-social', x: 919, y: 398, w: 255, h: 343 },
        tasks: { name: 'otter-tasks', x: 940, y: 400, w: 215, h: 335 }, // est.
      },
    },
  },
  usa: {
    id: 'usa',
    bg: 'bg-sunny-usa',
    says: 'MEAGLE SAYS:',
    trendSays: 'MEAGLE SAYS:',
    foodQuestion: ['Have you eaten?', 'What did you eat today?'],
    catchup: ['USA // SAT 14 NOV', 'TOP: WEATHER ALERT', 'SCI: SPACE LAUNCH TODAY', 'CULTURE: MOVIE TOPS BOX', 'STATUS: 5 NEW UPDATES'],
    mascot: {
      home: { name: 'eagle-home', x: 1027, y: 449, w: 226, h: 320 },
      homeTalk: { name: 'eagle-home', x: 1027, y: 449, w: 226, h: 320 },
      done: { name: 'eagle-done', x: 959, y: 394, w: 224, h: 341 },
      trend: { name: 'eagle-stats', x: 982, y: 414, w: 244, h: 350 },
      messages: { name: 'eagle-messages', x: 975, y: 445, w: 215, h: 320 }, // est.
      stats: { name: 'eagle-stats', x: 970, y: 430, w: 215, h: 330 }, // est.
      journal: {
        feelings: { name: 'eagle-feelings', x: 928, y: 435, w: 292, h: 324 },
        sleep: { name: 'eagle-sleep', x: 982, y: 442, w: 238, h: 316 },
        energy: { name: 'eagle-energy', x: 929, y: 423, w: 347, h: 339 },
        food: { name: 'eagle-food', x: 957, y: 411, w: 285, h: 351 },
        social: { name: 'eagle-social', x: 929, y: 424, w: 305, h: 339 },
        tasks: { name: 'eagle-tasks', x: 995, y: 416, w: 244, h: 350 },
      },
    },
  },
}

export function isRegion(v: string | undefined): v is RegionId {
  return v === 'sg' || v === 'usa'
}
