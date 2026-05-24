import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Directory from './pages/Directory'
import Events from './pages/Events'
import Concierge from './pages/Concierge'
import Guide from './pages/Guide'
import Professionals from './pages/Professionals'
import About from './pages/About'
import Submit from './pages/Submit'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/directory" element={<Directory />} />
        <Route path="/events" element={<Events />} />
        <Route path="/concierge" element={<Concierge />} />
        <Route path="/guide" element={<Guide />} />
        <Route path="/professionals" element={<Professionals />} />
        <Route path="/about" element={<About />} />
        <Route path="/submit" element={<Submit />} />
      </Route>
    </Routes>
  )
}
