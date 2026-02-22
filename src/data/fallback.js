export const fallbackStats = [
  {
    key: 'global_unemployment_rate',
    label: 'Global unemployment rate',
    value: 5.0,
    unit: '%',
    source: 'ILO World Employment and Social Outlook 2025',
    snapshot_date: '2025-05-15'
  },
  {
    key: 'global_youth_unemployment_rate',
    label: 'Global youth unemployment rate',
    value: 12.6,
    unit: '%',
    source: 'ILO World Employment and Social Outlook 2025',
    snapshot_date: '2025-05-15'
  },
  {
    key: 'estimated_jobs_added_2025',
    label: 'Estimated jobs added globally in 2025',
    value: 53,
    unit: 'million',
    source: 'ILO 2025 Update',
    snapshot_date: '2025-05-15'
  }
];

export const fallbackLookups = {
  riasec: [
    { code: 'R', name: 'Realistic', description: 'Hands-on and practical work.' },
    { code: 'I', name: 'Investigative', description: 'Analytical and research-focused work.' },
    { code: 'A', name: 'Artistic', description: 'Creative and expressive work.' },
    { code: 'S', name: 'Social', description: 'Helping and teaching work.' },
    { code: 'E', name: 'Enterprising', description: 'Business and leadership work.' },
    { code: 'C', name: 'Conventional', description: 'Structured and detail-driven work.' }
  ],
  mbti: [
    'INTJ', 'INTP', 'ENTJ', 'ENTP', 'INFJ', 'INFP', 'ENFJ', 'ENFP',
    'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ', 'ISTP', 'ISFP', 'ESTP', 'ESFP'
  ].map((code) => ({ code, title: code })),
  skills: [
    { id: 1, name: 'Communication', category: 'soft-skill' },
    { id: 2, name: 'Data Analysis', category: 'technical' },
    { id: 3, name: 'Problem Solving', category: 'soft-skill' },
    { id: 4, name: 'Software Development', category: 'technical' },
    { id: 5, name: 'Product Strategy', category: 'business' }
  ]
};
