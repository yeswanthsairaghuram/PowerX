import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import './Charts.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler, ChartDataLabels);

const ExerciseChart = () => {
  const [exerciseData, setExerciseData] = useState([]);
  const [filter, setFilter] = useState('daily');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExerciseData = async () => {
      const userEmail = localStorage.getItem('email');
      try {
        const response = await axios.get(`http://localhost:9000/Exercise-charts?email=${userEmail}`);
        if (response.data && response.data.length > 0) {
          setExerciseData(response.data);
        } else {
          setError('No exercise data found for this user.');
        }
      } catch (error) {
        console.error('Error fetching exercise data:', error);
        setError('Failed to load exercise data.');
      } finally {
        setLoading(false);
      }
    };

    fetchExerciseData();
  }, []);

  const filterData = (data, timeframe) => {
    const now = new Date();
    const filtered = data.filter(item => {
      const itemDate = new Date(item.completedAt);
      if (isNaN(itemDate)) return false;

      switch (timeframe) {
        case 'daily':
          return itemDate.toDateString() === now.toDateString();
        case 'weekly':
          const sevenDaysAgo = new Date(now);
          sevenDaysAgo.setDate(now.getDate() - 7);
          return itemDate >= sevenDaysAgo && itemDate <= now;
        case 'monthly':
          return itemDate.getMonth() === now.getMonth() && itemDate.getFullYear() === now.getFullYear();
        case 'yearly':
          return itemDate.getFullYear() === now.getFullYear();
        default:
          return true;
      }
    });

    const aggregatedData = {};
    filtered.forEach(item => {
      const dateStr = new Date(item.completedAt);
      let key;
      switch (timeframe) {
        case 'daily':
          key = dateStr.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          break;
        case 'weekly':
          key = dateStr.toLocaleDateString('en-US', { weekday: 'short' });
          break;
        case 'monthly':
          const weekNumber = Math.ceil(dateStr.getDate() / 7);
          key = `Week ${weekNumber}`;
          break;
        case 'yearly':
          const monthName = dateStr.toLocaleString('default', { month: 'long' });
          key = `${dateStr.getFullYear()}-${monthName}`;
          break;
        default:
          key = dateStr.toDateString();
      }

      if (!aggregatedData[key]) {
        aggregatedData[key] = 0;
      }
      aggregatedData[key] += item.caloriesBurnt;
    });

    return aggregatedData;
  };

  const aggregatedData = filterData(exerciseData, filter);
  const chartLabels = Object.keys(aggregatedData);
  const chartValues = Object.values(aggregatedData);
  const totalCaloriesBurned = chartValues.reduce((total, calories) => total + calories, 0);

  const chartData = {
    labels: chartLabels,
    datasets: [
      {
        label: 'Calories Burned',
        data: chartValues,
        fill: true,
        backgroundColor: '#01a8a852', // Fill color with transparency
        borderColor: '#008080', // Line color
        borderWidth: 2,
        pointBackgroundColor: '#008080',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#008080',
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        top: 20,
        bottom: 20,
      },
    },
    animation: {
      duration: 1000,
    },
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: true,
        text: 'Calories Burned Over Time',
        font: {
          size: 20,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.raw} kcal`;
          },
        },
      },
      datalabels: {
        anchor: 'end',
        align: 'end',
        color: 'black',
        formatter: (value) => value + ' kcal',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: filter === 'daily' ? 'Time of Completion' : 'Date',
        },
        grid: {
          color: 'rgba(200, 200, 200, 0.3)',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Calories Burned (kcal)',
        },
        grid: {
          color: 'rgba(200, 200, 200, 0.3)',
        },
        beginAtZero: true,
      },
    },
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="chart-container">
      <h3 className="total-calories">Total Calories Burned: {totalCaloriesBurned} kcal</h3>
      <div className="button-container">
        <button className="filter-button" onClick={() => setFilter('daily')}>Today</button>
        <button className="filter-button" onClick={() => setFilter('weekly')}>Weekly</button>
        <button className="filter-button" onClick={() => setFilter('monthly')}>Monthly</button>
        <button className="filter-button" onClick={() => setFilter('yearly')}>Yearly</button>
      </div>
      <div className="line-chart">
        <Line data={chartData} options={options} />
      </div>
      <div className="exercise-log">
        <h4>Exercise Log:</h4>
        <div className="log-list">
          {exerciseData
            .filter(item => {
              const itemDate = new Date(item.completedAt);
              const now = new Date();
              switch (filter) {
                case 'daily':
                  return itemDate.toDateString() === now.toDateString();
                case 'weekly':
                  const sevenDaysAgo = new Date(now);
                  sevenDaysAgo.setDate(now.getDate() - 7);
                  return itemDate >= sevenDaysAgo && itemDate <= now;
                case 'monthly':
                  return itemDate.getMonth() === now.getMonth() && itemDate.getFullYear() === now.getFullYear();
                case 'yearly':
                  return itemDate.getFullYear() === now.getFullYear();
                default:
                  return true;
              }
            })
            .map((entry) => (
              <div key={entry.completedAt} className="log-entry">
                <div className="log-date">{new Date(entry.completedAt).toLocaleString()}</div>
                <div className="log-details">{entry.cardname} - {entry.caloriesBurnt} kcal</div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ExerciseChart;
