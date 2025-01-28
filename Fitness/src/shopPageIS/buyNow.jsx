import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./buyNow.css"; // Use the same CSS file for consistent styling
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BuyNowPage = () => {
    const { name } = useParams(); // Get the product name from the URL
    const [product, setProduct] = useState(null); // State to store the product data
    const [shippingAddress, setShippingAddress] = useState(""); // State for shipping address
    const navigate = useNavigate(); // Hook to navigate between pages

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                // Fetch product by name
                const productResponse = await axios.get(`http://localhost:9000/prod-get/${name}`);
                setProduct(productResponse.data);
                console.log("Fetched Product for Buy Now:", productResponse.data);
            } catch (error) {
                console.error("Error fetching product for Buy Now:", error);
                toast.error('Error fetching product details');
            }
        };

        fetchProduct();
    }, [name]);

    // Loading state
    if (!product) {
        return <div>Loading...</div>;
    }

    // Handle order confirmation
    const handleConfirmOrder = async () => {
        if (!shippingAddress) {
            toast.error('Please enter a shipping address');
            return;
        }

        const orderData = {
            userEmail: localStorage.getItem("email"), // Assuming the user's email is stored in localStorage
            items: [{
                productId: product._id, // Assuming the product has an ID
                name: product.name,
                quantity: 1, // Set to 1 for Buy Now functionality
                price: product.costInRupees,
            }],
            shippingAddress,
            totalCost: product.costInRupees,
        };

        try {
            await axios.post("http://localhost:9000/checkout", orderData);
            alert("Order confirmed!");
            toast.success('Order confirmed!');
            navigate('/products');
        } catch (error) {
            console.error("Error confirming order:", error);
            toast.error('There was an error confirming your order');
        }
    };

    return (
        <div className="buyNowPage">
            <h1>Check Out</h1>
            <div className="buyNowSummary">
                <img src={product.imageadd1} alt={product.name} />
                <div className="bnsdata">
                    <h2>{product.name}</h2>
                    <p>Price: ₹ {product.costInRupees}</p>
                </div>
            </div>
            <div className="addressSection">
                <h2>Shipping Address</h2>
                <textarea
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    placeholder="Enter your shipping address"
                />
            </div>
            <button className="confirmOrderButton" onClick={handleConfirmOrder}>
                Confirm Order
            </button>
            <ToastContainer position="top-center" autoClose={3000} hideProgressBar={true} />
        </div>
    );
};

export default BuyNowPage;
