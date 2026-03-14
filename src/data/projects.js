// Pipeline projects — generic UK infrastructure tunnelling contracts
// Randomised clients, durations, and details

const PROJECTS = [
  // === SECURED (100% likelihood) ===
  { id: 'P001', name: 'Sheffield Industrial Bypass', client: 'South Yorkshire CC', detail: '320m through mudstone', tbmSize: 1800, durationWeeks: 8, startDate: '2026-06-01', likelihood: 1.0, revenue: 520, lat: 53.38, lng: -1.47, location: 'Sheffield' },
  { id: 'P002', name: 'Colchester Outfall', client: 'East Coast Water', detail: '85m sea outfall', tbmSize: 1200, durationWeeks: 3, startDate: '2026-09-15', likelihood: 1.0, revenue: 170, lat: 51.89, lng: 0.90, location: 'Essex' },
  { id: 'P003', name: 'Hillingdon Water Main', client: 'Metro Water', detail: '65m crossing', tbmSize: 1200, durationWeeks: 5, startDate: '2027-01-04', likelihood: 1.0, revenue: 160, lat: 51.54, lng: -0.45, location: 'NW London' },
  { id: 'P004', name: 'Thames Valley Link (A)', client: 'Metro Water', detail: '2.9km multi-drive', tbmSize: 1200, durationWeeks: 28, startDate: '2027-01-04', likelihood: 1.0, revenue: 1180, lat: 51.43, lng: -0.55, location: 'Surrey/Bucks' },
  { id: 'P005', name: 'Thames Valley Link (B)', client: 'Metro Water', detail: '2.9km multi-drive', tbmSize: 1200, durationWeeks: 34, startDate: '2027-01-04', likelihood: 1.0, revenue: 1320, lat: 51.44, lng: -0.52, location: 'Surrey/Bucks' },
  { id: 'P006', name: 'Euston Utility Tunnel', client: 'Rail Partners JV', detail: '200m utility diversion', tbmSize: 1500, durationWeeks: 9, startDate: '2027-11-01', likelihood: 1.0, revenue: 560, lat: 51.53, lng: -0.13, location: 'Central London' },

  // === EARLY PIPELINE (Apr-Aug 2026) ===
  { id: 'P010', name: 'Basingstoke Storm Relief', client: 'Southern Utilities', detail: '150m auger bore', tbmSize: 600, durationWeeks: 7, startDate: '2026-04-01', likelihood: 0.5, revenue: 85, lat: 51.27, lng: -1.09, location: 'Hampshire' },
  { id: 'P011', name: 'Bradford Sewer Rehab', client: 'Northern Utilities', detail: '200m sewer rehabilitation', tbmSize: 600, durationWeeks: 8, startDate: '2026-04-14', likelihood: 0.4, revenue: 90, lat: 53.79, lng: -1.75, location: 'Bradford' },
  { id: 'P012', name: 'Durham Water Link', client: 'North East Water', detail: '120m water main', tbmSize: 1200, durationWeeks: 4, startDate: '2026-04-21', likelihood: 0.3, revenue: 130, lat: 54.78, lng: -1.57, location: 'Durham' },
  { id: 'P013', name: 'Uxbridge Crossing', client: 'Network Alliance', detail: '250m rail crossing', tbmSize: 1200, durationWeeks: 6, startDate: '2026-05-18', likelihood: 0.2, revenue: 230, lat: 51.55, lng: -0.48, location: 'NW London' },
  { id: 'P014', name: 'Warrington Storm Overflow', client: 'North West Water', detail: '180m storm overflow', tbmSize: 1200, durationWeeks: 5, startDate: '2026-05-25', likelihood: 0.5, revenue: 175, lat: 53.39, lng: -2.60, location: 'Warrington' },
  { id: 'P015', name: 'West Midlands Trunk', client: 'Midlands Water', detail: '100m trunk sewer', tbmSize: 600, durationWeeks: 4, startDate: '2026-06-29', likelihood: 0.5, revenue: 100, lat: 52.48, lng: -1.90, location: 'Birmingham' },
  { id: 'P016', name: 'Exeter Storm Tunnel', client: 'South West Utilities', detail: '90m storm tunnel', tbmSize: 600, durationWeeks: 6, startDate: '2026-06-15', likelihood: 0.4, revenue: 75, lat: 50.72, lng: -3.53, location: 'Exeter' },
  { id: 'P017', name: 'Richmond River Siphon', client: 'Southern Utilities', detail: '300m river crossing', tbmSize: 1500, durationWeeks: 10, startDate: '2026-07-06', likelihood: 0.3, revenue: 340, lat: 51.46, lng: -0.30, location: 'SW London' },
  { id: 'P018', name: 'Gateshead Gas Main', client: 'Northern Gas', detail: '150m gas main crossing', tbmSize: 1200, durationWeeks: 7, startDate: '2026-07-20', likelihood: 0.4, revenue: 180, lat: 54.96, lng: -1.60, location: 'Gateshead' },
  { id: 'P019', name: 'Cambridge Ring Main', client: 'East Water', detail: '200m ring main', tbmSize: 1200, durationWeeks: 5, startDate: '2026-08-03', likelihood: 0.3, revenue: 200, lat: 52.21, lng: 0.12, location: 'Cambridge' },
  { id: 'P020', name: 'Slough Rising Main', client: 'Southern Utilities', detail: '250m rising main', tbmSize: 1500, durationWeeks: 8, startDate: '2026-08-17', likelihood: 0.5, revenue: 310, lat: 51.51, lng: -0.59, location: 'Slough' },

  // === MID PIPELINE (Sep 2026 - Mar 2027) ===
  { id: 'P030', name: 'Dartford Tunnel Crossing', client: 'National Infrastructure', detail: '144m steel gas pipe', tbmSize: 1500, durationWeeks: 6, startDate: '2026-10-16', likelihood: 0.5, revenue: 300, lat: 51.45, lng: 0.35, location: 'Kent/Essex' },
  { id: 'P031', name: 'Northampton Canal Crossing', client: 'Canal Alliance', detail: '151m under canal', tbmSize: 1200, durationWeeks: 3, startDate: '2026-11-02', likelihood: 0.5, revenue: 150, lat: 52.24, lng: -1.05, location: 'Northamptonshire' },
  { id: 'P032', name: 'Greenwich Power Tunnel', client: 'London Power', detail: '150m power cable tunnel', tbmSize: 1200, durationWeeks: 5, startDate: '2026-11-16', likelihood: 0.5, revenue: 190, lat: 51.48, lng: 0.01, location: 'SE London' },
  { id: 'P033', name: 'Coventry Collector Sewer', client: 'Midlands Water', detail: '400m collector sewer', tbmSize: 1200, durationWeeks: 12, startDate: '2026-09-28', likelihood: 0.4, revenue: 340, lat: 52.41, lng: -1.51, location: 'Coventry' },
  { id: 'P034', name: 'Norwich Trunk Main', client: 'East Water', detail: '180m trunk main', tbmSize: 1200, durationWeeks: 4, startDate: '2026-10-05', likelihood: 0.3, revenue: 145, lat: 52.63, lng: 1.30, location: 'Norwich' },
  { id: 'P035', name: 'Leeds Combined Sewer', client: 'Northern Utilities', detail: '120m combined sewer', tbmSize: 600, durationWeeks: 5, startDate: '2026-11-09', likelihood: 0.5, revenue: 90, lat: 53.80, lng: -1.55, location: 'Leeds' },
  { id: 'P036', name: 'Manchester Ring Main', client: 'North West Water', detail: '500m ring main', tbmSize: 1500, durationWeeks: 14, startDate: '2026-12-07', likelihood: 0.3, revenue: 460, lat: 53.48, lng: -2.24, location: 'Manchester' },
  { id: 'P037', name: 'Dartford Crossing Phase 2', client: 'National Infrastructure', detail: '152m HDPE water', tbmSize: 1200, durationWeeks: 4, startDate: '2027-01-11', likelihood: 0.5, revenue: 165, lat: 51.46, lng: 0.32, location: 'Kent/Essex' },
  { id: 'P038', name: 'Dartford Major Works', client: 'Highways JV', detail: 'Long-term tunnel package', tbmSize: 1200, durationWeeks: 38, startDate: '2027-01-11', likelihood: 0.5, revenue: 1380, lat: 51.44, lng: 0.38, location: 'Kent/Essex' },
  { id: 'P039', name: 'Barking Twin Tunnel', client: 'Southern Utilities', detail: '950m twin 1.5m dia', tbmSize: 1500, durationWeeks: 18, startDate: '2027-01-18', likelihood: 0.5, revenue: 620, lat: 51.54, lng: 0.09, location: 'East London' },
  { id: 'P040', name: 'Plymouth Sea Outfall', client: 'South West Utilities', detail: '350m sea outfall', tbmSize: 1800, durationWeeks: 10, startDate: '2027-01-25', likelihood: 0.2, revenue: 560, lat: 50.37, lng: -4.14, location: 'Plymouth' },

  // === LATE 2027 ===
  { id: 'P050', name: 'Dartford Crossing Phase 3', client: 'National Infrastructure', detail: '181m steel gas', tbmSize: 1200, durationWeeks: 5, startDate: '2027-02-08', likelihood: 0.5, revenue: 185, lat: 51.45, lng: 0.35, location: 'Kent/Essex' },
  { id: 'P051', name: 'Exeter District Heating', client: 'Devon Energy', detail: '950m heat network', tbmSize: 1800, durationWeeks: 11, startDate: '2027-02-15', likelihood: 0.2, revenue: 680, lat: 50.72, lng: -3.53, location: 'Devon' },
  { id: 'P052', name: 'River Allen Crossing', client: 'Northern Gas', detail: '100-250m crossing', tbmSize: 1200, durationWeeks: 6, startDate: '2027-02-15', likelihood: 0.5, revenue: 210, lat: 54.85, lng: -1.84, location: 'NE England' },
  { id: 'P053', name: 'Bedford Rail Underpass', client: 'Rail Partners JV', detail: '4×100m drives', tbmSize: 1200, durationWeeks: 13, startDate: '2027-02-15', likelihood: 0.2, revenue: 370, lat: 52.13, lng: -0.47, location: 'East England' },
  { id: 'P054', name: 'Dartford Phase 4', client: 'National Infrastructure', detail: '110m HDPE water', tbmSize: 600, durationWeeks: 4, startDate: '2027-03-08', likelihood: 0.5, revenue: 95, lat: 51.45, lng: 0.35, location: 'Kent/Essex' },
  { id: 'P055', name: 'Bristol Feeder Tunnel', client: 'Western Water', detail: '180m feeder tunnel', tbmSize: 1200, durationWeeks: 8, startDate: '2027-03-15', likelihood: 0.4, revenue: 220, lat: 51.45, lng: -2.59, location: 'Bristol' },
  { id: 'P056', name: 'Peterborough Trunk Link', client: 'East Water', detail: '220m trunk main', tbmSize: 1200, durationWeeks: 5, startDate: '2027-03-22', likelihood: 0.3, revenue: 215, lat: 52.57, lng: -0.24, location: 'Peterborough' },
  { id: 'P057', name: 'Cambridgeshire Transfer', client: 'Strategic Water', detail: '500m 1.8m dia transfer', tbmSize: 1800, durationWeeks: 15, startDate: '2027-04-01', likelihood: 0.5, revenue: 800, lat: 52.33, lng: -0.22, location: 'Cambridgeshire' },
  { id: 'P058', name: 'Thameside Mega Tunnel Ph1', client: 'City Infrastructure', detail: '25km Phase 1', tbmSize: 1800, durationWeeks: 48, startDate: '2027-04-05', likelihood: 0.5, revenue: 3400, lat: 51.50, lng: 0.07, location: 'SE London' },
  { id: 'P059', name: 'Beckton Relief Sewer', client: 'Southern Utilities', detail: '600m relief sewer', tbmSize: 1500, durationWeeks: 16, startDate: '2027-04-14', likelihood: 0.3, revenue: 510, lat: 51.51, lng: 0.07, location: 'East London' },
  { id: 'P060', name: 'Tyneside Water Transfer', client: 'North East Water', detail: '300m water transfer', tbmSize: 1200, durationWeeks: 6, startDate: '2027-05-05', likelihood: 0.4, revenue: 230, lat: 54.97, lng: -1.61, location: 'Newcastle' },
  { id: 'P061', name: 'Hertford Water Scheme', client: 'Southern Utilities', detail: 'Multi-drive scheme', tbmSize: 1200, durationWeeks: 22, startDate: '2027-06-01', likelihood: 0.5, revenue: 540, lat: 51.76, lng: -0.01, location: 'Hertfordshire' },
  { id: 'P062', name: 'Nottingham Trunk Sewer', client: 'Midlands Water', detail: '350m trunk sewer', tbmSize: 1200, durationWeeks: 7, startDate: '2027-06-16', likelihood: 0.3, revenue: 260, lat: 52.95, lng: -1.15, location: 'Nottingham' },
  { id: 'P063', name: 'Paddington Utility Diversion', client: 'Property Alliance', detail: '400m utility tunnel', tbmSize: 1500, durationWeeks: 9, startDate: '2027-08-02', likelihood: 0.2, revenue: 380, lat: 51.52, lng: -0.21, location: 'West London' },
  { id: 'P064', name: 'Bedford Rail Phase 2', client: 'Rail Partners JV', detail: '2×150m drives', tbmSize: 1200, durationWeeks: 11, startDate: '2027-08-02', likelihood: 0.2, revenue: 310, lat: 52.13, lng: -0.47, location: 'East England' },
  { id: 'P065', name: 'Sheffield Storm Tunnel', client: 'Northern Utilities', detail: '200m storm tunnel', tbmSize: 1500, durationWeeks: 8, startDate: '2027-08-23', likelihood: 0.4, revenue: 280, lat: 53.38, lng: -1.47, location: 'Sheffield' },
  { id: 'P066', name: 'Liverpool Dock Crossing', client: 'North West Water', detail: '250m dock crossing', tbmSize: 1800, durationWeeks: 9, startDate: '2027-09-06', likelihood: 0.2, revenue: 510, lat: 53.41, lng: -2.99, location: 'Liverpool' },
  { id: 'P067', name: 'Uxbridge Trunk Main', client: 'Metro Water', detail: '150m trunk main', tbmSize: 1200, durationWeeks: 4, startDate: '2027-09-20', likelihood: 0.5, revenue: 155, lat: 51.55, lng: -0.44, location: 'NW London' },
  { id: 'P068', name: 'Torbay Sea Outfall', client: 'South West Utilities', detail: '400m sea outfall', tbmSize: 1500, durationWeeks: 12, startDate: '2027-10-11', likelihood: 0.2, revenue: 410, lat: 50.46, lng: -3.53, location: 'Torbay' },
  { id: 'P069', name: 'Ipswich Rising Main', client: 'East Water', detail: '180m rising main', tbmSize: 1200, durationWeeks: 4, startDate: '2027-10-25', likelihood: 0.4, revenue: 150, lat: 52.06, lng: 1.16, location: 'Ipswich' },

  // === 2028+ ===
  { id: 'P070', name: 'Aberdeen Harbour Tunnel', client: 'Scottish Infrastructure', detail: '350m harbour crossing', tbmSize: 1800, durationWeeks: 6, startDate: '2028-01-03', likelihood: 0.2, revenue: 450, lat: 57.15, lng: -2.09, location: 'Aberdeen' },
  { id: 'P071', name: 'Bath Ring Main', client: 'Western Water', detail: '300m ring main', tbmSize: 1200, durationWeeks: 9, startDate: '2028-02-07', likelihood: 0.3, revenue: 270, lat: 51.38, lng: -2.36, location: 'Bath' },
  { id: 'P072', name: 'Newbury Trunk Tunnel', client: 'Southern Utilities', detail: '2.5km trunk tunnel', tbmSize: 1800, durationWeeks: 40, startDate: '2028-03-01', likelihood: 0.2, revenue: 1700, lat: 51.40, lng: -1.32, location: 'Newbury' },
  { id: 'P073', name: 'Grafham Water Transfer', client: 'Strategic Water', detail: '1350m transfer tunnel', tbmSize: 1800, durationWeeks: 20, startDate: '2028-04-03', likelihood: 0.2, revenue: 1000, lat: 52.30, lng: -0.32, location: 'Cambridgeshire' },
  { id: 'P074', name: 'East London Power Tunnel', client: 'London Power', detail: '125m × 2.1m dia', tbmSize: 1800, durationWeeks: 7, startDate: '2028-05-22', likelihood: 0.5, revenue: 400, lat: 51.57, lng: -0.03, location: 'London' },
  { id: 'P075', name: 'Pennine Transfer Tunnel', client: 'North West Water', detail: '800m transfer tunnel', tbmSize: 1800, durationWeeks: 18, startDate: '2028-06-12', likelihood: 0.2, revenue: 1150, lat: 53.63, lng: -1.80, location: 'West Yorkshire' },
  { id: 'P076', name: 'Birmingham Ring Main', client: 'Midlands Water', detail: '600m ring main', tbmSize: 1500, durationWeeks: 12, startDate: '2028-07-03', likelihood: 0.3, revenue: 490, lat: 52.49, lng: -1.89, location: 'Birmingham' },
  { id: 'P077', name: 'Lee Valley Transfer', client: 'Southern Utilities', detail: '1200m transfer', tbmSize: 1200, durationWeeks: 26, startDate: '2028-08-14', likelihood: 0.4, revenue: 810, lat: 51.62, lng: -0.04, location: 'N London' },
  { id: 'P078', name: 'Teddington Deep Sewer', client: 'Southern Utilities', detail: '250m × 1800mm', tbmSize: 1800, durationWeeks: 42, startDate: '2029-04-16', likelihood: 0.5, revenue: 2000, lat: 51.42, lng: -0.33, location: 'London' },
  { id: 'P079', name: 'Thameside Mega Tunnel Ph2', client: 'City Infrastructure', detail: '25km Phase 2', tbmSize: 1800, durationWeeks: 115, startDate: '2029-06-04', likelihood: 0.5, revenue: 5200, lat: 51.50, lng: 0.07, location: 'SE London' },
  { id: 'P080', name: 'HS2 Northern Utility', client: 'Rail Partners JV', detail: '400m utility diversions', tbmSize: 1200, durationWeeks: 14, startDate: '2029-01-08', likelihood: 0.2, revenue: 480, lat: 52.48, lng: -1.89, location: 'Birmingham' },
  { id: 'P081', name: 'Fenland Drainage Scheme', client: 'East Water', detail: '500m land drainage', tbmSize: 1200, durationWeeks: 11, startDate: '2029-03-03', likelihood: 0.3, revenue: 350, lat: 52.67, lng: 0.16, location: 'Fenland' },
  { id: 'P082', name: 'Hull Flood Barrier', client: 'Northern Utilities', detail: '350m flood barrier', tbmSize: 1500, durationWeeks: 13, startDate: '2029-07-14', likelihood: 0.2, revenue: 450, lat: 53.74, lng: -0.33, location: 'Hull' },
  { id: 'P083', name: 'Sunderland Link Main', client: 'North East Water', detail: '200m link main', tbmSize: 1200, durationWeeks: 5, startDate: '2029-09-02', likelihood: 0.4, revenue: 175, lat: 54.91, lng: -1.38, location: 'Sunderland' },
  { id: 'P084', name: 'Chelsea Embankment Sewer', client: 'Southern Utilities', detail: '800m embankment sewer', tbmSize: 1800, durationWeeks: 22, startDate: '2030-01-07', likelihood: 0.2, revenue: 1450, lat: 51.48, lng: -0.17, location: 'Central London' },
  { id: 'P085', name: 'Bolton Collector Sewer', client: 'North West Water', detail: '300m collector', tbmSize: 1200, durationWeeks: 6, startDate: '2030-03-11', likelihood: 0.3, revenue: 240, lat: 53.58, lng: -2.43, location: 'Bolton' },
];

export default PROJECTS;
