import React, { useState, useEffect, useRef, useCallback } from 'react';
import { saveMatch } from '../utils';
import './Game.css';

const DEFAULT_SETTINGS = {
  operations: {
    '+': true,
    '-': true,
    '×': true,
    '÷': true,
  },
  ranges: {
    '+': { min1: 2, max1: 100, min2: 2, max2: 100 },
    '-': { min1: 2, max1: 100, min2: 2, max2: 100 },
    '×': { min1: 2, max1: 12, min2: 2, max2: 100 },
    '÷': { min1: 2, max1: 12, min2: 2, max2: 100 },
  },
  timerDuration: 120,
};

const TIMER_OPTIONS = [30, 60, 120, 180, 300];

const Game = () => {
  const [gameState, setGameState] = useState('setup');
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('zetamacSettings');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [totalAttempted, setTotalAttempted] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [customTimer, setCustomTimer] = useState('');

  const timerRef = useRef(null);
  const inputRef = useRef(null);
  const questionsRef = useRef([]);
  const scoreRef = useRef(0);
  const totalRef = useRef(0);

  const getEnabledOperations = useCallback(() => {
    return Object.entries(settings.operations)
      .filter(([, enabled]) => enabled)
      .map(([op]) => op);
  }, [settings.operations]);

  const generateQuestion = useCallback(() => {
    const ops = getEnabledOperations();
    if (ops.length === 0) return null;

    const operation = ops[Math.floor(Math.random() * ops.length)];
    const range = settings.ranges[operation];

    let num1, num2, answer;

    if (operation === '÷') {
      num2 = Math.floor(Math.random() * (range.min1 <= range.max1 ? range.max1 - range.min1 + 1 : 1)) + range.min1;
      const quotient = Math.floor(Math.random() * (range.min2 <= range.max2 ? range.max2 - range.min2 + 1 : 1)) + range.min2;
      num1 = num2 * quotient;
      answer = quotient;
    } else if (operation === '×') {
      num1 = Math.floor(Math.random() * (range.max1 - range.min1 + 1)) + range.min1;
      num2 = Math.floor(Math.random() * (range.max2 - range.min2 + 1)) + range.min2;
      answer = num1 * num2;
    } else if (operation === '-') {
      num1 = Math.floor(Math.random() * (range.max1 - range.min1 + 1)) + range.min1;
      num2 = Math.floor(Math.random() * (range.max2 - range.min2 + 1)) + range.min2;
      if (num1 < num2) [num1, num2] = [num2, num1];
      answer = num1 - num2;
    } else {
      num1 = Math.floor(Math.random() * (range.max1 - range.min1 + 1)) + range.min1;
      num2 = Math.floor(Math.random() * (range.max2 - range.min2 + 1)) + range.min2;
      answer = num1 + num2;
    }

    return {
      question: `${num1} ${operation} ${num2}`,
      answer,
      operation,
      userAnswer: null,
      isCorrect: null,
    };
  }, [settings.ranges, getEnabledOperations]);

  const nextQuestion = useCallback(() => {
    const q = generateQuestion();
    if (q) {
      setCurrentQuestion(q);
      setUserAnswer('');
      setFeedback(null);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [generateQuestion]);

  const finishGame = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    const finalQuestions = questionsRef.current;
    const finalScore = scoreRef.current;
    const finalTotal = totalRef.current;

    const matchData = {
      score: finalScore,
      total: finalTotal,
      timerDuration: settings.timerDuration,
      questions: finalQuestions,
    };

    saveMatch(matchData);
    setGameState('summary');
  }, [settings.timerDuration]);

  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            timerRef.current = null;
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      };
    }
  }, [gameState]);

  useEffect(() => {
    if (gameState === 'playing' && timeLeft === 0) {
      finishGame();
    }
  }, [timeLeft, gameState, finishGame]);

  const startGame = () => {
    const ops = getEnabledOperations();
    if (ops.length === 0) return;

    questionsRef.current = [];
    scoreRef.current = 0;
    totalRef.current = 0;
    setQuestions([]);
    setScore(0);
    setTotalAttempted(0);
    setUserAnswer('');
    setFeedback(null);
    setTimeLeft(settings.timerDuration);
    setGameState('playing');

    const q = generateQuestion();
    setCurrentQuestion(q);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const submitAnswer = () => {
    if (userAnswer === '' || feedback !== null) return;

    const answer = parseInt(userAnswer, 10);
    const isCorrect = answer === currentQuestion.answer;

    const updatedQ = {
      ...currentQuestion,
      userAnswer: answer,
      isCorrect,
    };

    questionsRef.current = [...questionsRef.current, updatedQ];
    setQuestions((prev) => [...prev, updatedQ]);

    if (isCorrect) {
      scoreRef.current += 1;
      setScore((prev) => prev + 1);
    }
    totalRef.current += 1;
    setTotalAttempted((prev) => prev + 1);

    setFeedback(isCorrect ? 'correct' : 'wrong');

    if (isCorrect) {
      nextQuestion();
    } else {
      setTimeout(() => {
        nextQuestion();
      }, 800);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      submitAnswer();
    }
  };

  const resetGame = () => {
    setGameState('setup');
    setCurrentQuestion(null);
    setQuestions([]);
    setUserAnswer('');
    setFeedback(null);
    setScore(0);
    setTotalAttempted(0);
  };

  const updateOperation = (op, enabled) => {
    const newSettings = {
      ...settings,
      operations: { ...settings.operations, [op]: enabled },
    };
    setSettings(newSettings);
    localStorage.setItem('zetamacSettings', JSON.stringify(newSettings));
  };

  const updateRange = (op, field, value) => {
    const num = parseInt(value, 10);
    if (isNaN(num)) return;
    const newSettings = {
      ...settings,
      ranges: {
        ...settings.ranges,
        [op]: { ...settings.ranges[op], [field]: num },
      },
    };
    setSettings(newSettings);
    localStorage.setItem('zetamacSettings', JSON.stringify(newSettings));
  };

  const setTimerDuration = (duration) => {
    const newSettings = { ...settings, timerDuration: duration };
    setSettings(newSettings);
    localStorage.setItem('zetamacSettings', JSON.stringify(newSettings));
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  if (gameState === 'setup') {
    const enabledOps = getEnabledOperations();
    return (
      <div className="game-container">
        <div className="card game-card setup-card">
          <h1>mental math</h1>
          <p>zetamac-style arithmetic training</p>

          <div className="setup-section">
            <h2>timer</h2>
            <div className="timer-options">
              {TIMER_OPTIONS.map((t) => (
                <button
                  key={t}
                  className={`btn timer-btn ${settings.timerDuration === t ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => { setTimerDuration(t); setCustomTimer(''); }}
                >
                  {formatTime(t)}
                </button>
              ))}
              <div className="custom-timer">
                <input
                  type="number"
                  className="custom-timer-input"
                  placeholder="Custom (s)"
                  value={customTimer}
                  onChange={(e) => {
                    setCustomTimer(e.target.value);
                    const val = parseInt(e.target.value, 10);
                    if (val > 0) setTimerDuration(val);
                  }}
                  min="1"
                />
              </div>
            </div>
          </div>

          <div className="setup-section">
            <h2>operations & ranges</h2>
            <div className="operations-config">
              {['+', '-', '×', '÷'].map((op) => {
                const range = settings.ranges[op];
                const isDiv = op === '÷';
                const isMul = op === '×';
                return (
                  <div key={op} className={`operation-row ${!settings.operations[op] ? 'disabled-row' : ''}`}>
                    <label className="operation-toggle">
                      <input
                        type="checkbox"
                        checked={settings.operations[op]}
                        onChange={(e) => updateOperation(op, e.target.checked)}
                      />
                      <span className="operation-symbol">{op}</span>
                    </label>
                    <div className="range-inputs">
                      <div className="range-group">
                        <label>{isDiv || isMul ? 'Factor' : 'Num'} 1</label>
                        <div className="range-pair">
                          <input
                            type="number"
                            value={range.min1}
                            onChange={(e) => updateRange(op, 'min1', e.target.value)}
                            disabled={!settings.operations[op]}
                            min="0"
                          />
                          <span>to</span>
                          <input
                            type="number"
                            value={range.max1}
                            onChange={(e) => updateRange(op, 'max1', e.target.value)}
                            disabled={!settings.operations[op]}
                            min="0"
                          />
                        </div>
                      </div>
                      <div className="range-group">
                        <label>{isDiv || isMul ? 'Factor' : 'Num'} 2</label>
                        <div className="range-pair">
                          <input
                            type="number"
                            value={range.min2}
                            onChange={(e) => updateRange(op, 'min2', e.target.value)}
                            disabled={!settings.operations[op]}
                            min="0"
                          />
                          <span>to</span>
                          <input
                            type="number"
                            value={range.max2}
                            onChange={(e) => updateRange(op, 'max2', e.target.value)}
                            disabled={!settings.operations[op]}
                            min="0"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            className="btn btn-success btn-large"
            onClick={startGame}
            disabled={enabledOps.length === 0}
          >
            {enabledOps.length === 0 ? 'enable at least one operation' : 'start'}
          </button>
        </div>
      </div>
    );
  }

  if (gameState === 'playing') {
    const timerPercent = (timeLeft / settings.timerDuration) * 100;
    const timerUrgent = timeLeft <= 10;
    return (
      <div className="game-container">
        <div className="card game-card playing-card">
          <div className="game-header">
            <div className="score-info">{score}</div>
            <div className={`timer-display ${timerUrgent ? 'timer-urgent' : ''}`}>
              {formatTime(timeLeft)}
            </div>
          </div>

          <div className="timer-bar-container">
            <div
              className={`timer-bar ${timerUrgent ? 'timer-bar-urgent' : ''}`}
              style={{ width: `${timerPercent}%` }}
            />
          </div>

          {currentQuestion && (
            <div className="question-container">
              <h2 className="question">{currentQuestion.question} = ?</h2>

              <input
                ref={inputRef}
                type="number"
                className={`answer-input ${feedback ? `feedback-${feedback}` : ''}`}
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Answer"
                autoFocus
                disabled={feedback === 'wrong'}
              />

              {feedback === 'wrong' && (
                <div className="feedback feedback-wrong">
                  {currentQuestion.answer}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (gameState === 'summary') {
    const accuracy = totalAttempted > 0 ? ((score / totalAttempted) * 100).toFixed(0) : 0;
    const qpm = ((totalAttempted / settings.timerDuration) * 60).toFixed(1);
    return (
      <div className="game-container">
        <div className="card game-card">
          <h1>time's up</h1>

          <div className="summary-stats">
            <div className="stat-box">
              <div className="stat-value">{score}</div>
              <div className="stat-label">correct</div>
            </div>
            <div className="stat-box">
              <div className="stat-value">{totalAttempted}</div>
              <div className="stat-label">attempted</div>
            </div>
            <div className="stat-box">
              <div className="stat-value">{accuracy}%</div>
              <div className="stat-label">accuracy</div>
            </div>
            <div className="stat-box">
              <div className="stat-value">{formatTime(settings.timerDuration)}</div>
              <div className="stat-label">duration</div>
            </div>
            <div className="stat-box">
              <div className="stat-value">{qpm}</div>
              <div className="stat-label">q/min</div>
            </div>
          </div>

          <h3 style={{ color: '#646669', fontSize: '0.8rem', fontWeight: 400, marginBottom: '0.5rem' }}>question details</h3>
          <div className="questions-list">
            {questions.map((q, idx) => (
              <div key={idx} className={`question-item ${q.isCorrect ? 'correct' : 'wrong'}`}>
                <div className="question-num">#{idx + 1}</div>
                <div className="question-text">{q.question} = {q.answer}</div>
                <div className="user-answer">
                  Your answer: {q.userAnswer} {q.isCorrect ? '✅' : '❌'}
                </div>
              </div>
            ))}
          </div>

          <button className="btn btn-primary" onClick={resetGame}>
            play again
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default Game;
