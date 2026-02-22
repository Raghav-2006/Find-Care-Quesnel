import { useEffect, useRef, useState, useCallback } from 'react'
import {
  Search,
  SlidersHorizontal,
  Layers,
  LocateFixed,
  Navigation,
  PhoneCall,
  Hourglass,
  Clock,
  X,
  MapPin,
  Check,
} from 'lucide-react'
import { Loader } from '@googlemaps/js-api-loader'
import { places, Place, QUESNEL_CENTER, getDirectionsUrl, getPhoneUrl } from '../data/places'
import StatusBadge from '../components/StatusBadge'

const typeFilters = [
  { key: 'open', label: 'Open Now', icon: Check },
  { key: 'hospital', label: 'ER', icon: null },
  { key: 'pharmacy', label: 'Pharmacies', icon: null },
  { key: 'clinic', label: 'Clinics', icon: null },
] as const

type FilterKey = (typeof typeFilters)[number]['key']

const markerColors: Record<Place['type'], string> = {
  hospital: '#ef4444',
  clinic: '#1392ec',
  'urgent-care': '#1392ec',
  pharmacy: '#10b981',
}

export default function MapPage() {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<google.maps.Map | null>(null)
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([])
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null)
  const [activeFilters, setActiveFilters] = useState<Set<FilterKey>>(new Set())
  const [searchQuery, setSearchQuery] = useState('')
  const [mapError, setMapError] = useState(false)

  const filteredPlaces = places.filter((p) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      if (!p.name.toLowerCase().includes(q) && !p.typeLabel.toLowerCase().includes(q)) return false
    }
    if (activeFilters.size === 0) return true
    let pass = true
    if (activeFilters.has('open') && !p.openNow) pass = false
    if (activeFilters.has('hospital') && p.type !== 'hospital') {
      if (!activeFilters.has('clinic') && !activeFilters.has('pharmacy')) pass = false
      else if (p.type !== 'clinic' && p.type !== 'urgent-care' && p.type !== 'pharmacy') pass = false
    }
    if (activeFilters.has('clinic') && p.type !== 'clinic' && p.type !== 'urgent-care') {
      if (!activeFilters.has('hospital') && !activeFilters.has('pharmacy')) pass = false
      else if (p.type !== 'hospital' && p.type !== 'pharmacy') pass = false
    }
    if (activeFilters.has('pharmacy') && p.type !== 'pharmacy') {
      if (!activeFilters.has('hospital') && !activeFilters.has('clinic')) pass = false
      else if (p.type !== 'hospital' && p.type !== 'clinic' && p.type !== 'urgent-care') pass = false
    }
    return pass
  })

  const toggleFilter = (key: FilterKey) => {
    setActiveFilters((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  const initMap = useCallback(async () => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
    if (!apiKey || !mapRef.current) {
      setMapError(true)
      return
    }

    try {
      const loader = new Loader({
        apiKey,
        version: 'weekly',
        libraries: ['marker'],
      })
      const { Map } = await loader.importLibrary('maps')
      const { AdvancedMarkerElement } = await loader.importLibrary('marker')

      const map = new Map(mapRef.current, {
        center: QUESNEL_CENTER,
        zoom: 14,
        mapId: 'find-care-quesnel',
        disableDefaultUI: true,
        zoomControl: false,
        gestureHandling: 'greedy',
      })
      mapInstanceRef.current = map

      places.forEach((place) => {
        const pin = document.createElement('div')
        pin.className = 'flex items-center justify-center w-8 h-8 rounded-full border-[3px] border-white shadow-xl cursor-pointer'
        pin.style.backgroundColor = markerColors[place.type]

        const marker = new AdvancedMarkerElement({
          position: { lat: place.lat, lng: place.lng },
          map,
          content: pin,
          title: place.name,
        })

        marker.addListener('gmp-click', () => {
          setSelectedPlace(place)
          map.panTo({ lat: place.lat, lng: place.lng })
        })

        markersRef.current.push(marker)
      })
    } catch {
      setMapError(true)
    }
  }, [])

  useEffect(() => {
    initMap()
  }, [initMap])

  const handleLocate = () => {
    if (!navigator.geolocation || !mapInstanceRef.current) return
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        mapInstanceRef.current?.panTo({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        })
        mapInstanceRef.current?.setZoom(15)
      },
      () => {
        mapInstanceRef.current?.panTo(QUESNEL_CENTER)
      }
    )
  }

  return (
    <div className="relative w-full h-dvh flex flex-col overflow-hidden bg-slate-200">
      {/* Map or fallback */}
      {mapError ? (
        <div className="flex-1 flex items-center justify-center bg-slate-100 p-8">
          <div className="text-center">
            <MapPin size={48} className="text-slate-300 mx-auto mb-4" />
            <h3 className="font-bold text-slate-700 mb-2">Map unavailable</h3>
            <p className="text-sm text-slate-500 mb-4">
              Add your Google Maps API key to <code className="bg-slate-200 px-1 rounded text-xs">.env</code> to enable the map.
            </p>
            <div className="space-y-2">
              {filteredPlaces.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPlace(p)}
                  className="w-full text-left bg-white rounded-xl p-3 border border-slate-200 shadow-sm"
                >
                  <p className="font-semibold text-sm">{p.name}</p>
                  <p className="text-xs text-slate-500">{p.typeLabel}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div ref={mapRef} className="absolute inset-0 w-full h-full z-0" />
      )}

      {/* Search & Filters */}
      <div className="absolute top-0 left-0 w-full z-20 pt-12 px-4 flex flex-col gap-3 pointer-events-none">
        <div className="pointer-events-auto bg-white rounded-full shadow-lg flex items-center p-1 pr-1.5 gap-2 ring-1 ring-black/5">
          <div className="w-10 h-10 flex items-center justify-center text-slate-400">
            <Search size={20} />
          </div>
          <input
            className="flex-1 bg-transparent border-none focus:outline-none text-slate-900 placeholder-slate-400 text-sm font-medium h-full py-2"
            placeholder="Search clinics, doctors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="w-9 h-9 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-slate-200 transition-colors">
            <SlidersHorizontal size={18} />
          </button>
        </div>

        <div className="pointer-events-auto flex gap-2 overflow-x-auto hide-scrollbar pb-2">
          {typeFilters.map((f) => (
            <button
              key={f.key}
              onClick={() => toggleFilter(f.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full shadow-sm text-sm font-medium whitespace-nowrap ring-1 transition-colors ${
                activeFilters.has(f.key)
                  ? 'bg-primary text-white ring-primary'
                  : 'bg-white text-slate-700 ring-black/5 hover:bg-slate-50'
              }`}
            >
              {activeFilters.has(f.key) && <Check size={16} />}
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Right side controls */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-20 pointer-events-auto">
        <button className="w-10 h-10 bg-white rounded-xl shadow-lg flex items-center justify-center text-slate-700 hover:bg-slate-50 active:scale-95 transition-all ring-1 ring-black/5">
          <Layers size={20} />
        </button>
        <button
          onClick={handleLocate}
          className="w-10 h-10 bg-white rounded-xl shadow-lg flex items-center justify-center text-primary hover:bg-slate-50 active:scale-95 transition-all ring-1 ring-black/5"
        >
          <LocateFixed size={20} />
        </button>
      </div>

      {/* Bottom Sheet */}
      {selectedPlace && (
        <div className="absolute bottom-0 left-0 w-full z-30 pointer-events-auto animate-slide-up">
          <div className="bg-white rounded-t-[2rem] shadow-[0_-4px_20px_rgba(0,0,0,0.1)] p-1 w-full max-w-md mx-auto relative">
            {/* Pull Indicator */}
            <div className="w-full flex justify-center pt-3 pb-1">
              <div className="w-12 h-1.5 bg-slate-200 rounded-full" />
            </div>

            <button
              onClick={() => setSelectedPlace(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors"
            >
              <X size={16} />
            </button>

            <div className="px-5 pb-6 pt-2">
              <div className="flex justify-between items-start mb-2 pr-8">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 leading-tight">
                    {selectedPlace.name}
                  </h2>
                  <p className="text-slate-500 text-sm mt-1 font-medium">
                    {selectedPlace.typeLabel}
                  </p>
                </div>
                <StatusBadge
                  label={selectedPlace.statusLabel}
                  color={selectedPlace.statusColor}
                />
              </div>

              {/* Stats Row */}
              <div className="flex items-center gap-4 py-4">
                {selectedPlace.waitMins != null && (
                  <div className="flex-1 bg-slate-50 rounded-xl p-3 flex items-center gap-3 border border-slate-100">
                    <div className="bg-blue-100 p-2 rounded-lg text-primary">
                      <Hourglass size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">
                        Est. Wait
                      </p>
                      <p className="text-slate-900 font-bold text-lg">
                        {selectedPlace.waitMins} min
                      </p>
                    </div>
                  </div>
                )}
                {selectedPlace.closesLabel && (
                  <div className="flex-1 bg-slate-50 rounded-xl p-3 flex items-center gap-3 border border-slate-100">
                    <div className="bg-orange-100 p-2 rounded-lg text-orange-500">
                      <Clock size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">
                        Closes
                      </p>
                      <p className="text-slate-900 font-bold text-lg">
                        {selectedPlace.closesLabel.replace('Closes ', '')}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Address & Contact */}
              <div className="flex flex-col gap-2 mb-6">
                <div className="flex items-center gap-3 text-slate-600 text-sm">
                  <MapPin size={16} className="text-slate-400 shrink-0" />
                  <span>{selectedPlace.address}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-600 text-sm">
                  <PhoneCall size={16} className="text-slate-400 shrink-0" />
                  <span>{selectedPlace.phone}</span>
                </div>
                {selectedPlace.hours && (
                  <div className="flex items-center gap-3 text-slate-600 text-sm">
                    <Clock size={16} className="text-slate-400 shrink-0" />
                    <span>{selectedPlace.hours}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-5 gap-3">
                <a
                  href={getDirectionsUrl(selectedPlace.address)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="col-span-3 bg-primary hover:bg-primary-dark text-white rounded-xl py-3.5 px-4 font-semibold text-base shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 transition-colors"
                >
                  <Navigation size={18} /> Get Directions
                </a>
                <a
                  href={getPhoneUrl(selectedPlace.phone)}
                  className="col-span-2 bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 rounded-xl py-3.5 px-4 font-semibold text-base flex items-center justify-center gap-2 transition-colors"
                >
                  <PhoneCall size={18} className="text-primary" /> Call
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
