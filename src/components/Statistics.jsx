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

// Dark theme defaults for Chart.js
ChartJS.defaults.color = '#646669';
ChartJS.defaults.borderColor = '#3a3c3f';
ChartJS.defaults.font.family = "'Roboto Mono', monospace";

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
          <h1>statistics</h1>
          <div className="empty-state">
            <p>no data yet. play some games to see your stats.</p>
          </div>
        </div>
      </div>
    );
  }

  const chartTitleFont = { size: 13, weight: '400', family: "'Roboto Mono', monospace" };
  const chartTitleColor = '#646669';

  // Score Trend Chart Data
  const scoreTrendData = {
    labels: stats.scoreTrend.map((item, idx) => idx + 1),
    datasets: [
      {
        label: 'Score',
        data: stats.scoreTrend.map((item) => item.score),
        borderColor: '#e2b714',
        backgroundColor: 'rgba(226, 183, 20, 0.05)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#e2b714',
        pointRadius: 3,
        pointHoverRadius: 5,
        borderWidth: 2,
      },
    ],
  };

  const scoreTrendOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: 'score over time',
        font: chartTitleFont,
        color: chartTitleColor,
      },
    },
    scales: {
      y: { beginAtZero: true, grid: { color: '#3a3c3f' } },
      x: { grid: { display: false } },
    },
  };

  // Accuracy Trend Chart Data
  const accuracyTrendData = {
    labels: stats.scoreTrend.map((item, idx) => idx + 1),
    datasets: [
      {
        label: 'Accuracy %',
        data: stats.scoreTrend.map((item) => item.accuracy),
        borderColor: '#7ec870',
        backgroundColor: 'rgba(126, 200, 112, 0.05)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#7ec870',
        pointRadius: 3,
        pointHoverRadius: 5,
        borderWidth: 2,
      },
    ],
  };

  const accuracyTrendOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: 'accuracy trend',
        font: chartTitleFont,
        color: chartTitleColor,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: { callback: (value) => value + '%' },
        grid: { color: '#3a3c3f' },
      },
      x: { grid: { display: false } },
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
          'rgba(226, 183, 20, 0.6)',
          'rgba(126, 200, 112, 0.6)',
          'rgba(202, 71, 84, 0.6)',
          'rgba(100, 102, 105, 0.6)',
        ],
        borderColor: ['#e2b714', '#7ec870', '#ca4754', '#646669'],
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const operationOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: 'accuracy by operation',
        font: chartTitleFont,
        color: chartTitleColor,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: { callback: (value) => value + '%' },
        grid: { color: '#3a3c3f' },
      },
      x: { grid: { display: false } },
    },
  };

  // Scores by duration chart
  const durationLabels = Object.keys(stats.scoreByDuration);
  const durationData = {
    labels: durationLabels,
    datasets: [
      {
        label: 'Best',
        data: durationLabels.map((k) => stats.scoreByDuration[k].best),
        backgroundColor: 'rgba(226, 183, 20, 0.6)',
        borderColor: '#e2b714',
        borderWidth: 1,
        borderRadius: 4,
      },
      {
        label: 'Avg',
        data: durationLabels.map((k) => parseFloat(stats.scoreByDuration[k].avg)),
        backgroundColor: 'rgba(100, 102, 105, 0.4)',
        borderColor: '#646669',
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const durationOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: '#646669', font: { family: "'Roboto Mono', monospace", size: 11 } },
      },
      title: {
        display: true,
        text: 'scores by duration',
        font: chartTitleFont,
        color: chartTitleColor,
      },
    },
    scales: {
      y: { beginAtZero: true, grid: { color: '#3a3c3f' } },
      x: { grid: { display: false } },
    },
  };

  return (
    <div className="statistics-container">
      <div className="card">
        <h1>statistics</h1>
        <p>track your progress and performance</p>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{stats.totalMatches}</div>
            <div className="stat-label">games</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.overallAccuracy}%</div>
            <div className="stat-label">accuracy</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.averageScore}</div>
            <div className="stat-label">avg score</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.bestScore}</div>
            <div className="stat-label">best score</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.totalQuestionsAnswered}</div>
            <div className="stat-label">answered</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.averageQpm}</div>
            <div className="stat-label">avg q/min</div>
          </div>
        </div>

        <div className="charts-container">
          <div className="chart-wrapper">
            <div className="chart-box">
              <Line data={scoreTrendData} options={scoreTrendOptions} />
            </div>
          </div>

          <div className="chart-wrapper">
            <div className="chart-box">
              <Line data={accuracyTrendData} options={accuracyTrendOptions} />
            </div>
          </div>

          <div className="chart-wrapper">
            <div className="chart-box">
              <Bar data={operationData} options={operationOptions} />
            </div>
          </div>

          {durationLabels.length > 0 && (
            <div className="chart-wrapper">
              <div className="chart-box">
                <Bar data={durationData} options={durationOptions} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Statistics;
