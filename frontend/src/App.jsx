import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { GameProvider, useGame } from './context/GameContext';
import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Welcome from './pages/Welcome';
import Discover from './pages/Discover';
import Home from './pages/Home';
import MatchCentre from './pages/MatchCentre';
import FanZone from './pages/FanZone';
import Profile from './pages/Profile';
import './index.css';

function AppRoutes() {
  const { user, loadUser, match } = useGame();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    loadUser().finally(() => setChecking(false));
  }, [loadUser]);

  useEffect(() => {
    if (match && match.score) {
      document.title = `🔴 ${match.score.runs}/${match.score.wickets} (${match.score.overs}) | IND vs AUS - Sixer`;
    } else {
      document.title = 'Sixer | Watch. Predict. Play.';
    }
  }, [match]);

  if (checking) {
    return (
      <div className="welcome-screen">
        <div className="welcome-logo">SIXER</div>
        <p className="text-muted">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <Routes>
        <Route path="/discover" element={<Discover />} />
        <Route path="*" element={<Welcome />} />
      </Routes>
    );
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/match" element={<MatchCentre />} />
        <Route path="/fan-zone" element={<FanZone />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Navbar />
    </>
  );
}

function App() {
  return (
    <GameProvider>
      <BrowserRouter>
        <div className="app-bg" />
        <div className="app-container">
          <div className="main-content">
            <AppRoutes />
          </div>
        </div>
      </BrowserRouter>
    </GameProvider>
  );
}

export default App;
