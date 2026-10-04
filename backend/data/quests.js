export const quests = [
  // Daily Quests
  { id: 'q1', title: 'Prediction Master', description: 'Make 5 ball predictions', xp: 100, type: 'daily', icon: '🎯', target: 5, category: 'prediction' },
  { id: 'q2', title: 'Cricket Scholar', description: 'Learn 2 cricket terms from the AI Coach', xp: 50, type: 'daily', icon: '📚', target: 2, category: 'learning' },
  { id: 'q3', title: 'Fan Zone Explorer', description: 'Send a message in the Fan Zone chat', xp: 25, type: 'daily', icon: '💬', target: 1, category: 'social' },
  { id: 'q4', title: 'Hot Streak', description: 'Get 3 predictions correct in a row', xp: 75, type: 'daily', icon: '🔥', target: 3, category: 'prediction' },

  // Match Quests
  { id: 'q5', title: 'Match Watcher', description: 'Watch and predict through an entire over', xp: 50, type: 'match', icon: '👀', target: 6, category: 'prediction' },
  { id: 'q6', title: 'Boundary Spotter', description: 'Correctly predict 2 boundaries', xp: 75, type: 'match', icon: '🏏', target: 2, category: 'prediction' },
  { id: 'q7', title: 'Coach\'s Student', description: 'Ask the AI Coach a question during the match', xp: 30, type: 'match', icon: '🤖', target: 1, category: 'learning' },
  { id: 'q8', title: 'Community Player', description: 'Join the match leaderboard (make at least 1 prediction)', xp: 20, type: 'match', icon: '🏆', target: 1, category: 'social' },

  // Special Quests
  { id: 'q9', title: 'Six Seeker', description: 'Correctly predict a six', xp: 100, type: 'special', icon: '💥', target: 1, category: 'prediction' },
  { id: 'q10', title: 'Wicket Wizard', description: 'Correctly predict a wicket', xp: 150, type: 'special', icon: '😱', target: 1, category: 'prediction' }
];
