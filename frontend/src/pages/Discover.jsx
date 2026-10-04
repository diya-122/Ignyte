import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { api } from '../services/api';

export default function Discover() {
  const navigate = useNavigate();
  const { registerUser } = useGame();
  const [quizData, setQuizData] = useState(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [phase, setPhase] = useState('quiz'); // 'quiz' | 'result' | 'register'
  const [resultTeam, setResultTeam] = useState(null);
  const [name, setName] = useState('');
  const [city, setCity] = useState('');

  const teams = {
    india: { name: 'India Women', emoji: '🇮🇳', color: '#FF9933', personality: 'The Power Player', desc: 'You\'re all about bold moves and big moments! You love the thrill of a six and the roar of the crowd.' },
    australia: { name: 'Australia Women', emoji: '🇦🇺', color: '#FFD700', personality: 'The Strategist', desc: 'You think ahead, plan your moves, and love outsmarting the competition. Sharp mind, sharp game!' },
    england: { name: 'England Women', emoji: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', color: '#CF142B', personality: 'The Social Fan', desc: 'For you, cricket is about the experience — the friends, the atmosphere, and the memories.' },
    south_africa: { name: 'South Africa Women', emoji: '🇿🇦', color: '#007749', personality: 'The Passionate Heart', desc: 'You feel every run, every wicket, every victory deeply. Your passion is what makes sports special.' },
  };

  useEffect(() => {
    api.getPersonalityQuiz().then(setQuizData).catch(console.error);
  }, []);

  const handleAnswer = (option) => {
    setSelectedOption(option);
    const newAnswers = [...answers, option.team];

    setTimeout(() => {
      setSelectedOption(null);
      setAnswers(newAnswers);

      if (currentQ < (quizData?.questions?.length || 3) - 1) {
        setCurrentQ(currentQ + 1);
      } else {
        // Calculate result
        const counts = {};
        newAnswers.forEach(t => { counts[t] = (counts[t] || 0) + 1; });
        const topTeam = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
        setResultTeam(topTeam);
        setPhase('result');
      }
    }, 400);
  };

  const handleRegister = async () => {
    if (!name.trim()) return;
    try {
      await registerUser({
        displayName: name.trim(),
        city: city.trim() || 'Unknown',
        favouriteTeam: resultTeam,
      });
      navigate('/');
    } catch (err) {
      console.error('Registration failed:', err);
    }
  };

  if (!quizData) {
    return (
      <div className="welcome-screen">
        <div className="welcome-logo">SIXER</div>
        <p className="text-muted">Loading quiz...</p>
      </div>
    );
  }

  return (
    <div className="quiz-container" style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <AnimatePresence mode="wait">
        {phase === 'quiz' && (
          <motion.div
            key={`q-${currentQ}`}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            {/* Progress */}
            <div className="quiz-progress">
              {quizData.questions.map((_, i) => (
                <div
                  key={i}
                  className={`quiz-progress-dot ${i === currentQ ? 'active' : ''} ${i < currentQ ? 'completed' : ''}`}
                />
              ))}
            </div>

            <p className="text-muted text-sm mb-3">Question {currentQ + 1} of {quizData.questions.length}</p>

            <h2 className="quiz-question">{quizData.questions[currentQ].question}</h2>

            <div className="quiz-options">
              {quizData.questions[currentQ].options.map((opt, i) => (
                <button
                  key={i}
                  className={`quiz-option ${selectedOption === opt ? 'selected' : ''}`}
                  onClick={() => handleAnswer(opt)}
                >
                  {opt.text}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {phase === 'result' && resultTeam && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, type: 'spring' }}
          >
            <div style={{ fontSize: 72, marginBottom: 12 }}>{teams[resultTeam].emoji}</div>
            <h2 className="quiz-question" style={{ fontSize: 26, marginBottom: 8 }}>
              You're {teams[resultTeam].personality}!
            </h2>
            <p className="text-muted" style={{ fontSize: 15, marginBottom: 8, maxWidth: 300, margin: '0 auto' }}>
              {teams[resultTeam].desc}
            </p>
            <div className="badge" style={{ borderColor: teams[resultTeam].color, color: teams[resultTeam].color, margin: '16px auto' }}>
              Your Team: {teams[resultTeam].name}
            </div>

            <button
              className="btn btn-primary btn-lg btn-full mt-5"
              onClick={() => setPhase('register')}
              id="btn-continue-to-register"
            >
              Continue →
            </button>
          </motion.div>
        )}

        {phase === 'register' && (
          <motion.div
            key="register"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            style={{ textAlign: 'left' }}
          >
            <h2 className="quiz-question" style={{ textAlign: 'center', marginBottom: 24 }}>
              Almost there! 🏏
            </h2>

            <div className="form-group">
              <label className="form-label">What should we call you?</label>
              <input
                className="input"
                type="text"
                placeholder="Enter your fan name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={20}
                id="input-display-name"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Your city (optional)</label>
              <input
                className="input"
                type="text"
                placeholder="e.g. Mumbai, Delhi, Bangalore"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                id="input-city"
              />
            </div>

            <button
              className="btn btn-primary btn-lg btn-full mt-4"
              onClick={handleRegister}
              disabled={!name.trim()}
              style={{ opacity: name.trim() ? 1 : 0.5 }}
              id="btn-start-playing"
            >
              🚀 Start Playing
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
