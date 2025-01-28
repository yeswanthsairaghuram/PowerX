import React from "react";
import ExerciseChart from "./Charts";
import FoodChart from "./FoodChart";
import WeightLogger from "./WeightLogger";
import HealthMetricsCalculator from "./BmiCalc";
import { FaDumbbell, FaWeight, FaCalculator } from "react-icons/fa";
import { MdFastfood } from "react-icons/md";
import './MainCharts.css';

const MainCharts = () => {
    return (
        <div className="main-charts-wrapper">
            <h1 className="main-charts-heading">Fitness Dashboard</h1>
            <p className="main-charts-description">
                Track your exercise progress, monitor your food intake, and log your weight over time to achieve your fitness goals.
            </p>
            <div className="dashboard-grid">
                <div className="chart-container">
                    <h1 className="chart-title"><FaDumbbell /> Exercise Progress</h1>
                    <ExerciseChart />
                </div>
                <div className="chart-container">
                    <h1 className="chart-title"><MdFastfood /> Food Intake</h1>
                    <FoodChart />
                </div>
                <div className="chart-container">
                    <h1 className="chart-title"><FaWeight /> Weight Logger</h1>
                    <WeightLogger />
                </div>
                <div className="chart-container bmi-calculator">
                    <h1 className="chart-title"><FaCalculator /> Calculate Your BMI</h1>
                    <HealthMetricsCalculator />
                </div>
            </div>
        </div>
    );
};

export default MainCharts;
