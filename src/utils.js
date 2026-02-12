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
      bestScore: 0,
      totalQuestionsAnswered: 0,
      averageQpm: 0,
      accuracyByOperation: {},
      scoreTrend: [],
      scoreByDuration: {},
    };
  }

  const totalMatches = history.length;
  let totalCorrect = 0;
  let totalQuestions = 0;

  const operationStats = {};
  const scoreTrend = [];
  const durationStats = {};

  history.forEach((match) => {
    const { score, total, timerDuration, questions } = match;
    const accuracy = total > 0 ? (score / total) * 100 : 0;

    totalCorrect += score;
    totalQuestions += total;

    // Score trend
    scoreTrend.push({
      date: new Date(match.timestamp).toLocaleDateString(),
      score: score,
      accuracy: accuracy,
      duration: timerDuration || 0,
    });

    // By duration
    const durKey = timerDuration ? `${timerDuration}s` : 'unknown';
    if (!durationStats[durKey]) {
      durationStats[durKey] = { scores: [], accuracies: [], best: 0 };
    }
    durationStats[durKey].scores.push(score);
    durationStats[durKey].accuracies.push(accuracy);
    if (score > durationStats[durKey].best) {
      durationStats[durKey].best = score;
    }

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

  const overallAccuracy = totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0;
  const averageScore = totalCorrect / totalMatches;
  const bestScore = Math.max(...history.map((m) => m.score));

  // Average questions per minute across all matches
  const qpmValues = history
    .filter((m) => m.timerDuration && m.timerDuration > 0)
    .map((m) => (m.total / m.timerDuration) * 60);
  const averageQpm = qpmValues.length > 0
    ? qpmValues.reduce((a, b) => a + b, 0) / qpmValues.length
    : 0;

  const accuracyByOperation = {};
  Object.keys(operationStats).forEach((key) => {
    accuracyByOperation[key] =
      (operationStats[key].correct / operationStats[key].total) * 100;
  });

  const scoreByDuration = {};
  Object.keys(durationStats).forEach((key) => {
    const d = durationStats[key];
    scoreByDuration[key] = {
      avg: (d.scores.reduce((a, b) => a + b, 0) / d.scores.length).toFixed(1),
      best: d.best,
      matches: d.scores.length,
    };
  });

  return {
    totalMatches,
    overallAccuracy: overallAccuracy.toFixed(1),
    averageScore: averageScore.toFixed(1),
    bestScore,
    totalQuestionsAnswered: totalQuestions,
    averageQpm: averageQpm.toFixed(1),
    accuracyByOperation,
    scoreTrend,
    scoreByDuration,
  };
};

const getOperationFromQuestion = (questionText) => {
  if (questionText.includes('+')) return '+';
  if (questionText.includes('-')) return '-';
  if (questionText.includes('×')) return '×';
  if (questionText.includes('÷')) return '÷';
  return '+';
};
