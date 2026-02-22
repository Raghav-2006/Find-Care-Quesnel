export interface FaqItem {
  question: string;
  answer: string;
}

export const faqs: FaqItem[] = [
  {
    question: 'Do I need a referral?',
    answer:
      'For most walk-in clinics in Quesnel, you do not need a referral. However, specialists typically require a referral from a family doctor.',
  },
  {
    question: 'What are the wait times?',
    answer:
      'Wait times vary by facility and time of day. The ER triages based on severity. It\'s best to call ahead for clinics if possible.',
  },
  {
    question: 'Is there a walk-in clinic open on weekends?',
    answer:
      'The Quesnel UPCC is open on weekends and holidays from 10am–2pm. The hospital ER is always open 24/7.',
  },
  {
    question: 'Can I get a prescription refill without a doctor?',
    answer:
      'Pharmacists in BC can renew most prescriptions for a short period. Contact Shoppers Drug Mart or another local pharmacy to ask.',
  },
];
