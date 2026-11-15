import { useNavigate } from 'react-router-dom'
import { Img, Scene, boxStyle } from '../components/Stage'
import { Brand, StartButton } from '../components/ui'
import type { AssetName } from '../assets'

const CARDS: { img: AssetName; caption: string; x: number; to: string }[] = [
  { img: 'card-usa', caption: 'Astronaut based in United States', x: 59, to: '/usa/welcome' },
  { img: 'card-sg', caption: 'Astronaut based in Singapore', x: 514, to: '/sg/welcome' },
  { img: 'card-event', caption: 'Doodle Space Agency', x: 969, to: '/events/cny' },
]

/** "Start Page": choose a home country. */
export default function Start() {
  const navigate = useNavigate()
  return (
    <Scene bg="bg-iss">
      <Brand section="Start" to="/members" />
      <Img name="nasa-logo" alt="NASA" x={1268} y={32} w={118} h={98} />
      <p className="start-title">Select a Home Country</p>
      {CARDS.map((c) => (
        <div key={c.img}>
          <Img name={c.img} alt={c.caption} x={c.x} y={242} w={411} h={231} style={{ borderRadius: 5 }} />
          <p className="start-caption" style={boxStyle({ x: c.x, y: 505, w: 411 })}>
            {c.caption}
          </p>
          <StartButton x={c.x + 92} y={567} onClick={() => navigate(c.to)} />
        </div>
      ))}
    </Scene>
  )
}

const MEMBERS: { name: string; role: string; level: number; xp: number; photo: AssetName }[] = [
  { name: 'Cody Tan', role: 'Creative Lead', level: 24, xp: 51, photo: 'member-cody' },
  { name: 'Astro', role: 'Asset Designer', level: 22, xp: 41, photo: 'member-astro' },
  { name: 'Izzat', role: 'Team Lead', level: 26, xp: 58, photo: 'member-izzat' },
  { name: 'Depesh', role: 'Developer', level: 22, xp: 41, photo: 'member-depesh' },
]

/** "Credit Page": team cards. */
export function Members() {
  const navigate = useNavigate()
  return (
    <Scene bg="bg-members">
      <div className="credits-panel" />
      <p className="credits-title">
        TEAM <span className="credits-title-sub">//TRIPLE C</span>
      </p>
      <p className="credits-based">Astronaut Based In Singapore</p>
      {MEMBERS.map((m, i) => (
        <div key={m.name} className="member-card" style={boxStyle({ x: 201 + i * 267, y: 257, w: 238, h: 335 })}>
          <Img name={m.photo} alt={m.name} x={44} y={24} w={151} h={151} />
          <div className="member-info">
            <p>Name: {m.name}</p>
            <p>Role: {m.role}</p>
            <p>Level: {m.level}</p>
          </div>
          <div className="member-xp">
            <span style={{ width: `${m.xp}%` }} />
          </div>
        </div>
      ))}
      <p className="credits-note">Image Generated with ChatGPT</p>
      <Brand section="Members" />
      <button className="btn-step" style={boxStyle({ x: 660, y: 689, w: 121, h: 37 })} onClick={() => navigate('/')}>
        Start
      </button>
    </Scene>
  )
}
