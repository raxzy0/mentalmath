import React, { useState } from 'react';
import Game from './components/Game.jsx';
import History from './components/History.jsx';
import Statistics from './components/Statistics.jsx';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('game');

  const renderPage = () => {
    switch (currentPage) {
      case 'game':
        return <Game />;
      case 'history':
        return <History />;
      case 'statistics':
        return <Statistics />;
      default:
        return <Game />;
    }
  };

  return (
    <div className="app">
      <nav className="navbar">
        <div className="nav-content">
          <div className="nav-brand">🧮 Mental Math</div>
          <div className="nav-links">
            <button
              className={`nav-link ${currentPage === 'game' ? 'active' : ''}`}
              onClick={() => setCurrentPage('game')}
            >
              Game
            </button>
            <button
              className={`nav-link ${currentPage === 'history' ? 'active' : ''}`}
              onClick={() => setCurrentPage('history')}
            >
              History
            </button>
            <button
              className={`nav-link ${currentPage === 'statistics' ? 'active' : ''}`}
              onClick={() => setCurrentPage('statistics')}
            >
              Statistics
            </button>
          </div>
        </div>
      </nav>
      <main className="main-content">{renderPage()}</main>
    </div>
  );
}

export default App;
