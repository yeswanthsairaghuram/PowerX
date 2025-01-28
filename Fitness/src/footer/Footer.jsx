import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';
import { FaFacebookF, FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { GoArrowUpRight } from "react-icons/go";
import { LiaPhoneVolumeSolid } from "react-icons/lia";
import { MdOutlineTimer } from "react-icons/md";
import { LiaMapMarkedAltSolid } from "react-icons/lia";

const Footer = () => {
    return (
        <footer className="footer">
            <div className='subscribe'>
                <div className='subscribe-stay'>
                    <h2 id='sn'>SUBSCRIBE TO US</h2>
                    <div className='st'>Stay in Touch</div>
                </div>
                <div className='subscribe-input-f'>
                    <div className='in-f'>
                        <input type="email" placeholder="Your email ..." />
                    </div>
                    <div>
                        <button>SUBSCRIBE NOW</button>
                    </div>
                </div>
                <div className='social'>
                    <div className='fb'><FaFacebookF /></div>
                    <div className='fb'><FaInstagram /></div>
                    <div className='fb'><FaXTwitter /></div>
                </div>
            </div>

            <div className="footer-content">
                <div className="footer-info">
                    <img src="/Main-logo2.png" alt="Logo" className="footer-logo" />
                    <p>Track your fitness journey with ease! Our platform helps you log workouts, monitor progress, and stay motivated every step of the way.</p>
                </div>
                <div className="footer-explore">
                    <h3>Explore</h3>
                    <ul>
                        <li><GoArrowUpRight /><Link to="/">Home</Link></li>
                        <li><GoArrowUpRight /><Link to="/Exercises">Exercises</Link></li>
                        <li><GoArrowUpRight /><Link to="/FoodDiet">Food Diet</Link></li>
                        <li><GoArrowUpRight /><Link to="/Yogas">Yogas</Link></li>
                        <li><GoArrowUpRight /><Link to="/Products">Products</Link></li>
                        <li><GoArrowUpRight /><Link to="/Cart">Cart</Link></li>
                        <li><GoArrowUpRight /><Link to="/Dashboard">Dashboard</Link></li>
                        <li><GoArrowUpRight /><Link to="/yourorders">Your Orders</Link></li>
                    </ul>
                </div>
                <div className="footer-contact">
                    <div className="contact-item">
                        <LiaMapMarkedAltSolid className="icon-footer" />
                        <div className="contact-text">
                            <p className="label">Address:</p>
                            <p>Aditya University, Surampalem</p>
                        </div>
                    </div>
                    <div className="contact-item">
                        <LiaPhoneVolumeSolid className="icon-footer" />
                        <div className="contact-text">
                            <p className="label">Phone:</p>
                            <p>9542299491</p>
                        </div>
                    </div>
                    <div className="contact-item">
                        <MdOutlineTimer className="icon-footer" />
                        <div className="contact-text">
                            <p className="label">Working Hours:</p>
                            <p>Mon-Fri: 8am - 5pm</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <p> © All Rights Reserved - 2024 </p>
            </div>
        </footer>
    );
};

export default Footer;
