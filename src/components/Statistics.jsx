import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { calculateStats } from '../utils';
import './Statistics.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Statistics = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = () => {
    const calculatedStats = calculateStats();
    setStats(calculatedStats);
  };

  if (!stats || stats.totalMatches === 0) {
    return (
      <div className="statistics-container">
        <div className="card">
          <h1>Statistics</h1>
          <div className="empty-state">
            <p>No statistics available yet. Play some matches to see your progression!</p>
          </div>
        </div>
      </div>
    );
  }

  // Accuracy Trend Chart Data
  const accuracyTrendData = {
    labels: stats.accuracyTrend.map((item, idx) => `Match ${idx + 1}`),
    datasets: [
      {
        label: 'Accuracy %',
        data: stats.accuracyTrend.map((item) => item.accuracy),
        borderColor: '#667eea',
        backgroundColor: 'rgba(102, 126, 234, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const accuracyTrendOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Accuracy Trend Over Time',
        font: {
          size: 16,
          weight: 'bold',
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: (value) => value + '%',
        },
      },
    },
  };

  // Difficulty Breakdown Chart Data
  const difficultyData = {
    labels: Object.keys(stats.accuracyByDifficulty),
    datasets: [
      {
        label: 'Accuracy %',
        data: Object.values(stats.accuracyByDifficulty),
        backgroundColor: [
          'rgba(40, 167, 69, 0.7)',
          'rgba(255, 193, 7, 0.7)',
          'rgba(220, 53, 69, 0.7)',
        ],
        borderColor: ['#28a745', '#ffc107', '#dc3545'],
        borderWidth: 2,
      },
    ],
  };

  const difficultyOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Accuracy by Difficulty Level',
        font: {
          size: 16,
          weight: 'bold',
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: (value) => value + '%',
        },
      },
    },
  };

  // Operation Breakdown Chart Data
  const operationData = {
    labels: Object.keys(stats.accuracyByOperation),
    datasets: [
      {
        label: 'Accuracy %',
        data: Object.values(stats.accuracyByOperation),
        backgroundColor: [
          'rgba(102, 126, 234, 0.7)',
          'rgba(118, 75, 162, 0.7)',
          'rgba(255, 99, 132, 0.7)',
          'rgba(54, 162, 235, 0.7)',
        ],
        borderColor: ['#667eea', '#764ba2', '#ff6384', '#36a2eb'],
        borderWidth: 2,
      },
    ],
  };

  const operationOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Accuracy by Operation Type',
        font: {
          size: 16,
          weight: 'bold',
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: (value) => value + '%',
        },
      },
    },
  };

  return (
    <div className="statistics-container">
      <div className="card">
        <h1>Statistics Dashboard</h1>
        <p>Track your progress and performance</p>

        {/* Overall Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">🎮</div>
            <div className="stat-value">{stats.totalMatches}</div>
            <div className="stat-label">Total Matches</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🎯</div>
            <div className="stat-value">{stats.overallAccuracy}%</div>
            <div className="stat-label">Overall Accuracy</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⭐</div>
            <div className="stat-value">{stats.averageScore}</div>
            <div className="stat-label">Avg Score</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⏱️</div>
            <div className="stat-value">{stats.averageTime}s</div>
            <div className="stat-label">Avg Time</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🏆</div>
            <div className="stat-value">{stats.bestScore}%</div>
            <div className="stat-label">Best Score</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-value">{stats.worstScore}%</div>
            <div className="stat-label">Worst Score</div>
          </div>
        </div>

        {/* Charts */}
        <div className="charts-container">
          <div className="chart-wrapper">
            <div className="chart-box">
              <Line data={accuracyTrendData} options={accuracyTrendOptions} />
            </div>
          </div>

          <div className="chart-wrapper">
            <div className="chart-box">
              <Bar data={difficultyData} options={difficultyOptions} />
            </div>
          </div>

          <div className="chart-wrapper">
            <div className="chart-box">
              <Bar data={operationData} options={operationOptions} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
