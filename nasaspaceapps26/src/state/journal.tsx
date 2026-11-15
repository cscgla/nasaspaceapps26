import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'

export type Mood = 'Great' | 'Good' | 'Okay' | 'Low' | 'Rough'
export const MOODS: Mood[] = ['Great', 'Good', 'Okay', 'Low', 'Rough']

export const FEELINGS = ['Anxious', 'Lonely', 'Calm', 'Hopeful', 'Tired'] as const
export type Feeling = (typeof FEELINGS)[number]

export const SLEEP_HOURS = ['<4 hours', '4-6 hours', '7-8 hours', '>8 hours', 'Use reader'] as const
export const MEALS = ['Breakfast', 'Lunch', 'Dinner'] as const
export type Meal = (typeof MEALS)[number]
export type Social = 'yes' | 'no'

/** Selections made on the journal screens (kept while moving Back/Next). */
export type Journal = {
  mood?: Mood
  feelings: Feeling[]
  sleepQuality?: Mood
  sleepHours?: number
  energy: number
  meals: Meal[]
  social?: Social
}

const empty: Journal = { feelings: [], energy: 0, meals: [] }

type Ctx = { journal: Journal; update: (patch: Partial<Journal>) => void; reset: () => void }

const JournalContext = createContext<Ctx | null>(null)

export function JournalProvider({ children }: { children: ReactNode }) {
  const [journal, setJournal] = useState<Journal>(empty)
  const value = useMemo<Ctx>(
    () => ({
      journal,
      update: (patch) => setJournal((j) => ({ ...j, ...patch })),
      reset: () => setJournal(empty),
    }),
    [journal],
  )
  return <JournalContext.Provider value={value}>{children}</JournalContext.Provider>
}

export function useJournal() {
  const ctx = useContext(JournalContext)
  if (!ctx) throw new Error('useJournal must be used inside JournalProvider')
  return ctx
}
