import { useState, useRef, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  History,
  Send,
  Mic,
  Bot,
  Lightbulb,
  BarChart3,
  AlertTriangle,
  MapPin,
  PhoneCall,
  Info,
  ChevronRight,
} from 'lucide-react'
import { analyzeSymptoms, type SymptomResponse } from '../data/symptomEngine'

interface Message {
  id: string
  role: 'user' | 'assistant'
  text?: string
  analysis?: SymptomResponse
  timestamp: string
}

const urgencyColors = {
  Low: 'bg-green-100 text-green-600',
  Moderate: 'bg-orange-100 text-orange-600',
  High: 'bg-red-100 text-red-600',
}

export default function SymptomPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const prefill = (location.state as { prefill?: string } | null)?.prefill

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      text: "Hello! I'm your Quesnel Health Assistant. Describe your symptoms, and I'll help you figure out what to do next.",
      timestamp: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
    },
  ])
  const [input, setInput] = useState(prefill ?? '')
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const hasSentPrefill = useRef(false)

  useEffect(() => {
    if (prefill && !hasSentPrefill.current) {
      hasSentPrefill.current = true
      setTimeout(() => handleSend(prefill), 500)
    }
  }, [prefill])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  async function handleSend(text?: string) {
    const msg = (text ?? input).trim()
    if (!msg || loading) return

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: msg,
      timestamp: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
    }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setLoading(true)

    let analysis: SymptomResponse
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg }),
      })
      if (res.ok) {
        analysis = await res.json()
      } else {
        analysis = analyzeSymptoms(msg)
      }
    } catch {
      analysis = analyzeSymptoms(msg)
    }

    const aiMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      analysis,
      timestamp: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
    }
    setMessages((prev) => [...prev, aiMsg])
    setLoading(false)
  }

  return (
    <div className="relative flex h-dvh flex-col bg-white overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-slate-100 bg-white px-4 py-3 z-10 shrink-0">
        <button
          onClick={() => navigate(-1)}
          className="flex size-10 items-center justify-center rounded-full text-slate-500 hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft size={22} />
        </button>
        <div className="flex flex-col items-center">
          <h1 className="text-base font-bold text-slate-900">Symptom Checker</h1>
          <span className="flex items-center gap-1 text-[10px] font-medium text-teal-600 uppercase tracking-wide">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500" />
            </span>
            AI Active
          </span>
        </div>
        <button className="flex size-10 items-center justify-center rounded-full text-slate-500 hover:bg-slate-50 transition-colors">
          <History size={22} />
        </button>
      </header>

      {/* Chat Area */}
      <main ref={scrollRef} className="flex-1 overflow-y-auto p-4 pb-64 scroll-smooth">
        <div className="mb-6 text-center">
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">
            Today, {new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
          </span>
        </div>

        {messages.map((msg) =>
          msg.role === 'user' ? (
            <div key={msg.id} className="mb-6 flex justify-end gap-3">
              <div className="flex max-w-[85%] flex-col gap-1 items-end">
                <div className="rounded-2xl rounded-tr-none bg-teal-400 text-slate-900 p-4 shadow-sm">
                  <p className="text-sm leading-relaxed font-medium">{msg.text}</p>
                </div>
                <span className="text-[10px] text-slate-400 font-medium mr-1">
                  {msg.timestamp}
                </span>
              </div>
            </div>
          ) : msg.text ? (
            <div key={msg.id} className="mb-6 flex gap-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-600">
                <Bot size={18} />
              </div>
              <div className="flex max-w-[85%] flex-col gap-2">
                <div className="rounded-2xl rounded-tl-none bg-white border border-slate-100 p-4 shadow-sm">
                  <p className="text-sm leading-relaxed text-slate-700">{msg.text}</p>
                </div>
              </div>
            </div>
          ) : msg.analysis ? (
            <div key={msg.id} className="mb-6 flex gap-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-600 mt-1">
                <Bot size={18} />
              </div>
              <div className="flex max-w-[90%] flex-col gap-2">
                <AnalysisCard analysis={msg.analysis} />
              </div>
            </div>
          ) : null
        )}

        {loading && (
          <div className="mb-6 flex gap-3">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-600">
              <Bot size={18} />
            </div>
            <div className="rounded-2xl rounded-tl-none bg-white border border-slate-100 p-4 shadow-sm">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce [animation-delay:150ms]" />
                <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Input + Actions Footer */}
      <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-100 p-4 pb-24 z-20">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSend()
          }}
          className="mb-4 flex gap-2"
        >
          <div className="relative flex-1">
            <input
              ref={inputRef}
              className="w-full rounded-xl border-0 bg-slate-100 py-3 pl-4 pr-10 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-teal-400 outline-none"
              placeholder="Type a new symptom..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400"
            >
              <Mic size={20} />
            </button>
          </div>
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="flex size-11 items-center justify-center rounded-xl bg-teal-400 text-slate-900 shadow-lg hover:bg-teal-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={20} />
          </button>
        </form>

        <div className="grid grid-cols-5 gap-3">
          <button
            onClick={() => navigate('/map')}
            className="col-span-3 flex flex-col items-start justify-center rounded-xl bg-slate-900 p-3 text-left shadow-lg active:scale-[0.98] transition-transform group"
          >
            <div className="flex w-full items-center justify-between mb-1">
              <MapPin size={20} className="text-teal-400" />
              <ChevronRight size={18} className="text-slate-500" />
            </div>
            <span className="block text-xs font-medium text-slate-400">Next Step</span>
            <span className="block text-sm font-bold text-white">Find Clinics in Quesnel</span>
          </button>
          <a
            href="tel:811"
            className="col-span-2 flex flex-col items-center justify-center gap-1 rounded-xl border border-slate-200 bg-white p-3 text-center shadow-sm hover:bg-slate-50 active:scale-[0.98] transition-transform"
          >
            <PhoneCall size={24} className="text-red-500" />
            <span className="text-xs font-bold text-slate-900">Call 8-1-1</span>
            <span className="text-[10px] text-slate-500">HealthLink BC</span>
          </a>
        </div>
      </div>
    </div>
  )
}

function AnalysisCard({ analysis }: { analysis: SymptomResponse }) {
  const navigate = useNavigate()

  return (
    <div className="overflow-hidden rounded-2xl rounded-tl-none bg-white border border-slate-100 shadow-sm">
      <div className="border-b border-slate-100 bg-slate-50/50 px-4 py-3 flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-teal-600 flex items-center gap-1">
          <BarChart3 size={14} /> Analysis
        </span>
        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${urgencyColors[analysis.urgency]}`}>
          {analysis.urgency} Urgency
        </span>
      </div>

      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-bold text-slate-900 mb-1">{analysis.summaryTitle}</h3>
          <ul className="text-sm text-slate-600 leading-relaxed space-y-1">
            {analysis.reasoningBullets.map((b, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-slate-400 shrink-0">•</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-lg bg-teal-50 p-3 border border-teal-100">
          <div className="flex items-start gap-2">
            <Lightbulb size={16} className="text-teal-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-bold text-slate-900 mb-1">Recommendations</p>
              <ul className="text-xs text-slate-700 space-y-1">
                {analysis.recommendations.map((r, i) => (
                  <li key={i}>• {r}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {analysis.redFlags.length > 0 && (
          <div className="rounded-lg bg-red-50 p-3 border border-red-100">
            <div className="flex items-start gap-2">
              <AlertTriangle size={16} className="text-red-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-bold text-red-700 mb-1">Seek immediate care if:</p>
                <ul className="text-xs text-red-600 space-y-1">
                  {analysis.redFlags.map((f, i) => (
                    <li key={i}>• {f}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {analysis.nextStepCta && (
          <button
            onClick={() => {
              if (analysis.nextStepCta.href.startsWith('/')) {
                navigate(analysis.nextStepCta.href)
              } else {
                window.location.href = analysis.nextStepCta.href
              }
            }}
            className="w-full text-center bg-slate-900 text-white text-sm font-semibold py-2.5 rounded-lg hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
          >
            <MapPin size={16} />
            {analysis.nextStepCta.label}
          </button>
        )}
      </div>

      <div className="bg-slate-50 px-4 py-2 border-t border-slate-100">
        <p className="text-[10px] text-slate-400 flex items-center gap-1">
          <Info size={10} />
          Not medical advice. Call 911 for emergencies.
        </p>
      </div>
    </div>
  )
}
