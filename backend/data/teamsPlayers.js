export const teams = [
  {
    id: 'india',
    name: 'India Women',
    shortName: 'IND-W',
    city: 'India',
    colors: { primary: '#FF9933', secondary: '#138808', accent: '#000080' },
    logo: '🇮🇳',
    description: 'The Blue army — passionate, explosive, and full of flair. India Women have become one of the most exciting teams in world cricket.',
    funFact: 'India Women reached the T20 World Cup final in 2020, capturing the imagination of millions.'
  },
  {
    id: 'australia',
    name: 'Australia Women',
    shortName: 'AUS-W',
    city: 'Australia',
    colors: { primary: '#FFD700', secondary: '#006B3F', accent: '#000' },
    logo: '🇦🇺',
    description: 'The Southern Stars — dominant, disciplined, and record-breaking. Australia Women are the most successful team in cricket history.',
    funFact: 'Australia Women won the T20 World Cup in front of 86,174 fans at the MCG in 2020!'
  },
  {
    id: 'england',
    name: 'England Women',
    shortName: 'ENG-W',
    city: 'England',
    colors: { primary: '#CF142B', secondary: '#00247D', accent: '#FFF' },
    logo: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    description: 'The pioneers of women\'s cricket. England Women combine tradition with modern aggressive play.',
    funFact: 'England hosted the first-ever Women\'s Cricket World Cup in 1973!'
  },
  {
    id: 'south_africa',
    name: 'South Africa Women',
    shortName: 'SA-W',
    city: 'South Africa',
    colors: { primary: '#007749', secondary: '#FFB81C', accent: '#000' },
    logo: '🇿🇦',
    description: 'The Proteas — resilient, rising, and ready to compete. South Africa Women are the underdogs who keep surprising the world.',
    funFact: 'South Africa Women reached their first-ever T20 World Cup final in 2023!'
  }
];

export const players = [
  // India
  { id: 'p1', teamId: 'india', name: 'Smriti Mandhana', role: 'Batter', bat: 'Left-hand', bowl: 'Right-arm medium', bio: 'Elegant left-hander known for breathtaking strokeplay. One of the most watchable batters in the world.', stats: { matches: 120, runs: 3200, avg: 28.5, sr: 125.4 } },
  { id: 'p2', teamId: 'india', name: 'Shafali Verma', role: 'Batter', bat: 'Right-hand', bowl: 'Right-arm leg break', bio: 'Fearless young opener who hits the ball incredibly hard. The future of Indian cricket.', stats: { matches: 65, runs: 1800, avg: 24.2, sr: 142.8 } },
  { id: 'p3', teamId: 'india', name: 'Harmanpreet Kaur', role: 'All-rounder', bat: 'Right-hand', bowl: 'Right-arm off break', bio: 'Captain courageous! Known for match-winning knocks under pressure. A true leader.', stats: { matches: 160, runs: 3500, avg: 30.1, sr: 118.6 } },
  { id: 'p4', teamId: 'india', name: 'Jemimah Rodrigues', role: 'Batter', bat: 'Right-hand', bowl: 'Right-arm off break', bio: 'Creative, innovative, and always entertaining. Jemimah brings joy to every innings.', stats: { matches: 80, runs: 1600, avg: 26.8, sr: 115.2 } },
  { id: 'p5', teamId: 'india', name: 'Deepti Sharma', role: 'All-rounder', bat: 'Left-hand', bowl: 'Right-arm off break', bio: 'The backbone of India\'s bowling. A genuine all-rounder who can win matches with bat or ball.', stats: { matches: 100, runs: 1200, avg: 18.5, sr: 98.4, wickets: 85 } },
  // Australia
  { id: 'p6', teamId: 'australia', name: 'Alyssa Healy', role: 'Wicketkeeper-Batter', bat: 'Right-hand', bowl: '-', bio: 'Explosive opener and brilliant keeper. Captain of the most dominant team in women\'s cricket.', stats: { matches: 140, runs: 3800, avg: 30.4, sr: 132.5 } },
  { id: 'p7', teamId: 'australia', name: 'Ellyse Perry', role: 'All-rounder', bat: 'Right-hand', bowl: 'Right-arm fast-medium', bio: 'The ultimate all-rounder. Plays cricket and football for Australia. Absolute legend.', stats: { matches: 150, runs: 3200, avg: 35.6, sr: 108.2, wickets: 110 } },
  { id: 'p8', teamId: 'australia', name: 'Meg Lanning', role: 'Batter', bat: 'Left-hand', bowl: 'Right-arm medium', bio: 'One of the greatest batters ever. Former captain with an incredible record.', stats: { matches: 130, runs: 4000, avg: 38.2, sr: 120.1 } },
  { id: 'p9', teamId: 'australia', name: 'Ashleigh Gardner', role: 'All-rounder', bat: 'Right-hand', bowl: 'Right-arm off break', bio: 'Dynamic all-rounder who can change the game in any department. A true match-winner.', stats: { matches: 90, runs: 1500, avg: 22.4, sr: 128.7, wickets: 65 } },
  { id: 'p10', teamId: 'australia', name: 'Megan Schutt', role: 'Bowler', bat: 'Right-hand', bowl: 'Left-arm fast-medium', bio: 'Master of swing bowling. One of the most skillful pace bowlers in the women\'s game.', stats: { matches: 85, wickets: 95, avg: 18.2, econ: 6.1 } },
  // England
  { id: 'p11', teamId: 'england', name: 'Nat Sciver-Brunt', role: 'All-rounder', bat: 'Right-hand', bowl: 'Right-arm medium', bio: 'England\'s anchor and biggest match-winner. Can bat, bowl, and field brilliantly.', stats: { matches: 110, runs: 2800, avg: 32.1, sr: 112.8, wickets: 45 } },
  { id: 'p12', teamId: 'england', name: 'Sophie Ecclestone', role: 'Bowler', bat: 'Right-hand', bowl: 'Left-arm orthodox', bio: 'The world\'s No.1 T20I bowler. Almost unplayable on her day.', stats: { matches: 75, wickets: 100, avg: 14.5, econ: 5.8 } },
  // South Africa
  { id: 'p13', teamId: 'south_africa', name: 'Laura Wolvaardt', role: 'Batter', bat: 'Right-hand', bowl: '-', bio: 'Technically perfect and supremely talented. One of the most consistent batters in women\'s cricket.', stats: { matches: 90, runs: 2600, avg: 34.2, sr: 118.5 } },
  { id: 'p14', teamId: 'south_africa', name: 'Marizanne Kapp', role: 'All-rounder', bat: 'Right-hand', bowl: 'Right-arm fast-medium', bio: 'South Africa\'s warrior. Can bowl pace, bat aggressively, and inspires her team.', stats: { matches: 100, runs: 1400, avg: 20.8, sr: 105.3, wickets: 80 } }
];
