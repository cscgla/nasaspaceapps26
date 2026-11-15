import { useEffect } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { Abs, Img, Scene } from '../components/Stage'
import { Brand, Chip, Countdown, InputBar, MoodPicker, NavBar, Progress, SaysLabel, SpeechBubble, StepButton, STREAK_DAYS } from '../components/ui'
import { REGIONS, type JournalStepId, type RegionId } from '../regions'
import { FEELINGS, MEALS, SLEEP_HOURS, useJournal, type Journal } from '../state/journal'

const ORDER: JournalStepId[] = ['feelings', 'sleep', 'energy', 'food', 'social', 'tasks']

function question(step: JournalStepId, region: RegionId): { lines: string[]; hint?: string } {
  switch (step) {
    case 'feelings':
      return { lines: ['How are you feeling today?'], hint: 'Pick one, then add a word.' }
    case 'sleep':
      return { lines: ['How is your sleep?'], hint: 'Pick one, then add a word.' }
    case 'energy':
      return { lines: ['Whats’s your energy right now?'] }
    case 'food':
      return { lines: REGIONS[region].foodQuestion, hint: 'Tap each meal you had.' }
    case 'social':
      return { lines: ['Did you talk to anyone today?'] }
    case 'tasks':
      return { lines: ['Do you have anything on your mind', 'heading to the next task?'] }
  }
}

/** One of the six journal screens (Feelings → Sleep → Energy → Food → Social → Tasks). */
export default function JournalStep({ region }: { region: RegionId }) {
  const { step } = useParams()
  const navigate = useNavigate()
  const { journal, update } = useJournal()
  const i = ORDER.indexOf(step as JournalStepId)
  if (i < 0) return <Navigate to={`/${region}/journal/feelings`} replace />
  const id = ORDER[i]
  const r = REGIONS[region]
  const q = question(id, region)
  const base = `/${region}`
  const next = () => navigate(i === ORDER.length - 1 ? `${base}/journal/done` : `${base}/journal/${ORDER[i + 1]}`)
  const back = () => navigate(i === 0 ? `${base}/home` : `${base}/journal/${ORDER[i - 1]}`)

  // Text sits higher when there is a hint or two lines, centred otherwise
  const top = q.hint ? (q.lines.length > 1 ? 27 : 40) : q.lines.length > 1 ? 40 : 61

  return (
    <Scene bg={r.bg} key={id}>
      <Img {...r.mascot.journal[id]} />
      <Countdown />
      <SpeechBubble>
        <p className="bubble-text" style={{ left: 45, top, width: 600 }}>
          {q.lines.map((l) => (
            <span className="q" key={l}>
              {l}
            </span>
          ))}
          {q.hint && <span className="hint">{q.hint}</span>}
        </p>
      </SpeechBubble>
      <StepWidget id={id} journal={journal} update={update} />
      <Progress step={i + 1} />
      <InputBar wide={id === 'feelings' || id === 'sleep'} onClick={next} />
      <StepButton label="Back" onClick={back} />
      <StepButton label="Next" onClick={next} />
      <NavBar base={base} />
      <Brand section="Journal" to={`${base}/home`} />
    </Scene>
  )
}

function StepWidget({ id, journal, update }: { id: JournalStepId; journal: Journal; update: (p: Partial<Journal>) => void }) {
  const toggle = <T,>(list: T[], v: T) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v])
  switch (id) {
    case 'feelings':
      return (
        <>
          <MoodPicker value={journal.mood} onChange={(mood) => update({ mood })} />
          {FEELINGS.map((f, n) => (
            <Chip key={f} label={f} x={299 + n * 119} y={551} w={100} h={40} selected={journal.feelings.includes(f)}
              onToggle={() => update({ feelings: toggle(journal.feelings, f) })} />
          ))}
        </>
      )
    case 'sleep':
      return (
        <>
          <MoodPicker value={journal.sleepQuality} onChange={(sleepQuality) => update({ sleepQuality })} />
          {SLEEP_HOURS.map((h, n) => (
            <Chip key={h} label={h} x={325 + n * 107} y={551} w={98} h={40} className="chip-sm" selected={journal.sleepHours === n}
              onToggle={() => update({ sleepHours: journal.sleepHours === n ? undefined : n })} />
          ))}
        </>
      )
    case 'energy':
      return (
        <>
          <div className="energy-cells" role="radiogroup" aria-label="Energy">
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} role="radio" aria-checked={journal.energy === n} aria-label={`Energy ${n} of 5`}
                className={`energy-cell ${n <= journal.energy ? `on-${n}` : ''}`}
                onClick={() => update({ energy: journal.energy === n ? 0 : n })} />
            ))}
          </div>
          <p className="energy-label" style={{ left: 292, top: 524 }}>Drained</p>
          <p className="energy-label" style={{ left: 739, top: 524 }}>Charged</p>
        </>
      )
    case 'food': {
      const slots = [
        { x: 333, w: 165 },
        { x: 547, w: 118 },
        { x: 713, w: 118 },
      ]
      return (
        <>
          {MEALS.map((m, n) => {
            const on = journal.meals.includes(m)
            return (
              <Chip key={m} label={m} x={slots[n].x} y={438} w={slots[n].w} h={52} className="chip-meal" selected={on}
                onToggle={() => update({ meals: toggle(journal.meals, m) })}>
                <span className="chip-box">{on ? '✕' : ''}</span>
              </Chip>
            )
          })}
        </>
      )
    }
    case 'social':
      return (
        <>
          <Chip label="YES" x={405} y={438} w={177} h={66} className="chip-social" selected={journal.social === 'yes'}
            onToggle={() => update({ social: journal.social === 'yes' ? undefined : 'yes' })} />
          <Chip label="NOT TODAY" x={634} y={438} w={177} h={66} className="chip-social" selected={journal.social === 'no'}
            onToggle={() => update({ social: journal.social === 'no' ? undefined : 'no' })} />
        </>
      )
    default:
      return null
  }
}

/** "Loading": thanks + XP, then moves on to Mood Trend after a delay. */
export function JournalDone({ region }: { region: RegionId }) {
  const navigate = useNavigate()
  const r = REGIONS[region]
  useEffect(() => {
    const t = setTimeout(() => navigate(`/${region}/mood-trend`), 3000)
    return () => clearTimeout(t)
  }, [navigate, region])
  return (
    <Scene bg={r.bg}>
      <Img {...r.mascot.done} />
      <Countdown />
      <SpeechBubble>
        <p className="bubble-text" style={{ left: 45, top: 40, width: 600 }}>
          <span className="q">Thanks for telling me. Low days</span>
          <span className="q">count too.</span>
        </p>
      </SpeechBubble>
      <Abs x={499} y={722} w={443} h={67} className="xp-bar">
        <span className="xp-amount">+10 XP</span>
        <span className="xp-label">Log complete</span>
        <span className="xp-streak">{STREAK_DAYS} day streak</span>
      </Abs>
      <NavBar base={`/${region}`} />
      <Brand section="Journal" to={`/${region}/home`} />
    </Scene>
  )
}

const METERS = [
  { label: 'Sleep', value: 40 },
  { label: 'Energy', value: 60 },
  { label: 'Stress', value: 80, hot: true },
  { label: 'Social', value: 30 },
]

/** "Mood Trend": the check-in summary (fixed content, as designed). */
export function MoodTrend({ region }: { region: RegionId }) {
  const navigate = useNavigate()
  const r = REGIONS[region]
  return (
    <Scene bg={r.bg}>
      <Img {...r.mascot.trend} />
      <Countdown />
      <Abs x={227} y={157} w={690} h={342}>
        <Img name="mood-panel" x={0} y={0} w={690} h={342} />
        <div className="mood-content">
          <SaysLabel>{r.trendSays}</SaysLabel>
          <p className="mood-message">Tough days don’t last. You showed up today, and that counts.</p>
          <div className="mood-row">
            <span>Mood: Low but holding</span>
            <span>4/10</span>
          </div>
          <div className="mood-meters">
            {METERS.map((m) => (
              <div className="meter" key={m.label}>
                <span>{m.label}</span>
                <span className="meter-track">
                  <span className={`meter-fill ${m.hot ? 'hot' : ''}`} style={{ width: `${m.value}%` }} />
                </span>
                <span className="meter-value">{m.value}%</span>
              </div>
            ))}
          </div>
          <p className="mood-status">Status: be gentle with yourself today</p>
        </div>
      </Abs>
      <StepButton label="Next" onClick={() => navigate(`/${region}/home`)} />
      <NavBar base={`/${region}`} />
      <Brand section="Journal" to={`/${region}/home`} />
    </Scene>
  )
}
