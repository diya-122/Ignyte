-- Run this entire script in your Supabase SQL Editor

-- 1. Users Table
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  display_name TEXT NOT NULL,
  city TEXT,
  favourite_team TEXT,
  xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  streak INTEGER DEFAULT 0,
  match_streak INTEGER DEFAULT 0,
  badges TEXT[] DEFAULT '{"first_fan"}',
  completed_quests TEXT[] DEFAULT '{}',
  predictions_count INTEGER DEFAULT 0,
  correct_predictions INTEGER DEFAULT 0,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Predictions Table
CREATE TABLE predictions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT REFERENCES users(id),
  pick TEXT NOT NULL,
  outcome TEXT,
  correct BOOLEAN,
  xp_earned INTEGER,
  ball_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Chat Messages Table
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT REFERENCES users(id),
  display_name TEXT NOT NULL,
  text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Set up Realtime for Chat (Optional for frontend, but good to have enabled)
alter publication supabase_realtime add table chat_messages;
