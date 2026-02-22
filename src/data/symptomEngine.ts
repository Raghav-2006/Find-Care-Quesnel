export interface SymptomResponse {
  urgency: 'Low' | 'Moderate' | 'High';
  summaryTitle: string;
  reasoningBullets: string[];
  recommendations: string[];
  redFlags: string[];
  nextStepCta: { label: string; href: string };
}

interface Rule {
  keywords: string[];
  response: SymptomResponse;
}

const rules: Rule[] = [
  {
    keywords: ['chest pain', 'chest', 'heart', 'breathing', 'breath', 'unconscious', 'not breathing'],
    response: {
      urgency: 'High',
      summaryTitle: 'Potential Emergency Symptoms',
      reasoningBullets: [
        'Chest pain and difficulty breathing can indicate serious conditions',
        'These symptoms require immediate professional evaluation',
      ],
      recommendations: [
        'Call 911 immediately or go to G.R. Baker Memorial ER',
        'Do not drive yourself if experiencing severe symptoms',
        'Stay calm and sit upright if having difficulty breathing',
      ],
      redFlags: [
        'Crushing or squeezing chest pain',
        'Pain radiating to arm, jaw, or back',
        'Sudden severe shortness of breath',
        'Loss of consciousness',
      ],
      nextStepCta: { label: 'Call 911', href: 'tel:911' },
    },
  },
  {
    keywords: ['fever', 'temperature', 'hot', 'chills'],
    response: {
      urgency: 'Moderate',
      summaryTitle: 'Possible Common Illness Pattern',
      reasoningBullets: [
        'Fever is a common sign your body is fighting an infection',
        'Most fevers in adults resolve within a few days with rest',
      ],
      recommendations: [
        'Rest and stay hydrated — drink plenty of water and clear fluids',
        'Monitor your temperature regularly',
        'Over-the-counter fever reducers may help (follow package directions)',
        'If fever exceeds 39°C (102°F) or lasts more than 3 days, seek care',
      ],
      redFlags: [
        'Fever above 39°C / 102°F that does not respond to medication',
        'Difficulty breathing or chest pain',
        'Severe headache with stiff neck',
        'Rash that does not blanch when pressed',
      ],
      nextStepCta: { label: 'Find clinics in Quesnel', href: '/map' },
    },
  },
  {
    keywords: ['cough', 'sore throat', 'cold', 'flu', 'congestion', 'runny nose', 'sneezing'],
    response: {
      urgency: 'Low',
      summaryTitle: 'Possible Upper Respiratory Pattern',
      reasoningBullets: [
        'Cough and cold symptoms are very common and usually viral',
        'Most resolve within 7–10 days without specific treatment',
      ],
      recommendations: [
        'Rest and drink warm fluids',
        'Honey and warm water can soothe a sore throat (adults only)',
        'Use over-the-counter cold relief products as needed',
        'Visit a clinic if symptoms worsen or persist beyond 10 days',
      ],
      redFlags: [
        'Difficulty breathing or wheezing',
        'High fever developing alongside cough',
        'Coughing up blood',
      ],
      nextStepCta: { label: 'Find clinics in Quesnel', href: '/map' },
    },
  },
  {
    keywords: ['injury', 'cut', 'bleeding', 'broken', 'fracture', 'sprain', 'fall', 'wound'],
    response: {
      urgency: 'Moderate',
      summaryTitle: 'Possible Injury Assessment Needed',
      reasoningBullets: [
        'Injuries may range from minor to requiring urgent care',
        'Proper assessment ensures correct treatment',
      ],
      recommendations: [
        'Apply pressure to any bleeding wound with a clean cloth',
        'Immobilize the area if you suspect a fracture',
        'Apply ice wrapped in cloth for swelling (20 min on, 20 min off)',
        'Visit the ER or UPCC for proper evaluation',
      ],
      redFlags: [
        'Uncontrollable bleeding',
        'Visible bone or deep wound',
        'Inability to move a limb',
        'Head injury with confusion or vomiting',
      ],
      nextStepCta: { label: 'Find clinics in Quesnel', href: '/map' },
    },
  },
  {
    keywords: ['headache', 'migraine', 'head pain'],
    response: {
      urgency: 'Low',
      summaryTitle: 'Possible Headache Pattern',
      reasoningBullets: [
        'Headaches are very common and usually not serious',
        'They can be caused by stress, dehydration, or tension',
      ],
      recommendations: [
        'Rest in a quiet, dark room',
        'Stay hydrated and eat regular meals',
        'Over-the-counter pain relievers may help',
        'If this is a new, severe, or unusual headache, see a doctor',
      ],
      redFlags: [
        '"Worst headache of my life" or thunderclap onset',
        'Headache with fever and stiff neck',
        'Headache after a head injury',
        'Vision changes or confusion',
      ],
      nextStepCta: { label: 'Find clinics in Quesnel', href: '/map' },
    },
  },
  {
    keywords: ['stomach', 'nausea', 'vomiting', 'diarrhea', 'abdominal', 'belly'],
    response: {
      urgency: 'Low',
      summaryTitle: 'Possible Gastrointestinal Pattern',
      reasoningBullets: [
        'Stomach issues are common and often caused by viruses or food',
        'Most cases resolve within 24–48 hours',
      ],
      recommendations: [
        'Stay hydrated with small, frequent sips of water or electrolyte drinks',
        'Avoid solid foods until nausea passes, then try bland foods',
        'Rest and monitor symptoms',
        'See a clinic if symptoms last more than 48 hours',
      ],
      redFlags: [
        'Severe abdominal pain that is getting worse',
        'Blood in vomit or stool',
        'Signs of dehydration (dizziness, dry mouth, no urination)',
        'High fever with abdominal pain',
      ],
      nextStepCta: { label: 'Find clinics in Quesnel', href: '/map' },
    },
  },
  {
    keywords: ['refill', 'prescription', 'medication', 'pharmacy', 'pill', 'medicine'],
    response: {
      urgency: 'Low',
      summaryTitle: 'Prescription / Pharmacy Inquiry',
      reasoningBullets: [
        'BC pharmacists can renew many prescriptions for a short supply',
        'Contact your local pharmacy for details',
      ],
      recommendations: [
        'Call Shoppers Drug Mart at (250) 992-2214',
        'Bring your old prescription bottle or medication name',
        'If urgent, visit a walk-in clinic for a new prescription',
      ],
      redFlags: [
        'Running out of critical medication (e.g., insulin, heart meds)',
        'Adverse reaction to medication — seek immediate care',
      ],
      nextStepCta: { label: 'Find pharmacies', href: '/map' },
    },
  },
];

const defaultResponse: SymptomResponse = {
  urgency: 'Low',
  summaryTitle: 'General Health Inquiry',
  reasoningBullets: [
    'Your symptoms don\'t match a specific pattern in our guide',
    'A healthcare professional can provide personalized advice',
  ],
  recommendations: [
    'Call HealthLink BC at 8-1-1 to speak with a nurse 24/7',
    'Visit a walk-in clinic for a professional assessment',
    'Keep track of your symptoms (when they started, severity)',
  ],
  redFlags: [
    'If symptoms worsen suddenly, seek immediate care',
    'Difficulty breathing, chest pain, or loss of consciousness → Call 911',
  ],
  nextStepCta: { label: 'Find clinics in Quesnel', href: '/map' },
};

export function analyzeSymptoms(message: string): SymptomResponse {
  const lower = message.toLowerCase();
  for (const rule of rules) {
    if (rule.keywords.some((kw) => lower.includes(kw))) {
      return rule.response;
    }
  }
  return defaultResponse;
}
