import PROJECTS from '../data/projects';
import {
  GAME_START_DATE,
  GAME_END_WEEK,
  MOBILISATION_WEEKS,
  URGENCY_DEADLINE_WEEKS,
  STARTING_FLEET,
  TOTAL_CABINS,
  HIRE_RATES,
  STARTING_REPUTATION,
  REP_LOSS_CONTRACT_LOST,
  REP_GAIN_EARLY_COMPLETE,
  LIKELIHOOD_BIAS,
  LIKELIHOOD_CAP,
} from '../data/constants';

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

function likelihoodRoll(likelihood) {
  const adjustedChance = Math.min(likelihood + LIKELIHOOD_BIAS, LIKELIHOOD_CAP);
  return Math.random() < adjustedChance;
}

function prepareProjectPipeline() {
  return PROJECTS.map(p => ({
    ...p,
    spawnWeek: dateToWeek(p.startDate),
    spawned: false,
    appeared: false,
  }));
}

export function createInitialState() {
  const fleet = STARTING_FLEET.map(tbm => ({
    ...tbm,
    status: 'available',
    assignedProject: null,
    transitWeeksLeft: 0,
    hired: false,
  }));

  return {
    phase: 'title',
    week: 0,
    players: [
      {
        id: 'player',
        name: 'Tunnelworks',
        color: '#f97316',
        fleet,
        cabinsTotal: TOTAL_CABINS,
        cabinsInUse: 0,
        cash: 0,
        totalRevenue: 0,
        totalHireCost: 0,
        reputation: STARTING_REPUTATION,
        projectsCompleted: 0,
        projectsLost: 0,
        peakSimultaneous: 0,
        isAI: false,
      },
    ],
    pipeline: prepareProjectPipeline(),
    activeProjects: [],
    completedProjects: [],
    lostProjects: [],
    notifications: [],
    selectedProject: null,
    selectedTbm: null,
    hireModalOpen: false,
    difficulty: 'normal',
    mobileTab: 'map',
  };
}

export function gameReducer(state, action) {
  switch (action.type) {
    case 'START_GAME':
      return {
        ...createInitialState(),
        phase: 'playing',
        difficulty: action.difficulty || 'normal',
      };

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

    case 'DISPATCH_TBM': {
      const { tbmId, projectId } = action;
      const player = state.players[0];
      const project = state.activeProjects.find(p => p.id === projectId);
      const tbm = player.fleet.find(t => t.id === tbmId);

      if (!project || !tbm) return state;
      if (tbm.status !== 'available') return state;
      if (tbm.size !== project.tbmSize) return state;

      if (player.cabinsInUse >= player.cabinsTotal) {
        return {
          ...state,
          notifications: [
            ...state.notifications,
            { message: 'No cabin available — recall a TBM or wait', type: 'error', week: state.week },
          ],
        };
      }

      const updatedFleet = player.fleet.map(t =>
        t.id === tbmId
          ? { ...t, status: 'in_transit', assignedProject: projectId, transitWeeksLeft: MOBILISATION_WEEKS }
          : t
      );

      const updatedProjects = state.activeProjects.map(p =>
        p.id === projectId
          ? { ...p, status: 'mobilising', assignedTbm: tbmId, urgencyWeeks: 0 }
          : p
      );

      return {
        ...state,
        players: [
          {
            ...player,
            fleet: updatedFleet,
            cabinsInUse: player.cabinsInUse + 1,
          },
        ],
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
      const player = state.players[0];
      const tbm = player.fleet.find(t => t.id === tbmId);
      if (!tbm || (tbm.status !== 'on_site' && tbm.status !== 'in_transit')) return state;

      const project = state.activeProjects.find(p => p.id === tbm.assignedProject);

      const updatedFleet = player.fleet.map(t =>
        t.id === tbmId
          ? { ...t, status: 'returning', assignedProject: null, transitWeeksLeft: 1 }
          : t
      );

      const updatedProjects = state.activeProjects.map(p =>
        p.id === tbm.assignedProject
          ? { ...p, status: 'waiting', assignedTbm: null, weeksRemaining: p.durationWeeks }
          : p
      );

      return {
        ...state,
        players: [
          {
            ...player,
            fleet: updatedFleet,
            cabinsInUse: Math.max(0, player.cabinsInUse - 1),
            reputation: Math.max(0, player.reputation - 0.25),
          },
        ],
        activeProjects: updatedProjects,
        notifications: [
          ...state.notifications,
          {
            message: `${tbm.name} recalled from ${project?.name || 'project'} — reputation hit`,
            type: 'warning',
            week: state.week,
          },
        ],
      };
    }

    case 'HIRE_TBM': {
      const { size, durationWeeks } = action;
      const player = state.players[0];
      const cost = HIRE_RATES[size] * durationWeeks;
      const hireId = `HIRE-${size}-${Date.now()}`;

      const newTbm = {
        id: hireId,
        size,
        name: `Hired ${size}mm`,
        yard: 'Rye Meads',
        status: 'available',
        assignedProject: null,
        transitWeeksLeft: 0,
        hired: true,
        hireWeeksLeft: durationWeeks,
        hireCostPerWeek: HIRE_RATES[size],
      };

      return {
        ...state,
        players: [
          {
            ...player,
            fleet: [...player.fleet, newTbm],
            totalHireCost: player.totalHireCost + cost,
          },
        ],
        hireModalOpen: false,
        notifications: [
          ...state.notifications,
          {
            message: `Hired ${size}mm TBM for ${durationWeeks} weeks (£${(cost / 1000).toFixed(0)}k)`,
            type: 'info',
            week: state.week,
          },
        ],
      };
    }

    case 'END_TURN': {
      return processTick(state);
    }

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

    default:
      return state;
  }
}

function processTick(state) {
  let player = { ...state.players[0] };
  let fleet = player.fleet.map(t => ({ ...t }));
  let activeProjects = state.activeProjects.map(p => ({ ...p }));
  let completedProjects = [...state.completedProjects];
  let lostProjects = [...state.lostProjects];
  let pipeline = state.pipeline.map(p => ({ ...p }));
  let notifications = [];
  const week = state.week + 1;

  // 1. Spawn new projects
  for (const proj of pipeline) {
    if (proj.spawned) continue;
    if (proj.spawnWeek > week) continue;
    if (proj.spawnWeek < week - 2) {
      proj.spawned = true;
      continue;
    }

    const appears = proj.likelihood >= 1.0 || likelihoodRoll(proj.likelihood);
    proj.spawned = true;
    proj.appeared = appears;

    if (appears) {
      activeProjects.push({
        ...proj,
        status: 'waiting',
        assignedTbm: null,
        urgencyWeeks: 0,
        weeksRemaining: proj.durationWeeks,
      });
      notifications.push({
        message: `New: ${proj.name} (${proj.tbmSize}mm, ${proj.durationWeeks}wk)`,
        type: 'new_project',
        week,
      });
    }
  }

  // 2. Process TBM transit
  fleet = fleet.map(t => {
    if (t.status === 'in_transit' && t.transitWeeksLeft > 0) {
      const remaining = t.transitWeeksLeft - 1;
      if (remaining <= 0) {
        const proj = activeProjects.find(p => p.id === t.assignedProject);
        if (proj) proj.status = 'active';
        return { ...t, status: 'on_site', transitWeeksLeft: 0 };
      }
      return { ...t, transitWeeksLeft: remaining };
    }
    if (t.status === 'returning' && t.transitWeeksLeft > 0) {
      const remaining = t.transitWeeksLeft - 1;
      if (remaining <= 0) {
        return { ...t, status: 'available', transitWeeksLeft: 0, assignedProject: null };
      }
      return { ...t, transitWeeksLeft: remaining };
    }
    return t;
  });

  // 3. Tick active projects
  const completedThisTick = [];
  activeProjects = activeProjects.map(p => {
    if (p.status === 'active') {
      const remaining = p.weeksRemaining - 1;
      if (remaining <= 0) {
        completedThisTick.push(p);
        return { ...p, status: 'completed', weeksRemaining: 0 };
      }
      return { ...p, weeksRemaining: remaining };
    }
    if (p.status === 'waiting') {
      const urgency = p.urgencyWeeks + 1;
      if (urgency >= URGENCY_DEADLINE_WEEKS) {
        return { ...p, status: 'lost', urgencyWeeks: urgency };
      }
      return { ...p, urgencyWeeks: urgency };
    }
    return p;
  });

  // 4. Handle completed
  for (const p of completedThisTick) {
    fleet = fleet.map(t =>
      t.assignedProject === p.id
        ? { ...t, status: 'returning', transitWeeksLeft: 1, assignedProject: null }
        : t
    );
    player.cabinsInUse = Math.max(0, player.cabinsInUse - 1);
    player.cash += p.revenue;
    player.totalRevenue += p.revenue;
    player.projectsCompleted += 1;

    completedProjects.push({ ...p, completedWeek: week });
    notifications.push({
      message: `${p.name} completed! +£${p.revenue}k`,
      type: 'success',
      week,
    });
  }

  // 5. Handle lost
  const lostThisTick = activeProjects.filter(p => p.status === 'lost');
  for (const p of lostThisTick) {
    player.reputation = Math.max(0, player.reputation - REP_LOSS_CONTRACT_LOST);
    player.projectsLost += 1;
    lostProjects.push({ ...p, lostWeek: week });
    notifications.push({
      message: `Lost: ${p.name} — rep -${REP_LOSS_CONTRACT_LOST}`,
      type: 'error',
      week,
    });
  }

  activeProjects = activeProjects.filter(p => p.status !== 'completed' && p.status !== 'lost');

  // 6. Hired TBM expiry
  fleet = fleet.filter(t => {
    if (t.hired && t.hireWeeksLeft !== undefined) {
      t.hireWeeksLeft -= 1;
      if (t.hireWeeksLeft <= 0 && t.status === 'available') {
        notifications.push({ message: `Hired ${t.size}mm expired`, type: 'info', week });
        return false;
      }
    }
    return true;
  });

  // 7. Peak simultaneous
  const currentActive = activeProjects.filter(
    p => p.status === 'active' || p.status === 'mobilising'
  ).length;
  player.peakSimultaneous = Math.max(player.peakSimultaneous, currentActive);

  // 8. Game over
  let phase = state.phase;
  if (player.reputation <= 0) {
    phase = 'gameOver';
  } else if (week >= GAME_END_WEEK) {
    phase = 'gameOver';
  }

  player.fleet = fleet;

  return {
    ...state,
    week,
    phase,
    players: [player],
    pipeline,
    activeProjects,
    completedProjects,
    lostProjects,
    notifications,
  };
}
