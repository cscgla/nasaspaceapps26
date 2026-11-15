import { useEffect, useState, type CSSProperties, type ReactNode } from 'react'
import { asset, type AssetName } from '../assets'
import './stage.css'

export const DESIGN_W = 1440
export const DESIGN_H = 810

/**
 * The design is a fixed 1440×810 illustrated scene (characters sit on painted
 * backgrounds), so the whole canvas is scaled to fit the window and
 * letterboxed rather than reflowed.
 */
export function Stage({ children }: { children: ReactNode }) {
  const [scale, setScale] = useState(1)
  useEffect(() => {
    const fit = () => setScale(Math.min(window.innerWidth / DESIGN_W, window.innerHeight / DESIGN_H))
    fit()
    window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
  }, [])
  return (
    <div className="stage-viewport">
      <div className="stage" style={{ width: DESIGN_W, height: DESIGN_H, transform: `scale(${scale})` }}>
        {children}
      </div>
    </div>
  )
}

export type Box = { x: number; y: number; w?: number; h?: number }

export function boxStyle({ x, y, w, h }: Box, extra?: CSSProperties): CSSProperties {
  return { position: 'absolute', left: x, top: y, width: w, height: h, ...extra }
}

/** Absolutely positioned wrapper using design-space coordinates. */
export function Abs({
  children,
  className,
  style,
  ...box
}: Box & { children?: ReactNode; className?: string; style?: CSSProperties }) {
  return (
    <div className={className} style={boxStyle(box, style)}>
      {children}
    </div>
  )
}

const LIGHT_SLOTS = new Set<AssetName>(['speech-bubble', 'chat-bubble-small', 'mood-panel', 'input-bar'])

/** An exported Figma image, or a labelled placeholder until it's exported. */
export function Img({
  name,
  alt = '',
  flip,
  className,
  style,
  ...box
}: Box & { name: AssetName; alt?: string; flip?: boolean; className?: string; style?: CSSProperties }) {
  const src = asset(name)
  // Placeholders for bubbles/panels get a white fill so text drawn on top stays readable
  const light = LIGHT_SLOTS.has(name)
  const s = boxStyle(box, { ...(flip ? { transform: 'scaleX(-1)' } : null), ...style })
  if (!src) {
    return (
      <div className={`img-missing ${light ? 'is-light' : ''} ${className ?? ''}`} style={s} role="img" aria-label={alt || name}>
        <span>{name}</span>
      </div>
    )
  }
  return <img className={`img ${className ?? ''}`} src={src} alt={alt} style={s} draggable={false} />
}

/** Full-bleed scene background. */
export function Scene({ bg, children, dim }: { bg: AssetName; children?: ReactNode; dim?: boolean }) {
  return (
    <div className="scene">
      <Img name={bg} x={0} y={0} w={1441} h={DESIGN_H} className="scene-bg" />
      {dim && <div className="scene-dim" />}
      {children}
    </div>
  )
}
