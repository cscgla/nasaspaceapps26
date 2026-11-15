import type { ReactNode } from 'react'
import { Navigate, Route, Routes, useParams } from 'react-router-dom'
import { Stage } from './components/Stage'
import { isRegion, type RegionId } from './regions'
import Start, { Members } from './screens/Start'
import { Home, Updates, Welcome } from './screens/Intro'
import JournalStep, { JournalDone, MoodTrend } from './screens/Journal'
import Messages, { MessageView, WriteNote } from './screens/Messages'
import Stats from './screens/Stats'
import OneDayEvent, { EventsEnd } from './screens/Events'
import './screens/screens.css'

/** Resolves :region (sg | usa) and renders the screen for it. */
function R({ render }: { render: (r: RegionId) => ReactNode }) {
  const { region } = useParams()
  return isRegion(region) ? <>{render(region)}</> : <Navigate to="/" replace />
}

export default function App() {
  return (
    <Stage>
      <Routes>
        <Route path="/" element={<Start />} />
        <Route path="/members" element={<Members />} />

        {/* Singapore (otter) and USA (eagle) share the same flow */}
        <Route path="/:region/welcome" element={<R render={(r) => <Welcome region={r} />} />} />
        <Route path="/:region/updates" element={<R render={(r) => <Updates region={r} />} />} />
        <Route path="/:region/home" element={<R render={(r) => <Home region={r} />} />} />
        <Route path="/:region/journal/done" element={<R render={(r) => <JournalDone region={r} />} />} />
        <Route path="/:region/journal/:step" element={<R render={(r) => <JournalStep region={r} />} />} />
        <Route path="/:region/mood-trend" element={<R render={(r) => <MoodTrend region={r} />} />} />
        <Route path="/:region/messages" element={<R render={(r) => <Messages region={r} />} />} />
        <Route path="/:region/messages/view" element={<R render={(r) => <MessageView region={r} />} />} />
        <Route path="/:region/messages/write" element={<R render={(r) => <WriteNote region={r} />} />} />
        <Route path="/:region/stats" element={<R render={(r) => <Stats region={r} />} />} />

        {/* Doodle Space Agency: one-day events */}
        <Route path="/events/end" element={<EventsEnd />} />
        <Route path="/events/:id" element={<OneDayEvent />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Stage>
  )
}
