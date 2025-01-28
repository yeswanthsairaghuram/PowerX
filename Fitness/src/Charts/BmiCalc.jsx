import React, { useState } from 'react';
import ReactSpeedometer from 'react-d3-speedometer';
import './BmiCalc.css'; // Updated CSS file name

const HealthMetricsCalculator = () => {
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

    const resetFields = () => {
        setUserWeight('');
        setUserHeight('');
        setCalculatedBMI(null);
        setWeightCategory('');
    };

    return (
        <div className="metrics-container-dash">
            <h2>BMI Calculator</h2>
            <div className="input-area-dash">
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
                <button className="submit-button-dash" onClick={computeBMI}>
                    Calculate BMI
                </button>
            </div>

            {calculatedBMI && (
                <div className="result-area-dash">
                    <h3>Your BMI: {calculatedBMI}</h3>
                    <h3>CATEGORY: {weightCategory}</h3>
                    <ReactSpeedometer
                        maxValue={40}
                        value={calculatedBMI}
                        segments={5}
                        segmentColors={["#FF0000", "#FFA500", "#008000", "#FFA500", "#FF0000"]}
                        currentValueText={`BMI: ${calculatedBMI} (${weightCategory})`}
                        needleColor="black"
                    />
                    <button className="submit-button calc-again-dash" onClick={resetFields}>
                        Calculate Again
                    </button>
                </div>
            )}
        </div>
    );
};

export default HealthMetricsCalculator;
