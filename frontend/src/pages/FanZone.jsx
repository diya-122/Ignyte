import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Send, Users, MapPin } from 'lucide-react';
import { api } from '../services/api';
import { useGame } from '../context/GameContext';

export default function FanZone() {
  const { user, addXP } = useGame();
  const [activeTab, setActiveTab] = useState('chat');
  const [messages, setMessages] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [input, setInput] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000); // Polling for demo
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (activeTab === 'chat' && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, activeTab]);

  const fetchData = async () => {
    const [chatRes, leadRes] = await Promise.all([
      api.getChat(),
      api.getLeaderboard()
    ]);
    setMessages(chatRes);
    setLeaderboard(leadRes);
  };

  const handleSend = async () => {
    if (!input.trim() || !user) return;
    const text = input.trim();
    setInput('');
    
    try {
      const res = await api.sendChat(user.id, text);
      addXP(res.xpEarned);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const watchParties = [
    { city: 'Mumbai', venue: 'Wankhede Sports Bar', joining: 45 },
    { city: 'Delhi', venue: 'The Cricket Lounge', joining: 32 },
    { city: 'Bangalore', venue: 'Fanatic Pub', joining: 28 },
  ];

  return (
    <div className="fade-in">
      <div className="fanzone-header">
        <h1 className="font-display font-bold text-lg flex items-center gap-2" style={{ position: 'relative', zIndex: 1 }}>
          <Users size={24} color="#00E5FF" />
          Fan Zone
        </h1>
        <span className="text-xs font-bold px-3 py-1 bg-green-500/20 text-green-500 rounded-full flex items-center gap-2" style={{ position: 'relative', zIndex: 1 }}>
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          8,241 Online
        </span>
      </div>

      <div className="tabs mt-4">
        <button className={`tab ${activeTab === 'chat' ? 'active' : ''}`} onClick={() => setActiveTab('chat')}>Live Chat</button>
        <button className={`tab ${activeTab === 'leaderboard' ? 'active' : ''}`} onClick={() => setActiveTab('leaderboard')}>Leaderboard</button>
        <button className={`tab ${activeTab === 'parties' ? 'active' : ''}`} onClick={() => setActiveTab('parties')}>Watch Parties</button>
      </div>

      {activeTab === 'chat' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col h-[60vh]">
          <div className="chat-container flex-1 mb-4" style={{ maxHeight: '100%' }}>
            {messages.map((msg) => (
              <div key={msg.id} className="chat-message">
                <div className="chat-avatar">{msg.displayName.substring(0, 1).toUpperCase()}</div>
                <div className="chat-body">
                  <div className="flex items-center gap-2">
                    <span className="chat-name">{msg.displayName}</span>
                    <span className="text-[10px] text-muted">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="chat-text">{msg.text}</div>
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          <div className="chat-input-container mt-auto">
            <input
              type="text"
              className="chat-input"
              placeholder="Cheer for your team..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button className="btn btn-primary btn-icon" onClick={handleSend} disabled={!input.trim()}>
              <Send size={16} />
            </button>
          </div>
        </motion.div>
      )}

      {activeTab === 'leaderboard' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-2">
          {leaderboard.map((lbUser, index) => (
            <div key={lbUser.id} className={`leaderboard-item ${index < 3 ? 'top-3' : ''}`}>
              <div className={`leaderboard-rank rank-${index + 1}`}>{index + 1}</div>
              <div className="leaderboard-avatar">{lbUser.displayName.substring(0, 1).toUpperCase()}</div>
              <div className="leaderboard-info">
                <div className="leaderboard-name">{lbUser.displayName} {lbUser.id === user?.id && '(You)'}</div>
                <div className="leaderboard-xp">{lbUser.xp} XP</div>
              </div>
              <div className="leaderboard-level">Lvl {lbUser.level}</div>
            </div>
          ))}
        </motion.div>
      )}

      {activeTab === 'parties' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-3">
          <div className="text-sm text-muted mb-2">Connect with fans in your city</div>
          {watchParties.map((party, i) => (
            <div key={i} className="watch-party-card">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-md">{party.city}</h3>
                  <p className="text-xs text-muted flex items-center gap-1 mt-1">
                    <MapPin size={12} /> {party.venue}
                  </p>
                </div>
                <span className="text-xs bg-indigo-500/20 text-indigo-400 px-2 py-1 rounded-full">
                  {party.joining} joining
                </span>
              </div>
              <button className="btn btn-secondary btn-full text-sm py-2">Join Party</button>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
