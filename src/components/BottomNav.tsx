import { NavLink } from 'react-router-dom'
import { Home, Map, Stethoscope, Phone } from 'lucide-react'

const tabs = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/map', label: 'Map', icon: Map },
  { to: '/symptom', label: 'Check', icon: Stethoscope },
  { to: '/contacts', label: 'Contact', icon: Phone },
] as const

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-100 px-6 pb-6 pt-3">
      <div className="flex justify-between items-center max-w-md mx-auto">
        {tabs.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 tap-highlight-none transition-colors ${
                isActive ? 'text-primary' : 'text-slate-400 hover:text-slate-600'
              }`
            }
          >
            <Icon size={24} strokeWidth={1.8} />
            <span className="text-[10px] font-semibold">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
