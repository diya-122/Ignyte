import { NavLink } from 'react-router-dom';
import { Home, Trophy, Zap, Users, User } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="navbar" id="main-navbar">
      <div className="navbar-inner">
        <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} end>
          <Home size={20} />
          <span className="nav-label">Home</span>
        </NavLink>

        <NavLink to="/fan-zone" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Users size={20} />
          <span className="nav-label">Fan Zone</span>
        </NavLink>

        <NavLink to="/match" className={({ isActive }) => `nav-item nav-item-play ${isActive ? 'active' : ''}`}>
          <Zap size={24} />
        </NavLink>

        <NavLink to="/profile" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Trophy size={20} />
          <span className="nav-label">Rewards</span>
        </NavLink>

        <NavLink to="/profile" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <User size={20} />
          <span className="nav-label">Profile</span>
        </NavLink>
      </div>
    </nav>
  );
}
