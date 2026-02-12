import React, { useState } from 'react';
import { saveMatch } from '../utils';
import './Game.css';

const DIFFICULTY_SETTINGS = {
  Easy: {
    range: [1, 20],
    operations: ['+', '-'],
  },
  Medium: {
    range: [1, 50],
    operations: ['+', '-', '×', '÷'],
  },
  Hard: {
    range: [1, 100],
    operations: ['+', '-', '×', '÷'],
  },
};

const QUESTIONS_PER_MATCH = 10;

const Game = () => {
  const [gameState, setGameState] = useState('setup'); // setup, playing, summary
  const [difficulty, setDifficulty] = useState('Easy');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [questionStartTime, setQuestionStartTime] = useState(null);
  const [timeTaken, setTimeTaken] = useState(0);
  const [feedback, setFeedback] = useState(null);

  const generateQuestion = (diff) => {
    const settings = DIFFICULTY_SETTINGS[diff];
    const [min, max] = settings.range;
    const operation = settings.operations[Math.floor(Math.random() * settings.operations.length)];

    let num1 = Math.floor(Math.random() * (max - min + 1)) + min;
    let num2 = Math.floor(Math.random() * (max - min + 1)) + min;
    let answer;

    // For division, ensure it divides evenly
    if (operation === '÷') {
      num2 = Math.floor(Math.random() * (max / 2 - 1)) + 1;
      answer = Math.floor(Math.random() * (max / num2 - 1)) + 1;
      num1 = num2 * answer;
    } else {
      switch (operation) {
        case '+':
          answer = num1 + num2;
          break;
        case '-':
          // Ensure positive result
          if (num1 < num2) [num1, num2] = [num2, num1];
          answer = num1 - num2;
          break;
        case '×':
          answer = num1 * num2;
          break;
        default:
          answer = num1 + num2;
      }
    }

    return {
      question: `${num1} ${operation} ${num2}`,
      answer,
      operation,
      userAnswer: null,
      isCorrect: null,
      timeTaken: 0,
    };
  };

  const startGame = () => {
    const newQuestions = Array.from({ length: QUESTIONS_PER_MATCH }, () =>
      generateQuestion(difficulty)
    );
    setQuestions(newQuestions);
    setCurrentQuestion(0);
    setScore(0);
    setUserAnswer('');
    setFeedback(null);
    setGameState('playing');
    setStartTime(Date.now());
    setQuestionStartTime(Date.now());
  };

  const submitAnswer = () => {
    if (userAnswer === '') return;

    const questionTime = Date.now() - questionStartTime;
    const answer = parseInt(userAnswer, 10);
    const currentQ = questions[currentQuestion];
    const isCorrect = answer === currentQ.answer;

    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestion] = {
      ...currentQ,
      userAnswer: answer,
      isCorrect,
      timeTaken: questionTime,
    };

    setQuestions(updatedQuestions);
    setFeedback(isCorrect ? 'correct' : 'wrong');

    if (isCorrect) {
      setScore(score + 1);
    }

    setTimeout(() => {
      if (currentQuestion < QUESTIONS_PER_MATCH - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setUserAnswer('');
        setFeedback(null);
        setQuestionStartTime(Date.now());
      } else {
        finishGame(updatedQuestions);
      }
    }, 1000);
  };

  const finishGame = (finalQuestions) => {
    const endTime = Date.now();
    const totalTime = Math.floor((endTime - startTime) / 1000);
    setTimeTaken(totalTime);

    const matchData = {
      difficulty,
      score,
      total: QUESTIONS_PER_MATCH,
      timeTaken: totalTime,
      questions: finalQuestions,
    };

    saveMatch(matchData);
    setGameState('summary');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      submitAnswer();
    }
  };

  const resetGame = () => {
    setGameState('setup');
    setCurrentQuestion(0);
    setUserAnswer('');
    setFeedback(null);
  };

  if (gameState === 'setup') {
    return (
      <div className="game-container">
        <div className="card game-card">
          <h1>Mental Math Game</h1>
          <p>Test your arithmetic skills!</p>

          <div className="difficulty-selector">
            <h2>Select Difficulty</h2>
            <div className="difficulty-buttons">
              {Object.keys(DIFFICULTY_SETTINGS).map((diff) => (
                <button
                  key={diff}
                  className={`btn ${difficulty === diff ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setDifficulty(diff)}
                >
                  {diff}
                </button>
              ))}
            </div>
            <div className="difficulty-info">
              <p>
                <strong>{difficulty}:</strong> Numbers {DIFFICULTY_SETTINGS[difficulty].range[0]}-
                {DIFFICULTY_SETTINGS[difficulty].range[1]}, Operations:{' '}
                {DIFFICULTY_SETTINGS[difficulty].operations.join(', ')}
              </p>
            </div>
          </div>

          <button className="btn btn-success btn-large" onClick={startGame}>
            Start Game
          </button>
        </div>
      </div>
    );
  }

  if (gameState === 'playing') {
    const currentQ = questions[currentQuestion];
    return (
      <div className="game-container">
        <div className="card game-card">
          <div className="game-header">
            <div className="progress-info">
              Question {currentQuestion + 1} of {QUESTIONS_PER_MATCH}
            </div>
            <div className="score-info">Score: {score}</div>
          </div>

          <div className="question-container">
            <h2 className="question">{currentQ.question} = ?</h2>

            <input
              type="number"
              className={`answer-input ${feedback ? `feedback-${feedback}` : ''}`}
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Your answer"
              autoFocus
              disabled={feedback !== null}
            />

            {feedback && (
              <div className={`feedback feedback-${feedback}`}>
                {feedback === 'correct' ? (
                  <>
                    <span className="feedback-icon">✅</span> Correct!
                  </>
                ) : (
                  <>
                    <span className="feedback-icon">❌</span> Wrong! Answer: {currentQ.answer}
                  </>
                )}
              </div>
            )}

            {!feedback && (
              <button className="btn btn-primary" onClick={submitAnswer} disabled={userAnswer === ''}>
                Submit
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'summary') {
    const percentage = ((score / QUESTIONS_PER_MATCH) * 100).toFixed(0);
    return (
      <div className="game-container">
        <div className="card game-card">
          <h1>Match Summary</h1>

          <div className="summary-stats">
            <div className="stat-box">
              <div className="stat-value">{score}/{QUESTIONS_PER_MATCH}</div>
              <div className="stat-label">Score</div>
            </div>
            <div className="stat-box">
              <div className="stat-value">{percentage}%</div>
              <div className="stat-label">Accuracy</div>
            </div>
            <div className="stat-box">
              <div className="stat-value">{timeTaken}s</div>
              <div className="stat-label">Time</div>
            </div>
            <div className="stat-box">
              <div className="stat-value">{difficulty}</div>
              <div className="stat-label">Difficulty</div>
            </div>
          </div>

          <h3>Question Details</h3>
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
            Play Again
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default Game;
