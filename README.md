# Find Care — Quesnel, BC

A mobile-first web app that helps Quesnel residents find the right medical care for their needs. Built with React, Vite, TypeScript, and Tailwind CSS.

## Features

- **Home** — Quick access to emergency services, symptom checker, and local clinics
- **Interactive Map** — Google Maps with markers for local healthcare facilities, filterable by type
- **Symptom Checker** — AI-powered chat assistant with rule-based fallback (works without API keys)
- **Emergency Contacts** — Quick-dial cards for 911, HealthLink BC (811), and BC Crisis Line
- **Feedback Form** — Contact the project team

## Tech Stack

- React 19 + Vite + TypeScript
- React Router v7
- Tailwind CSS
- Google Maps JS API
- Lucide React icons
- Vercel serverless functions (optional AI endpoint)

## Getting Started

### 1. Clone & Install

```bash
git clone <repo-url>
cd Find-Care-Quesnel
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env` and fill in your keys:

```bash
cp .env.example .env
```

| Variable | Required | Description |
|---|---|---|
| `VITE_GOOGLE_MAPS_API_KEY` | For map | Google Maps JavaScript API key |
| `OPENAI_API_KEY` | Optional | Enables AI symptom analysis (server-side only) |

> The app works without any API keys — the map shows a fallback list and the symptom checker uses built-in rules.

### 3. Run Locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser (use mobile device mode for best experience).

### 4. Build for Production

```bash
npm run build
npm run preview
```

## Deploy to Vercel

1. Push to GitHub
2. Import the repo in [Vercel](https://vercel.com)
3. Add environment variables in Vercel project settings:
   - `VITE_GOOGLE_MAPS_API_KEY` — your Google Maps key
   - `OPENAI_API_KEY` — (optional) your OpenAI key
4. Deploy — Vercel auto-detects Vite and the `/api` serverless functions

## Disclaimer

**This application does not provide medical advice, diagnosis, or treatment.** The symptom checker is for informational purposes only and should not replace professional medical consultation. Always call 911 for life-threatening emergencies.

Wait times shown are **demo/estimated values** and do not reflect real-time data.

## License

MIT
