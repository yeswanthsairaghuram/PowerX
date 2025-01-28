import React, { useState, useRef } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './slickPart.css';
import { MdArrowOutward, MdArrowForward } from "react-icons/md";

import { PiArrowUpLeftLight, PiArrowUpRightLight } from "react-icons/pi";


function SlickFit() {
  const [prevClicked, setPrevClicked] = useState(false);
  const [nextClicked, setNextClicked] = useState(false);

  const sliderRef = useRef(null); // Create a reference for the slider

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: 0,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  const handlePrevClick = () => {
    setPrevClicked(true);
    sliderRef.current.slickPrev();
    setTimeout(() => setPrevClicked(false), 500); // Reset after 500ms
  };

  const handleNextClick = () => {
    setNextClicked(true);
    sliderRef.current.slickNext();
    setTimeout(() => setNextClicked(false), 500); // Reset after 500ms
  };

  // Array of images, feedbacks, and names for each slide
  const slidesData = [
    {
      imgSrc: "client1.jpg",
      name: "Siva Gadamsetty",
      feedback: "Mamulga manam thine thindiki,Chese paniki lekka lekapaaye. So naa weight lo maarpu undadhaaye. Appudu naku dorikindhi ee PowerX site. Indhulo register ayyaka nenu thaggakapoyina kani endhuku thaggatledho thelusthundhi. Idhi nenu vaadadame kaaka Anu tho kuda vaadisthunna."
    },
    {
      imgSrc: "client2.jpg",
      name: "Guna Bhai",
      feedback: "Kurrollu Karteeka maasam karanamga Dieting start chesanu Kurrollu. PowerX website baagundi. Register avvagane baaga receive cheskunnaru. Meeru kuda register avvandi. Itlu mee Guna Bhai👍👍."
    },
    {
      imgSrc: "client3.jpg",
      name: "G S Yadav",
      feedback: "Andi dieting chestnanandi. Bakkaga undi maa amma ni edipisthunnanandi. Ee website vadi body manchi shape loki occhindi andi manishi laa kaadu andi rowdyni anukondi. Meeru kooda vaadandi."
    },
    
    {
      imgSrc: "client5.jpg",
      name: "Match Box Macha",
      feedback: "Yoov FowerYex sight vaadtna maccha. Evudaina laavu ga unna annodo egiri thantha. Than ku FowerYex ."
    }
  ];

  return (
    <div className="slider-container">
      <Slider ref={sliderRef} {...settings}>
        {slidesData.map((slide, index) => (
          <div className="sdiv" key={index}>
            <div className="marking">
              <img src="mark.png" alt="" />
            </div>
            <div className="feedbackmatter">
              {slide.feedback}
            </div>
            <div className="imgnamediv">
              <div className="imgdiv">
                <img src={slide.imgSrc} alt={slide.name} />
              </div>
              <div className="namediv">{slide.name}</div>
            </div>
          </div>
        ))}
      </Slider>

      {/* Custom Navigation */}
      <div className="arrow-container">
        <div
          className={`custom-prev ${prevClicked ? 'clicked' : ''}`}
          onClick={handlePrevClick}
        >
              <PiArrowUpLeftLight />
        </div>
        <div
          className={`custom-next ${nextClicked ? 'clicked' : ''}`}
          onClick={handleNextClick}
        >
           <PiArrowUpRightLight />
        </div>
      </div>


      <style>
        {`
          .custom-prev, .custom-next {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 50px; /* Default width */
            height: 50px; /* Default height */
            background-color: white; /* White background for the circle */
            border: 2px solid black; /* Black border */
            border-radius: 50%; /* Make it round */
            color: black; /* Arrow color */
            font-size: 24px; /* Arrow size */
            cursor: pointer;
            transition: transform 0.3s ease, background-color 0.3s ease, color 0.3s ease; /* Smooth effect */
            position: relative; /* Ensure the positioning context */
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2); /* Default shadow for depth */
            transform-origin: center; /* Set transform origin to center */
          }


          .custom-prev.clicked, .custom-next.clicked {
            background-color: black; /* Change background color to black when clicked */
            color: white; /* Change arrow color to white when clicked */
            
          }

          .arrow-container {
            display: flex;
            justify-content: space-between;
            width: 120px; /* Adjust as needed */
            margin: 20px auto 0; /* Center the arrow container */
          }

          /* Responsive styles */
          @media screen and (max-width: 1440px) {
            .custom-prev, .custom-next {
              font-size: 20px;
              width: 45px; /* Adjust width for responsiveness */
              height: 45px; /* Adjust height for responsiveness */
            }
          }
          @media screen and (max-width: 1024px) {
            .custom-prev, .custom-next {
              font-size: 18px;
              width: 40px;
              height: 40px;
            }
          }
          @media screen and (max-width: 768px) {
            .custom-prev, .custom-next {
              font-size: 16px;
              width: 35px;
              height: 35px;
            }
          }
          @media screen and (max-width: 425px) {
            .custom-prev, .custom-next {
              font-size: 14px;
              width: 30px;
              height: 30px;
            }
          }
        `}
      </style>
    </div>
  );
}

export default SlickFit;