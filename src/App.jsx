import { useReducer, useEffect, useCallback, useState } from 'react';
import { gameReducer, createInitialState } from './game/engine';
import { YARDS } from './data/constants';
import { saveGame } from './game/save';
import { playClick, playSuccess, playBid, playEvent, playEndTurn, playAchievement } from './game/sound';
import TitleScreen from './components/TitleScreen';
import GameOverScreen from './components/GameOverScreen';
import GameHeader from './components/GameHeader';
import UKMap from './components/UKMap';
import FleetPanel from './components/FleetPanel';
import ProjectPanel from './components/ProjectPanel';
import HireModal from './components/HireModal';
import Notifications from './components/Notifications';
import BiddingModal from './components/BiddingModal';
import EventModal from './components/EventModal';
import CompetitorPanel from './components/CompetitorPanel';
import YearEndScreen from './components/YearEndScreen';
import TutorialOverlay from './components/TutorialOverlay';
import AchievementsPanel from './components/AchievementsPanel';
import AchievementToast from './components/AchievementToast';

export default function App() {
  const [state, dispatch] = useReducer(gameReducer, null, createInitialState);
  const [lastAchievement, setLastAchievement] = useState(null);
  const [prevAchievements, setPrevAchievements] = useState([]);
  const [saveNotice, setSaveNotice] = useState(false);

  const player = state.players[0];

  // Track new achievements
  useEffect(() => {
    if (state.achievements && state.achievements.length > prevAchievements.length) {
      const newOnes = state.achievements.filter(a => !prevAchievements.includes(a));
      if (newOnes.length > 0) {
        setLastAchievement(newOnes[newOnes.length - 1]);
        playAchievement();
        setTimeout(() => setLastAchievement(null), 4000);
      }
    }
    setPrevAchievements(state.achievements || []);
  }, [state.achievements]);

  // Keyboard: Enter/Space = end turn
  useEffect(() => {
    const handleKey = (e) => {
      if (state.phase !== 'playing') return;
      if (state.hireModalOpen || state.achievementsOpen || state.competitorPanelOpen) return;
      if (e.code === 'Enter' || e.code === 'Space') {
        e.preventDefault();
        playEndTurn();
        dispatch({ type: 'END_TURN' });
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [state.phase, state.hireModalOpen, state.achievementsOpen, state.competitorPanelOpen]);

  // Clear old notifications
  useEffect(() => {
    if (state.notifications && state.notifications.length > 0) {
      dispatch({ type: 'CLEAR_OLD_NOTIFICATIONS' });
    }
  }, [state.week]);

  const handleStart = useCallback((difficulty) => {
    playClick();
    dispatch({ type: 'START_GAME', difficulty });
  }, []);

  const handleLoad = useCallback((saveData) => {
    playClick();
    dispatch({ type: 'LOAD_GAME', saveData });
  }, []);

  const handleDispatch = useCallback((tbmId, projectId) => {
    playSuccess();
    dispatch({ type: 'DISPATCH_TBM', tbmId, projectId });
  }, []);

  const handleEndTurn = useCallback(() => {
    playEndTurn();
    dispatch({ type: 'END_TURN' });
  }, []);

  const handleSave = useCallback(() => {
    const success = saveGame(state);
    if (success) {
      setSaveNotice(true);
      setTimeout(() => setSaveNotice(false), 2000);
    }
  }, [state]);

  const handleBid = useCallback((amount) => {
    playBid();
    dispatch({ type: 'SUBMIT_BID', amount });
  }, []);

  const handleSkipBid = useCallback(() => {
    playClick();
    dispatch({ type: 'SKIP_BID' });
  }, []);

  const handleEventChoice = useCallback((choiceIndex) => {
    playEvent();
    dispatch({ type: 'RESOLVE_EVENT', choiceIndex });
  }, []);

  // Title screen
  if (state.phase === 'title') {
    return <TitleScreen onStart={handleStart} onLoad={handleLoad} />;
  }

  // Game over
  if (state.phase === 'gameOver') {
    return (
      <GameOverScreen
        player={player}
        players={state.players}
        week={state.week}
        difficulty={state.difficulty}
        onRestart={() => {
          playClick();
          dispatch({ type: 'START_GAME', difficulty: state.difficulty });
        }}
      />
    );
  }

  const mobileTab = state.mobileTab;

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      <GameHeader
        week={state.week}
        player={player}
        players={state.players}
        onEndTurn={handleEndTurn}
        onSave={handleSave}
        onToggleAchievements={() => dispatch({ type: 'TOGGLE_ACHIEVEMENTS' })}
        onToggleCompetitors={() => dispatch({ type: 'TOGGLE_COMPETITORS' })}
      />

      {/* Desktop layout: 3-column */}
      <div className="hidden md:flex flex-1 relative">
        <Notifications
          notifications={state.notifications}
          currentWeek={state.week}
          onDismiss={(i) => dispatch({ type: 'DISMISS_NOTIFICATION', index: i })}
        />

        <div className="w-60 p-2 overflow-y-auto custom-scrollbar" style={{ maxHeight: 'calc(100vh - 90px)' }}>
          <FleetPanel
            player={player}
            selectedTbm={state.selectedTbm}
            onSelectTbm={(id) => {
              playClick();
              dispatch({ type: 'SELECT_TBM', tbmId: id });
            }}
            onRecall={(id) => {
              playClick();
              dispatch({ type: 'RECALL_TBM', tbmId: id });
            }}
            onOpenHire={() => dispatch({ type: 'OPEN_HIRE_MODAL' })}
          />
        </div>

        <div className="flex-1 p-2 flex items-center justify-center" style={{ isolation: 'isolate', zIndex: 0 }}>
          <div className="w-full h-full" style={{ maxWidth: '650px', height: 'calc(100vh - 100px)' }}>
            <UKMap
              projects={state.activeProjects}
              yards={YARDS}
              selectedProject={state.selectedProject}
              onSelectProject={(id) => {
                playClick();
                dispatch({ type: 'SELECT_PROJECT', projectId: id });
              }}
              players={state.players}
            />
          </div>
        </div>

        <div className="w-80 p-2 overflow-y-auto custom-scrollbar" style={{ maxHeight: 'calc(100vh - 90px)' }}>
          <ProjectPanel
            activeProjects={state.activeProjects}
            selectedProject={state.selectedProject}
            selectedTbm={state.selectedTbm}
            onSelectProject={(id) => {
              playClick();
              dispatch({ type: 'SELECT_PROJECT', projectId: id });
            }}
            onDispatch={handleDispatch}
            week={state.week}
          />
        </div>
      </div>

      {/* Mobile layout */}
      <div className="md:hidden flex-1 flex flex-col relative">
        <Notifications
          notifications={state.notifications}
          currentWeek={state.week}
          onDismiss={(i) => dispatch({ type: 'DISMISS_NOTIFICATION', index: i })}
        />

        <div className="flex-1 overflow-y-auto p-2 pb-16 custom-scrollbar">
          {mobileTab === 'map' && (
            <div className="w-full" style={{ height: 'calc(100vh - 170px)', isolation: 'isolate', zIndex: 0 }}>
              <UKMap
                projects={state.activeProjects}
                yards={YARDS}
                selectedProject={state.selectedProject}
                onSelectProject={(id) => dispatch({ type: 'SELECT_PROJECT', projectId: id })}
                players={state.players}
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
        <div className="fixed bottom-0 left-0 right-0 glass-panel border-t border-gray-700/50 flex z-30">
          {[
            { id: 'map', label: 'Map', icon: '🗺️' },
            { id: 'fleet', label: 'Fleet', icon: '🚜' },
            { id: 'projects', label: 'Projects', icon: '📋' },
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
              <span className="text-sm">{tab.icon}</span>
              <span className="ml-1">{tab.label}</span>
              {tab.id === 'projects' && state.activeProjects.some(p => p.assignedTo === 'player' && p.status === 'waiting') && (
                <span className="ml-1 text-red-400 animate-pulse">!</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Modals */}
      {state.hireModalOpen && (
        <HireModal
          onHire={(size, duration) => {
            playClick();
            dispatch({ type: 'HIRE_TBM', size, durationWeeks: duration });
          }}
          onClose={() => dispatch({ type: 'CLOSE_HIRE_MODAL' })}
          playerCash={player.cash}
        />
      )}

      {state.phase === 'bidding' && state.currentBidProject && (
        <BiddingModal
          project={state.currentBidProject}
          playerCash={player.cash}
          playerFleet={player.fleet}
          onBid={handleBid}
          onSkip={handleSkipBid}
        />
      )}

      {state.phase === 'event' && state.currentEvent && (
        <EventModal
          event={state.currentEvent}
          onChoice={handleEventChoice}
        />
      )}

      {state.phase === 'yearEnd' && state.yearEndStats && (
        <YearEndScreen
          yearEndStats={state.yearEndStats}
          onContinue={() => {
            playClick();
            dispatch({ type: 'CONTINUE_YEAR' });
          }}
        />
      )}

      {state.showTutorial && state.tutorialStep !== null && state.phase === 'playing' && (
        <TutorialOverlay
          step={state.tutorialStep}
          onNext={() => dispatch({ type: 'ADVANCE_TUTORIAL' })}
          onSkip={() => dispatch({ type: 'SKIP_TUTORIAL' })}
        />
      )}

      {state.achievementsOpen && (
        <AchievementsPanel
          unlocked={state.achievements || []}
          onClose={() => dispatch({ type: 'TOGGLE_ACHIEVEMENTS' })}
        />
      )}

      {state.competitorPanelOpen && (
        <CompetitorPanel
          players={state.players}
          activeProjects={state.activeProjects}
          onClose={() => dispatch({ type: 'TOGGLE_COMPETITORS' })}
        />
      )}

      {/* Achievement toast */}
      {lastAchievement && <AchievementToast achievementId={lastAchievement} />}

      {/* Save notice */}
      {saveNotice && (
        <div className="fixed top-4 right-4 z-50 bg-green-900/80 border border-green-600/50 text-green-300 text-xs font-mono px-4 py-2 rounded-xl animate-pop-in backdrop-blur-sm">
          💾 Game saved!
        </div>
      )}
    </div>
  );
}
