import React, { useState, useEffect } from 'react';
import './PoseCards.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { IoArrowForwardCircleOutline, IoArrowBackCircleOutline } from "react-icons/io5";
import ShimmerCard from './ShimmerCards'; // Assuming you have a shimmer component

const PoseCards = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [poseData, setPoseData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 8;

  useEffect(() => {
    const fetchPoses = async () => {
      try {
        const response = await axios.get('http://localhost:9000/get-all-yoga-poses');
        setPoseData(response.data);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch yoga poses');
        setLoading(false);
      }
    };

    fetchPoses();
  }, []);

  const filteredPoses = poseData.filter(pose =>
    pose.english_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pose.sanskrit_name_adapted.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pose.sanskrit_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPoses.length / cardsPerPage);
  const indexOfLastPose = currentPage * cardsPerPage;
  const indexOfFirstPose = indexOfLastPose - cardsPerPage;
  const currentPoses = filteredPoses.slice(indexOfFirstPose, indexOfLastPose);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleDotClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  if (loading) {
    return (
      <div className="shimmer-container">
        <ShimmerCard />
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="pose-cards-wrapper">
      <div className="search-bar-container">
        <input
          type="text"
          placeholder="Search Yoga Poses..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-bar-input"
        />
      </div>
      <div className="pose-cards-container">
        {currentPoses.length > 0 ? (
          currentPoses.map((pose) => (
            <Link to={`/Yoga/${pose.english_name}`} key={pose.id} className="pose-card-link">
              <div className="pose-card">
                <img src={pose.url_svg} alt={pose.english_name} className="pose-image" />
                <h3 className="pose-name">{pose.english_name}</h3>
                <h4 className="pose-subname">({pose.sanskrit_name_adapted})</h4>
                <p className="pose-benefits">{pose.pose_benefits}...</p>
              </div>
            </Link>
          ))
        ) : (
          <div>No poses found for "{searchQuery}"</div>
        )}
      </div>

      <div className="pagination-section">
        <button onClick={handlePreviousPage} disabled={currentPage === 1} className="pagination-arrow">
          <IoArrowBackCircleOutline />
        </button>
        <div className="dots">
          {[...Array(totalPages)].map((_, index) => (
            <span
              key={index}
              className={`dot ${currentPage === index + 1 ? 'active' : ''}`}
              onClick={() => handleDotClick(index + 1)}
            >
              •
            </span>
          ))}
        </div>
        <button onClick={handleNextPage} disabled={currentPage === totalPages} className="pagination-arrow">
          <IoArrowForwardCircleOutline />
        </button>
      </div>
    </div>
  );
};

export default PoseCards;
