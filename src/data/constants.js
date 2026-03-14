// TBM size colours
export const TBM_COLORS = {
  600: '#10b981',   // emerald
  1200: '#3b82f6',  // blue
  1500: '#f59e0b',  // amber
  1800: '#ef4444',  // red
};

export const TBM_LABELS = {
  600: '600mm',
  1200: '1200mm',
  1500: '1500mm',
  1800: '1800mm',
};

// Weekly hire rates (£)
export const HIRE_RATES = {
  600: 12000,
  1200: 20000,
  1500: 25000,
  1800: 30000,
};

// Hire duration options (weeks)
export const HIRE_DURATIONS = [4, 8, 12, 16];

// Starting fleet — generic manufacturer + serial style names
export const STARTING_FLEET = [
  { id: 'TBM-600-01', size: 600, name: 'HK-600-Alpha', yard: 'Northern Depot' },
  { id: 'TBM-600-02', size: 600, name: 'RB-600-Bravo', yard: 'Southern Depot' },
  { id: 'TBM-1200-01', size: 1200, name: 'HK-1200-Charlie', yard: 'Northern Depot' },
  { id: 'TBM-1200-02', size: 1200, name: 'RB-1200-Delta', yard: 'Southern Depot' },
  { id: 'TBM-1200-03', size: 1200, name: 'NF-1200-Echo', yard: 'Northern Depot' },
  { id: 'TBM-1500-01', size: 1500, name: 'HK-1500-Foxtrot', yard: 'Southern Depot' },
  { id: 'TBM-1500-02', size: 1500, name: 'RB-1500-Golf', yard: 'Northern Depot' },
  { id: 'TBM-1800-01', size: 1800, name: 'HK-1800-Hotel', yard: 'Southern Depot' },
];

export const TOTAL_CABINS = 6;

// Depot locations
export const YARDS = [
  { id: 'Northern Depot', name: 'Northern Depot (Leeds)', lat: 53.80, lng: -1.55 },
  { id: 'Southern Depot', name: 'Southern Depot (Reading)', lat: 51.45, lng: -0.97 },
];

// Game timing
export const GAME_START_DATE = new Date(2026, 3, 1); // Apr 1 2026
export const GAME_END_WEEK = 260; // 5 years
export const WEEKS_PER_YEAR = 52;
export const MOBILISATION_WEEKS = 2;
export const URGENCY_DEADLINE_WEEKS = 4;

// Reputation
export const STARTING_REPUTATION = 5;
export const REP_LOSS_CONTRACT_LOST = 0.5;
export const REP_GAIN_EARLY_COMPLETE = 0.25;
export const REP_MULTIPLIERS = {
  5: 1.5,
  4: 1.2,
  3: 1.0,
  2: 0.8,
  1: 0.5,
  0: 0,
};

// Likelihood dice roll bias
export const LIKELIHOOD_BIAS = 0.15;
export const LIKELIHOOD_CAP = 0.95;

// Bidding
export const BID_MIN = 0.7;
export const BID_MAX = 1.3;

// Upgrade costs (£k)
export const UPGRADE_COSTS = {
  extra_cabin: 200,
  faster_mobilisation: 300,
  reputation_shield: 250,
  bulk_hire_discount: 150,
};
