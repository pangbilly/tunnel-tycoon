// AI competitors for Tunnel Tycoon v2
// Three competitors with different personalities and bidding strategies

const AI_COMPETITORS = [
  {
    id: 'boring_solutions',
    name: 'Boring Solutions Ltd',
    tagline: '"We put the BORE in boring"',
    color: '#8b5cf6', // purple
    personality: 'aggressive', // bids low, takes risks
    bidStyle: { min: 0.65, max: 0.90 },
    fleetPreference: { 600: 2, 1200: 2, 1500: 1, 1800: 1 },
    cabins: 4,
    catchphrases: [
      'We\'ll undercut anyone!',
      'Quality? Never heard of her.',
      'Our TBMs run on pure ambition.',
    ],
  },
  {
    id: 'mole_corp',
    name: 'Mole Corp International',
    tagline: '"Digging deep since 1987"',
    color: '#ec4899', // pink
    personality: 'balanced',
    bidStyle: { min: 0.80, max: 1.05 },
    fleetPreference: { 600: 1, 1200: 3, 1500: 2, 1800: 1 },
    cabins: 5,
    catchphrases: [
      'Slow and steady wins the contract.',
      'We measured twice. Drilled once.',
      'Our moles are unionised.',
    ],
  },
  {
    id: 'underground_overachievers',
    name: 'Underground Overachievers',
    tagline: '"We\'re overachieving... underground"',
    color: '#06b6d4', // cyan
    personality: 'conservative', // bids high, cherry picks
    bidStyle: { min: 0.90, max: 1.20 },
    fleetPreference: { 600: 1, 1200: 2, 1500: 1, 1800: 2 },
    cabins: 5,
    catchphrases: [
      'We only take premium jobs.',
      'Our TBMs have leather seats.',
      'Cheap? We don\'t know the meaning.',
    ],
  },
];

export default AI_COMPETITORS;
