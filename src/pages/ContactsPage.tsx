import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Stethoscope,
  Phone,
  HeartHandshake,
  Cross,
  CheckCircle,
  X,
} from 'lucide-react'

export default function ContactsPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [showToast, setShowToast] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitted(true)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
    setFormData({ name: '', email: '', message: '' })
    setTimeout(() => setSubmitted(false), 0)
  }

  return (
    <div className="relative flex flex-col min-h-dvh bg-white pb-24">
      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center justify-between bg-white/90 p-4 backdrop-blur-md border-b border-slate-100">
        <button
          onClick={() => navigate(-1)}
          className="flex size-10 items-center justify-center rounded-full text-slate-900 hover:bg-slate-100 transition-colors"
        >
          <ArrowLeft size={22} />
        </button>
        <h1 className="text-lg font-bold leading-tight tracking-tight text-slate-900">
          Emergency Contacts
        </h1>
        <div className="size-10" />
      </header>

      <main className="flex-1 overflow-y-auto">
        {/* Hero */}
        <div className="px-4 py-6">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Quesnel
            <br />
            <span className="text-teal-500">Care Support</span>
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Immediate access to emergency services and local health resources.
          </p>
        </div>

        {/* Emergency Cards */}
        <div className="flex flex-col gap-4 px-4">
          {/* 911 */}
          <div className="rounded-xl bg-red-50 p-5 shadow-sm border border-red-100">
            <div className="flex items-center gap-2 mb-1">
              <Cross size={20} className="text-red-600" />
              <h3 className="text-lg font-bold text-slate-900">Emergency (911)</h3>
            </div>
            <p className="text-sm text-slate-600 mb-4">
              For life-threatening emergencies, fire, or police.
            </p>
            <a
              href="tel:911"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-3 text-sm font-semibold text-white transition-transform active:scale-[0.98] hover:bg-red-700"
            >
              <Phone size={18} /> Call 911
            </a>
          </div>

          {/* 811 */}
          <div className="rounded-xl bg-teal-50 p-5 shadow-sm border border-teal-100">
            <div className="flex items-center gap-2 mb-1">
              <Stethoscope size={20} className="text-teal-600" />
              <h3 className="text-lg font-bold text-slate-900">HealthLink BC (811)</h3>
            </div>
            <p className="text-sm text-slate-600 mb-4">
              24/7 non-emergency health advice from a nurse.
            </p>
            <a
              href="tel:811"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-teal-500 px-4 py-3 text-sm font-bold text-white transition-transform active:scale-[0.98] hover:bg-teal-600"
            >
              <Phone size={18} /> Call 811
            </a>
          </div>

          {/* Crisis Line */}
          <div className="rounded-xl bg-slate-50 p-5 shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 mb-1">
              <HeartHandshake size={20} className="text-slate-700" />
              <h3 className="text-lg font-bold text-slate-900">Crisis Line</h3>
            </div>
            <p className="text-sm text-slate-600 mb-4">
              24-hour mental health support and suicide prevention.
            </p>
            <a
              href="tel:18007842433"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition-transform active:scale-[0.98] hover:bg-slate-800"
            >
              <Phone size={18} /> Call Crisis Line
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 flex items-center gap-4 px-4">
          <div className="h-px flex-1 bg-slate-200" />
          <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
            Feedback
          </span>
          <div className="h-px flex-1 bg-slate-200" />
        </div>

        {/* Feedback Form */}
        <div className="px-4">
          <div className="rounded-xl bg-slate-50 p-5 border border-slate-100">
            <h3 className="mb-1 text-lg font-bold text-slate-900">Contact the Project</h3>
            <p className="mb-6 text-sm text-slate-600">
              Questions about Find Care Quesnel? Let us know.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="name"
                  className="text-xs font-semibold uppercase tracking-wide text-slate-500"
                >
                  Name (Optional)
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="Jane Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-all placeholder:text-slate-400"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label
                  htmlFor="email"
                  className="text-xs font-semibold uppercase tracking-wide text-slate-500"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="jane@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-all placeholder:text-slate-400"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label
                  htmlFor="message"
                  className="text-xs font-semibold uppercase tracking-wide text-slate-500"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  placeholder="How can we help?"
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full resize-none rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-all placeholder:text-slate-400"
                />
              </div>

              <button
                type="submit"
                className="mt-2 w-full rounded-lg bg-slate-900 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-slate-800"
              >
                Send Feedback
              </button>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 mb-4 px-4 text-center">
          <p className="text-xs text-slate-400">
            Find Care Quesnel v1.0.0
            <br />
            This app does not provide medical advice.
            <br />© 2025 Quesnel Healthcare Initiative
          </p>
        </div>
      </main>

      {/* Toast */}
      {showToast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 animate-slide-down">
          <CheckCircle size={18} className="text-teal-400" />
          <span className="text-sm font-medium">Feedback sent! Thank you.</span>
          <button onClick={() => setShowToast(false)} className="ml-2 text-slate-400 hover:text-white">
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  )
}
