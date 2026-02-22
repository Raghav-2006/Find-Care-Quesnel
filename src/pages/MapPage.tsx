import { useEffect, useRef, useState } from 'react'
import {
  Search,
  SlidersHorizontal,
  LocateFixed,
  Navigation,
  PhoneCall,
  Hourglass,
  Clock,
  X,
  MapPin,
  Check,
  Loader2,
} from 'lucide-react'
import { places, Place, QUESNEL_CENTER, getDirectionsUrl, getPhoneUrl } from '../data/places'
import StatusBadge from '../components/StatusBadge'

const typeFilters = [
  { key: 'open', label: 'Open Now' },
  { key: 'hospital', label: 'ER' },
  { key: 'pharmacy', label: 'Pharmacies' },
  { key: 'clinic', label: 'Clinics' },
] as const

type FilterKey = (typeof typeFilters)[number]['key']

export default function MapPage() {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapObjRef = useRef<google.maps.Map | null>(null)
  const markersRef = useRef<google.maps.Marker[]>([])
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null)
  const [activeFilters, setActiveFilters] = useState<Set<FilterKey>>(new Set())
  const [searchQuery, setSearchQuery] = useState('')
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [errorMsg, setErrorMsg] = useState('')
  const initCalled = useRef(false)

  const filteredPlaces = places.filter((p) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      if (!p.name.toLowerCase().includes(q) && !p.typeLabel.toLowerCase().includes(q)) return false
    }
    if (activeFilters.size === 0) return true

    const typeFiltersActive = [
      activeFilters.has('hospital') ? 'hospital' : null,
      activeFilters.has('clinic') ? 'clinic' : null,
      activeFilters.has('pharmacy') ? 'pharmacy' : null,
    ].filter(Boolean) as string[]

    if (activeFilters.has('open') && !p.openNow) return false

    if (typeFiltersActive.length > 0) {
      const placeTypes = p.type === 'urgent-care' ? ['urgent-care', 'clinic'] : [p.type]
      if (!typeFiltersActive.some((tf) => placeTypes.includes(tf))) return false
    }

    return true
  })

  const toggleFilter = (key: FilterKey) => {
    setActiveFilters((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  useEffect(() => {
    if (initCalled.current) return
    initCalled.current = true

    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
    if (!apiKey) {
      setErrorMsg('No Google Maps API key found. Add VITE_GOOGLE_MAPS_API_KEY to your .env file.')
      setStatus('error')
      return
    }

    const scriptId = 'google-maps-script'
    if (document.getElementById(scriptId)) {
      tryInitMap()
      return
    }

    const script = document.createElement('script')
    script.id = scriptId
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=__initGoogleMap`
    script.async = true
    script.defer = true

    ;(window as any).__initGoogleMap = () => {
      tryInitMap()
    }

    script.onerror = () => {
      setErrorMsg('Failed to load Google Maps. Check your API key and ensure Maps JavaScript API is enabled.')
      setStatus('error')
    }

    document.head.appendChild(script)

    function tryInitMap() {
      if (!mapRef.current || !window.google?.maps) {
        setErrorMsg('Google Maps failed to initialize.')
        setStatus('error')
        return
      }

      try {
        const map = new window.google.maps.Map(mapRef.current, {
          center: QUESNEL_CENTER,
          zoom: 14,
          disableDefaultUI: true,
          zoomControl: true,
          zoomControlOptions: {
            position: window.google.maps.ControlPosition.RIGHT_CENTER,
          },
          gestureHandling: 'greedy',
          styles: [
            { featureType: 'poi.business', stylers: [{ visibility: 'off' }] },
            { featureType: 'transit', stylers: [{ visibility: 'off' }] },
          ],
        })
        mapObjRef.current = map

        places.forEach((place) => {
          const marker = new window.google.maps.Marker({
            position: { lat: place.lat, lng: place.lng },
            map,
            title: place.name,
            icon: {
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 14,
              fillColor:
                place.type === 'hospital'
                  ? '#ef4444'
                  : place.type === 'pharmacy'
                  ? '#10b981'
                  : '#1392ec',
              fillOpacity: 1,
              strokeColor: '#ffffff',
              strokeWeight: 3,
            },
          })

          marker.addListener('click', () => {
            setSelectedPlace(place)
            map.panTo({ lat: place.lat, lng: place.lng })
          })

          markersRef.current.push(marker)
        })

        setStatus('ready')
      } catch (err) {
        console.error('Map init error:', err)
        setErrorMsg('Failed to create map instance.')
        setStatus('error')
      }
    }
  }, [])

  useEffect(() => {
    if (status !== 'ready') return
    markersRef.current.forEach((marker, i) => {
      const place = places[i]
      const visible = filteredPlaces.some((fp) => fp.id === place.id)
      marker.setVisible(visible)
    })
  }, [filteredPlaces, status])

  const handleLocate = () => {
    if (!navigator.geolocation || !mapObjRef.current) return
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        mapObjRef.current?.panTo({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        })
        mapObjRef.current?.setZoom(15)
      },
      () => {
        mapObjRef.current?.panTo(QUESNEL_CENTER)
      }
    )
  }

  return (
    <div className="relative w-full h-dvh h-screen flex flex-col overflow-hidden bg-slate-200">
      {/* Map container - always rendered so ref is available */}
      <div
        ref={mapRef}
        className="absolute inset-0 w-full h-full z-0"
        style={{ minHeight: '100vh' }}
      />

      {/* Loading state */}
      {status === 'loading' && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-100">
          <div className="text-center">
            <Loader2 size={32} className="text-primary animate-spin mx-auto mb-3" />
            <p className="text-sm text-slate-500 font-medium">Loading map...</p>
          </div>
        </div>
      )}

      {/* Error state */}
      {status === 'error' && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-100 p-8 pb-24">
          <div className="text-center w-full max-w-sm">
            <MapPin size={48} className="text-slate-300 mx-auto mb-4" />
            <h3 className="font-bold text-slate-700 mb-2">Map unavailable</h3>
            <p className="text-sm text-slate-500 mb-4">{errorMsg}</p>
            <div className="space-y-2">
              {filteredPlaces.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPlace(p)}
                  className="w-full text-left bg-white rounded-xl p-3 border border-slate-200 shadow-sm active:scale-[0.98] transition-transform"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-sm">{p.name}</p>
                      <p className="text-xs text-slate-500">{p.typeLabel}</p>
                    </div>
                    <StatusBadge label={p.statusLabel} color={p.statusColor} />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
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

      {/* Locate button */}
      {status === 'ready' && (
        <div className="absolute right-4 bottom-32 flex flex-col gap-3 z-20 pointer-events-auto">
          <button
            onClick={handleLocate}
            className="w-10 h-10 bg-white rounded-xl shadow-lg flex items-center justify-center text-primary hover:bg-slate-50 active:scale-95 transition-all ring-1 ring-black/5"
          >
            <LocateFixed size={20} />
          </button>
        </div>
      )}

      {/* Bottom Sheet */}
      {selectedPlace && (
        <div className="absolute bottom-0 left-0 w-full z-30 pointer-events-auto animate-slide-up">
          <div className="bg-white rounded-t-[2rem] shadow-[0_-4px_20px_rgba(0,0,0,0.1)] p-1 w-full max-w-md mx-auto relative">
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
