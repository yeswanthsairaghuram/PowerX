import React from "react";
import { Link } from "react-router-dom";
import './YogaTop.css';

const YogaTop = () => {
    return (
        <div className="Yoga-top-wrapper">
            <div className="Yoga-top-desc">
                <div className="Yoga-nav">
                    <Link to="/">
                        <button>Home</button>
                    </Link>
                    <p>// Yogas</p>
                </div>
                <h1>Yogas</h1>
            </div>
        </div>
    );
}

export default YogaTop;
