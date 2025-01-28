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
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './WeightLogger.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler, ChartDataLabels);

const WeightLogger = () => {
  const [weightData, setWeightData] = useState([]);
  const [weight, setWeight] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('daily');
  const [submitting, setSubmitting] = useState(false);

  const fetchWeightData = async () => {
    const userEmail = localStorage.getItem('email');
    try {
      const response = await axios.get(`http://localhost:9000/Weight-charts?email=${userEmail}`);
      setWeightData(response.data || []);
    } catch (error) {
      console.error('Error fetching weight data:', error);
      setError('Failed to load weight data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeightData();
  }, []);

  const handleWeightSubmit = async () => {
    if (!weight || weight <= 0) {
      setError('Please enter a valid weight greater than 0.');
      return;
    }

    const userEmail = localStorage.getItem('email');
    const today = new Date().toISOString().split('T')[0];
    const todayWeightEntry = weightData.find(item => new Date(item.date).toISOString().split('T')[0] === today);
    
    if (todayWeightEntry) {
      toast.warn('You have already logged your weight for today!');
      return;
    }

    setSubmitting(true);
    try {
      await axios.post('http://localhost:9000/Weight-charts', {
        email: userEmail,
        weight: parseFloat(weight),
        date: new Date(),
      });
      setWeight('');
      await fetchWeightData();
      toast.success('Weight logged successfully!');
    } catch (error) {
      console.error('Error logging weight:', error);
      setError('Failed to log weight. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const filterData = (data, timeframe) => {
    const aggregatedData = {};
    data.forEach(item => {
      const itemDate = new Date(item.date);
      let key;

      switch (timeframe) {
        case 'daily':
          key = itemDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          break;
        case 'weekly':
          const startOfWeek = new Date(itemDate);
          startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
          key = startOfWeek.toDateString();
          break;
        case 'monthly':
          key = `${itemDate.getFullYear()}-${itemDate.getMonth() + 1}`;
          break;
        case 'yearly':
          key = itemDate.getFullYear();
          break;
        default:
          key = itemDate.toDateString();
      }

      if (!aggregatedData[key]) {
        aggregatedData[key] = [];
      }
      aggregatedData[key].push(item.weight);
    });

    return aggregatedData;
  };

  const aggregatedData = filterData(weightData, filter);
  const chartLabels = Object.keys(aggregatedData);
  const chartValues = chartLabels.map(label => {
    const weights = aggregatedData[label];
    return weights[weights.length - 1];
  });

  const weightChanges = chartValues.map((value, index) => {
    if (index === 0) return null;
    return value - chartValues[index - 1];
  });

  const chartData = {
    labels: chartLabels,
    datasets: [
      {
        label: 'Weight (kg)',
        data: chartValues,
        fill: true,
        backgroundColor: 'rgba(0, 128, 128, 0.2)',
        borderColor: '#008080',
        borderWidth: 2,
        pointBackgroundColor: '#008080',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#008080',
        tension: 0.4,
      },
      {
        label: 'Change (kg)',
        data: weightChanges,
        fill: true,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(255, 99, 132, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(255, 99, 132, 1)',
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
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 15,
          font: {
            size: 14,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.raw} kg`,
        },
      },
      datalabels: {
        anchor: 'end',
        align: 'top',
        color: '#333',
        formatter: (value) => `${value} kg`,
        font: {
          size: 10,
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: filter === 'daily' ? 'Time of Day' : (filter === 'weekly' ? 'Week Start' : (filter === 'monthly' ? 'Month' : 'Year')),
        },
        grid: {
          color: 'rgba(200, 200, 200, 0.3)',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Weight (kg)',
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

  const todayWeightEntry = weightData.find(item => new Date(item.date).toISOString().split('T')[0] === new Date().toISOString().split('T')[0]);

  return (
    <div className="weight-logger-container">
      <h3>Log Your Weight</h3>
      <div className="input-container">
        <input
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          placeholder="Enter weight in kg"
        />
        <button onClick={handleWeightSubmit} disabled={submitting}>
          {submitting ? 'Submitting...' : 'Submit'}
        </button>
      </div>
      <h3>Total Entries: {weightData.length}</h3>
      <div className="button-container">
        <button onClick={() => setFilter('daily')}>Today</button>
        <button onClick={() => setFilter('weekly')}>Weekly</button>
        <button onClick={() => setFilter('monthly')}>Monthly</button>
        <button onClick={() => setFilter('yearly')}>Yearly</button>
      </div>
      {filter === 'daily' && todayWeightEntry ? (
        <div className="today-weight">
          <h4>Today's Weight: {todayWeightEntry.weight} kg</h4>
        </div>
      ) : (
        <div className="line-chart">
          <Line data={chartData} options={options} />
        </div>
      )}
      <div className="weight-log">
        <h4>Logged Weights:</h4>
        <div className="log-list">
          {weightData.map((entry) => (
            <div key={entry.date} className="log-entry">
              {new Date(entry.date).toLocaleDateString()} - {entry.weight} kg
            </div>
          ))}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default WeightLogger;
