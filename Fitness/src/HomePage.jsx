import React from 'react';
import Slick from './Slick/Slick';
import FitnessExercise from './FitnessHomePage/FitnessExercise';
import Section from './Section/Section';
import YogaServices from './Yoga-Home/yoga';
import Client from  './fitness/totalPart'

const HomePage = () => {
  return (
    <>
        <div className="HomePage">
        <Slick/>
        <FitnessExercise/>
        <Section/>
        <YogaServices/>
        <Client/>
        </div>
    </>
  );
};

export default HomePage;
