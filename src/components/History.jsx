import React, { useState, useEffect } from 'react';
import { getMatchHistory } from '../utils';
import './History.css';

const formatDuration = (seconds) => {
  if (!seconds) return '—';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
};

const History = () => {
  const [matches, setMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    const history = getMatchHistory();
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
    const accuracy = selectedMatch.total > 0
      ? ((selectedMatch.score / selectedMatch.total) * 100).toFixed(0)
      : 0;
    return (
      <div className="history-container">
        <div className="card">
          <button className="btn btn-secondary btn-back" onClick={closeDetails}>
            ← back
          </button>

          <h1>match details</h1>

          <div className="match-details-header">
            <div className="detail-item">
              <strong>date</strong> {formatDate(selectedMatch.timestamp)}
            </div>
            <div className="detail-item">
              <strong>timer</strong> {formatDuration(selectedMatch.timerDuration)}
            </div>
            <div className="detail-item">
              <strong>score</strong> {selectedMatch.score}/{selectedMatch.total} ({accuracy}%)
            </div>
          </div>

          <h3 style={{ color: '#646669', fontSize: '0.8rem', fontWeight: 400, marginBottom: '0.5rem' }}>questions</h3>
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
        <h1>history</h1>
        <p>view all your past matches</p>

        {matches.length === 0 ? (
          <div className="empty-state">
            <p>no matches played yet. start playing to see your history.</p>
          </div>
        ) : (
          <div className="matches-list">
            {matches.map((match) => {
              const accuracy = match.total > 0
                ? ((match.score / match.total) * 100).toFixed(0)
                : 0;
              return (
                <div key={match.id} className="match-card" onClick={() => viewMatchDetails(match)}>
                  <div className="match-header">
                    <div className="match-date">{formatDate(match.timestamp)}</div>
                    <div className="match-duration">
                      {formatDuration(match.timerDuration)}
                    </div>
                  </div>
                  <div className="match-stats">
                    <div className="match-score">
                      <span className="score-value">{match.score} correct</span>
                      <span className="score-percentage">/ {match.total} attempted ({accuracy}%)</span>
                    </div>
                  </div>
                  <div className="match-footer">
                    <button className="btn btn-small btn-primary">details</button>
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
