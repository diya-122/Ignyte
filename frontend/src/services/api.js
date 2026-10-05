const API_BASE = 'https://ignyte.onrender.com/api';
async function fetchJSON(url, options = {}) {
  const res = await fetch(`${API_BASE}${url}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) throw new Error(`API Error: ${res.status}`);
  return res.json();
}

export const api = {
  // Auth
  register: (data) => fetchJSON('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  getUser: (id) => fetchJSON(`/user/${id}`),
  updateUser: (id, data) => fetchJSON(`/user/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),

  // Match
  getMatch: () => fetchJSON('/match'),
  nextBall: () => fetchJSON('/match/next-ball', { method: 'POST' }),
  resetMatch: () => fetchJSON('/match/reset', { method: 'POST' }),

  // Predictions
  predict: (userId, pick) => fetchJSON('/predict', { method: 'POST', body: JSON.stringify({ userId, pick }) }),

  // Quests
  getQuests: () => fetchJSON('/quests'),
  completeQuest: (userId, questId) => fetchJSON('/quests/complete', { method: 'POST', body: JSON.stringify({ userId, questId }) }),

  // Teams & Players
  getTeams: () => fetchJSON('/teams'),
  getPlayers: (teamId) => fetchJSON(`/players/${teamId}`),

  // Badges
  getBadges: () => fetchJSON('/badges'),

  // Leaderboard
  getLeaderboard: () => fetchJSON('/leaderboard'),

  // Chat
  getChat: () => fetchJSON('/chat'),
  sendChat: (userId, text) => fetchJSON('/chat', { method: 'POST', body: JSON.stringify({ userId, text }) }),

  // AI Coach
  askCoach: (question, matchContext) => fetchJSON('/coach/ask', { method: 'POST', body: JSON.stringify({ question, matchContext }) }),

  // Personality Quiz
  getPersonalityQuiz: () => fetchJSON('/quiz/personality'),
};
