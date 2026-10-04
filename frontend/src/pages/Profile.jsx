import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { LogOut, Trophy, Target, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { api } from '../services/api';

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout } = useGame();
  const [allBadges, setAllBadges] = useState([]);

  useEffect(() => {
    api.getBadges().then(setAllBadges).catch(console.error);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="fade-in pb-10">
      <div className="flex justify-end mb-4">
        <button className="btn btn-ghost btn-icon" onClick={handleLogout} title="Logout">
          <LogOut size={20} />
        </button>
      </div>

      <motion.div 
        className="profile-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="profile-avatar">
          {user.displayName.substring(0, 1).toUpperCase()}
        </div>
        <h1 className="profile-name">{user.displayName}</h1>
        <div className="profile-level">Level {user.level} Fan</div>
        <p className="text-sm text-muted mt-2">{user.city} • Supports {user.favouriteTeam === 'india' ? 'India' : user.favouriteTeam === 'australia' ? 'Australia' : user.favouriteTeam === 'england' ? 'England' : 'South Africa'}</p>

        <div className="profile-stats">
          <div className="profile-stat">
            <div className="profile-stat-value text-indigo-400">{user.xp}</div>
            <div className="profile-stat-label">Total XP</div>
          </div>
          <div className="profile-stat">
            <div className="profile-stat-value text-green-400">{user.correctPredictions}</div>
            <div className="profile-stat-label">Correct</div>
          </div>
          <div className="profile-stat">
            <div className="profile-stat-value text-amber-400">{user.badges?.length || 0}</div>
            <div className="profile-stat-label">Badges</div>
          </div>
        </div>
      </motion.div>

      <div className="mt-8">
        <div className="section-header">
          <h2 className="section-title flex items-center gap-2">
            <Trophy size={20} className="text-amber-400" />
            Badges & Achievements
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {allBadges.map((badge, i) => {
            const hasBadge = user.badges?.includes(badge.id);
            return (
              <motion.div 
                key={badge.id}
                className={`badge-card ${!hasBadge ? 'locked' : ''}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
              >
                <div className="badge-icon" style={{ 
                  color: badge.color, 
                  background: hasBadge ? `${badge.color}20` : 'var(--bg-glass-strong)' 
                }}>
                  {badge.icon}
                </div>
                <div>
                  <div className="badge-name" style={{ color: hasBadge ? badge.color : 'inherit' }}>{badge.name}</div>
                  <div className="badge-desc">{badge.description}</div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
