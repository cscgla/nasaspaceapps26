import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Abs, Img, Scene } from '../components/Stage'
import { Brand, Countdown, NavBar, SaysLabel, SpeechBubble, StartButton, StepButton, StreakBadge } from '../components/ui'
import { REGIONS, TASKS_BODY, type RegionId } from '../regions'
import { useJournal } from '../state/journal'

/** The framed "MESSAGE FROM HOME" video card. */
export function FamilyMessage() {
  return (
    <Abs x={254} y={128} w={933} h={555} className="family-frame">
      <p className="family-title">MESSAGE FROM HOME</p>
      <Img name="family-video" alt="Video message from family" x={144} y={129} w={668} h={390} />
    </Abs>
  )
}

/** "Welcome": message from home, then Next. */
export function Welcome({ region }: { region: RegionId }) {
  const navigate = useNavigate()
  const r = REGIONS[region]
  return (
    <Scene bg={r.bg}>
      <Img {...r.mascot.home} />
      <Brand />
      <Countdown />
      <div className="scene-dim" />
      <FamilyMessage />
      <StepButton label="Next" onClick={() => navigate(`/${region}/updates`)} />
    </Scene>
  )
}

/** "Updates": Daily Catchup + Today's Tasks cards. */
export function Updates({ region }: { region: RegionId }) {
  const navigate = useNavigate()
  const r = REGIONS[region]
  const cards = [
    { title: 'DAILY CATCHUP', icon: 'icon-news' as const, body: r.catchup, x: 304, iconX: 403, iconW: 180, iconH: 178 },
    { title: 'TODAY’S TASKS', icon: 'icon-tasks' as const, body: TASKS_BODY, x: 758, iconX: 857, iconW: 186, iconH: 181 },
  ]
  return (
    <Scene bg={r.bg}>
      <Img {...r.mascot.home} />
      <Brand />
      <Countdown />
      <div className="scene-dim" />
      {cards.map((c) => (
        <div key={c.title}>
          <Abs x={c.x} y={126} w={378} h={558} className="update-card" />
          <Img name={c.icon} x={c.iconX} y={187} w={c.iconW} h={c.iconH} style={{ borderRadius: 16 }} />
          <p className="update-title" style={{ left: c.x, top: 400, width: 378 }}>
            {c.title}
          </p>
          <div className="update-body" style={{ left: c.x + 24, top: 471 }}>
            {c.body.map((l) => (
              <p key={l}>{l}</p>
            ))}
          </div>
        </div>
      ))}
      <StepButton label="Back" onClick={() => navigate(`/${region}/welcome`)} />
      <StepButton label="Next" onClick={() => navigate(`/${region}/home`)} />
    </Scene>
  )
}

/**
 * "Landing Page": alternates on a timer with the "Landing Page - Animation"
 * variant where the mascot shares a thought (After-delay links in Figma).
 */
export function Home({ region }: { region: RegionId }) {
  const navigate = useNavigate()
  const { reset } = useJournal()
  const r = REGIONS[region]
  const [talking, setTalking] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setTalking((s) => !s), talking ? 6000 : 4000)
    return () => clearTimeout(t)
  }, [talking])

  return (
    <Scene bg={r.bg}>
      <Countdown />
      {talking ? (
        <div className="fade-in" key="talk">
          <Img {...r.mascot.homeTalk} />
          <SpeechBubble>
            <SaysLabel style={{ position: 'absolute', left: 42, top: 20 }}>{r.says}</SaysLabel>
            <p className="tip-text">Rain waters the garden too. Your low days are part of growing, not a step back.</p>
          </SpeechBubble>
        </div>
      ) : (
        <div className="fade-in" key="home">
          <p className="home-title">Let’s Unwind Together!</p>
          <StartButton
            x={606}
            y={415}
            onClick={() => {
              reset()
              navigate(`/${region}/journal/feelings`)
            }}
          />
          <Img {...r.mascot.home} />
        </div>
      )}
      <StreakBadge />
      <NavBar base={`/${region}`} />
      <Brand section="Home" to={`/${region}/home`} />
    </Scene>
  )
}
