import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { Img, Scene, boxStyle } from '../components/Stage'
import { Brand, ContinueButton, Countdown, NavBar, SpeechBubble } from '../components/ui'
import type { AssetName } from '../assets'
import type { Box } from '../components/Stage'

type EventCfg = {
  id: string
  bg: AssetName
  lines: string[]
  /** Smaller second line (Deepavali) */
  small?: boolean
  art: (Box & { name: AssetName })[]
  nav: boolean
}

/** "Doodle Space Agency": one-day holiday events, chained by CONTINUE. */
export const EVENTS: EventCfg[] = [
  {
    id: 'cny',
    bg: 'bg-cny',
    lines: ['新年快乐', 'Happy New Year!'],
    art: [{ name: 'event-cny-otter', x: 945, y: 425, w: 205, h: 329 }],
    nav: true,
  },
  {
    id: 'raya',
    bg: 'bg-raya',
    lines: ['Selamat Hari Raya!', 'Happy Eid!'],
    art: [{ name: 'event-raya-otter', x: 923, y: 417, w: 205, h: 337 }],
    nav: true,
  },
  {
    id: 'deepavali',
    bg: 'bg-deepavali',
    lines: ['இனிய தீபாவளி நல்வாழ்த்துக்கள்', 'Happy Diwali!'],
    small: true,
    art: [{ name: 'event-deepavali-otter', x: 936, y: 438, w: 204, h: 326 }],
    nav: true,
  },
  {
    id: 'christmas',
    bg: 'bg-snowy',
    lines: ['Walao, so cold.', 'Merry Christmas!'],
    art: [
      { name: 'event-xmas-tree', x: 1085, y: 345, w: 240, h: 390 }, // est.
      { name: 'event-xmas-otter', x: 920, y: 430, w: 195, h: 325 }, // est.
    ],
    nav: true,
  },
  {
    id: 'haze',
    bg: 'bg-hazy',
    lines: ['PSI: Over 300,', 'School and office still open.'],
    art: [{ name: 'event-haze-otter', x: 925, y: 425, w: 200, h: 330 }], // est.
    nav: true,
  },
  {
    id: 'july4',
    bg: 'bg-sunny-usa',
    lines: ['‘Murica!', 'Happy 4th of July!'],
    art: [
      { name: 'event-july4-jet', x: 470, y: 70, w: 390, h: 200 }, // est.
      { name: 'event-july4-eagle', x: 1090, y: 340, w: 300, h: 430 }, // est.
    ],
    nav: false,
  },
]

function bubbleBox(id: string): Box {
  return id === 'july4' ? { x: 516, y: 278, w: 592, h: 171 } : { x: 310, y: 296, w: 620, h: 179 }
}

export default function OneDayEvent() {
  const { id } = useParams()
  const navigate = useNavigate()
  const i = EVENTS.findIndex((e) => e.id === id)
  if (i < 0) return <Navigate to="/events/cny" replace />
  const e = EVENTS[i]
  const b = bubbleBox(e.id)
  return (
    <Scene bg={e.bg} key={e.id}>
      {e.art.map((a) => (
        <Img key={a.name} {...a} />
      ))}
      <Brand />
      <Countdown />
      <SpeechBubble {...b}>
        <p className={`bubble-text event-text ${e.small ? 'is-small' : ''}`}>
          {e.lines.map((l) => (
            <span key={l} className="q">
              {l}
            </span>
          ))}
        </p>
      </SpeechBubble>
      {e.nav && <NavBar />}
      <ContinueButton onClick={() => navigate(i === EVENTS.length - 1 ? '/events/end' : `/events/${EVENTS[i + 1].id}`)} />
    </Scene>
  )
}

/** "You Died!" end screen: Respawn restarts the events, Title Screen goes to Start. */
export function EventsEnd() {
  const navigate = useNavigate()
  return (
    <Scene bg="event-end">
      <button className="end-hotspot" style={boxStyle({ x: 224, y: 500, w: 994, h: 96 })} aria-label="Respawn" onClick={() => navigate('/events/cny')} />
      <button className="end-hotspot" style={boxStyle({ x: 224, y: 620, w: 994, h: 96 })} aria-label="Title Screen" onClick={() => navigate('/')} />
    </Scene>
  )
}
