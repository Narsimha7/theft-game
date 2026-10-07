import { useState, useEffect, useCallback } from 'react';
import { socketService } from '../services/socket';
import { 
  GameStatePublic, 
  Role, 
  ChatMessage, 
  VoteResults, 
  SOCKET_EVENTS, 
  GamePhase,
  UserStats
} from '@theft/shared';
import { soundService } from '../services/audio';

export function useGame(user: UserStats | null) {
  const [gameState, setGameState] = useState<GameStatePublic | null>(null);
  const [myRole, setMyRole] = useState<Role | null>(null);
  const [roleBriefing, setRoleBriefing] = useState<string>('');
  const [investigationActionsLeft, setInvestigationActionsLeft] = useState<number>(2);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [voteResults, setVoteResults] = useState<VoteResults | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [actionReport, setActionReport] = useState<string | null>(null);
  const [gameOverData, setGameOverData] = useState<any | null>(null);

  useEffect(() => {
    if (!user) return;
    const socket = socketService.connect();

    // 1. Room Updated
    socket.on(SOCKET_EVENTS.ROOM_UPDATED, (state: GameStatePublic) => {
      setGameState(state);
    });

    // 2. Game Started
    socket.on(SOCKET_EVENTS.GAME_STARTED, (state: GameStatePublic) => {
      setGameState(state);
      setGameOverData(null);
      setVoteResults(null);
      soundService.playAlarm();
    });

    // 3. Role Assigned (PRIVATE TO THIS PLAYER ONLY)
    socket.on(SOCKET_EVENTS.ROLE_ASSIGNED, (data: { role: Role; investigationActionsLeft?: number; briefing?: string }) => {
      setMyRole(data.role);
      setRoleBriefing(data.briefing || '');
      if (data.investigationActionsLeft !== undefined) {
        setInvestigationActionsLeft(data.investigationActionsLeft);
      }
      soundService.playSelect();
    });

    // 4. Phase Changed
    socket.on(SOCKET_EVENTS.PHASE_CHANGED, (data: { phase: GamePhase; duration: number; roundNumber: number }) => {
      setGameState(prev => prev ? {
        ...prev,
        currentPhase: data.phase,
        phaseTimeRemaining: data.duration,
        roundNumber: data.roundNumber
      } : null);
      soundService.playSelect();
    });

    // 5. Timer Tick
    socket.on(SOCKET_EVENTS.TIMER_TICK, ({ timeRemaining }: { timeRemaining: number }) => {
      setGameState(prev => prev ? { ...prev, phaseTimeRemaining: timeRemaining } : null);
      if (timeRemaining <= 10 && timeRemaining > 0) {
        soundService.playTick();
      }
    });

    // 6. Receive Message
    socket.on(SOCKET_EVENTS.RECEIVE_MESSAGE, (msg: ChatMessage) => {
      setMessages(prev => [...prev, msg]);
      soundService.playClick();
    });

    // 7. Action Result
    socket.on(SOCKET_EVENTS.ACTION_RESULT, (data: { report: string; actionsRemaining?: number }) => {
      setActionReport(data.report);
      if (data.actionsRemaining !== undefined) {
        setInvestigationActionsLeft(data.actionsRemaining);
      }
      soundService.playSuccess();
    });

    // 8. Vote Results
    socket.on(SOCKET_EVENTS.VOTE_RESULTS, (results: VoteResults) => {
      setVoteResults(results);
      soundService.playArrest();
    });

    // 9. Game Over
    socket.on(SOCKET_EVENTS.GAME_OVER, (data: any) => {
      setGameOverData(data);
      soundService.playAlarm();
    });

    // 10. Error Message
    socket.on(SOCKET_EVENTS.ERROR_MESSAGE, ({ error }: { error: string }) => {
      setErrorMessage(error);
      setTimeout(() => setErrorMessage(null), 4000);
    });

    return () => {
      socket.off(SOCKET_EVENTS.ROOM_UPDATED);
      socket.off(SOCKET_EVENTS.GAME_STARTED);
      socket.off(SOCKET_EVENTS.ROLE_ASSIGNED);
      socket.off(SOCKET_EVENTS.PHASE_CHANGED);
      socket.off(SOCKET_EVENTS.TIMER_TICK);
      socket.off(SOCKET_EVENTS.RECEIVE_MESSAGE);
      socket.off(SOCKET_EVENTS.ACTION_RESULT);
      socket.off(SOCKET_EVENTS.VOTE_RESULTS);
      socket.off(SOCKET_EVENTS.GAME_OVER);
      socket.off(SOCKET_EVENTS.ERROR_MESSAGE);
    };
  }, [user]);

  const joinRoom = useCallback((roomCode: string) => {
    if (!user) return;
    socketService.joinRoom(roomCode, user);
  }, [user]);

  const setReady = useCallback((isReady: boolean) => {
    if (!gameState) return;
    socketService.setReady(gameState.roomCode, isReady);
  }, [gameState]);

  const addBot = useCallback(() => {
    if (!gameState) return;
    socketService.addBot(gameState.roomCode);
  }, [gameState]);

  const startGame = useCallback(() => {
    if (!gameState) return;
    socketService.startGame(gameState.roomCode);
  }, [gameState]);

  const sendMessage = useCallback((text: string) => {
    if (!gameState) return;
    socketService.sendMessage(gameState.roomCode, text);
  }, [gameState]);

  const submitVote = useCallback((targetId: string) => {
    if (!gameState) return;
    socketService.submitVote(gameState.roomCode, targetId);
    soundService.playSelect();
  }, [gameState]);

  const executePoliceAction = useCallback((actionType: any, targetPlayerId?: string) => {
    if (!gameState) return;
    socketService.policeAction(gameState.roomCode, actionType, targetPlayerId);
  }, [gameState]);

  const executeThiefAction = useCallback((objectiveId: string) => {
    if (!gameState) return;
    socketService.thiefAction(gameState.roomCode, objectiveId);
  }, [gameState]);

  const leaveRoom = useCallback(() => {
    if (gameState) {
      socketService.leaveRoom(gameState.roomCode);
    }
    setGameState(null);
    setMyRole(null);
    setMessages([]);
    setVoteResults(null);
    setGameOverData(null);
  }, [gameState]);

  return {
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
  };
}
