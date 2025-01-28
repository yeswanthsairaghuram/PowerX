import React from "react";
import { Link } from "react-router-dom";
import "./FitnessExercise.css";

const FitnessExercise = () => {
  return (
    <>
      <div className="fitness-exercise-wrapper">
        <div className="exercise-image-container">
          <div className="large-image">
            <img src={"/Exercise-HomePage/Exercise-1.jpg"} alt="Exercise-1" />
          </div>
          <div className="small-images">
            <img src={"/Exercise-HomePage/Exercise-2.jpg"} alt="Exercise-2" />
            <img src={"/Exercise-HomePage/Exercise-3.jpg"} alt="Exercise-3" />
          </div>
        </div>
        <div className="exercise-content">
          <p className="headline">Transform your mindset, transform your body</p>
          <p className="subheadline">Push yourself beyond your limits</p>
          <div className="stats-container">
            <div className="stat-item">
              <h2>165+</h2>
              <p>Happy Customers</p>
            </div>
            <div className="stat-item">
              <h2>98%</h2>
              <p>Efficiency</p>
            </div>
            <div className="stat-item">
              <h2>12</h2>
              <p>Years of Experience</p>
            </div>
          </div>
          <Link to="/Exercises" className="explore-button">
            Explore Exercises
          </Link>
        </div>
      </div>
    </>
  );
};

export default FitnessExercise;
