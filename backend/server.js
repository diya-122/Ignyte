import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import { matchData, getNextBall, resetMatch } from './data/matchEngine.js';
import { teams, players } from './data/teamsPlayers.js';
import { quests } from './data/quests.js';
import { badges } from './data/badges.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// ─── Auth / User ───
app.post('/api/auth/register', async (req, res) => {
  const { displayName, city, favouriteTeam } = req.body;
  const id = 'user_' + Date.now();
  const user = {
    id,
    display_name: displayName,
    city,
    favourite_team: favouriteTeam,
    xp: 0,
    level: 1,
    streak: 0,
    match_streak: 0,
    badges: ['first_fan'],
    completed_quests: [],
    predictions_count: 0,
    correct_predictions: 0
  };
  
  const { data, error } = await supabase.from('users').insert(user).select().single();
  if (error) return res.status(500).json({ error: error.message });
  
  // Transform back to camelCase for frontend
  const formattedUser = { ...data, displayName: data.display_name, favouriteTeam: data.favourite_team, completedQuests: data.completed_quests, matchStreak: data.match_streak, predictionsCount: data.predictions_count, correctPredictions: data.correct_predictions };
  res.json({ success: true, user: formattedUser });
});

app.get('/api/user/:id', async (req, res) => {
  const { data, error } = await supabase.from('users').select('*').eq('id', req.params.id).single();
  if (error || !data) return res.status(404).json({ error: 'User not found' });
  const formattedUser = { ...data, displayName: data.display_name, favouriteTeam: data.favourite_team, completedQuests: data.completed_quests, matchStreak: data.match_streak, predictionsCount: data.predictions_count, correctPredictions: data.correct_predictions };
  res.json(formattedUser);
});

app.patch('/api/user/:id', async (req, res) => {
  // Convert camelCase to snake_case for Supabase
  const updateData = {};
  if (req.body.displayName) updateData.display_name = req.body.displayName;
  if (req.body.city) updateData.city = req.body.city;
  if (req.body.favouriteTeam) updateData.favourite_team = req.body.favouriteTeam;
  
  const { data, error } = await supabase.from('users').update(updateData).eq('id', req.params.id).select().single();
  if (error || !data) return res.status(404).json({ error: 'User not found' });
  const formattedUser = { ...data, displayName: data.display_name, favouriteTeam: data.favourite_team, completedQuests: data.completed_quests, matchStreak: data.match_streak, predictionsCount: data.predictions_count, correctPredictions: data.correct_predictions };
  res.json(formattedUser);
});

// ─── Match Engine ───
app.get('/api/match', (req, res) => {
  res.json(matchData);
});

app.post('/api/match/next-ball', (req, res) => {
  const ball = getNextBall();
  if (!ball) {
    return res.json({ completed: true, match: matchData });
  }
  res.json({ completed: false, ball, match: matchData });
});

app.post('/api/match/reset', (req, res) => {
  resetMatch();
  res.json({ success: true, match: matchData });
});

// ─── Predictions ───
app.post('/api/predict', async (req, res) => {
  const { userId, pick } = req.body;
  const { data: dbUser, error: userError } = await supabase.from('users').select('*').eq('id', userId).single();
  if (userError || !dbUser) return res.status(404).json({ error: 'User not found' });

  // Get current ball outcome
  const ball = getNextBall();
  if (!ball) return res.json({ completed: true });

  let outcome;
  if (ball.wicket) outcome = 'wicket';
  else if (ball.runs === 0) outcome = 'dot';
  else if (ball.runs === 4) outcome = 'four';
  else if (ball.runs === 6) outcome = 'six';
  else outcome = '1-3';

  const correct = pick === outcome;
  let xpEarned = 20; // participation XP

  // Convert dbUser to camelCase temporarily for logic
  const user = { ...dbUser, badges: dbUser.badges || [], streak: dbUser.streak || 0, correctPredictions: dbUser.correct_predictions || 0, predictionsCount: dbUser.predictions_count || 0, xp: dbUser.xp || 0 };

  if (correct) {
    xpEarned = 50;
    user.streak += 1;
    user.correctPredictions += 1;

    // Streak bonuses
    if (user.streak === 3) xpEarned += 25;
    if (user.streak === 5) xpEarned += 50;
    if (user.streak === 7 && !user.badges.includes('hot_hand')) user.badges.push('hot_hand');
    if (user.streak === 10 && !user.badges.includes('predictor')) user.badges.push('predictor');
    if (user.streak === 15 && !user.badges.includes('cricket_oracle')) user.badges.push('cricket_oracle');

    // Outcome-specific badges
    if (outcome === 'four') {
      const { count } = await supabase.from('predictions').select('*', { count: 'exact', head: true }).eq('user_id', userId).eq('correct', true).eq('outcome', 'four');
      if ((count || 0) + 1 >= 5 && !user.badges.includes('boundary_hunter')) user.badges.push('boundary_hunter');
    }
    if (outcome === 'six') {
      const { count } = await supabase.from('predictions').select('*', { count: 'exact', head: true }).eq('user_id', userId).eq('correct', true).eq('outcome', 'six');
      if ((count || 0) + 1 >= 3 && !user.badges.includes('six_sense')) user.badges.push('six_sense');
    }
  } else {
    user.streak = 0;
  }

  user.predictionsCount += 1;
  user.xp += xpEarned;

  if (user.predictionsCount === 1 && !user.badges.includes('first_prediction')) user.badges.push('first_prediction');
  user.level = Math.floor(user.xp / 200) + 1;

  // Update user in DB
  const updateData = {
    xp: user.xp,
    level: user.level,
    streak: user.streak,
    correct_predictions: user.correctPredictions,
    predictions_count: user.predictionsCount,
    badges: user.badges
  };
  await supabase.from('users').update(updateData).eq('id', userId);

  // Insert prediction
  const prediction = {
    user_id: userId,
    pick,
    outcome,
    correct,
    xp_earned: xpEarned,
    ball_data: ball
  };
  const { data: savedPred } = await supabase.from('predictions').insert(prediction).select().single();

  const formattedUser = { ...user, displayName: dbUser.display_name, favouriteTeam: dbUser.favourite_team, completedQuests: dbUser.completed_quests };

  res.json({
    prediction: savedPred,
    user: formattedUser,
    newBadges: correct ? user.badges.slice(-1) : [],
    streakBonus: user.streak >= 3 ? Math.floor(user.streak / 3) * 25 : 0
  });
});

// ─── Quests ───
app.get('/api/quests', (req, res) => res.json(quests));

app.post('/api/quests/complete', async (req, res) => {
  const { userId, questId } = req.body;
  const { data: user, error } = await supabase.from('users').select('*').eq('id', userId).single();
  if (error || !user) return res.status(404).json({ error: 'User not found' });

  const quest = quests.find(q => q.id === questId);
  if (!quest) return res.status(404).json({ error: 'Quest not found' });

  const completedQuests = user.completed_quests || [];
  if (!completedQuests.includes(questId)) {
    completedQuests.push(questId);
    const newXp = (user.xp || 0) + quest.xp;
    const newLevel = Math.floor(newXp / 200) + 1;
    
    await supabase.from('users').update({ xp: newXp, level: newLevel, completed_quests: completedQuests }).eq('id', userId);
    user.xp = newXp;
    user.level = newLevel;
    user.completed_quests = completedQuests;
  }

  const formattedUser = { ...user, displayName: user.display_name, favouriteTeam: user.favourite_team, completedQuests: user.completed_quests };
  res.json({ user: formattedUser, quest });
});

// ─── Teams & Players ───
app.get('/api/teams', (req, res) => res.json(teams));
app.get('/api/players', (req, res) => res.json(players));
app.get('/api/players/:teamId', (req, res) => {
  res.json(players.filter(p => p.teamId === req.params.teamId));
});

// ─── Badges ───
app.get('/api/badges', (req, res) => res.json(badges));

// ─── Leaderboard ───
app.get('/api/leaderboard', async (req, res) => {
  const { data, error } = await supabase.from('users').select('id, display_name, xp, level').order('xp', { ascending: false }).limit(20);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data.map(u => ({ id: u.id, displayName: u.display_name, xp: u.xp, level: u.level })));
});

// ─── Chat ───
app.get('/api/chat', async (req, res) => {
  const { data, error } = await supabase.from('chat_messages').select('*').order('created_at', { ascending: false }).limit(50);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data.reverse().map(m => ({ id: m.id, userId: m.user_id, displayName: m.display_name, text: m.text, createdAt: m.created_at })));
});

app.post('/api/chat', async (req, res) => {
  const { userId, text } = req.body;
  const { data: user, error } = await supabase.from('users').select('*').eq('id', userId).single();
  if (error || !user) return res.status(404).json({ error: 'User not found' });

  // Chat XP
  const newXp = (user.xp || 0) + 5;
  const newLevel = Math.floor(newXp / 200) + 1;
  const badges = user.badges || [];
  if (!badges.includes('social_fan')) badges.push('social_fan');

  await supabase.from('users').update({ xp: newXp, level: newLevel, badges }).eq('id', userId);

  const msg = {
    user_id: userId,
    display_name: user.display_name,
    text
  };
  const { data: savedMsg } = await supabase.from('chat_messages').insert(msg).select().single();

  res.json({ message: { id: savedMsg.id, userId: savedMsg.user_id, displayName: savedMsg.display_name, text: savedMsg.text, createdAt: savedMsg.created_at }, xpEarned: 5 });
});

// ─── AI Cricket Coach ───
app.post('/api/coach/ask', (req, res) => {
  const { question, matchContext } = req.body;
  
  // Simulated AI responses for the hackathon
  const responses = {
    'rrr': {
      explanation: 'RRR stands for Required Run Rate. It tells you how many runs per over the batting team needs to score from this point to reach the target. For example, if a team needs 48 runs in 8 overs, the RRR is 6.0 runs per over.',
      quiz: {
        question: 'If a team needs 36 runs in 6 overs, what is the RRR?',
        options: ['4', '6', '8', '12'],
        correct: 1,
        xp: 30
      }
    },
    'powerplay': {
      explanation: 'A Powerplay is a phase of the innings where fielding restrictions apply. In T20 cricket, the first 6 overs are the mandatory powerplay — only 2 fielders are allowed outside the inner circle. This usually means more runs for the batting team!',
      quiz: {
        question: 'How many overs is the mandatory powerplay in T20 cricket?',
        options: ['4', '5', '6', '8'],
        correct: 2,
        xp: 30
      }
    },
    'strike rate': {
      explanation: 'Strike Rate (SR) measures how fast a batter scores. It\'s calculated as (Runs scored / Balls faced) × 100. A strike rate of 150 means the batter scores 150 runs for every 100 balls — that\'s aggressive batting!',
      quiz: {
        question: 'If a batter scores 30 runs off 20 balls, what is their strike rate?',
        options: ['100', '120', '150', '200'],
        correct: 2,
        xp: 30
      }
    },
    'wicket': {
      explanation: 'A wicket falls when a batter is dismissed — they\'re "out". This can happen through being bowled, caught, run out, stumped, or LBW. In T20, each team has 10 wickets (batters), so losing them quickly is dangerous.',
      quiz: {
        question: 'How many wickets does each team have in a T20 match?',
        options: ['5', '8', '10', '11'],
        correct: 2,
        xp: 30
      }
    },
    'over': {
      explanation: 'An over consists of 6 legal deliveries (balls) bowled by one bowler. In T20 cricket, each innings has a maximum of 20 overs. A bowler can bowl a maximum of 4 overs in a T20 match.',
      quiz: {
        question: 'How many balls are in one over?',
        options: ['4', '5', '6', '8'],
        correct: 2,
        xp: 30
      }
    },
    'default': {
      explanation: `Great question! In the current match context, ${matchContext?.battingTeam || 'the batting team'} is at ${matchContext?.score || '142/3'} after ${matchContext?.overs || '17.4'} overs. The team is in a strong position and looking to accelerate in the final overs. The key is to watch how the batters handle the pace and spin bowling changes.`,
      quiz: null
    }
  };

  const key = Object.keys(responses).find(k => 
    question.toLowerCase().includes(k)
  ) || 'default';

  const response = responses[key];
  
  res.json({
    answer: response.explanation,
    quiz: response.quiz,
    concept: key !== 'default' ? key : null
  });
});

// ─── Cricket Personality Quiz ───
app.get('/api/quiz/personality', (req, res) => {
  res.json({
    questions: [
      {
        id: 1,
        question: 'When watching a match, what excites you most?',
        options: [
          { text: 'Big sixes and boundaries! 💥', team: 'india' },
          { text: 'Clever tactics and strategy 🧠', team: 'australia' },
          { text: 'Team spirit and celebrations 🎉', team: 'england' },
          { text: 'Underdog comebacks 🔥', team: 'south_africa' }
        ]
      },
      {
        id: 2,
        question: 'Pick your cricket superpower:',
        options: [
          { text: 'Smash every ball for six 🏏', team: 'india' },
          { text: 'Never miss a catch 🧤', team: 'australia' },
          { text: 'Bowl unplayable deliveries 🎯', team: 'england' },
          { text: 'Read the game like a captain 👑', team: 'south_africa' }
        ]
      },
      {
        id: 3,
        question: 'Your ideal matchday vibe?',
        options: [
          { text: 'Loud, colourful, full energy! 📣', team: 'india' },
          { text: 'Focused, analytical, competitive 📊', team: 'australia' },
          { text: 'Friends, fun, and fancy dress 🎭', team: 'england' },
          { text: 'Passionate and heartfelt ❤️', team: 'south_africa' }
        ]
      }
    ]
  });
});

app.listen(PORT, () => {
  console.log(`\n🏏 Sixer Backend running on http://localhost:${PORT}`);
  console.log(`   Connected to Supabase Match Engine\n`);
});
