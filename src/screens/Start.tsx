import { useNavigate } from 'react-router-dom'
import { Img, Scene, boxStyle } from '../components/Stage'
import { Brand, StartButton, StepButton } from '../components/ui'
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

/** "Members": team credits. */
export function Members() {
  const navigate = useNavigate()
  return (
    <Scene bg="bg-members">
      <div className="members-panel">
        <h1>TRIPLE C</h1>
        <p>Home Country: Singapore</p>
        <p className="members-gap">Team Members:</p>
        {['Izzat', 'Cody', 'Astro', 'Depesh'].map((n) => (
          <p key={n}>{n}</p>
        ))}
        <p className="members-credit">Image Generated with ChatGPT</p>
      </div>
      <Brand section="Members" />
      <StepButton label="Back" x={659} y={640} w={122} h={38} onClick={() => navigate('/')} />
    </Scene>
  )
}
