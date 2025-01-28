import React from "react";
import { Link } from "react-router-dom";
import './DietTop.css';

const DietTop = () => {
    return (
        <div className="Diet-top-wrapper">
            <div className="Diet-top-desc">
                <div className="Diet-nav">
                    <Link to="/">
                        <button>Home</button>
                    </Link>
                    <p>// Food Diet</p>
                </div>
                <h1>Food Diet</h1>
            </div>
        </div>
    );
}

export default DietTop;
