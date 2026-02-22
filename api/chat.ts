import type { VercelRequest, VercelResponse } from '@vercel/node'

interface SymptomResponse {
  urgency: 'Low' | 'Moderate' | 'High'
  summaryTitle: string
  reasoningBullets: string[]
  recommendations: string[]
  redFlags: string[]
  nextStepCta: { label: string; href: string }
}

const SYSTEM_PROMPT = `You are a health triage assistant for Find Care Quesnel, a community health navigation app in Quesnel, BC, Canada.

RULES:
- NEVER diagnose. Use phrases like "Possible common illness pattern" or "Symptoms may suggest..."
- Always encourage seeking professional medical care
- If symptoms sound life-threatening (chest pain, difficulty breathing, stroke signs, severe bleeding, unconsciousness), set urgency to "High" and tell them to call 911
- Keep responses concise
- Always include red flags to watch for
- Be empathetic and supportive

Respond ONLY with valid JSON matching this exact schema:
{
  "urgency": "Low" | "Moderate" | "High",
  "summaryTitle": "short title",
  "reasoningBullets": ["bullet1", "bullet2"],
  "recommendations": ["rec1", "rec2"],
  "redFlags": ["flag1", "flag2"],
  "nextStepCta": { "label": "Find clinics in Quesnel", "href": "/map" }
}

For High urgency, set nextStepCta to { "label": "Call 911", "href": "tel:911" }.
Do not include any text outside the JSON object.`

function localFallback(message: string): SymptomResponse {
  const lower = message.toLowerCase()

  const emergencyKeywords = ['chest pain', 'heart', 'breathing', 'breath', 'unconscious', 'stroke', 'not breathing']
  if (emergencyKeywords.some((kw) => lower.includes(kw))) {
    return {
      urgency: 'High',
      summaryTitle: 'Potential Emergency Symptoms',
      reasoningBullets: [
        'These symptoms can indicate serious conditions requiring immediate attention',
        'Professional evaluation is critical',
      ],
      recommendations: [
        'Call 911 immediately',
        'Do not drive yourself to the hospital',
        'Stay calm and wait for help',
      ],
      redFlags: [
        'Crushing chest pain',
        'Sudden severe shortness of breath',
        'Loss of consciousness',
        'Signs of stroke (face drooping, arm weakness, speech difficulty)',
      ],
      nextStepCta: { label: 'Call 911', href: 'tel:911' },
    }
  }

  const feverKeywords = ['fever', 'temperature', 'hot', 'chills']
  if (feverKeywords.some((kw) => lower.includes(kw))) {
    return {
      urgency: 'Moderate',
      summaryTitle: 'Possible Common Illness Pattern',
      reasoningBullets: [
        'Fever is a common sign your body is fighting an infection',
        'Most fevers resolve within a few days with rest',
      ],
      recommendations: [
        'Rest and stay hydrated',
        'Monitor your temperature regularly',
        'Over-the-counter fever reducers may help',
        'If fever exceeds 39°C or lasts more than 3 days, seek care',
      ],
      redFlags: [
        'Fever above 39°C that does not respond to medication',
        'Difficulty breathing or chest pain',
        'Severe headache with stiff neck',
      ],
      nextStepCta: { label: 'Find clinics in Quesnel', href: '/map' },
    }
  }

  const coldKeywords = ['cough', 'sore throat', 'cold', 'flu', 'congestion', 'runny nose']
  if (coldKeywords.some((kw) => lower.includes(kw))) {
    return {
      urgency: 'Low',
      summaryTitle: 'Possible Upper Respiratory Pattern',
      reasoningBullets: [
        'Cough and cold symptoms are very common and usually viral',
        'Most resolve within 7–10 days',
      ],
      recommendations: [
        'Rest and drink warm fluids',
        'Honey and warm water can soothe a sore throat',
        'Visit a clinic if symptoms persist beyond 10 days',
      ],
      redFlags: [
        'Difficulty breathing or wheezing',
        'High fever developing alongside cough',
        'Coughing up blood',
      ],
      nextStepCta: { label: 'Find clinics in Quesnel', href: '/map' },
    }
  }

  return {
    urgency: 'Low',
    summaryTitle: 'General Health Inquiry',
    reasoningBullets: [
      "Your symptoms don't match a specific pattern in our guide",
      'A healthcare professional can provide personalized advice',
    ],
    recommendations: [
      'Call HealthLink BC at 8-1-1 for nurse advice (24/7)',
      'Visit a walk-in clinic for professional assessment',
      'Keep track of your symptoms',
    ],
    redFlags: [
      'If symptoms worsen suddenly, seek immediate care',
      'Difficulty breathing, chest pain, or loss of consciousness → Call 911',
    ],
    nextStepCta: { label: 'Find clinics in Quesnel', href: '/map' },
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { message } = req.body || {}
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message is required' })
  }

  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    return res.status(200).json(localFallback(message))
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: message },
        ],
        temperature: 0.3,
        max_tokens: 500,
      }),
    })

    if (!response.ok) {
      return res.status(200).json(localFallback(message))
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content

    try {
      const parsed = JSON.parse(content)
      return res.status(200).json(parsed)
    } catch {
      return res.status(200).json(localFallback(message))
    }
  } catch {
    return res.status(200).json(localFallback(message))
  }
}
