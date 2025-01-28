import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./CheckoutPage.css";

const CheckoutPage = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [shippingAddress, setShippingAddress] = useState("");
    const navigate = useNavigate();
    const userEmail = localStorage.getItem("email");

    useEffect(() => {
        const fetchCartItems = async () => {
            if (!userEmail) {
                return navigate("/"); // Redirect if not logged in
            }

            try {
                const response = await axios.get(`http://localhost:9000/cart/${userEmail}`);
                const cartData = response.data;

                const productsWithDetails = await Promise.all(
                    cartData.map(async (item) => {
                        const productResponse = await axios.get(`http://localhost:9000/prod-getid/${item.productId}`);
                        return {
                            ...item,
                            productDetails: productResponse.data,
                        };
                    })
                );

                setCartItems(productsWithDetails);
            } catch (error) {
                console.error("Error fetching cart items:", error);
                alert("Could not fetch cart items. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchCartItems();
    }, [userEmail, navigate]);

    const totalCost = cartItems.reduce(
        (acc, item) => acc + item.productDetails.costInRupees * item.quantity,
        0
    );

    const handleConfirmOrder = async () => {
        if (!shippingAddress || cartItems.length === 0) {
            alert("Please provide a shipping address and ensure your cart is not empty.");
            return;
        }

        const orderData = {
            userEmail,
            items: cartItems.map(item => ({
                productId: item.productDetails._id,
                name: item.productDetails.name,
                quantity: item.quantity,
                price: item.productDetails.costInRupees,
            })),
            shippingAddress,
            totalCost,
        };

        try {
            await axios.post("http://localhost:9000/checkout", orderData);
            alert("Order confirmed!");
            navigate("/products");
        } catch (error) {
            console.error("Error confirming order:", error);
            alert("There was an error confirming your order.");
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="checkoutPage">
            <h1>Checkout</h1>
            {cartItems.length === 0 ? (
                <p>Your cart is empty</p>
            ) : (
                <>
                    <table className="checkoutTable">
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Quantity</th>
                                <th>Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cartItems.map((item) => (
                                <tr key={`${item.productDetails._id}-${item.quantity}`}>
                                    <td>{item.productDetails.name}</td>
                                    <td>{item.quantity}</td>
                                    <td>₹ {item.productDetails.costInRupees}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="addressSection">
                        <h2>Shipping Address</h2>
                        <textarea
                            placeholder="Enter your address"
                            value={shippingAddress}
                            onChange={(e) => setShippingAddress(e.target.value)}
                        />
                    </div>
                    <div className="checkoutSummary">
                        <h2>Order Summary</h2>
                        <p>Total Cost: ₹ {totalCost}</p>
                    </div>
                    <button
                        className="confirmOrderButton"
                        onClick={handleConfirmOrder}
                    >
                        Confirm Order
                    </button>
                </>
            )}
        </div>
    );
};

export default CheckoutPage;
