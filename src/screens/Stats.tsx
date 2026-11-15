import { Abs, Img, Scene } from '../components/Stage'
import { Brand, Countdown, NavBar, SideBubble } from '../components/ui'
import { REGIONS, type RegionId } from '../regions'

const WEEK = [
  { d: 'Sun', v: 5 },
  { d: 'Mon', v: 3 },
  { d: 'Tue', v: 4 },
  { d: 'Wed', v: 6 },
  { d: 'Thu', v: 5 },
  { d: 'Fri', v: 3 },
  { d: 'Sat', v: 4 },
]
const AVG = 4.3

// Last 5 weeks (rows) × S M T W T F S, 1 = low … 5 = high
const HEATMAP = [
  [3, 2, 3, 4, 3, 2, 4],
  [4, 1, 3, 4, 4, 2, 3],
  [3, 2, 4, 5, 3, 1, 4],
  [4, 2, 3, 4, 4, 2, 3],
  [3, 1, 3, 5, 4, 2, 3],
]

const FACTORS = [
  { k: 'Sleep', v: 85, note: 'Strong link', tone: 'pos' },
  { k: 'Social', v: 65, note: 'Lifts your mood', tone: 'pos' },
  { k: 'Exercise', v: 40, note: 'Small Lift', tone: 'pos' },
  { k: 'Nutrition', v: 20, note: 'Weak link', tone: 'neutral' },
  { k: 'Stress', v: 75, note: 'Lowers mood', tone: 'neg' },
] as const

const ADVICE = [
  {
    title: 'Protect your sleep',
    why: 'Your best day followed your best sleep. This week you averaged under 7 hours.',
    action: 'Aim to lights out by 11pm.',
  },
  {
    title: 'REACH OUT ON MONDAYS',
    why: 'Mondays and Fridays were lowest, with no social contact on either.',
    action: 'Send one message home each Monday.',
  },
  {
    title: 'EASE THE STRESS',
    why: 'Stress rose on the same days your mood dropped.',
    action: 'Try reading for 10-minute after dinner.',
  },
]

/** "Stats": scrollable Mood Report (static content, as designed). */
export default function Stats({ region }: { region: RegionId }) {
  const r = REGIONS[region]
  return (
    <Scene bg={r.bg}>
      <Img {...r.mascot.stats} />
      <Countdown />
      <Abs x={60} y={134} w={803} h={640} className="stats-panel">
        <header className="stats-head">
          <h1>Mood Report</h1>
          <div className="stats-range">
            <span className="is-on">WEEK</span>
            <span>MONTH</span>
            <span>YEAR</span>
          </div>
        </header>
        <div className="stats-scroll">
          <section>
            <h2>THIS WEEK AT A GLANCE</h2>
            <div className="glance">
              <Stat label="AVERAGE MOOD" value="4.3 / 10" note="+0.6 vs last week" />
              <Stat label="BEST DAY" value="Wed (6)" note="Also your best sleep" />
              <Stat label="AVERAGE SLEEP" value="6.4 h" note="Below your 7 h goal" warn />
              <Stat label="CHECK-IN STREAK" value="5 days" note="Keep it going" />
            </div>
          </section>
          <hr />
          <section>
            <h2>MOOD TREND</h2>
            <LineChart />
          </section>
          <hr />
          <section className="heat-section">
            <div>
              <h2>LAST 5 WEEKS</h2>
              <div className="heat">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                  <span className="heat-day" key={i}>
                    {d}
                  </span>
                ))}
                {HEATMAP.flat().map((v, i) => (
                  <span className="heat-cell" key={i} data-v={v} />
                ))}
              </div>
              <div className="heat-legend">
                <span>Low</span>
                {[1, 2, 3, 4, 5].map((v) => (
                  <span className="heat-cell sm" data-v={v} key={v} />
                ))}
                <span>High</span>
              </div>
            </div>
            <div className="heat-note">
              <p>Monday and Fridays are your toughest days across the last 5 weeks.</p>
              <p className="muted">Each square is one day.</p>
            </div>
          </section>
          <hr />
          <section>
            <h2>WHAT MOVES YOUR MOOD?</h2>
            <div className="factors">
              {FACTORS.map((f) => (
                <div className="factor" key={f.k}>
                  <span>{f.k}</span>
                  <span className="factor-track">
                    <span className={`factor-fill ${f.tone}`} style={{ width: `${f.v}%` }} />
                  </span>
                  <span className="factor-note">{f.note}</span>
                </div>
              ))}
            </div>
          </section>
          <hr />
          <section>
            <h2>MOOD MIX THIS WEEK</h2>
            <div className="mix">
              <span className="mix-seg good" style={{ flex: 1 }} />
              <span className="mix-seg okay" style={{ flex: 4 }} />
              <span className="mix-seg low" style={{ flex: 2 }} />
            </div>
            <div className="mix-labels">
              <span style={{ flex: 1 }}>Good 1</span>
              <span style={{ flex: 4 }}>Okay 4</span>
              <span style={{ flex: 2 }}>Low 2</span>
            </div>
          </section>
          <hr />
          <section>
            <h2>ADVICE FOR NEXT WEEK</h2>
            {ADVICE.map((a) => (
              <div className="advice" key={a.title}>
                <div>
                  <h3>{a.title}</h3>
                  <p>{a.why}</p>
                  <p className="advice-action">{a.action}</p>
                </div>
                <span className="advice-btn">Add to tasks</span>
              </div>
            ))}
          </section>
        </div>
      </Abs>
      <SideBubble says={r.says}>
        I took a closer look
        <br />
        at your week. Sleep is
        <br />
        your biggest lever.
      </SideBubble>
      <NavBar base={`/${region}`} />
      <Brand section="Stats" to={`/${region}/home`} />
    </Scene>
  )
}

function Stat({ label, value, note, warn }: { label: string; value: string; note: string; warn?: boolean }) {
  return (
    <div className="stat">
      <p className="stat-label">{label}</p>
      <p className="stat-value">{value}</p>
      <p className={`stat-note ${warn ? 'warn' : ''}`}>{note}</p>
    </div>
  )
}

/** Weekly mood line (0–10 scale) with dashed average. */
function LineChart() {
  const left = 25
  const right = 571
  const yFor = (v: number) => 154.7 - ((v - 2) / 6) * (154.7 - 56)
  const xFor = (i: number) => 42.6 + i * 81.3
  return (
    <svg className="line-chart" viewBox="0 0 600 240" width={600} height={240} role="img" aria-label="Mood this week, average 4.3">
      {[2, 4, 6, 8].map((v) => (
        <g key={v}>
          <line x1={left} x2={right} y1={yFor(v)} y2={yFor(v)} className="grid" />
          <text x={left - 10} y={yFor(v) + 5} textAnchor="end" className="axis">
            {v}
          </text>
        </g>
      ))}
      <line x1={left} x2={580} y1={yFor(AVG)} y2={yFor(AVG)} className="avg" />
      <text x={586} y={yFor(AVG) + 5} className="avg-label">
        avg {AVG}
      </text>
      <polyline points={WEEK.map((p, i) => `${xFor(i)},${yFor(p.v)}`).join(' ')} className="trend" />
      {WEEK.map((p, i) => (
        <g key={p.d}>
          <rect x={xFor(i) - 7.7} y={yFor(p.v) - 7.7} width={15.5} height={15.5} className="dot" />
          <text x={xFor(i)} y={yFor(p.v) - 14} textAnchor="middle" className="dot-label">
            {p.v}
          </text>
          <text x={xFor(i)} y={226} textAnchor="middle" className="day">
            {p.d}
          </text>
        </g>
      ))}
    </svg>
  )
}
