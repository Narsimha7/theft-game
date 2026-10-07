import React, { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { useGame } from './hooks/useGame';
import { ApiService } from './services/api';

// Components
import { Navbar } from './components/Navbar';
import { ProfileModal } from './components/ProfileModal';
import { RulesModal } from './components/RulesModal';
import { AdminModal } from './components/AdminModal';
import { AuthModal } from './components/AuthModal';

// Pages
import { MainMenu } from './pages/MainMenu';
import { Lobby } from './pages/Lobby';
import { RoleReveal } from './pages/RoleReveal';
import { Investigation } from './pages/Investigation';
import { Discussion } from './pages/Discussion';
import { Voting } from './pages/Voting';
import { GameOver } from './pages/GameOver';

export const App: React.FC = () => {
  const { user, login, register, logout, setUser } = useAuth();
  const {
    gameState,
    myRole,
    roleBriefing,
    investigationActionsLeft,
    messages,
    voteResults,
    errorMessage,
    actionReport,
    setActionReport,
    gameOverData,
    joinRoom,
    setReady,
    addBot,
    startGame,
    sendMessage,
    submitVote,
    executePoliceAction,
    executeThiefAction,
    leaveRoom
  } = useGame(user);

  // Modals state
  const [showProfile, setShowProfile] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [loading, setLoading] = useState(false);

  // Room Creation / Join Handlers
  const handleCreateRoom = async (mode = 'CLASSIC') => {
    try {
      setLoading(true);
      const res = await ApiService.createRoom();
      if (res.success && res.roomCode) {
        joinRoom(res.roomCode);
      } else {
        // Fallback local code generation
        const fallbackCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        joinRoom(fallbackCode);
      }
    } catch {
      const fallbackCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      joinRoom(fallbackCode);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRoom = (code: string) => {
    joinRoom(code);
  };

  const handleQuickPlay = async () => {
    try {
      setLoading(true);
      const res = await ApiService.quickPlay();
      if (res.success && res.roomCode) {
        joinRoom(res.roomCode);
      } else {
        handleCreateRoom();
      }
    } catch {
      handleCreateRoom();
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = async (username: string) => {
    const guestUser = {
      id: `guest-${Date.now().toString(36)}`,
      username,
      avatar: 'avatar-detective',
      level: 1,
      gamesPlayed: 0,
      wins: 0,
      losses: 0,
      policeWins: 0,
      undercoverWins: 0,
      thiefWins: 0
    };
    setUser(guestUser);
    localStorage.setItem('theft_user', JSON.stringify(guestUser));
    return true;
  };

  const handleAddBots = (count: number) => {
    for (let i = 0; i < count; i++) {
      addBot();
    }
  };

  const currentUserId = user?.id || '';
  const selfPlayer = gameState?.players.find((p) => p.id === currentUserId);
  const hasVoted = selfPlayer?.hasVoted ?? false;

  return (
    <div className="min-h-screen bg-[#070a10] text-slate-100 flex flex-col font-body selection:bg-police selection:text-white">
      {/* Top Navigation */}
      <Navbar
        user={user}
        gameState={gameState}
        onOpenProfile={() => setShowProfile(true)}
        onOpenRules={() => setShowRules(true)}
        onOpenAdmin={() => setShowAdmin(true)}
        onLeaveRoom={leaveRoom}
      />

      {/* Global Alerts & Notifications */}
      {errorMessage && (
        <div className="fixed top-20 right-6 z-50 animate-bounce">
          <div className="px-4 py-3 rounded-xl bg-rose-600 text-white font-mono text-xs font-bold shadow-2xl flex items-center gap-2 border border-rose-400">
            <span className="material-symbols-outlined text-[18px]">warning</span>
            <span>{errorMessage}</span>
          </div>
        </div>
      )}

      {actionReport && (
        <div className="fixed top-20 right-6 z-50 animate-fade-in">
          <div className="px-4 py-3 rounded-xl bg-police text-white font-mono text-xs font-bold shadow-2xl flex items-center gap-2 border border-police-light">
            <span className="material-symbols-outlined text-[18px]">info</span>
            <span>{actionReport}</span>
            <button
              onClick={() => setActionReport(null)}
              className="ml-2 hover:opacity-80"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Main View Router based on gameState.currentPhase */}
      <main className="flex-1">
        {!gameState && (
          <MainMenu
            user={user}
            onCreateRoom={handleCreateRoom}
            onJoinRoom={handleJoinRoom}
            onQuickPlay={handleQuickPlay}
            onOpenRules={() => setShowRules(true)}
            onOpenProfile={() => setShowProfile(true)}
            onLoginAsGuest={handleGuestLogin}
            onOpenAuth={() => setShowAuth(true)}
          />
        )}

        {gameState && gameState.currentPhase === 'LOBBY' && (
          <Lobby
            gameState={gameState}
            currentUserId={currentUserId}
            onToggleReady={() => setReady(!selfPlayer?.isReady)}
            onStartGame={startGame}
            onAddBot={addBot}
            onRemoveBot={() => {}}
            onLeaveRoom={leaveRoom}
          />
        )}

        {gameState && gameState.currentPhase === 'ROLE_REVEAL' && (
          <RoleReveal
            role={myRole}
            timeRemaining={gameState.phaseTimeRemaining}
          />
        )}

        {gameState && gameState.currentPhase === 'INVESTIGATION' && (
          <Investigation
            gameState={gameState}
            currentUserId={currentUserId}
            role={myRole}
            investigationActionsLeft={investigationActionsLeft}
            onPoliceAction={executePoliceAction}
            onThiefAction={executeThiefAction}
          />
        )}

        {gameState && gameState.currentPhase === 'DISCUSSION' && (
          <Discussion
            gameState={gameState}
            currentUserId={currentUserId}
            role={myRole}
            messages={messages}
            onSendMessage={sendMessage}
          />
        )}

        {gameState && (gameState.currentPhase === 'VOTING' || gameState.currentPhase === 'RESULTS') && (
          <Voting
            gameState={gameState}
            currentUserId={currentUserId}
            hasVoted={hasVoted}
            voteResults={voteResults}
            onSubmitVote={submitVote}
          />
        )}

        {gameState && gameState.currentPhase === 'GAME_OVER' && (
          <GameOver
            gameState={gameState}
            currentUserId={currentUserId}
            onPlayAgain={startGame}
            onBackToMenu={leaveRoom}
          />
        )}
      </main>

      {/* Modals */}
      <ProfileModal
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
        user={user}
        onLogout={logout}
      />

      <RulesModal
        isOpen={showRules}
        onClose={() => setShowRules(false)}
      />

      <AdminModal
        isOpen={showAdmin}
        onClose={() => setShowAdmin(false)}
        onAddBots={handleAddBots}
      />

      <AuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        onLogin={async (u, p) => (await login(u, p)).success}
        onRegister={async (u, p) => (await register(u, p)).success}
        onGuestLogin={handleGuestLogin}
      />
    </div>
  );
};

export default App;
