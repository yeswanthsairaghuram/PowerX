import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { youtubeOptions, fetchData } from './fetchData';
import './ExerciseDetails.css';
import YouTubeVideos from './YouTubeVideos';

const ExerciseDetails = () => {
  const { exerciseName } = useParams();
  const [exercise, setExercise] = useState(null);
  const [exerciseVideos, setExerciseVideos] = useState([]);

  // Fetch exercise details from backend
  useEffect(() => {
    const fetchExerciseData = async () => {
      try {
        const response = await axios.get(`http://localhost:9000/get-exercises-data/${exerciseName}`);
        setExercise(response.data);
      } catch (error) {
        console.error('Error fetching exercise data:', error);
      }
    };

    if (exerciseName) {
      fetchExerciseData();
    }
  }, [exerciseName]);

  // Fetch YouTube videos
  useEffect(() => {
    const fetchExerciseVideos = async () => {
      try {
        const youtubeSearchUrl = 'https://youtube-search-and-download.p.rapidapi.com';
        const response = await fetchData(
          `${youtubeSearchUrl}/search?query=${exerciseName} exercise`,
          youtubeOptions
        );
        setExerciseVideos(response.contents);
      } catch (error) {
        console.error('Error fetching YouTube videos:', error);
      }
    };

    if (exerciseName) {
      fetchExerciseVideos();
    }
  }, [exerciseName]);

  if (!exercise) {
    return <div>Loading...</div>;
  }

  return (
    <div className="exercise-page-wrapper">
      <div className="exercise-detail-container">
        <div className="exercise-image-section">
          <img src={exercise.gifImageUrl} alt={exercise.name} className="exercise-detail-image" />
        </div>
        <div className="exercise-info-section">
          <div className="exercise-names">
            <h2 className="exercise-name-detail">{exercise.name}</h2>
            <h3 className="exercise-category-detail">({exercise.category})</h3>
            <p className="exercise-kcal"><span>Calories Burnt:</span> {exercise.caloriesBurnt} kcal</p>
          </div>
        </div>
      </div>

      <div className="exercise-detail-desc">
        <p className="exercise-description">{exercise.description}</p>
        <div className="gradient-line"></div>
        <h4>Benefits:</h4>
        <p className="exercise-benefits-detail">{exercise.benefits}</p>
        <h4>Steps:</h4>
        <ul className="exercise-steps">
          {exercise.steps.map((step, index) => (
            <li key={index}>{step}</li>
          ))}
        </ul>
      </div>

      {/* YouTube Videos Section */}
      <div className="youtube-videos-section">
        <YouTubeVideos Videos={exerciseVideos} name={exercise.name} />
      </div>
    </div>
  );
};

export default ExerciseDetails;
