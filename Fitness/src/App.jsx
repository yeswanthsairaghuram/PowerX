import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import './App.css';

import ScrollToTop from './ScrollToTop';
import PoseDetailPage from './FitnessPages/PoseDetailPage';
import MainPage from './FitnessPages/MainPage1';
import FoodDietDetails from './FitnessPages/FoodDietDetails';
import MainFoodDietPage from './FitnessPages/MainFoodDietPage';
import ExerciseDetails from './FitnessPages/ExerciseDetailsPage';
import MainWorkoutsPage from './FitnessPages/MainWorkoutsPage';
import HomePage from './HomePage';
import Header from './FitnessPages/MainHeader';
import Footer from './footer/Footer';
import ShopPage from './shopPageIS/shopPage';
import ProductOverview from './shopPageIS/proOverview';
import CartPage from './shopPageIS/CartPage';
import Scroller from './ScrollToTop/ScrollToTop';
import LoginSignup from './LoginSignUp/LoginSignup';
import MainCharts from './Charts/MainCharts';
import CheckoutPage from './shopPageIS/CheckOutPage';
import BuyNowPage from './shopPageIS/buyNow';
import YourOrdersPage from './shopPageIS/yourOrders';

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const location = useLocation();

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem('token');
            const storedUsername = localStorage.getItem('username');
            const storedEmail = localStorage.getItem('email');
            if (token) {
                setIsLoggedIn(true);
                setUsername(storedUsername || 'Guest');
                setEmail(storedEmail);
            }
            setLoading(false);
        };

        checkAuth();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('email');
        setIsLoggedIn(false);
        setUsername('');
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            {location.pathname !== '/login' && <Header username={username} onLogout={handleLogout} userEmail={email} />}
            <ScrollToTop />
            <Routes>
                <Route path="/" element={isLoggedIn ? <HomePage /> : <Navigate to="/login" />} />
                <Route path="/Exercises" element={isLoggedIn ? <MainWorkoutsPage /> : <Navigate to="/login" />} />
                <Route path="/Exercise/:exerciseName" element={isLoggedIn ? <ExerciseDetails /> : <Navigate to="/login" />} />
                <Route path="/Yogas" element={isLoggedIn ? <MainPage /> : <Navigate to="/login" />} />
                <Route path="/Yoga/:poseName" element={isLoggedIn ? <PoseDetailPage /> : <Navigate to="/login" />} />
                <Route path="/FoodDiet" element={isLoggedIn ? <MainFoodDietPage /> : <Navigate to="/login" />} />
                <Route path="/FoodDiet/:foodName" element={isLoggedIn ? <FoodDietDetails /> : <Navigate to="/login" />} />
                <Route path="/Products" element={isLoggedIn ? <ShopPage /> : <Navigate to="/login" />} />
                <Route path="/product-overview/:name" element={isLoggedIn ? <ProductOverview /> : <Navigate to="/login" />} />
                <Route path="/checkout" element={isLoggedIn?<CheckoutPage />:<Navigate to="/login"/>} /> 
                <Route path="/buy-now/:name" element={isLoggedIn? <BuyNowPage />:<Navigate to="/login"/>} />
                <Route path="/yourorders" element={isLoggedIn? <YourOrdersPage/>:<Navigate to="/login"/>}/>

                <Route path="/cart" element={isLoggedIn ? <CartPage /> : <Navigate to="/login" />} />
                <Route path="/login" element={<LoginSignup setIsLoggedIn={setIsLoggedIn} setUsername={setUsername} />} />
                <Route path="/Dashboard" element={isLoggedIn? <MainCharts /> : <Navigate to="/login" />} />
            </Routes>
            {location.pathname !== '/login' && <Footer />}
            <Scroller />
        </>
    );
};

const WrappedApp = () => (
    <BrowserRouter>
        <App />
    </BrowserRouter>
);

export default WrappedApp;
