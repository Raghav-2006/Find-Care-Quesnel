import { Routes, Route, useLocation } from 'react-router-dom'
import BottomNav from './components/BottomNav'
import HomePage from './pages/HomePage'
import MapPage from './pages/MapPage'
import SymptomPage from './pages/SymptomPage'
import ContactsPage from './pages/ContactsPage'

export default function App() {
  const location = useLocation()
  const isMapPage = location.pathname === '/map'

  return (
    <div
      className={
        isMapPage
          ? 'relative h-dvh w-full bg-white'
          : 'relative min-h-dvh max-w-md mx-auto bg-white shadow-xl'
      }
    >
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
