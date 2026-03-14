// Random events for Tunnel Tycoon v2
// Each event triggers once per turn with choices that affect game state

const RANDOM_EVENTS = [
  {
    id: 'breakdown',
    name: 'TBM Breakdown!',
    icon: '\u{1F527}',
    description: 'Your lead engineer just called. Apparently someone forgot to grease the main bearing. Again.',
    affectsActive: true,
    choices: [
      { label: 'Rush repair (\u00A350k)', effect: { type: 'SPEND_CASH', amount: 50, delayWeeks: 1 } },
      { label: 'Standard repair', effect: { type: 'DELAY_RANDOM_PROJECT', weeks: 3 } },
    ],
  },
  {
    id: 'weather',
    name: 'Biblical Rainfall',
    icon: '\u{1F327}\uFE0F',
    description: 'The Met Office has issued a red warning. Your sites look like swimming pools.',
    choices: [
      { label: 'Pump and carry on (\u00A330k)', effect: { type: 'SPEND_CASH', amount: 30 } },
      { label: 'Down tools for the week', effect: { type: 'DELAY_ALL_PROJECTS', weeks: 1 } },
    ],
  },
  {
    id: 'inspection',
    name: 'H&S Inspection',
    icon: '\u{1F9BA}',
    description: 'The HSE inspector has arrived unannounced. He looks... thorough.',
    choices: [
      { label: 'Full compliance review (\u00A320k)', effect: { type: 'SPEND_CASH', amount: 20, repBoost: 0.25 } },
      { label: 'Wing it', effect: { type: 'REP_CHANGE', amount: -0.25, chance: 0.5 } },
    ],
  },
  {
    id: 'client_bonus',
    name: 'Client Happy Hour',
    icon: '\u{1F37E}',
    description: 'Your client is so impressed they want to give you a bonus. Must be your charming personality.',
    affectsActive: true,
    choices: [
      { label: 'Take the money', effect: { type: 'BONUS_CASH', amount: 80 } },
      { label: 'Ask for more work instead', effect: { type: 'REP_CHANGE', amount: 0.5 } },
    ],
  },
  {
    id: 'fuel_spike',
    name: 'Fuel Price Explosion',
    icon: '\u26FD',
    description: 'Diesel prices just went through the roof. Your fleet manager is weeping.',
    choices: [
      { label: 'Absorb the cost (\u00A340k)', effect: { type: 'SPEND_CASH', amount: 40 } },
      { label: 'Pass to clients', effect: { type: 'REP_CHANGE', amount: -0.25 } },
    ],
  },
  {
    id: 'skilled_worker',
    name: 'Staff Poached!',
    icon: '\u{1F477}',
    description: 'Your best TBM operator just got headhunted. They offered him a company car AND a parking space.',
    choices: [
      { label: 'Counter-offer (\u00A325k)', effect: { type: 'SPEND_CASH', amount: 25 } },
      { label: 'Let them go', effect: { type: 'MOBILISATION_PENALTY', extraWeeks: 1, duration: 8 } },
    ],
  },
  {
    id: 'discovery',
    name: 'Archaeological Find',
    icon: '\u{1F3FA}',
    description: 'Your crew just dug up what appears to be a Roman latrine. English Heritage is on speed dial.',
    affectsActive: true,
    choices: [
      { label: 'Proper excavation (2wk delay)', effect: { type: 'DELAY_RANDOM_PROJECT', weeks: 2, repBoost: 0.25 } },
      { label: 'Oops, what find?', effect: { type: 'REP_CHANGE', amount: -0.5, chance: 0.3 } },
    ],
  },
  {
    id: 'council',
    name: 'Council Complaint',
    icon: '\u{1F4CB}',
    description: 'Local residents are complaining about noise. Apparently 3am drilling isn\'t "ambient".',
    choices: [
      { label: 'Community liaison (\u00A315k)', effect: { type: 'SPEND_CASH', amount: 15, repBoost: 0.15 } },
      { label: 'Ignore them', effect: { type: 'REP_CHANGE', amount: -0.15 } },
    ],
  },
  {
    id: 'innovation',
    name: 'Engineering Breakthrough',
    icon: '\u{1F4A1}',
    description: 'Your R&D team (Dave from accounts) has found a way to speed up TBM assembly.',
    choices: [
      { label: 'Implement it!', effect: { type: 'SPEED_BOOST', weeks: 1, duration: 12 } },
    ],
  },
  {
    id: 'equipment_sale',
    name: 'Fire Sale!',
    icon: '\u{1F3F7}\uFE0F',
    description: 'A competitor went bust. Their equipment is going cheap at auction.',
    choices: [
      { label: 'Buy spare parts (\u00A335k, faster repairs)', effect: { type: 'SPEND_CASH', amount: 35, tempBonus: 'fast_repair' } },
      { label: 'Nah, we\'re good', effect: { type: 'NONE' } },
    ],
  },
  {
    id: 'media',
    name: 'TV Documentary',
    icon: '\u{1F4FA}',
    description: 'A TV crew wants to film your TBM operations for "Underground Britain". Free publicity!',
    choices: [
      { label: 'Welcome them', effect: { type: 'REP_CHANGE', amount: 0.5 } },
      { label: 'Too risky', effect: { type: 'NONE' } },
    ],
  },
  {
    id: 'ground_conditions',
    name: 'Unexpected Ground',
    icon: '\u{1FAA8}',
    description: 'The geological survey was... optimistic. You\'ve hit solid basalt where they promised "soft clay".',
    affectsActive: true,
    choices: [
      { label: 'Specialist tools (\u00A360k)', effect: { type: 'SPEND_CASH', amount: 60 } },
      { label: 'Slow and steady', effect: { type: 'DELAY_RANDOM_PROJECT', weeks: 3 } },
    ],
  },
  {
    id: 'union',
    name: 'Union Negotiations',
    icon: '\u270A',
    description: 'The union wants a 15% pay rise. They\'ve seen your revenue figures somehow.',
    choices: [
      { label: 'Negotiate (\u00A345k)', effect: { type: 'SPEND_CASH', amount: 45 } },
      { label: 'Refuse', effect: { type: 'DELAY_ALL_PROJECTS', weeks: 1 } },
    ],
  },
  {
    id: 'award',
    name: 'Industry Award!',
    icon: '\u{1F3C6}',
    description: 'You\'ve been nominated for "Most Boring Company" at the Tunnelling Awards. It\'s a compliment!',
    choices: [
      { label: 'Attend ceremony (\u00A310k)', effect: { type: 'SPEND_CASH', amount: 10, repBoost: 0.5 } },
      { label: 'Send our regards', effect: { type: 'REP_CHANGE', amount: 0.15 } },
    ],
  },
  {
    id: 'theft',
    name: 'Copper Thieves!',
    icon: '\u{1F9B9}',
    description: 'Someone\'s nicked the copper cabling from your southern depot. Cheeky.',
    choices: [
      { label: 'Replace and upgrade security (\u00A325k)', effect: { type: 'SPEND_CASH', amount: 25 } },
      { label: 'Use aluminium instead', effect: { type: 'SPEND_CASH', amount: 10 } },
    ],
  },
];

export default RANDOM_EVENTS;
