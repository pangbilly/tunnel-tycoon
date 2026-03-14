// TBM size colours
export const TBM_COLORS = {
  600: '#10b981',   // green
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
  600: 11500,
  1200: 19500,
  1500: 23000,
  1800: 27000,
};

// Hire duration options (weeks)
export const HIRE_DURATIONS = [4, 8, 12];

// Starting fleet — randomised generic names
export const STARTING_FLEET = [
  { id: 'TBM-600-01', size: 600, name: '600 Herrenknecht AVN', yard: 'Northern Depot' },
  { id: 'TBM-600-02', size: 600, name: '600 Robbins MT', yard: 'Northern Depot' },
  { id: 'TBM-600-03', size: 600, name: '600 NFM Compact', yard: 'Southern Depot' },
  { id: 'TBM-1200-01', size: 1200, name: '1200 Herrenknecht #1', yard: 'Northern Depot' },
  { id: 'TBM-1200-02', size: 1200, name: '1200 Herrenknecht #2', yard: 'Southern Depot' },
  { id: 'TBM-1200-03', size: 1200, name: '1200 Robbins', yard: 'Southern Depot' },
  { id: 'TBM-1500-01', size: 1500, name: '1500 Herrenknecht', yard: 'Northern Depot' },
  { id: 'TBM-1800-01', size: 1800, name: '1800 Herrenknecht', yard: 'Southern Depot' },
  { id: 'TBM-1800-02', size: 1800, name: '1800 Robbins EPB', yard: 'Northern Depot' },
];

export const TOTAL_CABINS = 7;

// Depot locations
export const YARDS = [
  { id: 'Northern Depot', name: 'Northern Depot (Doncaster)', lat: 53.52, lng: -1.13 },
  { id: 'Southern Depot', name: 'Southern Depot (Reading)', lat: 51.45, lng: -0.97 },
];

// Game timing
export const GAME_START_WEEK = 0; // Week 0 = first week of Apr 2026
export const GAME_START_DATE = new Date(2026, 3, 1); // Apr 1 2026
export const GAME_END_WEEK = 260; // ~5 years
export const MOBILISATION_WEEKS = 1;
export const URGENCY_DEADLINE_WEEKS = 3; // lose contract after 3 weeks unresourced

// Speed settings (ms per game week)
export const SPEED_SETTINGS = {
  0: null,     // paused
  1: 4000,     // 1x — 4 seconds per week
  2: 2000,     // 2x
  4: 1000,     // 4x
};

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
export const LIKELIHOOD_BIAS = 0.2;
export const LIKELIHOOD_CAP = 0.95;
