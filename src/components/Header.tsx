import { Cross, Menu } from 'lucide-react'

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-100 px-4 py-3 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-2">
        <div className="bg-teal-100 p-2 rounded-lg">
          <Cross size={20} className="text-teal-600" />
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tight text-slate-900 leading-none">
            Find Care
          </h1>
          <p className="text-xs text-slate-500 font-medium">Quesnel, BC</p>
        </div>
      </div>
      <button className="p-2 text-slate-900 hover:bg-slate-50 rounded-full transition-colors">
        <Menu size={22} />
      </button>
    </header>
  )
}
