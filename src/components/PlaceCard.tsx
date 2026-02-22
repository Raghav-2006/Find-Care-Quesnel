import {
  Hospital,
  Stethoscope,
  Pill,
  PhoneCall,
  Navigation,
} from 'lucide-react'
import StatusBadge from './StatusBadge'
import { Place, getDirectionsUrl, getPhoneUrl } from '../data/places'

const iconMap: Record<Place['type'], typeof Hospital> = {
  hospital: Hospital,
  clinic: Stethoscope,
  'urgent-care': Stethoscope,
  pharmacy: Pill,
}

export default function PlaceCard({ place }: { place: Place }) {
  const Icon = iconMap[place.type]

  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
      <div className="flex justify-between items-start mb-3">
        <div className="flex gap-3">
          <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
            <Icon size={22} className="text-slate-600" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-sm">{place.name}</h4>
            <p className="text-xs text-slate-500">{place.typeLabel}</p>
          </div>
        </div>
        <StatusBadge label={place.statusLabel} color={place.statusColor} />
      </div>

      {place.waitMins != null && (
        <p className="text-xs text-slate-400 mb-3">
          Est. wait: ~{place.waitMins} min{' '}
          <span className="text-slate-300">(demo)</span>
        </p>
      )}

      <div className="flex gap-2 mt-2">
        <a
          href={getPhoneUrl(place.phone)}
          className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-900 text-xs font-semibold py-2.5 rounded-lg flex items-center justify-center gap-1 transition-colors"
        >
          <PhoneCall size={14} /> Call
        </a>
        <a
          href={getDirectionsUrl(place.address)}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex-1 text-xs font-semibold py-2.5 rounded-lg flex items-center justify-center gap-1 transition-colors ${
            place.type === 'hospital'
              ? 'bg-primary text-white hover:bg-primary-dark'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Navigation size={14} /> Directions
        </a>
      </div>
    </div>
  )
}
