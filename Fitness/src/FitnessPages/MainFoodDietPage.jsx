import React from "react";
import FoodDietPage from "./FoodDietPage";
import './MainFoodDietPage.css';

import BMICalculator from "./SideBmiCalculator";

import DietTop from "./DietTop";


const MainFoodDietPage = () => {
  return (
    <div>
      <BMICalculator />
      <DietTop />
      <div className="hero-banner">
        <div className="hero-banner-content">
          <div className="content">
            <h1 className="hero-banner-heading-food">
              Eat Well,<br />Live Well.
            </h1>
            <p className="hero-banner-subtext-food">
              Discover nutritious and delicious diets tailored to your goals.
            </p>
            <div className="hero-banner-button-wrapper">
              <a href="#FoodDiets" className="hero-banner-button-food">Explore Diets</a>
            </div>
            <p className="hero-banner-watermark-diet">Diet</p>
          </div>
          <img src={"/FoodImages/MainFoodImage.jpg"} alt="hero-banner" className="hero-banner-img" />
        </div>
      </div>

      <div id="FoodDiets">
        <FoodDietPage />
      </div>

    </div>
  );
}

export default MainFoodDietPage;
