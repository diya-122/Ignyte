// ─── Simulated Match Engine ───
// Provides ball-by-ball cricket data for the hackathon demo

const innings = [
  { over: 1, ball: 1, batter: 'Smriti Mandhana', bowler: 'Ellyse Perry', runs: 4, wicket: false, commentary: 'Gorgeous cover drive for FOUR! Mandhana at her elegant best.' },
  { over: 1, ball: 2, batter: 'Smriti Mandhana', bowler: 'Ellyse Perry', runs: 0, wicket: false, commentary: 'Dot ball. Good length, left alone outside off.' },
  { over: 1, ball: 3, batter: 'Smriti Mandhana', bowler: 'Ellyse Perry', runs: 1, wicket: false, commentary: 'Single to mid-on. Rotates the strike.' },
  { over: 1, ball: 4, batter: 'Shafali Verma', bowler: 'Ellyse Perry', runs: 6, wicket: false, commentary: 'SIX! Shafali launches it over long-on! Massive hit! 💥' },
  { over: 1, ball: 5, batter: 'Shafali Verma', bowler: 'Ellyse Perry', runs: 0, wicket: false, commentary: 'Beaten outside off. Good comeback delivery.' },
  { over: 1, ball: 6, batter: 'Shafali Verma', bowler: 'Ellyse Perry', runs: 2, wicket: false, commentary: 'Worked to leg for two. Good running between wickets.' },
  { over: 2, ball: 1, batter: 'Smriti Mandhana', bowler: 'Megan Schutt', runs: 0, wicket: false, commentary: 'Dot. Tight line from Schutt.' },
  { over: 2, ball: 2, batter: 'Smriti Mandhana', bowler: 'Megan Schutt', runs: 4, wicket: false, commentary: 'FOUR! Flicked off the pads through midwicket. Class! 🏏' },
  { over: 2, ball: 3, batter: 'Smriti Mandhana', bowler: 'Megan Schutt', runs: 1, wicket: false, commentary: 'Single down to third man.' },
  { over: 2, ball: 4, batter: 'Shafali Verma', bowler: 'Megan Schutt', runs: 0, wicket: false, commentary: 'Dot ball. Good yorker.' },
  { over: 2, ball: 5, batter: 'Shafali Verma', bowler: 'Megan Schutt', runs: 4, wicket: false, commentary: 'FOUR! Upper cut over point. Sensational shot! 🔥' },
  { over: 2, ball: 6, batter: 'Shafali Verma', bowler: 'Megan Schutt', runs: 1, wicket: false, commentary: 'Quick single to end the over.' },
  { over: 3, ball: 1, batter: 'Smriti Mandhana', bowler: 'Ashleigh Gardner', runs: 6, wicket: false, commentary: 'SIX! Smriti dances down the track and launches it into the stands! 💥' },
  { over: 3, ball: 2, batter: 'Smriti Mandhana', bowler: 'Ashleigh Gardner', runs: 1, wicket: false, commentary: 'Single to deep cover.' },
  { over: 3, ball: 3, batter: 'Shafali Verma', bowler: 'Ashleigh Gardner', runs: 0, wicket: true, commentary: 'WICKET! Caught at mid-off! Shafali tries to go big but finds the fielder! 😱' },
  { over: 3, ball: 4, batter: 'Jemimah Rodrigues', bowler: 'Ashleigh Gardner', runs: 0, wicket: false, commentary: 'New batter Jemimah defends solidly.' },
  { over: 3, ball: 5, batter: 'Jemimah Rodrigues', bowler: 'Ashleigh Gardner', runs: 4, wicket: false, commentary: 'FOUR! Reverse sweep from Jemimah. What a shot to get off the mark! ✨' },
  { over: 3, ball: 6, batter: 'Jemimah Rodrigues', bowler: 'Ashleigh Gardner', runs: 2, wicket: false, commentary: 'Pushed to long-off for two. Smart cricket.' },
  { over: 4, ball: 1, batter: 'Smriti Mandhana', bowler: 'Sophie Molineux', runs: 1, wicket: false, commentary: 'Tapped to mid-on for a single.' },
  { over: 4, ball: 2, batter: 'Jemimah Rodrigues', bowler: 'Sophie Molineux', runs: 4, wicket: false, commentary: 'FOUR! Swept fine. Jemimah is finding her rhythm!' },
  { over: 4, ball: 3, batter: 'Jemimah Rodrigues', bowler: 'Sophie Molineux', runs: 0, wicket: false, commentary: 'Dot ball. Good turn from Molineux.' },
  { over: 4, ball: 4, batter: 'Jemimah Rodrigues', bowler: 'Sophie Molineux', runs: 6, wicket: false, commentary: 'SIX! Slog sweep into the crowd! Jemimah is on fire! 🔥💥' },
  { over: 4, ball: 5, batter: 'Jemimah Rodrigues', bowler: 'Sophie Molineux', runs: 1, wicket: false, commentary: 'Single to long-on.' },
  { over: 4, ball: 6, batter: 'Smriti Mandhana', bowler: 'Sophie Molineux', runs: 2, wicket: false, commentary: 'Two runs to end a productive over.' },
  { over: 5, ball: 1, batter: 'Smriti Mandhana', bowler: 'Ellyse Perry', runs: 4, wicket: false, commentary: 'FOUR! Driven through the covers. Poetry in motion! 🏏' },
  { over: 5, ball: 2, batter: 'Smriti Mandhana', bowler: 'Ellyse Perry', runs: 0, wicket: true, commentary: 'WICKET! Bowled! Perry gets through the gate! Mandhana has to go for a brilliant 32. 😢' },
  { over: 5, ball: 3, batter: 'Harmanpreet Kaur', bowler: 'Ellyse Perry', runs: 0, wicket: false, commentary: 'Captain Harmanpreet walks in. Defends the first ball.' },
  { over: 5, ball: 4, batter: 'Harmanpreet Kaur', bowler: 'Ellyse Perry', runs: 6, wicket: false, commentary: 'SIX! Welcome to the crease, captain! Deposited over long-on! 💪💥' },
  { over: 5, ball: 5, batter: 'Harmanpreet Kaur', bowler: 'Ellyse Perry', runs: 4, wicket: false, commentary: 'FOUR! Pull shot! The captain means business! 🔥' },
  { over: 5, ball: 6, batter: 'Harmanpreet Kaur', bowler: 'Ellyse Perry', runs: 1, wicket: false, commentary: 'Quick single. India motoring along.' },
  { over: 6, ball: 1, batter: 'Jemimah Rodrigues', bowler: 'Megan Schutt', runs: 2, wicket: false, commentary: 'Flicked to midwicket for two.' },
  { over: 6, ball: 2, batter: 'Jemimah Rodrigues', bowler: 'Megan Schutt', runs: 0, wicket: false, commentary: 'Dot ball. Good length.' },
  { over: 6, ball: 3, batter: 'Jemimah Rodrigues', bowler: 'Megan Schutt', runs: 4, wicket: false, commentary: 'FOUR! Glanced to fine leg. End of the powerplay! 🏏' },
  { over: 6, ball: 4, batter: 'Jemimah Rodrigues', bowler: 'Megan Schutt', runs: 1, wicket: false, commentary: 'Single to rotate strike.' },
  { over: 6, ball: 5, batter: 'Harmanpreet Kaur', bowler: 'Megan Schutt', runs: 6, wicket: false, commentary: 'SIX!! Harmanpreet goes downtown! What a way to end the powerplay! 🎆💥' },
  { over: 6, ball: 6, batter: 'Harmanpreet Kaur', bowler: 'Megan Schutt', runs: 0, wicket: false, commentary: 'Beaten outside off. End of powerplay: India 82/2 in 6 overs!' },
];

let currentBallIndex = 0;

export const matchData = {
  id: 'match_001',
  homeTeam: 'India Women',
  awayTeam: 'Australia Women',
  venue: 'Wankhede Stadium, Mumbai',
  status: 'live',
  target: 180,
  innings: 2,
  score: { runs: 0, wickets: 0, overs: '0.0' },
  battingTeam: 'India Women',
  bowlingTeam: 'Australia Women',
  currentBatter: 'Smriti Mandhana',
  currentBowler: 'Ellyse Perry',
  partnership: { runs: 0, balls: 0 },
  lastSix: [],
  runRate: 0,
  requiredRunRate: 9.0,
  winProbability: 45
};

function updateMatchState(ball) {
  if (ball.wicket) {
    matchData.score.wickets += 1;
    matchData.partnership = { runs: 0, balls: 0 };
  }
  matchData.score.runs += ball.runs;
  matchData.score.overs = `${ball.over - 1}.${ball.ball}`;
  if (ball.ball === 6) {
    matchData.score.overs = `${ball.over}.0`;
  }
  matchData.currentBatter = ball.batter;
  matchData.currentBowler = ball.bowler;
  matchData.partnership.runs += ball.runs;
  matchData.partnership.balls += 1;
  matchData.lastSix.push(ball.runs + (ball.wicket ? 'W' : ''));
  if (matchData.lastSix.length > 6) matchData.lastSix.shift();

  const totalBalls = (ball.over - 1) * 6 + ball.ball;
  matchData.runRate = parseFloat((matchData.score.runs / (totalBalls / 6)).toFixed(2));
  const remainingBalls = 120 - totalBalls;
  const remainingRuns = matchData.target - matchData.score.runs;
  matchData.requiredRunRate = remainingBalls > 0 
    ? parseFloat((remainingRuns / (remainingBalls / 6)).toFixed(2)) 
    : 0;
  matchData.winProbability = Math.min(95, Math.max(5, 
    Math.round(45 + (matchData.score.runs / matchData.target) * 50 - matchData.score.wickets * 8)
  ));
}

export function getNextBall() {
  if (currentBallIndex >= innings.length) return null;
  const ball = innings[currentBallIndex];
  updateMatchState(ball);
  currentBallIndex++;
  return ball;
}

export function resetMatch() {
  currentBallIndex = 0;
  matchData.score = { runs: 0, wickets: 0, overs: '0.0' };
  matchData.currentBatter = 'Smriti Mandhana';
  matchData.currentBowler = 'Ellyse Perry';
  matchData.partnership = { runs: 0, balls: 0 };
  matchData.lastSix = [];
  matchData.runRate = 0;
  matchData.requiredRunRate = 9.0;
  matchData.winProbability = 45;
  matchData.status = 'live';
}
