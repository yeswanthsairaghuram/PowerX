import React, { useState, useEffect } from 'react';
import { FaArrowUp } from "react-icons/fa";
import './Scroll.css';

function Scroller() {
  const [isVisible, setIsVisible] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > window.innerHeight) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
<>

      {isVisible && (
        <button onClick={scrollToTop} className="scroll-to-top">
           <FaArrowUp />
        </button>
      )}
</>
  );
}

export default Scroller;