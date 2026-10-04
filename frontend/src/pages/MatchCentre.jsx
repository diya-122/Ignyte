import { useEffect, useState, useCallback, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, MessageCircle, Brain, Users, ExternalLink, Mic } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { api } from '../services/api';
import CelebrationOverlay from '../components/CelebrationOverlay';
import AICoach from '../components/AICoach';
import TiltCard from '../components/TiltCard';
import MiniScoreboard from '../components/MiniScoreboard';

export default function MatchCentre() {
  const { user, match, loadMatch, makePrediction, celebration, dismissCelebration, isLoading } = useGame();
  const [selectedPick, setSelectedPick] = useState(null);
  const [lastResult, setLastResult] = useState(null);
  const [showCoach, setShowCoach] = useState(false);
  const [commentary, setCommentary] = useState('Waiting for the next delivery...');
  const [ballHistory, setBallHistory] = useState([]);
  const [predictionPhase, setPredictionPhase] = useState('pick'); // 'pick' | 'waiting' | 'result'
  const [crowdStats, setCrowdStats] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const pipRootRef = useRef(null);

  const handleOpenPip = async () => {
    if ('documentPictureInPicture' in window) {
      try {
        const pipWindow = await window.documentPictureInPicture.requestWindow({
          width: 320,
          height: 200,
        });

        // Create a container in the PiP window
        const container = pipWindow.document.createElement('div');
        container.id = 'pip-root';
        pipWindow.document.body.appendChild(container);

        // Render the React component into it
        pipRootRef.current = createRoot(container);
        pipRootRef.current.render(<MiniScoreboard match={match} />);

        pipWindow.addEventListener('pagehide', () => {
          if (pipRootRef.current) {
            pipRootRef.current.unmount();
            pipRootRef.current = null;
          }
        });
      } catch (error) {
        console.error('Failed to open PiP window:', error);
      }
    } else {
      alert('Document Picture-in-Picture is not supported in your browser.');
    }
  };

  // Update PiP window when match changes
  useEffect(() => {
    if (pipRootRef.current) {
      pipRootRef.current.render(<MiniScoreboard match={match} />);
    }
  }, [match]);

  const generateCrowdStats = useCallback(() => {
    // Generate realistic looking percentages that sum to 100
    const raw = [Math.random() * 40 + 20, Math.random() * 20 + 5, Math.random() * 20 + 5, Math.random() * 15 + 2, Math.random() * 15 + 2];
    const sum = raw.reduce((a, b) => a + b, 0);
    const normalized = raw.map(r => Math.round((r / sum) * 100));
    
    // Fix rounding errors to ensure exactly 100%
    const diff = 100 - normalized.reduce((a, b) => a + b, 0);
    normalized[0] += diff;

    setCrowdStats({
      '1-3': normalized[0],
      'dot': normalized[1],
      'four': normalized[2],
      'six': normalized[3],
      'wicket': normalized[4]
    });
  }, []);

  useEffect(() => {
    loadMatch();
    generateCrowdStats();
  }, [loadMatch, generateCrowdStats]);

  const handlePrediction = useCallback(async (pick) => {
    if (predictionPhase !== 'pick' || isLoading) return;
    
    setSelectedPick(pick);
    setPredictionPhase('waiting');

    // Suspense delay for drama
    await new Promise(r => setTimeout(r, 1200));

    const result = await makePrediction(pick);
    
    if (result && !result.completed) {
      setLastResult(result);
      setCommentary(result.ball?.commentary || '');
      setBallHistory(prev => [...prev, result]);
      setPredictionPhase('result');

      // Reset for next ball after celebration
      setTimeout(() => {
        setPredictionPhase('pick');
        setSelectedPick(null);
        setLastResult(null);
        generateCrowdStats();
      }, 3500);
    }
  }, [makePrediction, predictionPhase, isLoading, generateCrowdStats]);

  const handleVoiceCommand = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Voice predictions are not supported in this browser. Try Chrome!');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      console.log('Voice heard:', transcript);
      
      let pick = null;
      if (transcript.includes('wicket') || transcript.includes('out') || transcript.includes('catch')) pick = 'wicket';
      else if (transcript.includes('six')) pick = 'six';
      else if (transcript.includes('four') || transcript.includes('boundary')) pick = 'four';
      else if (transcript.includes('dot') || transcript.includes('zero')) pick = 'dot';
      else if (transcript.includes('one') || transcript.includes('two') || transcript.includes('three') || transcript.includes('run')) pick = '1-3';

      if (pick) {
        handlePrediction(pick);
      } else {
        alert("Couldn't understand the prediction. Please say 'Six', 'Four', 'Wicket', 'Dot', or 'Single'.");
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
    };

    recognition.onend = () => setIsListening(false);
    
    recognition.start();
  }, [handlePrediction]);

  const handleResetMatch = async () => {
    await api.resetMatch();
    await loadMatch();
    setBallHistory([]);
    setCommentary('Match reset! Ready for the first delivery.');
    setPredictionPhase('pick');
    setSelectedPick(null);
    setLastResult(null);
    generateCrowdStats();
  };

  const predictionOptions = [
    { id: 'dot', emoji: '⭕', label: 'DOT', color: '#6b7280' },
    { id: '1-3', emoji: '🏃', label: '1-3', color: '#3b82f6' },
    { id: 'four', emoji: '4️⃣', label: 'FOUR', color: '#10b981' },
    { id: 'six', emoji: '6️⃣', label: 'SIX', color: '#f59e0b' },
    { id: 'wicket', emoji: '🔴', label: 'WICKET', color: '#ef4444' },
  ];

  const getCommentaryClass = () => {
    if (!lastResult) return '';
    const ball = lastResult.ball;
    if (ball?.wicket) return 'wicket';
    if (ball?.runs === 4) return 'boundary';
    if (ball?.runs === 6) return 'six';
    return '';
  };

  return (
    <div className="fade-in">
      {/* Celebration overlay */}
      <AnimatePresence>
        {celebration && (
          <CelebrationOverlay celebration={celebration} onDismiss={dismissCelebration} />
        )}
      </AnimatePresence>

      {/* Match Header with 3D Tilt */}
      <TiltCard>
        <motion.div
          className="match-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ position: 'relative', overflow: 'hidden' }}
        >
          {/* Faded background image in header */}
          <div style={{ position: 'absolute', inset: 0, background: 'url(/hero_bg.png) center/cover', opacity: 0.15, zIndex: 0 }} />
          
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div className="flex items-center justify-between mb-2">
              <span className="match-live-badge">
                <span className="match-live-dot" />
                LIVE
              </span>
              <div className="flex gap-2">
                <button className="btn btn-ghost btn-icon" onClick={handleOpenPip} title="Pop out minimised scoreboard">
                  <ExternalLink size={16} />
                </button>
                <button className="btn btn-ghost btn-icon" onClick={handleResetMatch} title="Reset match">
                  <RefreshCw size={16} />
                </button>
              </div>
            </div>

            <div className="match-teams">
              <span className="match-team-name">🇮🇳 {match?.homeTeam || 'IND-W'}</span>
              <span className="match-vs">vs</span>
              <span className="match-team-name">{match?.awayTeam || 'AUS-W'} 🇦🇺</span>
            </div>

        <div className="match-score">
          {match?.score?.runs || 0}/{match?.score?.wickets || 0}
        </div>
        <div className="match-overs">
          {match?.score?.overs || '0.0'} overs • Target: {match?.target || 180}
        </div>

        {/* Win Probability */}
        <div style={{ margin: '12px 0 4px' }}>
          <div className="flex items-center justify-between text-xs mb-1">
            <span style={{ color: '#6366f1' }}>IND {match?.winProbability || 50}%</span>
            <span style={{ color: '#f97316' }}>AUS {100 - (match?.winProbability || 50)}%</span>
          </div>
          <div className="win-prob-bar">
            <div className="win-prob-fill win-prob-home" style={{ width: `${match?.winProbability || 50}%` }} />
            <div className="win-prob-fill win-prob-away" style={{ width: `${100 - (match?.winProbability || 50)}%` }} />
          </div>
        </div>

        <div className="match-stats">
          <div className="match-stat">
            <div className="match-stat-value">{match?.runRate || '0.00'}</div>
            <div className="match-stat-label">Run Rate</div>
          </div>
          <div className="match-stat">
            <div className="match-stat-value" style={{ color: 'var(--cricket-gold)' }}>{match?.requiredRunRate || '9.00'}</div>
            <div className="match-stat-label">Req. Rate</div>
          </div>
          <div className="match-stat">
            <div className="match-stat-value">{match?.target ? match.target - match.score.runs : 180}</div>
            <div className="match-stat-label">Runs Needed</div>
          </div>
        </div>

        {/* Current Players */}
        <div className="match-info-bar">
          <div>
            <span className="text-xs text-muted">🏏 </span>
            <span style={{ fontWeight: 600, fontSize: 13 }}>{match?.currentBatter || 'Mandhana'}</span>
          </div>
          <div>
            <span className="text-xs text-muted">⚾ </span>
            <span style={{ fontWeight: 600, fontSize: 13 }}>{match?.currentBowler || 'Perry'}</span>
          </div>
        </div>

        {/* Last 6 Balls */}
        {match?.lastSix?.length > 0 && (
          <div className="flex items-center justify-center gap-2 mt-3">
            <span className="text-xs text-muted" style={{ marginRight: 4 }}>This over:</span>
            <div className="last-balls">
              {match.lastSix.map((ball, i) => {
                const isWicket = String(ball).includes('W');
                const runs = parseInt(ball) || 0;
                let cls = 'dot';
                if (isWicket) cls = 'wicket';
                else if (runs === 4) cls = 'four';
                else if (runs === 6) cls = 'six';
                return (
                  <div key={i} className={`ball-result ${cls}`}>
                    {isWicket ? 'W' : runs}
                  </div>
                );
              })}
            </div>
          </div>
        )}
        </div>
        </motion.div>
      </TiltCard>

      {/* Commentary */}
      <motion.div
        className={`commentary-box ${getCommentaryClass()}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        key={commentary}
      >
        <p>{commentary}</p>
      </motion.div>

      {/* Prediction Panel */}
      <motion.div
        className="prediction-panel"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="prediction-title flex items-center gap-2">
              {predictionPhase === 'pick' ? '⚡ What Happens Next?' : 
               predictionPhase === 'waiting' ? '🎲 Revealing...' : 
               lastResult?.correct ? '🎉 Result!' : '😤 Result!'}
            </h3>
            <p className="prediction-subtitle">
              {predictionPhase === 'pick' ? 'Pick the outcome of the next ball' :
               predictionPhase === 'waiting' ? 'The bowler runs in...' : 
               commentary}
            </p>
          </div>
          
          <div className="flex gap-2 items-center">
            {predictionPhase === 'pick' && (
              <button 
                className={`btn btn-icon ${isListening ? 'bg-red-500 text-white animate-pulse' : 'btn-secondary'}`}
                onClick={handleVoiceCommand}
                title="Voice Prediction"
                style={isListening ? { background: 'var(--cricket-red)', borderColor: 'var(--cricket-red)', color: 'white', boxShadow: '0 0 15px rgba(239,68,68,0.5)' } : {}}
              >
                <Mic size={16} />
              </button>
            )}
            
            {user?.streak > 0 && predictionPhase === 'pick' && (
              <div className="streak-counter" style={{ fontSize: 12 }}>
                <span className="streak-fire">🔥</span>
                <span>×{user.streak}</span>
              </div>
            )}
          </div>
        </div>

        <div className="prediction-options">
          {predictionOptions.map((opt) => {
            let btnClass = 'btn btn-prediction';
            if (selectedPick === opt.id) {
              if (predictionPhase === 'result') {
                btnClass += lastResult?.correct ? ' btn-correct' : ' btn-wrong';
              } else {
                btnClass += ' selected';
              }
            }
            if (predictionPhase === 'result' && lastResult?.outcome === opt.id && !lastResult?.correct) {
              btnClass += ' btn-correct';
            }

            const crowdPercentage = crowdStats ? crowdStats[opt.id] : 0;
            return (
              <motion.button
                key={opt.id}
                className={btnClass}
                onClick={() => handlePrediction(opt.id)}
                disabled={predictionPhase !== 'pick'}
                whileHover={predictionPhase === 'pick' ? { scale: 1.05 } : {}}
                whileTap={predictionPhase === 'pick' ? { scale: 0.95 } : {}}
                style={{ opacity: predictionPhase !== 'pick' && selectedPick !== opt.id && lastResult?.outcome !== opt.id ? 0.4 : 1 }}
              >
                <span className="prediction-emoji">{opt.emoji}</span>
                <span className="prediction-label">{opt.label}</span>
                {predictionPhase === 'pick' && crowdStats && (
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '2px' }}>
                    <Users size={10} /> {crowdPercentage}%
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* XP Earned */}
        <AnimatePresence>
          {predictionPhase === 'result' && lastResult && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center mt-3"
            >
              <span style={{
                fontSize: 16,
                fontWeight: 800,
                fontFamily: 'var(--font-display)',
                background: lastResult.correct ? 'var(--correct-gradient)' : 'var(--wrong-gradient)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                {lastResult.correct ? `✅ CORRECT! +${lastResult.xpEarned} XP` : `❌ It was ${lastResult.outcome.toUpperCase()} • +${lastResult.xpEarned} XP`}
              </span>
              {lastResult.correct && user?.streak >= 3 && (
                <p className="text-xs mt-1" style={{ color: '#f97316' }}>🔥 {user.streak} streak bonus!</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Action Buttons */}
      <div className="flex gap-2 mt-3">
        <button
          className="btn btn-secondary flex-1"
          onClick={() => setShowCoach(!showCoach)}
          style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
        >
          <Brain size={18} />
          {showCoach ? 'Hide Coach' : 'AI Coach'}
        </button>
      </div>

      {/* AI Coach */}
      <AnimatePresence>
        {showCoach && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3"
          >
            <AICoach matchContext={match} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ball History */}
      {ballHistory.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-5"
        >
          <div className="section-header">
            <h3 className="section-title">📝 Your Predictions</h3>
            <span className="text-xs text-muted">{ballHistory.filter(b => b.correct).length}/{ballHistory.length} correct</span>
          </div>
          <div className="flex flex-col gap-2" style={{ maxHeight: 200, overflowY: 'auto' }}>
            {[...ballHistory].reverse().slice(0, 8).map((result, i) => (
              <div
                key={i}
                className="flex items-center gap-3"
                style={{
                  padding: '8px 12px',
                  background: result.correct ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.05)',
                  borderRadius: 'var(--radius-md)',
                  borderLeft: `3px solid ${result.correct ? '#10b981' : '#ef4444'}`,
                  fontSize: 13,
                }}
              >
                <span>{result.correct ? '✅' : '❌'}</span>
                <span className="text-muted" style={{ flex: 1 }}>
                  Picked {result.pick} → was {result.outcome}
                </span>
                <span style={{ fontWeight: 700, color: result.correct ? '#10b981' : '#ef4444', fontFamily: 'var(--font-display)' }}>
                  +{result.xpEarned} XP
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
