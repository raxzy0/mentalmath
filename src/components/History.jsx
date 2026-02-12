import React, { useState, useEffect } from 'react';
import { getMatchHistory } from '../utils';
import './History.css';

const History = () => {
  const [matches, setMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    const history = getMatchHistory();
    // Sort by most recent first
    setMatches(history.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const viewMatchDetails = (match) => {
    setSelectedMatch(match);
  };

  const closeDetails = () => {
    setSelectedMatch(null);
  };

  if (selectedMatch) {
    const percentage = ((selectedMatch.score / selectedMatch.total) * 100).toFixed(0);
    return (
      <div className="history-container">
        <div className="card">
          <button className="btn btn-secondary btn-back" onClick={closeDetails}>
            ← Back to History
          </button>

          <h1>Match Details</h1>

          <div className="match-details-header">
            <div className="detail-item">
              <strong>Date:</strong> {formatDate(selectedMatch.timestamp)}
            </div>
            <div className="detail-item">
              <strong>Difficulty:</strong> {selectedMatch.difficulty}
            </div>
            <div className="detail-item">
              <strong>Score:</strong> {selectedMatch.score}/{selectedMatch.total} ({percentage}%)
            </div>
            <div className="detail-item">
              <strong>Time:</strong> {selectedMatch.timeTaken}s
            </div>
          </div>

          <h3>Questions</h3>
          <div className="questions-list">
            {selectedMatch.questions.map((q, idx) => (
              <div key={idx} className={`question-item ${q.isCorrect ? 'correct' : 'wrong'}`}>
                <div className="question-num">#{idx + 1}</div>
                <div className="question-text">{q.question} = {q.answer}</div>
                <div className="user-answer">
                  Your answer: {q.userAnswer} {q.isCorrect ? '✅' : '❌'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="history-container">
      <div className="card">
        <h1>Match History</h1>
        <p>View all your past matches</p>

        {matches.length === 0 ? (
          <div className="empty-state">
            <p>No matches played yet. Start playing to see your history!</p>
          </div>
        ) : (
          <div className="matches-list">
            {matches.map((match) => {
              const percentage = ((match.score / match.total) * 100).toFixed(0);
              return (
                <div key={match.id} className="match-card" onClick={() => viewMatchDetails(match)}>
                  <div className="match-header">
                    <div className="match-date">{formatDate(match.timestamp)}</div>
                    <div className={`match-difficulty difficulty-${match.difficulty.toLowerCase()}`}>
                      {match.difficulty}
                    </div>
                  </div>
                  <div className="match-stats">
                    <div className="match-score">
                      <span className="score-value">{match.score}/{match.total}</span>
                      <span className="score-percentage">({percentage}%)</span>
                    </div>
                    <div className="match-time">{match.timeTaken}s</div>
                  </div>
                  <div className="match-footer">
                    <button className="btn btn-small btn-primary">View Details</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
