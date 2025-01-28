import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios'; 
import { youtubeOptions, fetchData } from './fetchData';
import './PoseDetailPage.css';
import YouTubeVideos from './YouTubeVideos';
import ShimmerYT from './ShimmerYt';

const PoseDetailPage = () => {
  const { poseName } = useParams();
  const [pose, setPose] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [exerciseVideos, setExerciseVideos] = useState([]);
  const [videosLoading, setVideosLoading] = useState(true);


  useEffect(() => {
    const fetchPoseDataFromBackend = async () => {
      try {
        const response = await axios.get(`http://localhost:9000/get-yoga-pose/${poseName}`);
        setPose(response.data);
      } catch (error) {
        console.error('Error fetching pose data:', error);
        setError('Pose not found');
      } finally {
        setLoading(false);
      }
    };

    if (poseName) {
      fetchPoseDataFromBackend();
    }
  }, [poseName]);

  useEffect(() => {
    const fetchExercisesData = async () => {
      if (pose) {
        const youtubeSearchUrl = 'https://youtube-search-and-download.p.rapidapi.com';
        const exerciseVideosData = await fetchData(
          `${youtubeSearchUrl}/search?query=${pose.sanskrit_name_adapted} yoga`,
          youtubeOptions
        );
        setExerciseVideos(exerciseVideosData.contents);
      }
      setVideosLoading(false);
    };

    fetchExercisesData();
  }, [pose]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    pose && (
      <div className="pose-page-wrapper">
        <div className="pose-detail-container">
          <div className="pose-image-section">
            <img src={pose.url_svg || pose.url_svg_alt} alt={pose.english_name} className="pose-detail-image" />
          </div>
          <div className="pose-info-section">
            <div className="pose-names">
              <h2 className="pose-name-detail">{pose.english_name}</h2>
              <h3 className="pose-subname-detail">{pose.sanskrit_name_adapted}</h3>
            </div>
            <div className="pose-alt-icon">
              <img src={pose.url_svg_alt} alt={pose.english_name} className="pose-alt-image" />
            </div>
          </div>
        </div>
        <div className="pose-detail-desc">
          <p className="pose-description">{pose.pose_description}</p>
          <div className="gradient-line"></div>
          <h4>Benefits:</h4>
          <p className="pose-benefits-detail">{pose.pose_benefits}</p>
        </div>

        {/* YouTube Videos Section */}
        <div className="youtube-videos-section">
          {videosLoading ? (
            <ShimmerYT />
          ) : (
            <YouTubeVideos Videos={exerciseVideos} name={pose.sanskrit_name_adapted} />
          )}
        </div>
      </div>
    )
  );
};

export default PoseDetailPage;
