export const TANZANIA_REGIONS = [
  'Dar es Salaam',
  'Arusha',
  'Mwanza',
  'Dodoma',
  'Mbeya',
  'Morogoro',
  'Tanga',
  'Other',
];

export const DAR_ES_SALAAM_AGENTS = [
  { id: 'posta', name: 'Central Posta', address: 'Posta Mpya, Dar es Salaam' },
  { id: 'kariakoo', name: 'Kariakoo Market', address: 'Kariakoo, Dar es Salaam' },
  { id: 'mbezi', name: 'Mbezi Luis', address: 'Mbezi Luis, Dar es Salaam' }
];


export const OTHER_REGION_AGENTS: Record<string, Array<{id: string, name: string, address: string}>> = {
  'Arusha': [
    { id: 'arusha_central', name: 'Arusha Central', address: 'Soko Kuu, Arusha' }
  ],
  'Mwanza': [
    { id: 'mwanza_central', name: 'Mwanza Central', address: 'City Center, Mwanza' }
  ],
  'Dodoma': [
    { id: 'dodoma_central', name: 'Dodoma Central', address: 'City Center, Dodoma' }
  ],
  'Mbeya': [
    { id: 'mbeya_central', name: 'Mbeya Central', address: 'City Center, Mbeya' }
  ],
  'Morogoro': [
    { id: 'morogoro_central', name: 'Morogoro Central', address: 'City Center, Morogoro' }
  ],
  'Tanga': [
    { id: 'tanga_central', name: 'Tanga Central', address: 'City Center, Tanga' }
  ],
  'Other': [
    { id: 'regional_bus_terminal', name: 'Regional Bus Terminal', address: 'Main Bus Terminal, Regional Center' }
  ]
};