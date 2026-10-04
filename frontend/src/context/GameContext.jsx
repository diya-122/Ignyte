import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { api } from '../services/api';
import { vibrate, playSound } from '../utils/haptics';

const GameContext = createContext(null);

const applyTeamTheme = (team) => {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  
  switch (team) {
    case 'india':
      root.style.setProperty('--accent-primary', '#0077FF');
      root.style.setProperty('--accent-secondary', '#FF9933');
      root.style.setProperty('--accent-gradient', 'linear-gradient(135deg, #0077FF, #FF9933)');
      break;
    case 'australia':
      root.style.setProperty('--accent-primary', '#FFD700');
      root.style.setProperty('--accent-secondary', '#008000');
      root.style.setProperty('--accent-gradient', 'linear-gradient(135deg, #FFD700, #008000)');
      break;
    case 'england':
      root.style.setProperty('--accent-primary', '#E00000');
      root.style.setProperty('--accent-secondary', '#000033');
      root.style.setProperty('--accent-gradient', 'linear-gradient(135deg, #E00000, #000033)');
      break;
    case 'south africa':
      root.style.setProperty('--accent-primary', '#007A4D');
      root.style.setProperty('--accent-secondary', '#FFB81C');
      root.style.setProperty('--accent-gradient', 'linear-gradient(135deg, #007A4D, #FFB81C)');
      break;
    default:
      root.style.setProperty('--accent-primary', '#00E5FF');
      root.style.setProperty('--accent-secondary', '#FF427F');
      root.style.setProperty('--accent-gradient', 'linear-gradient(135deg, #00E5FF, #FF427F)');
  }
};

export function GameProvider({ children }) {
  const [user, setUser] = useState(null);
  const [match, setMatch] = useState(null);
  const [currentBall, setCurrentBall] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [celebration, setCelebration] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const registerUser = useCallback(async (data) => {
    const result = await api.register(data);
    setUser(result.user);
    applyTeamTheme(result.user.favouriteTeam);
    localStorage.setItem('sixer_user_id', result.user.id);
    return result.user;
  }, []);

  const loadUser = useCallback(async () => {
    const id = localStorage.getItem('sixer_user_id');
    if (id) {
      try {
        const userData = await api.getUser(id);
        setUser(userData);
        applyTeamTheme(userData.favouriteTeam);
        return userData;
      } catch {
        localStorage.removeItem('sixer_user_id');
        return null;
      }
    }
    return null;
  }, []);

  const loadMatch = useCallback(async () => {
    const matchData = await api.getMatch();
    setMatch(matchData);
    return matchData;
  }, []);

  const fetchNextBall = useCallback(async () => {
    setIsLoading(true);
    const result = await api.nextBall();
    if (!result.completed) {
      setCurrentBall(result.ball);
      setMatch(result.match);
    }
    setIsLoading(false);
    return result;
  }, []);

  const makePrediction = useCallback(async (pick) => {
    if (!user) return;
    setIsLoading(true);
    
    // First fetch the next ball
    const ballResult = await api.nextBall();
    if (ballResult.completed) {
      setIsLoading(false);
      return { completed: true };
    }
    
    setCurrentBall(ballResult.ball);
    setMatch(ballResult.match);

    // Determine outcome
    const ball = ballResult.ball;
    let outcome;
    if (ball.wicket) outcome = 'wicket';
    else if (ball.runs === 0) outcome = 'dot';
    else if (ball.runs === 4) outcome = 'four';
    else if (ball.runs === 6) outcome = 'six';
    else outcome = '1-3';

    const correct = pick === outcome;
    let xpEarned = 20;

    if (correct) {
      playSound('success');
      vibrate([50, 50, 100]); // Short-short-long vibration

      xpEarned = 50;
      const newStreak = (user.streak || 0) + 1;
      if (newStreak === 3) xpEarned += 25;
      if (newStreak === 5) xpEarned += 50;

      setUser(prev => ({
        ...prev,
        xp: prev.xp + xpEarned,
        streak: newStreak,
        correctPredictions: prev.correctPredictions + 1,
        predictionsCount: prev.predictionsCount + 1,
        level: Math.floor((prev.xp + xpEarned) / 200) + 1,
      }));

      setCelebration({
        type: 'correct',
        outcome,
        xp: xpEarned,
        streak: (user.streak || 0) + 1,
        commentary: ball.commentary,
      });
    } else {
      playSound('error');
      vibrate(100); // Single long thud

      setUser(prev => ({
        ...prev,
        xp: prev.xp + xpEarned,
        streak: 0,
        predictionsCount: prev.predictionsCount + 1,
        level: Math.floor((prev.xp + xpEarned) / 200) + 1,
      }));

      setCelebration({
        type: 'wrong',
        outcome,
        pick,
        xp: xpEarned,
        commentary: ball.commentary,
      });
    }

    const predData = {
      pick,
      outcome,
      correct,
      xpEarned,
      ball,
      timestamp: new Date().toISOString(),
    };
    setPrediction(predData);
    setIsLoading(false);

    // Auto-dismiss celebration
    setTimeout(() => setCelebration(null), 3000);

    return predData;
  }, [user]);

  const dismissCelebration = useCallback(() => {
    setCelebration(null);
  }, []);

  const addXP = useCallback((amount) => {
    setUser(prev => {
      if (!prev) return prev;
      const newXP = prev.xp + amount;
      return {
        ...prev,
        xp: newXP,
        level: Math.floor(newXP / 200) + 1,
      };
    });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('sixer_user_id');
    setUser(null);
    setMatch(null);
    setCurrentBall(null);
    setPrediction(null);
  }, []);

  const value = {
    user,
    setUser,
    match,
    setMatch,
    currentBall,
    prediction,
    celebration,
    isLoading,
    registerUser,
    loadUser,
    loadMatch,
    fetchNextBall,
    makePrediction,
    dismissCelebration,
    addXP,
    logout,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame must be used within GameProvider');
  return context;
}
