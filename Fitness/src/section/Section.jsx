import React from "react";
import { Link } from "react-router-dom";
import "./Section.css";
import { MdArrowOutward } from "react-icons/md";

const FitnessSection = () => {
  const sections = [
    {
      image: "./yoga.jpg", 
      title: "Yoga",
      description:
        "We will develop for you a unique nutrition program for weight loss and positive tone of the whole body",
      path: "/Yogas"
    },
    {
      image: "./Exercise.jpg",
      title: "Bodybuilding",
      description:
        "The cornerstone of bodybuilding is resistance training, which involves lifting weights to stimulate muscle growth",
      path: "/Exercises"
    },
    {
      image: "./fooddiet.jpeg", 
      title: "Food Diet",
      description:
        "His training can be tailored to different goals, such as hypertrophy (increasing muscle size), strength, or endurance",
      path: "/FoodDiet"
    },
    {
      image: "./power.jpg", 
      title: "Products",
      description:
        "Compound exercises, like squats and deadlifts, are particularly effective for building strength and muscle mass",
      path: "/products"
    },
  ];

  return (
    <div className="fitness-section-wrapper">
      <div className="fitness-section">
        {sections.map((section, index) => (
          <Link key={index} to={section.path} className="fitness-item">
            <div className="fitness-image">
              <img src={section.image} alt={section.title} />
            </div>
            <div className="fitness-info">
              <h2>{section.title}</h2>
              <div className="fitness-description">
                <p>{section.description}</p>
              </div>
            </div>
            <div className="fitness-arrow">
              <span className="arrow-right">
                <MdArrowOutward />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default FitnessSection;
