// Save/Load system for Tunnel Tycoon v2
// Persists game state and achievements to localStorage

const SAVE_KEY = 'tunnel_tycoon_save';
const ACHIEVEMENTS_KEY = 'tunnel_tycoon_achievements';
const SAVE_VERSION = 2;

export function saveGame(state) {
  try {
    const saveData = {
      ...state,
      savedAt: new Date().toISOString(),
      version: SAVE_VERSION,
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
    return true;
  } catch (e) {
    console.error('Save failed:', e);
    return false;
  }
}

export function loadGame() {
  try {
    const data = localStorage.getItem(SAVE_KEY);
    if (!data) return null;

    const parsed = JSON.parse(data);

    // Reject incompatible saves
    if (parsed.version !== SAVE_VERSION) return null;

    // Ensure phase is valid (don't restore to title since that resets)
    const validPhases = ['playing', 'bidding', 'event', 'yearEnd', 'gameOver'];
    if (!validPhases.includes(parsed.phase)) {
      parsed.phase = 'playing';
    }

    // Ensure arrays exist (guard against corrupt saves)
    parsed.players = parsed.players || [];
    parsed.pipeline = parsed.pipeline || [];
    parsed.activeProjects = parsed.activeProjects || [];
    parsed.completedProjects = parsed.completedProjects || [];
    parsed.lostProjects = parsed.lostProjects || [];
    parsed.notifications = parsed.notifications || [];
    parsed.pendingBids = parsed.pendingBids || [];
    parsed.achievements = parsed.achievements || [];
    parsed.upgrades = parsed.upgrades || [];

    // Ensure each player has a fleet array
    for (const player of parsed.players) {
      player.fleet = player.fleet || [];
    }

    return parsed;
  } catch (e) {
    console.error('Load failed:', e);
    return null;
  }
}

export function hasSave() {
  try {
    const data = localStorage.getItem(SAVE_KEY);
    if (!data) return false;
    const parsed = JSON.parse(data);
    return parsed.version === SAVE_VERSION;
  } catch (e) {
    return false;
  }
}

export function deleteSave() {
  localStorage.removeItem(SAVE_KEY);
}

export function getSaveInfo() {
  try {
    const data = localStorage.getItem(SAVE_KEY);
    if (!data) return null;
    const parsed = JSON.parse(data);
    if (parsed.version !== SAVE_VERSION) return null;
    return {
      savedAt: parsed.savedAt,
      week: parsed.week,
      difficulty: parsed.difficulty,
      cash: parsed.players?.[0]?.cash || 0,
      reputation: parsed.players?.[0]?.reputation || 0,
      projectsCompleted: parsed.players?.[0]?.projectsCompleted || 0,
    };
  } catch (e) {
    return null;
  }
}

export function saveAchievements(achievements) {
  try {
    localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(achievements));
  } catch (e) {
    // Silently fail - achievements are non-critical
  }
}

export function loadAchievements() {
  try {
    const data = localStorage.getItem(ACHIEVEMENTS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}
