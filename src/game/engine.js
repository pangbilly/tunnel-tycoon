import { generateProjects } from '../data/projects';
import AI_COMPETITORS from '../data/competitors';
import RANDOM_EVENTS from '../data/events';
import ACHIEVEMENTS from '../data/achievements';
import {
  GAME_START_DATE, GAME_END_WEEK, WEEKS_PER_YEAR,
  MOBILISATION_WEEKS, URGENCY_DEADLINE_WEEKS,
  STARTING_FLEET, TOTAL_CABINS, HIRE_RATES,
  STARTING_REPUTATION, REP_LOSS_CONTRACT_LOST,
  REP_GAIN_EARLY_COMPLETE, LIKELIHOOD_BIAS, LIKELIHOOD_CAP,
  BID_MIN, BID_MAX,
} from '../data/constants';

// ---------------------------------------------------------------------------
// Utility functions
// ---------------------------------------------------------------------------

export function dateToWeek(dateStr) {
  const d = new Date(dateStr);
  const diff = d - GAME_START_DATE;
  return Math.floor(diff / (7 * 24 * 60 * 60 * 1000));
}

export function weekToDate(week) {
  const d = new Date(GAME_START_DATE);
  d.setDate(d.getDate() + week * 7);
  return d;
}

export function formatDate(date) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[date.getMonth()]} ${date.getFullYear()}`;
}

export function formatWeek(week) {
  return formatDate(weekToDate(week));
}

export function likelihoodRoll(likelihood) {
  const adjustedChance = Math.min(likelihood + LIKELIHOOD_BIAS, LIKELIHOOD_CAP);
  return Math.random() < adjustedChance;
}

export function seededRandom(seed) {
  let s = seed;
  return function rand() {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

// ---------------------------------------------------------------------------
// Build AI fleet from competitor data
// ---------------------------------------------------------------------------

function buildAIPlayer(comp) {
  const pref = comp.fleetPreference; // { 600: N, 1200: N, ... }
  const fleet = [];
  let idx = 1;
  for (const [sizeStr, count] of Object.entries(pref)) {
    const size = Number(sizeStr);
    for (let i = 0; i < count; i++) {
      fleet.push({
        id: `${comp.id}-${size}-${String(idx).padStart(2, '0')}`,
        size,
        name: `${comp.name.split(' ')[0]}-${size}-${idx}`,
        yard: idx % 2 === 0 ? 'Southern Depot' : 'Northern Depot',
        status: 'available',
        assignedProject: null,
        transitWeeksLeft: 0,
        hired: false,
      });
      idx++;
    }
  }

  return {
    id: comp.id,
    name: comp.name,
    color: comp.color,
    fleet,
    cabinsTotal: comp.cabins,
    cabinsInUse: 0,
    cash: 500,
    totalRevenue: 0,
    totalHireCost: 0,
    totalEventCost: 0,
    reputation: STARTING_REPUTATION,
    projectsCompleted: 0,
    projectsLost: 0,
    projectsWon: 0,
    peakSimultaneous: 0,
    isAI: true,
    personality: comp.personality,
    bidStyle: comp.bidStyle,
    skipChance: comp.skipChance || 0.15,
    catchphrases: comp.catchphrases || [],
    consecutiveBidsWon: 0,
    fiveStarWeeks: 0,
    lowestRepReached: 5,
    completionsThisTurn: 0,
  };
}

// ---------------------------------------------------------------------------
// Initial state
// ---------------------------------------------------------------------------

export function createInitialState() {
  const fleet = STARTING_FLEET.map(tbm => ({
    ...tbm,
    status: 'available',
    assignedProject: null,
    transitWeeksLeft: 0,
    hired: false,
  }));

  return {
    phase: 'title', // title | playing | bidding | event | yearEnd | gameOver
    week: 0,
    gameSeed: Date.now(),
    players: [
      {
        id: 'player',
        name: 'Your Company',
        color: '#f97316',
        fleet,
        cabinsTotal: TOTAL_CABINS,
        cabinsInUse: 0,
        cash: 500,
        totalRevenue: 0,
        totalHireCost: 0,
        totalEventCost: 0,
        reputation: STARTING_REPUTATION,
        projectsCompleted: 0,
        projectsLost: 0,
        projectsWon: 0,
        peakSimultaneous: 0,
        isAI: false,
        consecutiveBidsWon: 0,
        fiveStarWeeks: 0,
        lowestRepReached: 5,
        completionsThisTurn: 0,
      },
    ],
    pipeline: [],
    activeProjects: [],
    completedProjects: [],
    lostProjects: [],
    // Bidding
    pendingBids: [],
    currentBidProject: null,
    playerBidAmount: null,
    // Events
    currentEvent: null,
    eventCooldown: 0,
    // Notifications
    notifications: [],
    selectedProject: null,
    selectedTbm: null,
    hireModalOpen: false,
    achievementsOpen: false,
    competitorPanelOpen: false,
    tutorialStep: 0,
    showTutorial: true,
    difficulty: 'normal',
    mobileTab: 'map',
    achievements: [],
    yearEndStats: null,
    // Upgrades
    upgrades: [],
    // Tracking
    allTimeBidsWon: 0,
    weeksSinceFiveStar: 0,
  };
}

// ---------------------------------------------------------------------------
// Achievement checking
// ---------------------------------------------------------------------------

function checkAchievements(state) {
  const newAchievements = [...state.achievements];
  let changed = false;

  for (const ach of ACHIEVEMENTS) {
    if (newAchievements.includes(ach.id)) continue;

    let earned = false;

    // Achievements with a check function
    if (ach.check) {
      earned = ach.check(state);
    } else {
      // Achievements tracked by special logic
      const player = state.players[0];
      switch (ach.id) {
        case 'five_star':
          earned = player.fiveStarWeeks >= 26;
          break;
        case 'survivor':
          earned = player.lowestRepReached <= 1 && player.reputation >= 3;
          break;
        case 'bid_sniper':
          // tracked at bid resolution time
          break;
        case 'monopolist':
          earned = player.consecutiveBidsWon >= 5;
          break;
        case 'underdog':
          // checked at game over
          if (state.phase === 'gameOver' && state.players.length > 1) {
            const playerScore = player.totalRevenue;
            const allBeat = state.players.slice(1).every(ai => playerScore > ai.totalRevenue);
            earned = allBeat;
          }
          break;
        case 'mega_project':
          earned = state.completedProjects.some(
            p => p.completedBy === 'player' && (p.actualRevenue || p.revenue) >= 1000
          );
          break;
        case 'speed_demon':
          earned = player.completionsThisTurn >= 3;
          break;
        case 'diversified': {
          const activeSizes = new Set();
          for (const t of player.fleet) {
            if (t.status === 'on_site' || t.status === 'in_transit') {
              activeSizes.add(t.size);
            }
          }
          earned = activeSizes.size >= 4;
          break;
        }
        case 'iron_man':
          earned = state.phase === 'gameOver' && state.difficulty === 'hard' && state.week >= GAME_END_WEEK;
          break;
        default:
          break;
      }
    }

    if (earned) {
      newAchievements.push(ach.id);
      changed = true;
    }
  }

  return changed ? newAchievements : state.achievements;
}

// ---------------------------------------------------------------------------
// Bidding helpers
// ---------------------------------------------------------------------------

function generateAIBid(aiPlayer, project) {
  // Skip if AI doesn't have a TBM that can serve this project
  const hasMatchingTbm = aiPlayer.fleet.some(
    t => t.size === project.tbmSize && (t.status === 'available' || t.status === 'returning')
  );
  const hasCabin = aiPlayer.cabinsInUse < aiPlayer.cabinsTotal;

  if (!hasMatchingTbm || !hasCabin) return null;

  // Random skip based on personality
  if (Math.random() < (aiPlayer.skipChance || 0.15)) return null;

  const { min, max } = aiPlayer.bidStyle;
  const bidMultiplier = min + Math.random() * (max - min);
  const bidAmount = Math.round(project.revenue * bidMultiplier);

  return {
    playerId: aiPlayer.id,
    amount: bidAmount,
  };
}

function resolveBid(state, playerBid) {
  const project = state.currentBidProject;
  if (!project) return state;

  let players = state.players.map(p => ({ ...p, fleet: p.fleet.map(t => ({ ...t })) }));
  let activeProjects = state.activeProjects.map(p => ({ ...p }));
  let notifications = [...state.notifications];
  let achievements = [...state.achievements];

  // Gather all bids
  const allBids = [];

  // Player bid
  if (playerBid !== null && playerBid !== undefined) {
    allBids.push({ playerId: 'player', amount: playerBid });
  }

  // AI bids
  for (let i = 1; i < players.length; i++) {
    const aiBid = generateAIBid(players[i], project);
    if (aiBid) allBids.push(aiBid);
  }

  if (allBids.length === 0) {
    // Nobody bid - project goes uncontested, disappears
    notifications.push({
      message: `No bids on ${project.name} - tender expired`,
      type: 'info',
      week: state.week,
    });

    return advanceToNextBidOrPhase({
      ...state,
      players,
      activeProjects,
      notifications,
      achievements,
    });
  }

  // Sort by bid amount ascending (lowest wins). Ties broken by reputation.
  allBids.sort((a, b) => {
    if (a.amount !== b.amount) return a.amount - b.amount;
    const repA = players.find(p => p.id === a.playerId)?.reputation || 0;
    const repB = players.find(p => p.id === b.playerId)?.reputation || 0;
    return repB - repA; // higher rep wins tie
  });

  const winner = allBids[0];
  const winnerPlayer = players.find(p => p.id === winner.playerId);

  // Create the active project assigned to the winner
  const newProject = {
    ...project,
    status: 'waiting',
    assignedTo: winner.playerId,
    assignedTbm: null,
    urgencyWeeks: 0,
    weeksRemaining: project.durationWeeks,
    actualRevenue: winner.amount,
    bids: allBids,
  };

  activeProjects.push(newProject);
  winnerPlayer.projectsWon = (winnerPlayer.projectsWon || 0) + 1;

  if (winner.playerId === 'player') {
    winnerPlayer.consecutiveBidsWon = (winnerPlayer.consecutiveBidsWon || 0) + 1;

    notifications.push({
      message: `Won bid: ${project.name} at ${winner.amount}k (${allBids.length} bidder${allBids.length > 1 ? 's' : ''})`,
      type: 'success',
      week: state.week,
    });

    // Check bid_sniper achievement (won at minimum ~70% of base revenue)
    if (winner.amount <= Math.round(project.revenue * BID_MIN * 1.02)) {
      if (!achievements.includes('bid_sniper')) {
        achievements.push('bid_sniper');
      }
    }
  } else {
    // Player lost or didn't bid - reset consecutive
    if (playerBid !== null && playerBid !== undefined) {
      players[0].consecutiveBidsWon = 0;
    }

    notifications.push({
      message: `${winnerPlayer.name} won ${project.name} at ${winner.amount}k`,
      type: 'info',
      week: state.week,
    });
  }

  // Check monopolist
  if (players[0].consecutiveBidsWon >= 5 && !achievements.includes('monopolist')) {
    achievements.push('monopolist');
  }

  return advanceToNextBidOrPhase({
    ...state,
    players,
    activeProjects,
    notifications,
    achievements,
    allTimeBidsWon: winner.playerId === 'player'
      ? (state.allTimeBidsWon || 0) + 1
      : (state.allTimeBidsWon || 0),
  });
}

function advanceToNextBidOrPhase(state) {
  const remaining = state.pendingBids.filter(p => p.id !== state.currentBidProject?.id);

  if (remaining.length > 0) {
    return {
      ...state,
      pendingBids: remaining,
      currentBidProject: remaining[0],
      playerBidAmount: null,
      phase: 'bidding',
    };
  }

  // No more bids - check for event or year end
  if (state.currentEvent) {
    return {
      ...state,
      pendingBids: [],
      currentBidProject: null,
      playerBidAmount: null,
      phase: 'event',
    };
  }

  if (state.yearEndStats) {
    return {
      ...state,
      pendingBids: [],
      currentBidProject: null,
      playerBidAmount: null,
      phase: 'yearEnd',
    };
  }

  if (state.players[0].reputation <= 0 || state.week >= GAME_END_WEEK) {
    return {
      ...state,
      pendingBids: [],
      currentBidProject: null,
      playerBidAmount: null,
      phase: 'gameOver',
    };
  }

  return {
    ...state,
    pendingBids: [],
    currentBidProject: null,
    playerBidAmount: null,
    phase: 'playing',
  };
}

// ---------------------------------------------------------------------------
// Event resolution
// ---------------------------------------------------------------------------

function applyEventEffect(state, effect) {
  let players = state.players.map(p => ({ ...p, fleet: p.fleet.map(t => ({ ...t })) }));
  let activeProjects = state.activeProjects.map(p => ({ ...p }));
  let notifications = [...state.notifications];
  const player = players[0];

  switch (effect.type) {
    case 'SPEND_CASH': {
      player.cash -= effect.amount;
      player.totalEventCost = (player.totalEventCost || 0) + effect.amount;

      // Optional delay from rush repair etc
      if (effect.delayWeeks) {
        const playerActiveProjects = activeProjects.filter(
          p => p.assignedTo === 'player' && p.status === 'active'
        );
        if (playerActiveProjects.length > 0) {
          const target = playerActiveProjects[Math.floor(Math.random() * playerActiveProjects.length)];
          target.weeksRemaining += effect.delayWeeks;
          notifications.push({
            message: `${target.name} delayed by ${effect.delayWeeks} week(s)`,
            type: 'warning',
            week: state.week,
          });
        }
      }

      if (effect.repBoost) {
        player.reputation = Math.min(5, player.reputation + effect.repBoost);
        notifications.push({
          message: `Reputation +${effect.repBoost}`,
          type: 'success',
          week: state.week,
        });
      }
      break;
    }

    case 'DELAY_RANDOM_PROJECT': {
      const candidates = activeProjects.filter(
        p => p.assignedTo === 'player' && p.status === 'active'
      );
      if (candidates.length > 0) {
        const target = candidates[Math.floor(Math.random() * candidates.length)];
        target.weeksRemaining += effect.weeks;
        notifications.push({
          message: `${target.name} delayed by ${effect.weeks} week(s)`,
          type: 'warning',
          week: state.week,
        });
      }
      if (effect.repBoost) {
        player.reputation = Math.min(5, player.reputation + effect.repBoost);
      }
      break;
    }

    case 'DELAY_ALL_PROJECTS': {
      const affected = activeProjects.filter(
        p => p.assignedTo === 'player' && p.status === 'active'
      );
      for (const p of affected) {
        p.weeksRemaining += effect.weeks;
      }
      if (affected.length > 0) {
        notifications.push({
          message: `All active projects delayed by ${effect.weeks} week(s)`,
          type: 'warning',
          week: state.week,
        });
      }
      break;
    }

    case 'BONUS_CASH': {
      player.cash += effect.amount;
      notifications.push({
        message: `Bonus: +${effect.amount}k`,
        type: 'success',
        week: state.week,
      });
      break;
    }

    case 'REP_CHANGE': {
      let applyChange = true;
      if (effect.chance !== undefined) {
        applyChange = Math.random() < effect.chance;
      }
      if (applyChange) {
        player.reputation = Math.max(0, Math.min(5, player.reputation + effect.amount));
        const sign = effect.amount >= 0 ? '+' : '';
        notifications.push({
          message: `Reputation ${sign}${effect.amount}`,
          type: effect.amount >= 0 ? 'success' : 'warning',
          week: state.week,
        });
      } else {
        notifications.push({
          message: 'Got away with it... this time',
          type: 'info',
          week: state.week,
        });
      }
      break;
    }

    case 'SPEED_BOOST': {
      // Reduce weeksRemaining on a random active project
      const boostCandidates = activeProjects.filter(
        p => p.assignedTo === 'player' && p.status === 'active' && p.weeksRemaining > 1
      );
      if (boostCandidates.length > 0) {
        const target = boostCandidates[Math.floor(Math.random() * boostCandidates.length)];
        const reduction = Math.min(effect.weeks || 1, target.weeksRemaining - 1);
        target.weeksRemaining -= reduction;
        notifications.push({
          message: `${target.name} sped up by ${reduction} week(s)!`,
          type: 'success',
          week: state.week,
        });
      }
      break;
    }

    case 'MOBILISATION_PENALTY': {
      // Already handled implicitly by the event text; no persistent state needed in v2
      notifications.push({
        message: `Mobilisation slowed for ${effect.duration || 4} weeks`,
        type: 'warning',
        week: state.week,
      });
      break;
    }

    case 'NONE':
    default:
      break;
  }

  // Apply tempBonus if present (informational only in v2)
  if (effect.tempBonus) {
    notifications.push({
      message: `Temporary bonus: ${effect.tempBonus}`,
      type: 'info',
      week: state.week,
    });
  }

  players[0] = player;

  return {
    ...state,
    players,
    activeProjects,
    notifications,
  };
}

// ---------------------------------------------------------------------------
// Main tick processing
// ---------------------------------------------------------------------------

function processTick(state) {
  let players = state.players.map(p => ({
    ...p,
    fleet: p.fleet.map(t => ({ ...t })),
    completionsThisTurn: 0,
  }));
  let activeProjects = state.activeProjects.map(p => ({ ...p }));
  let completedProjects = [...state.completedProjects];
  let lostProjects = [...state.lostProjects];
  let pipeline = state.pipeline.map(p => ({ ...p }));
  let notifications = [];
  let pendingBids = [];
  let achievements = [...state.achievements];
  const week = state.week + 1;
  let eventCooldown = Math.max(0, state.eventCooldown - 1);

  // -----------------------------------------------------------------------
  // 1. Spawn new projects from pipeline into pending bids
  // -----------------------------------------------------------------------
  for (const proj of pipeline) {
    if (proj.spawned) continue;
    if (proj.spawnWeek > week) continue;

    // Expired pipeline entries (more than 2 weeks past spawn)
    if (proj.spawnWeek < week - 2) {
      proj.spawned = true;
      continue;
    }

    const appears = state.difficulty === 'easy'
      ? proj.likelihood >= 1.0
      : (proj.likelihood >= 1.0 || likelihoodRoll(proj.likelihood));

    proj.spawned = true;
    proj.appeared = appears;

    if (appears) {
      pendingBids.push({
        ...proj,
        status: 'tender',
        assignedTbm: null,
        assignedTo: null,
        urgencyWeeks: 0,
        weeksRemaining: proj.durationWeeks,
        bids: [],
      });
      notifications.push({
        message: `Tender: ${proj.name} (${proj.tbmSize}mm, ${proj.durationWeeks}wk, ~${proj.revenue}k)`,
        type: 'new_project',
        week,
      });
    }
  }

  // -----------------------------------------------------------------------
  // 2-8. Process fleet, projects, completions, losses for ALL players
  // -----------------------------------------------------------------------
  for (let pi = 0; pi < players.length; pi++) {
    const player = players[pi];
    let fleet = player.fleet;

    // --- 2. Process TBM transit ---
    fleet = fleet.map(t => {
      if (t.status === 'in_transit' && t.transitWeeksLeft > 0) {
        const rem = t.transitWeeksLeft - 1;
        if (rem <= 0) {
          const proj = activeProjects.find(p => p.id === t.assignedProject);
          if (proj && proj.assignedTo === player.id) {
            proj.status = 'active';
          }
          return { ...t, status: 'on_site', transitWeeksLeft: 0 };
        }
        return { ...t, transitWeeksLeft: rem };
      }
      if (t.status === 'returning' && t.transitWeeksLeft > 0) {
        const rem = t.transitWeeksLeft - 1;
        if (rem <= 0) {
          return { ...t, status: 'available', transitWeeksLeft: 0, assignedProject: null };
        }
        return { ...t, transitWeeksLeft: rem };
      }
      return t;
    });

    // --- 3. Tick active projects for this player ---
    const completedThisTick = [];
    activeProjects = activeProjects.map(p => {
      if (p.assignedTo !== player.id) return p;

      if (p.status === 'active') {
        const rem = p.weeksRemaining - 1;
        if (rem <= 0) {
          completedThisTick.push(p);
          return { ...p, status: 'completed', weeksRemaining: 0 };
        }
        return { ...p, weeksRemaining: rem };
      }

      if (p.status === 'waiting') {
        const urg = p.urgencyWeeks + 1;
        if (urg >= URGENCY_DEADLINE_WEEKS) {
          return { ...p, status: 'lost', urgencyWeeks: urg };
        }
        return { ...p, urgencyWeeks: urg };
      }

      return p;
    });

    // --- 4. Handle completions ---
    for (const p of completedThisTick) {
      // Free the TBM
      fleet = fleet.map(t =>
        t.assignedProject === p.id
          ? { ...t, status: 'returning', transitWeeksLeft: 1, assignedProject: null }
          : t
      );
      player.cabinsInUse = Math.max(0, player.cabinsInUse - 1);

      const rev = p.actualRevenue || p.revenue;
      player.cash += rev;
      player.totalRevenue += rev;
      player.projectsCompleted += 1;

      completedProjects.push({
        ...p,
        completedWeek: week,
        completedBy: player.id,
      });

      if (!player.isAI) {
        player.completionsThisTurn = (player.completionsThisTurn || 0) + 1;
        notifications.push({
          message: `${p.name} completed! +${rev}k`,
          type: 'success',
          week,
        });

        // Early completion rep boost
        if (p.weeksRemaining !== undefined && p.weeksRemaining <= 0) {
          player.reputation = Math.min(5, player.reputation + REP_GAIN_EARLY_COMPLETE);
        }
      }
    }

    // --- 5. Handle lost contracts ---
    const lostThisTick = activeProjects.filter(
      p => p.assignedTo === player.id && p.status === 'lost'
    );
    for (const p of lostThisTick) {
      player.reputation = Math.max(0, player.reputation - REP_LOSS_CONTRACT_LOST);
      player.projectsLost += 1;
      lostProjects.push({ ...p, lostWeek: week, lostBy: player.id });

      // Free any TBM assigned to this lost project (shouldn't normally happen but safety)
      fleet = fleet.map(t =>
        t.assignedProject === p.id
          ? { ...t, status: 'available', transitWeeksLeft: 0, assignedProject: null }
          : t
      );

      if (!player.isAI) {
        notifications.push({
          message: `Lost: ${p.name} -- rep -${REP_LOSS_CONTRACT_LOST}`,
          type: 'error',
          week,
        });
      }
    }

    // --- 6. Hired TBM expiry ---
    fleet = fleet.filter(t => {
      if (t.hired && t.hireWeeksLeft !== undefined) {
        t.hireWeeksLeft -= 1;
        if (t.hireWeeksLeft <= 0 && t.status === 'available') {
          if (!player.isAI) {
            notifications.push({
              message: `Hired ${t.size}mm expired`,
              type: 'info',
              week,
            });
          }
          return false;
        }
      }
      return true;
    });

    // --- 7. AI auto-dispatch ---
    if (player.isAI) {
      const waitingProjects = activeProjects.filter(
        p => p.assignedTo === player.id && p.status === 'waiting'
      );
      for (const proj of waitingProjects) {
        const availTbm = fleet.find(
          t => t.status === 'available' && t.size === proj.tbmSize
        );
        if (availTbm && player.cabinsInUse < player.cabinsTotal) {
          availTbm.status = 'in_transit';
          availTbm.assignedProject = proj.id;
          availTbm.transitWeeksLeft = MOBILISATION_WEEKS;
          proj.status = 'mobilising';
          proj.assignedTbm = availTbm.id;
          player.cabinsInUse += 1;
        }
      }
    }

    // --- 8. Track peak simultaneous ---
    const currentActive = activeProjects.filter(
      p => p.assignedTo === player.id && (p.status === 'active' || p.status === 'mobilising')
    ).length;
    player.peakSimultaneous = Math.max(player.peakSimultaneous, currentActive);

    player.fleet = fleet;
    players[pi] = player;
  }

  // Remove completed/lost from activeProjects
  activeProjects = activeProjects.filter(
    p => p.status !== 'completed' && p.status !== 'lost'
  );

  // -----------------------------------------------------------------------
  // 9. Random event roll (human player only)
  // -----------------------------------------------------------------------
  let currentEvent = null;
  if (week > 4 && eventCooldown <= 0 && pendingBids.length === 0 && Math.random() < 0.12) {
    const playerActiveCount = activeProjects.filter(
      p => p.assignedTo === 'player' && p.status === 'active'
    ).length;

    const eligible = RANDOM_EVENTS.filter(e => {
      if (e.affectsActive && playerActiveCount === 0) return false;
      return true;
    });

    if (eligible.length > 0) {
      currentEvent = { ...eligible[Math.floor(Math.random() * eligible.length)] };
      eventCooldown = 3 + Math.floor(Math.random() * 4); // 3-6 weeks cooldown
    }
  }

  // -----------------------------------------------------------------------
  // 10. Track reputation streaks
  // -----------------------------------------------------------------------
  if (players[0].reputation >= 5) {
    players[0].fiveStarWeeks = (players[0].fiveStarWeeks || 0) + 1;
  } else {
    players[0].fiveStarWeeks = 0;
  }
  players[0].lowestRepReached = Math.min(
    players[0].lowestRepReached !== undefined ? players[0].lowestRepReached : 5,
    players[0].reputation
  );

  // -----------------------------------------------------------------------
  // 11. Year-end check
  // -----------------------------------------------------------------------
  let yearEndStats = null;
  if (week > 0 && week % WEEKS_PER_YEAR === 0 && week < GAME_END_WEEK) {
    const year = week / WEEKS_PER_YEAR;
    yearEndStats = {
      year,
      players: players.map(p => ({
        id: p.id,
        name: p.name,
        color: p.color,
        revenue: p.totalRevenue,
        completed: p.projectsCompleted,
        lost: p.projectsLost,
        reputation: p.reputation,
        cash: p.cash,
        isAI: p.isAI,
      })),
    };
  }

  // -----------------------------------------------------------------------
  // 12. Determine phase
  // -----------------------------------------------------------------------
  let phase = 'playing';
  if (players[0].reputation <= 0) {
    phase = 'gameOver';
  } else if (week >= GAME_END_WEEK) {
    phase = 'gameOver';
  } else if (pendingBids.length > 0) {
    phase = 'bidding';
  } else if (currentEvent) {
    phase = 'event';
  } else if (yearEndStats) {
    phase = 'yearEnd';
  }

  // -----------------------------------------------------------------------
  // 13. Check achievements
  // -----------------------------------------------------------------------
  const newState = {
    ...state,
    week,
    phase,
    players,
    pipeline,
    activeProjects,
    completedProjects,
    lostProjects,
    pendingBids: phase === 'bidding' ? pendingBids : [],
    currentBidProject: phase === 'bidding' ? pendingBids[0] : null,
    playerBidAmount: null,
    currentEvent: currentEvent || null,
    eventCooldown,
    notifications: [...state.notifications, ...notifications],
    yearEndStats: phase === 'yearEnd' ? yearEndStats : null,
    achievements,
  };

  newState.achievements = checkAchievements(newState);

  return newState;
}

// ---------------------------------------------------------------------------
// Main reducer
// ---------------------------------------------------------------------------

export function gameReducer(state, action) {
  switch (action.type) {
    // -------------------------------------------------------------------
    // Game lifecycle
    // -------------------------------------------------------------------
    case 'START_GAME': {
      const difficulty = action.difficulty || 'normal';
      const seed = action.seed || Date.now();

      // Determine number of AI players
      const aiCount = difficulty === 'easy' ? 1 : difficulty === 'hard' ? 3 : 2;
      const aiPlayers = AI_COMPETITORS.slice(0, aiCount).map(comp => buildAIPlayer(comp));

      // Generate pipeline
      const projects = generateProjects(seed);
      const pipeline = projects.map(p => ({
        ...p,
        spawnWeek: dateToWeek(p.startDate),
        spawned: false,
        appeared: false,
      }));

      const base = createInitialState();
      return {
        ...base,
        phase: 'playing',
        gameSeed: seed,
        difficulty,
        pipeline,
        players: [base.players[0], ...aiPlayers],
        showTutorial: action.showTutorial !== undefined ? action.showTutorial : true,
        tutorialStep: action.showTutorial === false ? null : 0,
      };
    }

    case 'LOAD_GAME': {
      if (action.savedState) {
        return { ...action.savedState };
      }
      return state;
    }

    // -------------------------------------------------------------------
    // UI selections
    // -------------------------------------------------------------------
    case 'SELECT_PROJECT':
      return { ...state, selectedProject: action.projectId };

    case 'SELECT_TBM':
      return { ...state, selectedTbm: action.tbmId };

    case 'SET_MOBILE_TAB':
      return { ...state, mobileTab: action.tab };

    case 'OPEN_HIRE_MODAL':
      return { ...state, hireModalOpen: true };

    case 'CLOSE_HIRE_MODAL':
      return { ...state, hireModalOpen: false };

    case 'TOGGLE_ACHIEVEMENTS':
      return { ...state, achievementsOpen: !state.achievementsOpen };

    case 'TOGGLE_COMPETITORS':
      return { ...state, competitorPanelOpen: !state.competitorPanelOpen };

    // -------------------------------------------------------------------
    // Tutorial
    // -------------------------------------------------------------------
    case 'ADVANCE_TUTORIAL':
      return {
        ...state,
        tutorialStep: state.tutorialStep !== null ? state.tutorialStep + 1 : null,
      };

    case 'SKIP_TUTORIAL':
      return { ...state, tutorialStep: null, showTutorial: false };

    // -------------------------------------------------------------------
    // TBM dispatch / recall / hire
    // -------------------------------------------------------------------
    case 'DISPATCH_TBM': {
      const { tbmId, projectId } = action;
      const players = state.players.map(p => ({ ...p, fleet: p.fleet.map(t => ({ ...t })) }));
      const player = players[0];
      const project = state.activeProjects.find(p => p.id === projectId);
      const tbm = player.fleet.find(t => t.id === tbmId);

      if (!project || !tbm) return state;
      if (tbm.status !== 'available') return state;
      if (tbm.size !== project.tbmSize) return state;
      if (project.assignedTo !== 'player') return state;

      if (player.cabinsInUse >= player.cabinsTotal) {
        return {
          ...state,
          notifications: [
            ...state.notifications,
            { message: 'No cabin available -- recall a TBM or wait', type: 'error', week: state.week },
          ],
        };
      }

      player.fleet = player.fleet.map(t =>
        t.id === tbmId
          ? { ...t, status: 'in_transit', assignedProject: projectId, transitWeeksLeft: MOBILISATION_WEEKS }
          : t
      );
      player.cabinsInUse += 1;

      const updatedProjects = state.activeProjects.map(p =>
        p.id === projectId
          ? { ...p, status: 'mobilising', assignedTbm: tbmId, urgencyWeeks: 0 }
          : p
      );

      return {
        ...state,
        players,
        activeProjects: updatedProjects,
        selectedProject: null,
        selectedTbm: null,
        notifications: [
          ...state.notifications,
          { message: `${tbm.name} dispatched to ${project.name}`, type: 'success', week: state.week },
        ],
      };
    }

    case 'RECALL_TBM': {
      const { tbmId } = action;
      const players = state.players.map(p => ({ ...p, fleet: p.fleet.map(t => ({ ...t })) }));
      const player = players[0];
      const tbm = player.fleet.find(t => t.id === tbmId);

      if (!tbm || (tbm.status !== 'on_site' && tbm.status !== 'in_transit')) return state;

      const project = state.activeProjects.find(p => p.id === tbm.assignedProject);

      player.fleet = player.fleet.map(t =>
        t.id === tbmId
          ? { ...t, status: 'returning', assignedProject: null, transitWeeksLeft: 1 }
          : t
      );
      player.cabinsInUse = Math.max(0, player.cabinsInUse - 1);
      player.reputation = Math.max(0, player.reputation - 0.25);

      const updatedProjects = state.activeProjects.map(p =>
        p.id === tbm.assignedProject
          ? { ...p, status: 'waiting', assignedTbm: null, weeksRemaining: p.durationWeeks }
          : p
      );

      return {
        ...state,
        players,
        activeProjects: updatedProjects,
        notifications: [
          ...state.notifications,
          {
            message: `${tbm.name} recalled from ${project?.name || 'project'} -- reputation hit`,
            type: 'warning',
            week: state.week,
          },
        ],
      };
    }

    case 'HIRE_TBM': {
      const { size, durationWeeks } = action;
      const players = state.players.map(p => ({ ...p, fleet: p.fleet.map(t => ({ ...t })) }));
      const player = players[0];
      const weeklyCost = HIRE_RATES[size];
      const totalCost = Math.round((weeklyCost * durationWeeks) / 1000); // convert to £k
      const hireId = `HIRE-${size}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

      if (player.cash < totalCost) {
        return {
          ...state,
          notifications: [
            ...state.notifications,
            { message: `Not enough cash to hire (need ${totalCost}k)`, type: 'error', week: state.week },
          ],
        };
      }

      const newTbm = {
        id: hireId,
        size,
        name: `Hired ${size}mm`,
        yard: 'Hire Depot',
        status: 'available',
        assignedProject: null,
        transitWeeksLeft: 0,
        hired: true,
        hireWeeksLeft: durationWeeks,
        hireCostPerWeek: weeklyCost,
      };

      player.fleet = [...player.fleet, newTbm];
      player.cash -= totalCost;
      player.totalHireCost += totalCost;

      return {
        ...state,
        players,
        hireModalOpen: false,
        notifications: [
          ...state.notifications,
          {
            message: `Hired ${size}mm TBM for ${durationWeeks} weeks (${totalCost}k)`,
            type: 'info',
            week: state.week,
          },
        ],
      };
    }

    // -------------------------------------------------------------------
    // Bidding
    // -------------------------------------------------------------------
    case 'SUBMIT_BID': {
      const bidAmount = action.amount;
      if (bidAmount === null || bidAmount === undefined) return state;

      // Clamp bid to valid range
      const project = state.currentBidProject;
      if (!project) return state;

      const minBid = Math.round(project.revenue * BID_MIN);
      const maxBid = Math.round(project.revenue * BID_MAX);
      const clampedBid = Math.max(minBid, Math.min(maxBid, Math.round(bidAmount)));

      return resolveBid(
        { ...state, playerBidAmount: clampedBid },
        clampedBid
      );
    }

    case 'SKIP_BID': {
      // Player skips, but AI bids still resolve
      return resolveBid(state, null);
    }

    // -------------------------------------------------------------------
    // Events
    // -------------------------------------------------------------------
    case 'RESOLVE_EVENT': {
      const { choiceIndex } = action;
      const event = state.currentEvent;
      if (!event || !event.choices || choiceIndex >= event.choices.length) {
        // No valid choice, just dismiss
        return advanceAfterEvent(state);
      }

      const choice = event.choices[choiceIndex];
      const afterEffect = applyEventEffect(state, choice.effect);
      return advanceAfterEvent(afterEffect);
    }

    // -------------------------------------------------------------------
    // Turn processing
    // -------------------------------------------------------------------
    case 'END_TURN': {
      if (state.phase !== 'playing') return state;
      return processTick(state);
    }

    // -------------------------------------------------------------------
    // Year end
    // -------------------------------------------------------------------
    case 'CONTINUE_YEAR': {
      return {
        ...state,
        phase: 'playing',
        yearEndStats: null,
      };
    }

    // -------------------------------------------------------------------
    // Notifications
    // -------------------------------------------------------------------
    case 'DISMISS_NOTIFICATION': {
      return {
        ...state,
        notifications: state.notifications.filter((_, i) => i !== action.index),
      };
    }

    case 'CLEAR_OLD_NOTIFICATIONS': {
      return {
        ...state,
        notifications: state.notifications.filter(n => state.week - n.week < 3),
      };
    }

    // -------------------------------------------------------------------
    // Upgrades
    // -------------------------------------------------------------------
    case 'PURCHASE_UPGRADE': {
      const { upgradeId, cost } = action;
      if (state.upgrades.includes(upgradeId)) return state;

      const players = state.players.map(p => ({ ...p, fleet: p.fleet.map(t => ({ ...t })) }));
      const player = players[0];

      if (player.cash < cost) {
        return {
          ...state,
          notifications: [
            ...state.notifications,
            { message: `Not enough cash for upgrade (need ${cost}k)`, type: 'error', week: state.week },
          ],
        };
      }

      player.cash -= cost;

      // Apply upgrade effects
      switch (upgradeId) {
        case 'extra_cabin':
          player.cabinsTotal += 1;
          break;
        // Other upgrades are checked at usage time
        default:
          break;
      }

      return {
        ...state,
        players,
        upgrades: [...state.upgrades, upgradeId],
        notifications: [
          ...state.notifications,
          { message: `Upgrade purchased: ${upgradeId}`, type: 'success', week: state.week },
        ],
      };
    }

    default:
      return state;
  }
}

// ---------------------------------------------------------------------------
// Helper: advance after event resolution
// ---------------------------------------------------------------------------

function advanceAfterEvent(state) {
  // After event, check for year end or game over
  if (state.players[0].reputation <= 0 || state.week >= GAME_END_WEEK) {
    return {
      ...state,
      currentEvent: null,
      phase: 'gameOver',
    };
  }

  if (state.yearEndStats) {
    return {
      ...state,
      currentEvent: null,
      phase: 'yearEnd',
    };
  }

  // Check achievements after event
  const achievements = checkAchievements(state);

  return {
    ...state,
    currentEvent: null,
    phase: 'playing',
    achievements,
  };
}

export default gameReducer;
