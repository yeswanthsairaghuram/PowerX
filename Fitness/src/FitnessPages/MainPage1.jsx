import React from "react";
import PoseCards from "./PoseCards";

import './MainPage1.css';

import YogaTop from "./YogaTop";
import BMICalculator from "./SideBmiCalculator";


const MainPage = () => {
    return (
        <div>
            <BMICalculator />
            <YogaTop />

            <div className="hero-banner">
                <div className="hero-banner-content">
                    <div className="content">
                        <h1 className="hero-banner-heading-yoga">
                            Inhale the future,<br />Exhale the past.
                        </h1>
                        <p className="hero-banner-subtext-yoga">
                            Check out the most effective Yogas personalized to you..
                        </p>
                        <div className="hero-banner-button-wrapper">
                            <a href="#Yogas" className="hero-banner-button">Explore Yogas</a>
                        </div>
                        <p className="hero-banner-watermark-yoga">Yoga</p>
                    </div>
                    <img src={"/yoga-main.jpg"} alt="hero-banner" className="hero-banner-img" />
                </div>
            </div>


            <div id="Yogas"><PoseCards /></div>


        </div>
    );
}

export default MainPage;
