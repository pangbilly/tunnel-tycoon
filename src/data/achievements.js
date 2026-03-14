// Achievements for Tunnel Tycoon v2
// Each achievement has a check function (or null if tracked separately by game logic)

const ACHIEVEMENTS = [
  { id: 'first_blood', name: 'First Blood', desc: 'Complete your first project', icon: '\u{1F3AF}', check: (s) => s.players[0].projectsCompleted >= 1 },
  { id: 'fleet_commander', name: 'Fleet Commander', desc: 'Have 5 TBMs active simultaneously', icon: '\u{1F680}', check: (s) => s.players[0].peakSimultaneous >= 5 },
  { id: 'money_machine', name: 'Money Machine', desc: 'Earn \u00A35,000k total revenue', icon: '\u{1F4B0}', check: (s) => s.players[0].totalRevenue >= 5000 },
  { id: 'perfect_ten', name: 'Perfect Ten', desc: 'Complete 10 projects with zero losses', icon: '\u2728', check: (s) => s.players[0].projectsCompleted >= 10 && s.players[0].projectsLost === 0 },
  { id: 'boring_expert', name: 'Boring Expert', desc: 'Complete 25 projects', icon: '\u{1F3D7}\uFE0F', check: (s) => s.players[0].projectsCompleted >= 25 },
  { id: 'penny_pincher', name: 'Penny Pincher', desc: 'Reach week 52 without hiring any TBMs', icon: '\u{1F90F}', check: (s) => s.week >= 52 && s.players[0].totalHireCost === 0 },
  { id: 'big_spender', name: 'Big Spender', desc: 'Spend \u00A3500k on TBM hire', icon: '\u{1F911}', check: (s) => s.players[0].totalHireCost >= 500000 },
  { id: 'five_star', name: 'Five Star General', desc: 'Maintain 5-star reputation for 26 weeks', icon: '\u2B50', check: null },
  { id: 'survivor', name: 'Survivor', desc: 'Recover from 1-star reputation to 3+', icon: '\u{1F525}', check: null },
  { id: 'year_one', name: 'Year One', desc: 'Complete the first year', icon: '\u{1F4C5}', check: (s) => s.week >= 52 },
  { id: 'marathon', name: 'Marathon Runner', desc: 'Complete all 5 years', icon: '\u{1F3C3}', check: (s) => s.week >= 260 },
  { id: 'bid_sniper', name: 'Bid Sniper', desc: 'Win a bid at minimum price (70%)', icon: '\u{1F3AF}', check: null },
  { id: 'monopolist', name: 'Monopolist', desc: 'Win 5 bids in a row', icon: '\u{1F451}', check: null },
  { id: 'underdog', name: 'Underdog', desc: 'Beat all AI competitors in final score', icon: '\u{1F415}', check: null },
  { id: 'mega_project', name: 'Mega Project', desc: 'Complete a project worth \u00A31,000k+', icon: '\u{1F3DB}\uFE0F', check: null },
  { id: 'speed_demon', name: 'Speed Demon', desc: 'Complete 3 projects in a single week', icon: '\u26A1', check: null },
  { id: 'diversified', name: 'Diversified', desc: 'Have all 4 TBM sizes active at once', icon: '\u{1F3A8}', check: null },
  { id: 'iron_man', name: 'Iron Man', desc: 'Complete the game on Hard difficulty', icon: '\u{1F9BE}', check: null },
];

export default ACHIEVEMENTS;
