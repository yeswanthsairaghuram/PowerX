import React from "react";
import { Link } from "react-router-dom";
import './ExerciseTop.css';

const ExerciseTop = () => {
    return (
        <div className="Exercise-top-wrapper">
            <div className="Exercise-top-desc">
                <div className="Exercise-nav">
                    <Link to="/">
                        <button>Home</button>
                    </Link>
                    <p>// Exercises</p>
                </div>
                <h1>Exercises</h1>
            </div>
        </div>
    );
}

export default ExerciseTop;
