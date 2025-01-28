import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { youtubeOptions, fetchData } from './fetchData';
import './FoodDietDetails.css';
import YouTubeVideos from './YouTubeVideos';

const FoodDietDetails = () => {
  const { foodName } = useParams();
  const [food, setFood] = useState(null);
  const [foodData, setFoodData] = useState([]);

  useEffect(() => {
    const fetchFoodDataFromBackend = async () => {
      try {
        const response = await axios.get(`http://localhost:9000/get-all-diets/${foodName}`);
        setFood(response.data);
      } catch (error) {
        console.error('Error fetching food data:', error);
      }
    };

    if (foodName) {
      fetchFoodDataFromBackend();
    }
  }, [foodName]);

  // Fetch YouTube videos
  useEffect(() => {
    const fetchYouTubeVideos = async () => {
      try {
        const youtubeSearchUrl = 'https://youtube-search-and-download.p.rapidapi.com';
        const response = await fetchData(
          `${youtubeSearchUrl}/search?query=${foodName} food`,
          youtubeOptions
        );
        setFoodData(response.contents);
      } catch (error) {
        console.error('Error fetching YouTube videos:', error);
      }
    };

    if (foodName) {
      fetchYouTubeVideos();
    }
  }, [foodName]);

  if (!food) {
    return <div>Loading...</div>;
  }

  return (
    <div className="food-page-wrapper">
      <div className="food-detail-container">
        <div className="food-image-section">
          <img src={food.svgImageUrl} alt={food.name} className="food-detail-image" />
        </div>
        <div className="food-info-section">
          <div className="food-names">
            <h2 className="food-name-detail">{food.name}</h2>
            <h3 className="food-category-detail">({food.category})</h3>
            <p className="food-kcal"><span>Calories:</span> {food.kcalBurnt} kcal</p>
          </div>
        </div>
      </div>

      <div className="food-detail-desc">
        <p className="food-description">{food.description}</p>
        <div className="gradient-line"></div>
        <h4>Benefits:</h4>
        <p className="food-benefits-detail">{food.benefits}</p>
        <h4>Steps:</h4>
        <ul className="food-steps">
          {food.steps.map((step, index) => (
            <li key={index}>{step}</li>
          ))}
        </ul>
      </div>

      {/* YouTube Videos Section */}
      <div className="youtube-videos-section">
        <YouTubeVideos Videos={foodData} name={food.name} />
      </div>
    </div>
  );
};

export default FoodDietDetails;
