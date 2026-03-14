// Procedural project generator for Tunnel Tycoon v2
// Generates randomised UK infrastructure tunnelling contracts every playthrough

const PREFIXES = ['North', 'South', 'East', 'West', 'Central', 'Upper', 'Lower', 'Greater', 'New', 'Old'];

const PROJECT_TYPES = [
  'Storm Relief Tunnel', 'Sewer Rehabilitation', 'Water Main Crossing', 'Ring Main Extension',
  'Outfall Tunnel', 'Rising Main', 'Canal Crossing', 'Rail Underpass', 'River Siphon',
  'Power Cable Tunnel', 'Gas Main Crossing', 'District Heating', 'Flood Relief',
  'Transfer Tunnel', 'Collector Sewer', 'Deep Sewer', 'Utility Diversion',
  'Harbour Crossing', 'Sea Outfall', 'Trunk Main',
];

const UK_LOCATIONS = [
  { name: 'Sheffield', lat: 53.38, lng: -1.47 },
  { name: 'Manchester', lat: 53.48, lng: -2.24 },
  { name: 'Birmingham', lat: 52.49, lng: -1.89 },
  { name: 'Leeds', lat: 53.80, lng: -1.55 },
  { name: 'Bristol', lat: 51.45, lng: -2.59 },
  { name: 'Newcastle', lat: 54.97, lng: -1.61 },
  { name: 'Liverpool', lat: 53.41, lng: -2.99 },
  { name: 'Nottingham', lat: 52.95, lng: -1.15 },
  { name: 'Southampton', lat: 50.90, lng: -1.40 },
  { name: 'Portsmouth', lat: 50.80, lng: -1.09 },
  { name: 'Plymouth', lat: 50.37, lng: -4.14 },
  { name: 'Exeter', lat: 50.72, lng: -3.53 },
  { name: 'Norwich', lat: 52.63, lng: 1.30 },
  { name: 'Cambridge', lat: 52.21, lng: 0.12 },
  { name: 'Oxford', lat: 51.75, lng: -1.25 },
  { name: 'Bath', lat: 51.38, lng: -2.36 },
  { name: 'York', lat: 53.96, lng: -1.08 },
  { name: 'Durham', lat: 54.78, lng: -1.57 },
  { name: 'Coventry', lat: 52.41, lng: -1.51 },
  { name: 'Leicester', lat: 52.63, lng: -1.13 },
  { name: 'Stoke', lat: 53.00, lng: -2.18 },
  { name: 'Sunderland', lat: 54.91, lng: -1.38 },
  { name: 'Aberdeen', lat: 57.15, lng: -2.09 },
  { name: 'Edinburgh', lat: 55.95, lng: -3.19 },
  { name: 'Glasgow', lat: 55.86, lng: -4.25 },
  { name: 'Cardiff', lat: 51.48, lng: -3.18 },
  { name: 'Swansea', lat: 51.62, lng: -3.94 },
  { name: 'Brighton', lat: 50.82, lng: -0.14 },
  { name: 'Reading', lat: 51.45, lng: -0.97 },
  { name: 'Milton Keynes', lat: 52.04, lng: -0.76 },
  { name: 'Northampton', lat: 52.24, lng: -0.90 },
  { name: 'Peterborough', lat: 52.57, lng: -0.24 },
  { name: 'Ipswich', lat: 52.06, lng: 1.16 },
  { name: 'Canterbury', lat: 51.28, lng: 1.08 },
  { name: 'Cheltenham', lat: 51.90, lng: -2.07 },
  { name: 'Blackpool', lat: 53.82, lng: -3.05 },
  { name: 'Bolton', lat: 53.58, lng: -2.43 },
  { name: 'Warrington', lat: 53.39, lng: -2.60 },
  { name: 'Central London', lat: 51.51, lng: -0.13 },
  { name: 'East London', lat: 51.54, lng: 0.05 },
  { name: 'South London', lat: 51.45, lng: -0.08 },
  { name: 'West London', lat: 51.51, lng: -0.25 },
  { name: 'North London', lat: 51.57, lng: -0.10 },
];

const GENERIC_CLIENTS = [
  'Anglian Infrastructure', 'Northern Utilities', 'Thames Alliance', 'Severn Water Corp',
  'Pennine Water', 'Meridian Power', 'Crown Highways', 'National Rail Partners',
  'Metro Gas Networks', 'Coastal Utilities', 'Highland Water', 'Valley Infrastructure',
  'Capital Tunnels Ltd', 'Riverside Water', 'Celtic Utilities', 'Midlands Water',
  'South Coast Water', 'Eastern Gas', 'Urban Infrastructure', 'Pacific Drainage',
];

const TUNNEL_LENGTHS = [50, 80, 100, 120, 150, 180, 200, 250, 300, 350, 400, 500, 600, 800, 950, 1200];

const GROUND_CONDITIONS = [
  'through clay', 'under river', 'in sandstone', 'through chalk', 'mixed ground',
  'in alluvium', 'below road', 'under rail', 'through granite', 'in limestone',
];

/**
 * Generate a full set of projects for a game using a seeded RNG.
 * @param {number} seed - Random seed for reproducible generation
 * @returns {Array} Array of project objects sorted by start date
 */
export function generateProjects(seed = Date.now()) {
  // Seeded random number generator (simple LCG)
  let s = seed;
  function rand() {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  }
  function randInt(min, max) {
    return Math.floor(rand() * (max - min + 1)) + min;
  }
  function pick(arr) {
    return arr[Math.floor(rand() * arr.length)];
  }

  const projects = [];
  let id = 1;

  // Generate ~12-18 projects per year for 5 years
  for (let year = 0; year < 5; year++) {
    const projectsThisYear = randInt(12, 18);

    for (let i = 0; i < projectsThisYear; i++) {
      const loc = pick(UK_LOCATIONS);
      const type = pick(PROJECT_TYPES);
      const prefix = rand() > 0.5 ? pick(PREFIXES) + ' ' : '';
      const name = `${prefix}${loc.name} ${type}`;

      // Randomise TBM size with weighted distribution
      const sizeRoll = rand();
      let tbmSize;
      if (sizeRoll < 0.25) tbmSize = 600;
      else if (sizeRoll < 0.55) tbmSize = 1200;
      else if (sizeRoll < 0.80) tbmSize = 1500;
      else tbmSize = 1800;

      // Duration based on TBM size (bigger = generally longer)
      const baseDuration = { 600: [3, 8], 1200: [3, 14], 1500: [6, 18], 1800: [8, 48] };
      const [minD, maxD] = baseDuration[tbmSize];
      const durationWeeks = randInt(minD, maxD);

      // Revenue based on size and duration (£k per week range)
      const baseRevPerWeek = { 600: [12, 20], 1200: [25, 45], 1500: [35, 55], 1800: [50, 80] };
      const [minR, maxR] = baseRevPerWeek[tbmSize];
      const revenue = Math.round(durationWeeks * randInt(minR, maxR));

      // Start date: spread across the year
      // First 3 projects each year start in weeks 0-2 (guaranteed early action)
      const weekOffset = year * 52 + (i < 3 ? i : randInt(3, 48));
      const startDate = new Date(2026, 3, 1);
      startDate.setDate(startDate.getDate() + weekOffset * 7);

      // Likelihood: first 3 of each year are secured (1.0), rest are pipeline
      const likelihood = i < 3 ? 1.0 : Math.round((0.2 + rand() * 0.5) * 100) / 100;

      // Random detail text
      const length = pick(TUNNEL_LENGTHS);
      const detail = `${length}m ${pick(GROUND_CONDITIONS)}`;

      projects.push({
        id: `P${String(id).padStart(3, '0')}`,
        name,
        client: pick(GENERIC_CLIENTS),
        detail,
        tbmSize,
        durationWeeks,
        startDate: startDate.toISOString().split('T')[0],
        likelihood,
        revenue,
        lat: loc.lat + (rand() - 0.5) * 0.1,
        lng: loc.lng + (rand() - 0.5) * 0.1,
        location: loc.name,
      });
      id++;
    }
  }

  // Sort by start date
  projects.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

  return projects;
}

export default generateProjects;
