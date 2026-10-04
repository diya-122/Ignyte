import { motion } from 'framer-motion';
import { useEffect, useMemo } from 'react';

const CONFETTI_COLORS = ['#6366f1', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899', '#3b82f6', '#f97316'];

export default function CelebrationOverlay({ celebration, onDismiss }) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 3000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  const particles = useMemo(() => {
    if (!celebration || celebration.type !== 'correct') return [];
    return Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: (Math.random() - 0.5) * 400,
      y: -(Math.random() * 300 + 100),
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      delay: Math.random() * 0.3,
      size: Math.random() * 6 + 4,
    }));
  }, [celebration]);

  if (!celebration) return null;

  const isCorrect = celebration.type === 'correct';

  const outcomeEmojis = {
    dot: '⭕',
    '1-3': '🏃',
    four: '4️⃣',
    six: '6️⃣',
    wicket: '🔴',
  };

  return (
    <motion.div
      className="celebration-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onDismiss}
      style={{
        background: isCorrect 
          ? 'radial-gradient(circle, rgba(16,185,129,0.15) 0%, rgba(0,0,0,0.6) 70%)'
          : 'radial-gradient(circle, rgba(239,68,68,0.1) 0%, rgba(0,0,0,0.5) 70%)',
      }}
    >
      {/* Confetti particles for correct */}
      {isCorrect && particles.map(p => (
        <motion.div
          key={p.id}
          className="confetti-particle"
          initial={{ x: 0, y: 0, opacity: 1 }}
          animate={{ x: p.x, y: p.y, opacity: 0, rotate: 720 }}
          transition={{ duration: 1.5, delay: p.delay, ease: 'easeOut' }}
          style={{
            width: p.size,
            height: p.size,
            background: p.color,
            left: '50%',
            top: '45%',
          }}
        />
      ))}

      <motion.div
        className="celebration-content"
        initial={{ scale: 0, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', damping: 12, stiffness: 200 }}
      >
        <div className="celebration-emoji">
          {isCorrect ? '🎉' : outcomeEmojis[celebration.outcome] || '😤'}
        </div>
        
        <div className="celebration-text" style={{ 
          color: isCorrect ? '#10b981' : '#ef4444' 
        }}>
          {isCorrect ? 'CORRECT!' : 'NOT THIS TIME'}
        </div>

        <div className="celebration-xp">
          +{celebration.xp} XP
        </div>

        {isCorrect && celebration.streak >= 3 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{ marginTop: 8, color: '#f97316', fontSize: 16, fontWeight: 700 }}
          >
            🔥 {celebration.streak} Streak Bonus!
          </motion.div>
        )}

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 12, maxWidth: 280 }}
        >
          {celebration.commentary}
        </motion.p>

        {isCorrect && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            onClick={(e) => {
              e.stopPropagation();
              if (navigator.share) {
                navigator.share({
                  title: 'My Sixer Prediction!',
                  text: `I just predicted a ${celebration.outcome.toUpperCase()} correctly on Sixer and earned +${celebration.xp} XP! ${celebration.streak >= 3 ? `I'm on a ${celebration.streak}x streak 🔥` : ''}`,
                  url: window.location.origin,
                }).catch(console.error);
              } else {
                alert('Copied to clipboard!');
              }
            }}
            className="btn btn-primary"
            style={{ marginTop: 20, padding: '8px 16px', fontSize: 13, borderRadius: 'var(--radius-full)' }}
          >
            🤳 Brag on Socials
          </motion.button>
        )}
      </motion.div>
    </motion.div>
  );
}
