import React from "react";
import './MainWorkoutsPage.css';

import ExercisePage from "./ExercisesPage";

import BMICalculator from "./SideBmiCalculator";

import ExerciseTop from "./ExerciseTop";

const MainWorkoutsPage = () => {
  return (
    <div>
      <ExerciseTop />

      <BMICalculator />

      <div className="hero-banner-exer">
        <div className="hero-banner-content">
          <div className="content">
            <h1 className="hero-banner-heading-exer">
              Train Hard,<br />Stay Strong.
            </h1>
            <p className="hero-banner-subtext-exer">
              Discover workouts designed to help you reach your fitness goals.
            </p>
            <div className="hero-banner-button-wrapper">
              <a href="#Workouts" className="hero-banner-button-exer">Explore Workouts</a>
            </div>
            <p className="hero-banner-watermark-exer">Workout</p>
          </div>
          <img src={"/exercise-main.jpg"} alt="hero-banner" className="hero-banner-img" />
        </div>
      </div>

      <div id="Workouts">
        <ExercisePage />
      </div>
    </div>
  );
}

export default MainWorkoutsPage;
