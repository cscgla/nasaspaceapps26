import { useState, type CSSProperties, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { Abs, Img, boxStyle, type Box } from './Stage'
import { MOODS, type Mood } from '../state/journal'
import './ui.css'

export const DAYS_TO_HOME = 86
export const STREAK_DAYS = 63

/* ---------- Header ---------- */

/** "Triple C //Section" in the top-left. Clickable when `to` is given. */
export function Brand({ section, to }: { section?: string; to?: string }) {
  const navigate = useNavigate()
  const content = (
    <>
      <span className="brand-name">Triple C </span>
      {section && <span className="brand-section">//{section}</span>}
    </>
  )
  return to ? (
    <button className="brand" style={{ left: 60, top: 40 }} onClick={() => navigate(to)}>
      {content}
    </button>
  ) : (
    <div className="brand" style={{ left: 60, top: 40 }}>
      {content}
    </div>
  )
}

export type NavKey = 'home' | 'messages' | 'stats'

/** Top nav. Without `base` the items only show their hover state (event screens). */
export function NavBar({ base }: { base?: string }) {
  const navigate = useNavigate()
  const items: { key: NavKey; label: string; x: number; w: number }[] = [
    { key: 'home', label: 'Home', x: 408, w: 113 },
    { key: 'messages', label: 'Messages', x: 600, w: 218 },
    { key: 'stats', label: 'Stats', x: 897, w: 136 },
  ]
  return (
    <nav aria-label="Main">
      {items.map((it) => (
        <button
          key={it.key}
          className="nav-item"
          style={boxStyle({ x: it.x, y: 40, w: it.w, h: 54 })}
          onClick={base ? () => navigate(`${base}/${it.key}`) : undefined}
        >
          {it.label}
        </button>
      ))}
    </nav>
  )
}

export function Countdown({ days = DAYS_TO_HOME }: { days?: number }) {
  return (
    <div style={boxStyle({ x: 1163, y: 26, w: 256, h: 54 })}>
      <Img name="countdown-bar" x={0} y={0} w={256} h={54} />
      <span className="countdown-text">{days} Days to home</span>
    </div>
  )
}

/* ---------- Buttons ---------- */

/** Green START button; shows "GO!" on hover, as in the component's hover variant. */
export function StartButton({ onClick, ...box }: Box & { onClick: () => void }) {
  return (
    <button className="btn-start" style={boxStyle({ w: 227, h: 70, ...box })} onClick={onClick} aria-label="Start">
      <span className="btn-start-default">START</span>
      <span className="btn-start-hover">GO!</span>
    </button>
  )
}

export function StepButton({
  label,
  onClick,
  x,
  y = 744,
  w = 124,
  h = 40,
}: { label: 'Next' | 'Back'; onClick: () => void } & Partial<Box>) {
  const px = x ?? (label === 'Next' ? 1295 : 21)
  return (
    <button className="btn-step" style={boxStyle({ x: px, y, w, h })} onClick={onClick}>
      {label}
    </button>
  )
}

/** Navy CONTINUE pill on the one-day event screens. */
export function ContinueButton({ onClick }: { onClick: () => void }) {
  return (
    <button className="btn-pixel btn-continue" style={boxStyle({ x: 1220, y: 721, w: 173, h: 52 })} onClick={onClick}>
      CONTINUE
    </button>
  )
}

/** Outlined-text pixel buttons: PLAY, WRITE A NOTE, GET DATA, SAVE DRAFT, SEND NOTE. */
export function PixelButton({
  children,
  tone,
  onClick,
  className = '',
  style,
}: { children: ReactNode; tone: 'blue' | 'green' | 'navy'; onClick?: () => void; className?: string; style?: CSSProperties }) {
  return (
    <button className={`btn-pixel tone-${tone} ${className}`} style={style} onClick={onClick}>
      {children}
    </button>
  )
}

/* ---------- Speech bubbles ---------- */

/** Big white pixel speech bubble used for questions (exported image). */
export function SpeechBubble({ children, x = 276, y = 233, w = 681, h = 197 }: Partial<Box> & { children?: ReactNode }) {
  return (
    <div style={boxStyle({ x, y, w, h })}>
      <Img name="speech-bubble" x={0} y={0} w={w} h={h} />
      {children}
    </div>
  )
}

/** Small "OTTie SAYS:" label (Silkscreen, blue). */
export function SaysLabel({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <p className="says-label" style={style}>
      {children}
    </p>
  )
}

/** Right-hand bubble on Messages / Send a Note / Stats. */
export function SideBubble({ says, children }: { says: string; children: ReactNode }) {
  return (
    <Abs x={972} y={152} w={414} h={247}>
      <Img name="chat-bubble-small" x={0} y={0} w={414} h={247} />
      <SaysLabel style={{ position: 'absolute', left: 51, top: 37 }}>{says}</SaysLabel>
      <div className="side-bubble-text">{children}</div>
    </Abs>
  )
}

/* ---------- Journal widgets ---------- */

export function Progress({ step, total = 6 }: { step: number; total?: number }) {
  return (
    <div className="progress" style={boxStyle({ x: 401, y: 621, w: 374, h: 20 })} aria-label={`Step ${step} of ${total}`}>
      <span className="progress-label">Progress</span>
      <div className="progress-cells">
        {Array.from({ length: total }, (_, i) => (
          <span key={i} className={`progress-cell ${i < step ? 'is-done' : ''}`} />
        ))}
      </div>
      <span className="progress-count">
        {step} / {total}
      </span>
    </div>
  )
}

/** Text box + mic + SEND bar. It's an image in the prototype; tapping it goes to the next screen. */
export function InputBar({ wide, onClick }: { wide?: boolean; onClick: () => void }) {
  const box = wide ? { x: 471, y: 730, w: 465, h: 67 } : { x: 500, y: 729, w: 442, h: 63 }
  return (
    <button className="input-bar" style={boxStyle(box)} onClick={onClick} aria-label="Send">
      <Img name="input-bar" x={0} y={0} w={box.w} h={box.h} />
    </button>
  )
}

const moodColor: Record<Mood, string> = {
  Great: 'var(--mood-great)',
  Good: 'var(--mood-good)',
  Okay: 'var(--mood-okay)',
  Low: 'var(--mood-low)',
  Rough: 'var(--mood-rough)',
}

/** Five mood tiles; the selected tile gets a yellow frame, clicking it again clears it. */
export function MoodPicker({ value, onChange }: { value?: Mood; onChange: (m?: Mood) => void }) {
  return (
    <div className="mood-picker" style={boxStyle({ x: 298, y: 418 })} role="radiogroup" aria-label="Mood">
      {MOODS.map((m) => (
        <button
          key={m}
          role="radio"
          aria-checked={value === m}
          className={`mood-tile ${value === m ? 'is-selected' : ''}`}
          onClick={() => onChange(value === m ? undefined : m)}
        >
          <span className="mood-face" style={{ background: moodColor[m] }}>
            <MoodFace mood={m} />
            <span className="mood-tile-label">{m}</span>
          </span>
        </button>
      ))}
    </div>
  )
}

function MoodFace({ mood }: { mood: Mood }) {
  // 11×11 pixel faces matching the Mood picker component
  const mouths: Record<Mood, string> = {
    Great: 'M2 6h1v1h1v1h3V7h1V6h1v1H8v1H7v1H4V8H3V7H2z',
    Good: 'M3 7h1v1h3V7h1v1H7v1H4V8H3z',
    Okay: 'M3 8h5v1H3z',
    Low: 'M4 7h3v1h1v1H7V8H4v1H3V8h1z',
    Rough: 'M3 8h1V7h3v1h1v1H3zM2 2h2v1H2zM7 2h2v1H7z',
  }
  return (
    <svg width="44" height="44" viewBox="0 0 11 11" shapeRendering="crispEdges" aria-hidden>
      <path fill="#141414" d={`M3 4h1v2H3zM7 4h1v2H7z${mouths[mood]}`} />
    </svg>
  )
}

/** Toggle chip: white with black border; selected = yellow with outlined white text. */
export function Chip({
  label,
  selected,
  onToggle,
  className = '',
  children,
  ...box
}: Box & { label: string; selected: boolean; onToggle: () => void; className?: string; children?: ReactNode }) {
  return (
    <button
      className={`chip ${selected ? 'is-selected' : ''} ${className}`}
      style={boxStyle(box)}
      aria-pressed={selected}
      onClick={onToggle}
    >
      {children}
      <span className="chip-label">{label}</span>
    </button>
  )
}

export function StreakBadge({ days = STREAK_DAYS }: { days?: number }) {
  return (
    <Abs x={45} y={669} w={325} h={86}>
      <div className="streak-card" />
      <Img name="streak-fire" x={0} y={14} w={107} h={58} />
      <span className="streak-text">{days} Days Streak</span>
    </Abs>
  )
}

/** A popup that closes itself after a delay. */
export function useToast(ms = 2400) {
  const [toast, setToast] = useState<string | null>(null)
  const show = (id: string) => {
    setToast(id)
    window.setTimeout(() => setToast((t) => (t === id ? null : t)), ms)
  }
  return { toast, show, hide: () => setToast(null) }
}
