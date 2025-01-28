import React, { useState, useRef } from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import './Slick.css'; // Custom CSS

const FitnessSlider = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const sliderRef = useRef(null); // Reference to the slider

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        autoplay: true,
        autoplaySpeed: 3000,
        fade: true,
        beforeChange: (current, next) => setCurrentSlide(next),
    };

    const totalSlides = 4;

    const handleClick = (index) => {
        if (sliderRef.current) {
            sliderRef.current.slickGoTo(index); // Programmatically change slide
        }
    };

    return (
        <div className="slider-containe">
            <Slider {...settings} ref={sliderRef}>
                {Array.from({ length: totalSlides }).map((_, index) => (
                    <div key={index} className={`slide ${currentSlide === index ? 'active' : ''}`}>
                        <img src={`./slick${index + 1}.jpg`} alt={`Slide ${index + 1}`} className="zoom-img" />
                        <div className="text-overlay">Transform your</div>
                        <div className="text-overlay1">mindset, transform</div>
                        <div className="text-overlay2">your body</div>
                        <div className="right-corner-text">
                            <div className='lines'></div>
                            Your way to an ideal body shape starts here.<br />
                            Thousands of people have changed their<br/>
                             lives for the better.
                        </div>
                    </div>
                ))}
            </Slider>
            <div className="vertical-numbers">
                {[...Array(totalSlides)].map((_, index) => (
                    <div key={index} className="number-container" onClick={() => handleClick(index)}>
                        {index + 1 === currentSlide + 1 && <div className="line" />}
                        <div className={`number ${index + 1 === currentSlide + 1 ? 'active' : ''}`}>
                            {`0${index + 1}`}
                        </div>
                        {index + 1 === currentSlide + 1 && <div className="line" />}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FitnessSlider;
