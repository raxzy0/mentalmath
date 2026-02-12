// Utility functions for localStorage operations

const STORAGE_KEY = 'mentalMathMatches';

export const saveMatch = (matchData) => {
  const history = getMatchHistory();
  history.push({
    ...matchData,
    id: Date.now(),
    timestamp: new Date().toISOString(),
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
};

export const getMatchHistory = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  try {
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error parsing match history:', error);
    return [];
  }
};

export const getMatchById = (id) => {
  const history = getMatchHistory();
  return history.find(match => match.id === id);
};

export const clearHistory = () => {
  localStorage.removeItem(STORAGE_KEY);
};

// Statistics calculations
export const calculateStats = () => {
  const history = getMatchHistory();
  
  if (history.length === 0) {
    return {
      totalMatches: 0,
      overallAccuracy: 0,
      averageScore: 0,
      averageTime: 0,
      bestScore: 0,
      worstScore: 0,
      accuracyByDifficulty: {},
      accuracyByOperation: {},
      accuracyTrend: [],
    };
  }

  const totalMatches = history.length;
  let totalCorrect = 0;
  let totalQuestions = 0;
  let totalTime = 0;
  let bestScore = 0;
  let worstScore = 100;

  const difficultyStats = {};
  const operationStats = {};
  const accuracyTrend = [];

  history.forEach((match) => {
    const { score, total, difficulty, timeTaken, questions } = match;
    const accuracy = (score / total) * 100;

    totalCorrect += score;
    totalQuestions += total;
    totalTime += timeTaken || 0;

    if (accuracy > bestScore) bestScore = accuracy;
    if (accuracy < worstScore) worstScore = accuracy;

    // Track accuracy trend
    accuracyTrend.push({
      date: new Date(match.timestamp).toLocaleDateString(),
      accuracy: accuracy,
    });

    // By difficulty
    if (!difficultyStats[difficulty]) {
      difficultyStats[difficulty] = { correct: 0, total: 0 };
    }
    difficultyStats[difficulty].correct += score;
    difficultyStats[difficulty].total += total;

    // By operation
    if (questions) {
      questions.forEach((q) => {
        const op = q.operation || getOperationFromQuestion(q.question);
        if (!operationStats[op]) {
          operationStats[op] = { correct: 0, total: 0 };
        }
        operationStats[op].total += 1;
        if (q.isCorrect) {
          operationStats[op].correct += 1;
        }
      });
    }
  });

  const overallAccuracy = (totalCorrect / totalQuestions) * 100;
  const averageScore = totalCorrect / totalMatches;
  const averageTime = totalTime / totalMatches;

  const accuracyByDifficulty = {};
  Object.keys(difficultyStats).forEach((key) => {
    accuracyByDifficulty[key] =
      (difficultyStats[key].correct / difficultyStats[key].total) * 100;
  });

  const accuracyByOperation = {};
  Object.keys(operationStats).forEach((key) => {
    accuracyByOperation[key] =
      (operationStats[key].correct / operationStats[key].total) * 100;
  });

  return {
    totalMatches,
    overallAccuracy: overallAccuracy.toFixed(2),
    averageScore: averageScore.toFixed(2),
    averageTime: averageTime.toFixed(2),
    bestScore: bestScore.toFixed(2),
    worstScore: worstScore.toFixed(2),
    accuracyByDifficulty,
    accuracyByOperation,
    accuracyTrend,
  };
};

const getOperationFromQuestion = (questionText) => {
  if (questionText.includes('+')) return '+';
  if (questionText.includes('-')) return '-';
  if (questionText.includes('×')) return '×';
  if (questionText.includes('÷')) return '÷';
  return '+';
};
