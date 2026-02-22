import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface AccordionProps {
  question: string
  answer: string
}

export default function Accordion({ question, answer }: AccordionProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full cursor-pointer items-center justify-between p-4 font-medium text-slate-900 text-left tap-highlight-none"
      >
        <span className="text-sm">{question}</span>
        <ChevronDown
          size={20}
          className={`text-slate-400 transition-transform duration-200 shrink-0 ml-2 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-200 ${
          open ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 pb-4 text-sm text-slate-500 leading-relaxed">{answer}</div>
      </div>
    </div>
  )
}
