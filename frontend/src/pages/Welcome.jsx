import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, BookOpen, Users, Trophy } from 'lucide-react';

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="welcome-screen">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <div className="welcome-logo">SIXER</div>
        <p className="welcome-tagline">Watch. Predict. Play. Belong.</p>
      </motion.div>

      <motion.div
        className="welcome-features"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <div className="welcome-feature">
          <span className="welcome-feature-icon"><Zap size={20} color="#6366f1" /></span>
          <span>Predict every ball & earn XP</span>
        </div>
        <div className="welcome-feature">
          <span className="welcome-feature-icon"><BookOpen size={20} color="#10b981" /></span>
          <span>Learn cricket with AI Coach</span>
        </div>
        <div className="welcome-feature">
          <span className="welcome-feature-icon"><Users size={20} color="#f97316" /></span>
          <span>Join the fan community</span>
        </div>
        <div className="welcome-feature">
          <span className="welcome-feature-icon"><Trophy size={20} color="#f59e0b" /></span>
          <span>Climb the leaderboard</span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        style={{ width: '100%', maxWidth: 320 }}
      >
        <button
          className="btn btn-primary btn-lg btn-full"
          onClick={() => navigate('/discover')}
          id="btn-get-started"
        >
          🏏 Find Your Cricket Personality
        </button>
        <p className="text-muted text-sm text-center mt-3">
          Takes 30 seconds • No cricket knowledge needed
        </p>
      </motion.div>
    </div>
  );
}
