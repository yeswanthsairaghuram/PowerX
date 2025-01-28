import React, { useState } from 'react';
import ReactSpeedometer from 'react-d3-speedometer';
import './SideBmi.css';

const BMICalculator = () => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [userWeight, setUserWeight] = useState('');
  const [userHeight, setUserHeight] = useState('');
  const [calculatedBMI, setCalculatedBMI] = useState(null);
  const [weightCategory, setWeightCategory] = useState('');

  const computeBMI = () => {
    const heightInMeters = parseFloat(userHeight) / 100;
    const bmiValue = (parseFloat(userWeight) / (heightInMeters * heightInMeters)).toFixed(2);
    setCalculatedBMI(parseFloat(bmiValue));

    if (bmiValue < 18.5) {
      setWeightCategory('Underweight');
    } else if (bmiValue < 24.9) {
      setWeightCategory('Normal');
    } else if (bmiValue < 29.9) {
      setWeightCategory('Overweight');
    } else {
      setWeightCategory('Obese');
    }
  };

  const togglePopupVisibility = () => {
    if (isPopupVisible) {
      document.querySelector('.metrics-popup').classList.add('hide');
      setTimeout(() => {
        setIsPopupVisible(false);
      }, 1000);
    } else {
      setIsPopupVisible(true);
    }
  };

  const resetFields = () => {
    setUserWeight('');
    setUserHeight('');
    setCalculatedBMI(null);
    setWeightCategory('');
  };

  return (
    <div className="metrics-container">
      <button className="metrics-button" onClick={togglePopupVisibility}>
        Calculate BMI
      </button>

      {isPopupVisible && (
        <div className={`metrics-popup ${isPopupVisible ? 'show' : ''}`}>
          <div className={`popup-inner ${isPopupVisible ? 'show' : ''}`}>
            <span className="close-icon" onClick={togglePopupVisibility}>
              ✖
            </span>
            <h2>BMI Calculator</h2>

            {!calculatedBMI ? (
              <div className="input-area">
                <label>Weight (kg):</label>
                <input
                  type="number"
                  value={userWeight}
                  onChange={(e) => setUserWeight(e.target.value)}
                  placeholder="Enter your weight"
                  required
                />
                <label>Height (cm):</label>
                <input
                  type="number"
                  value={userHeight}
                  onChange={(e) => setUserHeight(e.target.value)}
                  placeholder="Enter your height"
                  required
                />

                <button className="submit-button" onClick={computeBMI}>
                  Submit
                </button>
              </div>
            ) : (
              <div className="speedometer-area">
                <h3>Your BMI: {calculatedBMI}</h3>
                <h3>CATEGORY: {weightCategory}</h3>
                <ReactSpeedometer
                  maxValue={40}
                  value={calculatedBMI}
                  segments={5}
                  segmentColors={["#FF0000", "#FFFF00", "#008000", "#FFA500", "#FF0000"]}
                  currentValueText={`BMI: ${calculatedBMI} (${weightCategory})`}
                  needleColor="black"
                />
                <button className="submit-button calc-again" onClick={resetFields}>
                  Calculate Again
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BMICalculator;
