import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaUser, FaShoppingBag, FaBars, FaTimes } from 'react-icons/fa';
import { MdArrowOutward } from "react-icons/md";
import axios from 'axios';
import './MainHeader.css';

const Header = ({ username, onLogout, userEmail }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [cartLength, setCartLength] = useState(0);

  const isActive = (path) => (location.pathname === path ? 'active' : '');

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const handleLogout = () => {
    onLogout();
    toggleSidebar();
    const event = new Event('cartUpdated');
    window.dispatchEvent(event);
    setCartLength(0);
  };

  const fetchProduct = async () => {
    if (!userEmail) return; 
    try {
      const cartItemsResponse = await axios.get(`http://localhost:9000/cart/${userEmail}`);
      setCartLength(cartItemsResponse.data.length);
    } catch (err) {
      console.error('Error fetching cart items:', err);
    }
  };

  useEffect(() => {
    if (userEmail) {
      fetchProduct();
    }
  }, [userEmail]);

  useEffect(() => {
    const handleCartUpdate = () => {
      fetchProduct();
    };

    window.addEventListener('cartUpdated', handleCartUpdate);

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  useEffect(() => {
    const hasVisitedDashboard = localStorage.getItem('hasVisitedDashboard');

    if (location.pathname === "/dashboard" && !hasVisitedDashboard) {
      localStorage.setItem('hasVisitedDashboard', 'true');
      window.location.reload();
    }
  }, [location.pathname]);

  const handleDropdownClick = () => {
    setDropdownOpen(false);
  };

  return (
    <header className="header">
      <div className="logo">
        <img src="/Main-logo.png" alt="Logo" className="logo-image" />
      </div>

      <nav className={`nav-links ${sidebarOpen ? 'open' : ''}`}>
        {['/', '/Exercises', '/FoodDiet', '/Yogas', '/Products'].map((path) => (
          <Link to={path} className={`nav-item ${isActive(path)}`} onClick={toggleSidebar} key={path}>
            {path.substring(1) || 'Home'} <span className="arrow"><MdArrowOutward /></span>
          </Link>
        ))}
      </nav>

      <div className="icons">
        <Link to="/cart">
          <div className="cart-icon">
            <FaShoppingBag className="icon" />
            <span className="cart-count">{cartLength}</span>
          </div>
        </Link>

        <div className="user-icon" onClick={() => setDropdownOpen(!dropdownOpen)}>
          <FaUser className="icon" />
        </div>

        <div className="hamburger" onClick={toggleSidebar}>
          {sidebarOpen ? <FaTimes className="icon" /> : <FaBars className="icon" />}
        </div>

        {dropdownOpen && (
          <div className={`user-dropdown ${dropdownOpen ? 'show' : ''}`}>
            <div className="user-info">
              <span className="username-dropdown">{username}</span>
            </div>
            <Link to="/dashboard" className="dropdown-item" onClick={handleDropdownClick}>
              Dashboard
            </Link>
            <Link to="/yourorders" className="dropdown-item" onClick={handleDropdownClick}>
              Your Orders
            </Link>
            <button onClick={handleLogout} className="dropdown-item logout-btn">
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
