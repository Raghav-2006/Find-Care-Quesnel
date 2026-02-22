import { Routes, Route } from 'react-router-dom'
import BottomNav from './components/BottomNav'
import HomePage from './pages/HomePage'
import MapPage from './pages/MapPage'
import SymptomPage from './pages/SymptomPage'
import ContactsPage from './pages/ContactsPage'

export default function App() {
  return (
    <div className="relative min-h-dvh max-w-md mx-auto bg-white shadow-xl">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/symptom" element={<SymptomPage />} />
        <Route path="/contacts" element={<ContactsPage />} />
      </Routes>
      <BottomNav />
    </div>
  )
}
