import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Target, BookOpen, MessageCircle, ChevronRight, Flame, Star, PlayCircle } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { api } from '../services/api';

export default function Home() {
  const navigate = useNavigate();
  const { user, loadMatch, match } = useGame();
  const [quests, setQuests] = useState([]);

  useEffect(() => {
    loadMatch();
    api.getQuests().then(setQuests).catch(console.error);
  }, [loadMatch]);

  const levelNames = {
    1: 'Curious Fan', 2: 'Curious Fan', 3: 'Curious Fan', 4: 'Curious Fan',
    5: 'Rookie', 6: 'Rookie', 7: 'Rookie', 8: 'Rookie', 9: 'Rookie',
    10: 'Supporter', 11: 'Supporter', 12: 'Supporter', 13: 'Supporter', 14: 'Supporter',
    15: 'Supporter', 16: 'Supporter', 17: 'Supporter', 18: 'Supporter', 19: 'Supporter',
    20: 'Superfan', 21: 'Superfan', 22: 'Superfan', 23: 'Superfan', 24: 'Superfan',
    25: 'Superfan', 26: 'Superfan', 27: 'Superfan', 28: 'Superfan', 29: 'Superfan',
    30: 'Cricket Expert',
  };

  const xpForNextLevel = (user?.level || 1) * 200;
  const xpProgress = user ? ((user.xp % 200) / 200) * 100 : 0;

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const dailyQuests = quests.filter(q => q.type === 'daily').slice(0, 3);

  // Mock stories for the new Cricinfo-style feature
  const stories = [
    { id: 1, title: 'Top Play', emoji: '🔥', color: 'linear-gradient(135deg, #f97316, #ef4444)' },
    { id: 2, title: 'Learn RRR', emoji: '📚', color: 'linear-gradient(135deg, #10b981, #06b6d4)' },
    { id: 3, title: 'Fan Meet', emoji: '👥', color: 'linear-gradient(135deg, #6366f1, #8b5cf6)' },
    { id: 4, title: 'WC 2024', emoji: '🏆', color: 'linear-gradient(135deg, #f59e0b, #d97706)' },
    { id: 5, title: 'Highlights', emoji: '🎬', color: 'linear-gradient(135deg, #ec4899, #be185d)' },
  ];

  return (
    <div className="fade-in">
      {/* Greeting Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ marginBottom: 16 }}
      >
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-muted text-sm">{greeting()}</p>
            <h1 className="font-display font-bold text-lg">{user?.displayName} 👋</h1>
          </div>
          {user?.streak > 0 && (
            <div className="streak-counter">
              <span className="streak-fire">🔥</span>
              <span>{user.streak} streak</span>
            </div>
          )}
        </div>

        {/* XP Progress */}
        <div className="card" style={{ padding: 12 }}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Star size={16} color="#f59e0b" />
              <span className="text-sm font-bold">Level {user?.level || 1}</span>
              <span className="text-xs text-muted">• {levelNames[Math.min(user?.level || 1, 30)]}</span>
            </div>
            <span className="text-xs text-accent">{user?.xp || 0} XP</span>
          </div>
          <div className="xp-bar-container">
            <div className="xp-bar-fill" style={{ width: `${xpProgress}%` }} />
          </div>
        </div>
      </motion.div>

      {/* Stories Carousel (Cricinfo inspired) */}
      <motion.div 
        className="stories-container mb-5"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar" style={{ scrollSnapType: 'x mandatory' }}>
          {stories.map(story => (
            <div key={story.id} className="story-item" style={{ scrollSnapAlign: 'start', flexShrink: 0 }}>
              <div className="story-ring" style={{ background: story.color }}>
                <div className="story-inner">
                  <span style={{ fontSize: 24 }}>{story.emoji}</span>
                </div>
              </div>
              <span className="story-title text-xs mt-1 text-center block w-full truncate">{story.title}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Match Carousel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-5"
      >
        <div className="section-header">
          <h2 className="section-title">🏏 Live Matches</h2>
        </div>
        
        <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar" style={{ scrollSnapType: 'x mandatory' }}>
          {/* Main Live Match */}
          <div
            className="card card-gradient match-carousel-card"
            onClick={() => navigate('/match')}
            style={{ cursor: 'pointer', scrollSnapAlign: 'start', flexShrink: 0, width: '280px' }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-muted">T20I Series • Mumbai</span>
              <span className="match-live-badge"><span className="match-live-dot" />LIVE</span>
            </div>
            
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="font-display font-bold text-md flex items-center gap-2">
                  🇮🇳 {match?.homeTeam || 'IND-W'}
                </p>
                <p className="font-display font-bold text-md flex items-center gap-2 mt-1">
                  🇦🇺 {match?.awayTeam || 'AUS-W'}
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p className="font-display font-black text-lg text-accent">
                  {match?.score?.runs || 0}/{match?.score?.wickets || 0}
                </p>
                <p className="text-xs text-muted mt-1 text-right">Target: {match?.target || 180}</p>
              </div>
            </div>

            <div className="match-info-bar py-2 px-3 mt-0 mb-0">
              <span className="text-xs text-indigo-400 font-bold">Predict Next Ball →</span>
            </div>
          </div>

          {/* Dummy Match 1 */}
          <div className="card match-carousel-card" style={{ scrollSnapAlign: 'start', flexShrink: 0, width: '280px', opacity: 0.8 }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-muted">ODI • London</span>
              <span className="text-xs text-green-400 font-bold">FINISHED</span>
            </div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="font-display font-bold text-md">🏴󠁧󠁢󠁥󠁮󠁧󠁿 ENG-W</p>
                <p className="font-display font-bold text-md mt-1">🇿🇦 SA-W</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p className="font-bold text-sm">240/8</p>
                <p className="font-bold text-sm mt-1 text-muted">235/10</p>
              </div>
            </div>
            <div className="text-xs text-muted mt-2">ENG-W won by 5 runs</div>
          </div>

          {/* Upcoming Match with Reminder */}
          <div className="card match-carousel-card" style={{ scrollSnapAlign: 'start', flexShrink: 0, width: '280px' }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-muted">T20I • Tomorrow, 7:30 PM</span>
              <span className="text-xs text-accent font-bold">UPCOMING</span>
            </div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="font-display font-bold text-md">🇳🇿 NZ-W</p>
                <p className="font-display font-bold text-md mt-1">🇵🇰 PAK-W</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <button 
                  className="btn btn-secondary" 
                  style={{ padding: '6px 12px', fontSize: '11px', background: 'var(--bg-glass-strong)' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    alert('🔔 Push notification reminder set for tomorrow at 7:15 PM!');
                    e.currentTarget.innerText = '✅ Reminder Set';
                    e.currentTarget.style.color = 'var(--cricket-green)';
                  }}
                >
                  🔔 Remind Me
                </button>
              </div>
            </div>
            <div className="text-xs text-muted mt-2">Get 50 XP for early predictions!</div>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-2"
      >
        <div className="grid-2">
          <div className="card" onClick={() => navigate('/match')} style={{ cursor: 'pointer', textAlign: 'center', padding: '16px 12px' }}>
            <Target size={24} color="#6366f1" style={{ margin: '0 auto 8px' }} />
            <p className="font-bold text-sm">Predict</p>
          </div>
          <div className="card" onClick={() => navigate('/fan-zone')} style={{ cursor: 'pointer', textAlign: 'center', padding: '16px 12px' }}>
            <MessageCircle size={24} color="#10b981" style={{ margin: '0 auto 8px' }} />
            <p className="font-bold text-sm">Fan Zone</p>
          </div>
        </div>
      </motion.div>

      {/* Today's Quests */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-6"
      >
        <div className="section-header">
          <h2 className="section-title">📋 Today's Quests</h2>
          <span className="section-action" onClick={() => navigate('/profile')}>View all</span>
        </div>

        <div className="flex flex-col gap-3">
          {dailyQuests.map((quest, i) => (
            <motion.div
              key={quest.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className={`quest-card ${user?.completedQuests?.includes(quest.id) ? 'completed' : ''}`}
            >
              <div className="quest-icon">{quest.icon}</div>
              <div className="quest-info">
                <p className="quest-title">{quest.title}</p>
                <p className="quest-desc">{quest.description}</p>
              </div>
              <div className="quest-reward">+{quest.xp} XP</div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
