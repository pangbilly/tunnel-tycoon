import { useReducer, useEffect, useCallback } from 'react';
import { gameReducer, createInitialState } from './game/engine';
import { YARDS } from './data/constants';
import TitleScreen from './components/TitleScreen';
import GameOverScreen from './components/GameOverScreen';
import GameHeader from './components/GameHeader';
import UKMap from './components/UKMap';
import FleetPanel from './components/FleetPanel';
import ProjectPanel from './components/ProjectPanel';
import HireModal from './components/HireModal';
import Notifications from './components/Notifications';

export default function App() {
  const [state, dispatch] = useReducer(gameReducer, null, createInitialState);

  const player = state.players[0];

  // Keyboard: Enter/Space = end turn
  useEffect(() => {
    const handleKey = (e) => {
      if (state.phase !== 'playing') return;
      if (state.hireModalOpen) return;
      if (e.code === 'Enter' || e.code === 'Space') {
        e.preventDefault();
        dispatch({ type: 'END_TURN' });
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [state.phase, state.hireModalOpen]);

  // Clear old notifications on turn advance
  useEffect(() => {
    if (state.notifications.length > 0) {
      dispatch({ type: 'CLEAR_OLD_NOTIFICATIONS' });
    }
  }, [state.week]);

  const handleStart = useCallback((difficulty) => {
    dispatch({ type: 'START_GAME', difficulty });
  }, []);

  const handleDispatch = useCallback((tbmId, projectId) => {
    dispatch({ type: 'DISPATCH_TBM', tbmId, projectId });
  }, []);

  if (state.phase === 'title') {
    return <TitleScreen onStart={handleStart} />;
  }

  if (state.phase === 'gameOver') {
    return (
      <GameOverScreen
        player={player}
        week={state.week}
        onRestart={() => dispatch({ type: 'START_GAME', difficulty: state.difficulty })}
      />
    );
  }

  const mobileTab = state.mobileTab;

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      <GameHeader
        week={state.week}
        player={player}
        onEndTurn={() => dispatch({ type: 'END_TURN' })}
      />

      {/* Desktop layout: 3-column */}
      <div className="hidden md:flex flex-1 relative">
        <Notifications
          notifications={state.notifications}
          currentWeek={state.week}
          onDismiss={(i) => dispatch({ type: 'DISMISS_NOTIFICATION', index: i })}
        />

        <div className="w-56 p-2 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 80px)' }}>
          <FleetPanel
            player={player}
            selectedTbm={state.selectedTbm}
            onSelectTbm={(id) => dispatch({ type: 'SELECT_TBM', tbmId: id })}
            onRecall={(id) => dispatch({ type: 'RECALL_TBM', tbmId: id })}
            onOpenHire={() => dispatch({ type: 'OPEN_HIRE_MODAL' })}
          />
        </div>

        <div className="flex-1 p-2 flex items-center justify-center">
          <div className="w-full h-full" style={{ maxWidth: '600px', height: 'calc(100vh - 96px)' }}>
            <UKMap
              projects={state.activeProjects}
              yards={YARDS}
              selectedProject={state.selectedProject}
              onSelectProject={(id) => dispatch({ type: 'SELECT_PROJECT', projectId: id })}
              playerFleet={player.fleet}
            />
          </div>
        </div>

        <div className="w-80 p-2 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 80px)' }}>
          <ProjectPanel
            activeProjects={state.activeProjects}
            selectedProject={state.selectedProject}
            selectedTbm={state.selectedTbm}
            onSelectProject={(id) => dispatch({ type: 'SELECT_PROJECT', projectId: id })}
            onDispatch={handleDispatch}
            week={state.week}
          />
        </div>
      </div>

      {/* Mobile layout: single panel with tab bar */}
      <div className="md:hidden flex-1 flex flex-col relative">
        <Notifications
          notifications={state.notifications}
          currentWeek={state.week}
          onDismiss={(i) => dispatch({ type: 'DISMISS_NOTIFICATION', index: i })}
        />

        <div className="flex-1 overflow-y-auto p-2 pb-16">
          {mobileTab === 'map' && (
            <div className="w-full" style={{ height: 'calc(100vh - 160px)' }}>
              <UKMap
                projects={state.activeProjects}
                yards={YARDS}
                selectedProject={state.selectedProject}
                onSelectProject={(id) => dispatch({ type: 'SELECT_PROJECT', projectId: id })}
                playerFleet={player.fleet}
              />
            </div>
          )}
          {mobileTab === 'fleet' && (
            <FleetPanel
              player={player}
              selectedTbm={state.selectedTbm}
              onSelectTbm={(id) => dispatch({ type: 'SELECT_TBM', tbmId: id })}
              onRecall={(id) => dispatch({ type: 'RECALL_TBM', tbmId: id })}
              onOpenHire={() => dispatch({ type: 'OPEN_HIRE_MODAL' })}
            />
          )}
          {mobileTab === 'projects' && (
            <ProjectPanel
              activeProjects={state.activeProjects}
              selectedProject={state.selectedProject}
              selectedTbm={state.selectedTbm}
              onSelectProject={(id) => dispatch({ type: 'SELECT_PROJECT', projectId: id })}
              onDispatch={handleDispatch}
              week={state.week}
            />
          )}
        </div>

        {/* Mobile tab bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-700 flex z-30">
          {[
            { id: 'map', label: 'Map' },
            { id: 'fleet', label: 'Fleet' },
            { id: 'projects', label: 'Projects' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => dispatch({ type: 'SET_MOBILE_TAB', tab: tab.id })}
              className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${
                mobileTab === tab.id
                  ? 'text-orange-500 border-t-2 border-orange-500'
                  : 'text-gray-500'
              }`}
            >
              {tab.label}
              {tab.id === 'projects' && state.activeProjects.some(p => p.status === 'waiting') && (
                <span className="ml-1 text-red-400">!</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {state.hireModalOpen && (
        <HireModal
          onHire={(size, duration) => dispatch({ type: 'HIRE_TBM', size, durationWeeks: duration })}
          onClose={() => dispatch({ type: 'CLOSE_HIRE_MODAL' })}
        />
      )}
    </div>
  );
}
