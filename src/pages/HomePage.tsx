import { useNavigate } from 'react-router-dom'
import {
  AlertTriangle,
  Stethoscope,
  MapPin,
  ChevronRight,
  Thermometer,
  Pill,
  HeartPulse,
  Headphones,
  Baby,
  Brain,
} from 'lucide-react'
import Header from '../components/Header'
import PlaceCard from '../components/PlaceCard'
import Accordion from '../components/Accordion'
import { places } from '../data/places'
import { faqs } from '../data/faq'

const quickDecisions = [
  { label: 'Fever', sub: 'Check guide', icon: Thermometer, color: 'bg-orange-100 text-orange-600', prompt: 'I have a fever' },
  { label: 'Refills', sub: 'Find Pharmacy', icon: Pill, color: 'bg-blue-100 text-blue-600', prompt: 'I need a prescription refill' },
  { label: 'Injury', sub: 'First Aid', icon: HeartPulse, color: 'bg-emerald-100 text-emerald-600', prompt: 'I have an injury' },
  { label: 'Headache', sub: 'Check guide', icon: Brain, color: 'bg-purple-100 text-purple-600', prompt: 'I have a headache' },
  { label: 'Child', sub: 'Kids care', icon: Baby, color: 'bg-pink-100 text-pink-600', prompt: 'My child is sick' },
]

export default function HomePage() {
  const navigate = useNavigate()

  return (
    <div className="pb-24">
      <Header />

      <main className="flex flex-col w-full overflow-x-hidden">
        {/* Hero Section */}
        <section className="px-5 pt-8 pb-6 bg-white rounded-b-[2rem] shadow-sm relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-teal-100/40 rounded-full blur-3xl pointer-events-none" />

          <h2 className="text-[28px] font-bold leading-tight tracking-tight text-slate-900 mb-2 relative z-10">
            Not sure where to go for care?
          </h2>
          <p className="text-slate-500 text-base font-normal leading-relaxed mb-8 relative z-10">
            We help you find the right medical care for your needs in Quesnel.
          </p>

          <div className="flex flex-col gap-3 relative z-10">
            {/* Emergency Button */}
            <button
              onClick={() => navigate('/contacts')}
              className="group flex w-full items-center justify-between overflow-hidden rounded-2xl bg-red-50 border border-red-100 p-1 pr-3 transition-all active:scale-[0.98] tap-highlight-none"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emergency text-white shadow-md">
                  <AlertTriangle size={22} />
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-sm font-bold text-slate-900">I need help now</span>
                  <span className="text-xs font-medium text-red-600">Emergency / 911</span>
                </div>
              </div>
              <ChevronRight size={20} className="text-red-400" />
            </button>

            {/* Symptom Checker Button */}
            <button
              onClick={() => navigate('/symptom')}
              className="group flex w-full items-center justify-between overflow-hidden rounded-2xl bg-primary/5 border border-primary/10 p-1 pr-3 transition-all active:scale-[0.98] tap-highlight-none"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white shadow-md">
                  <Stethoscope size={22} />
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-sm font-bold text-slate-900">I have symptoms</span>
                  <span className="text-xs font-medium text-primary">Start Checker</span>
                </div>
              </div>
              <ChevronRight size={20} className="text-primary/60" />
            </button>

            {/* Find Clinic Button */}
            <button
              onClick={() => navigate('/map')}
              className="group flex w-full items-center justify-between overflow-hidden rounded-2xl bg-slate-50 border border-slate-100 p-1 pr-3 transition-all active:scale-[0.98] tap-highlight-none"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-slate-900 border border-slate-100 shadow-sm">
                  <MapPin size={22} />
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-sm font-bold text-slate-900">Find a clinic</span>
                  <span className="text-xs font-medium text-slate-500">View Map</span>
                </div>
              </div>
              <ChevronRight size={20} className="text-slate-400" />
            </button>
          </div>
        </section>

        {/* Quick Decision */}
        <section className="pt-8 px-5">
          <div className="flex justify-between items-end mb-4">
            <h3 className="text-lg font-bold text-slate-900">Quick Decision</h3>
            <button
              onClick={() => navigate('/symptom')}
              className="text-sm font-semibold text-primary"
            >
              See all
            </button>
          </div>
          <div className="flex overflow-x-auto gap-3 pb-4 hide-scrollbar -mx-5 px-5">
            {quickDecisions.map((item) => (
              <button
                key={item.label}
                onClick={() => navigate('/symptom', { state: { prefill: item.prompt } })}
                className="flex-shrink-0 w-32 h-36 bg-white rounded-2xl p-4 flex flex-col justify-between border border-slate-100 shadow-sm active:scale-[0.97] transition-transform tap-highlight-none"
              >
                <div className={`w-10 h-10 rounded-full ${item.color} flex items-center justify-center`}>
                  <item.icon size={20} />
                </div>
                <div className="text-left">
                  <p className="font-bold text-sm text-slate-900">{item.label}</p>
                  <p className="text-[10px] text-slate-500 mt-1">{item.sub}</p>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* After Hours Banner */}
        <section className="px-5 mb-8">
          <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 flex gap-4 items-start">
            <div className="bg-indigo-100 rounded-full p-2 text-indigo-600 shrink-0">
              <Headphones size={22} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-indigo-900 mb-1">
                Need advice after 5pm?
              </h4>
              <p className="text-xs text-indigo-700 leading-relaxed mb-3">
                Call 8-1-1 for HealthLink BC to speak with a nurse anytime.
              </p>
              <a
                href="tel:811"
                className="inline-block text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 py-2 px-4 rounded-lg transition-colors"
              >
                Call 8-1-1
              </a>
            </div>
          </div>
        </section>

        {/* Places to Go */}
        <section className="px-5 mb-8">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Places to Go</h3>
          <div className="flex flex-col gap-4">
            {places.slice(0, 3).map((place) => (
              <PlaceCard key={place.id} place={place} />
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="px-5 mb-24">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Common Questions</h3>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <Accordion key={i} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
