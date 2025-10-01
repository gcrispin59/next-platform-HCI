import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Participants from './pages/Participants'
import CarePlans from './pages/CarePlans'
import PersonalAssistants from './pages/PersonalAssistants'
import AIAssistant from './pages/AIAssistant'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/participants" element={<Participants />} />
        <Route path="/care-plans" element={<CarePlans />} />
        <Route path="/personal-assistants" element={<PersonalAssistants />} />
        <Route path="/ai-assistant" element={<AIAssistant />} />
      </Routes>
    </Layout>
  )
}

export default App
