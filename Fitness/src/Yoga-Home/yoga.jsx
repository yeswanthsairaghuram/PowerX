import React from 'react';
import { Link } from "react-router-dom";
import './yoga.css';

const YogaServices = () => {
  return (
    <>
    <div className="Yoga-services-wrapper">
    <div className="yoga-services-container">
      <div className="yoga-services-header">
        YOGA SERVICES
      </div>
      <div className="yoga-services-title">
        What we Propose
      </div>
      <p className="yoga-services-description">
        Originating in ancient India, yoga has gained immense popularity worldwide for its numerous
        physical, mental, and spiritual benefits.
      </p>
    </div>
    <div className='yoga-cards-container'>
    <div className='yoga-cards'>
        <img src='./yoga1.jpg'/>
        <h3>Hatha Yoga</h3>
        <p>Most common forms of yoga, focusing on physical exercises and breathing techniques</p>
    </div>
    <div className='yoga-cards'>
    <img src='./yoga2.jpg'/>
    <h3>Asthanga Yoga</h3>
    <p>A rigorous and structured style that includes six series of poses performed in a specific order</p>
    </div>
    <div className='yoga-cards'>
    <img src='./yoga3.jpg'/>
    <h3>Kundalini Yoga</h3>
    <p>The form of yoga combines physical exercises, breathing techniques, meditation, and mantras to awaken</p>
    </div>
    </div>
    <div className='yoga-explore-div'>
    <Link to="/Yogas" className="explore-button-yoga">
        Explore Yogas
    </Link>
    </div>
    </div>
    
  </>
  );
};

export default YogaServices;
