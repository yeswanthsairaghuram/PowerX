import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import Toastify CSS
import "./shopPage.css";
import axios from "axios";

import ShimmerCard from "../FitnessPages/ShimmerCards"; // Import ShimmerCard component

const ShopPage = () => {
    const [products, setProducts] = useState([]);
    const [category, setCategory] = useState("");
    const [sortOrder, setSortOrder] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [cartQuantities, setCartQuantities] = useState({});
    const [loading, setLoading] = useState(true); // Add loading state
    const navigate = useNavigate();

    // Fetch the user email from localStorage
    const userEmail = localStorage.getItem("email");

    useEffect(() => {
        const fetchProductsAndCart = async () => {
            try {
                // Fetch products
                const productsResponse = await axios.get("http://localhost:9000/prod-get");
                setProducts(productsResponse.data);

                // Fetch cart items for the logged-in user
                const cartItemsResponse = await axios.get(`http://localhost:9000/cart/${userEmail}`);

                // Initialize cart quantities based on items in the user's cart
                const quantities = {};
                cartItemsResponse.data.forEach(item => {
                    // Ensure comparison is done correctly by using the toString method
                    const productId = item.productId ? item.productId.toString() : null; // Convert to string if exists
                    if (productId) {
                        quantities[productId] = item.quantity || 0; // Initialize with quantity or 0
                    }
                });
                setCartQuantities(quantities);

                // Set loading to false after data is fetched
                setLoading(false);
            } catch (error) {
                console.error("Error fetching products or cart items:", error);
                setLoading(false); // In case of error, stop loading
            }
        };

        fetchProductsAndCart();
    }, [userEmail]);

    const handleAddToCart = async (productId, e) => {
        e.stopPropagation(); // Prevent event from bubbling up to the card
        try {
            await axios.patch(`http://localhost:9000/cart-add`, { email: userEmail, productId, quantity: 1 });
            toast.success('Item added to cart!');
            const event = new Event('cartUpdated');
             window.dispatchEvent(event);
            fetchCartItems();
        } catch (error) {
            console.error("Error adding to cart:", error.response ? error.response.data : error.message);
            toast.error(`Failed to add item to cart: ${error.response ? error.response.data.message : error.message}`);
        }
    };

    const fetchCartItems = async () => {
        try {
            const cartItemsResponse = await axios.get(`http://localhost:9000/cart/${userEmail}`);
            const quantities = {};
            cartItemsResponse.data.forEach(item => {
                const productId = item.productId ? item.productId.toString() : null; // Ensure the ID is a string
                if (productId) {
                    quantities[productId] = item.quantity || 0;
                }
            });
            setCartQuantities(quantities);
        } catch (error) {
            console.error("Error fetching cart items:", error);
        }
    };

    const handleGoToCart = (e) => {
        e.stopPropagation(); // Prevent event from bubbling up to the card
        navigate('/cart');
    };

    const handleProductClick = (productName) => {
        navigate(`/product-overview/${encodeURIComponent(productName)}`);
    };

    const getFilteredProducts = () => {
        return products
            .filter(product => !category || product.category === category) // Filter by category
            .filter(product => !searchQuery || product.name.toLowerCase().includes(searchQuery.toLowerCase())) // Filter by search query
            .sort((a, b) => {
                if (sortOrder === "lowToHigh") {
                    return a.costInRupees - b.costInRupees;
                } else if (sortOrder === "highToLow") {
                    return b.costInRupees - a.costInRupees;
                }
                return 0; // No sorting
            });
    };

    return (
        <div className="parent">
            <div className="bigtext">Shop your Fitness..</div>
            <div className="searchMenu">
                <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="searchBar"
                />
                <select
                    name="category"
                    id="category"
                    onChange={(e) => setCategory(e.target.value)}
                >
                    <option value="">All Categories</option>
                    <option value="Supplement">Supplement</option>
                    <option value="Gym Equipment">Gym Equipment</option>
                </select>
                <select
                    name="filters"
                    id="filters"
                    onChange={(e) => setSortOrder(e.target.value)}
                >
                    <option value="">Sort by</option>
                    <option value="lowToHigh">Price Low-High</option>
                    <option value="highToLow">Price High-Low</option>
                </select>
            </div>
            <div className="products">
                {loading ? (
                    // Render shimmer cards if loading is true
                    <>
                        <ShimmerCard />
                        <ShimmerCard />
                        <ShimmerCard />
                    </>
                ) : (
                    getFilteredProducts().map((prod) => (
                        <div key={prod._id} className="productsSub" onClick={() => handleProductClick(prod.name)}>
                            <img src={prod.imageadd1} alt={prod.name} className="productImage" />
                            <div className="productInfo">
                                <div className="productDetails">
                                    <p className="productName">{prod.name}</p>
                                    <p className="productDesc">{prod.description}</p>
                                    <span className="priceContainer">
                                        <div className="productCost">₹ {prod.costInRupees}</div>
                                        {prod.discount && (
                                            <small className="discountTagSP">{prod.discount}% off</small>
                                        )}
                                    </span>
                                </div>
                                <p className="productRating">⭐ {prod.rating}</p>
                            </div>
                            {cartQuantities[prod._id] > 0 ? (
                                <button className="addToCartButton" onClick={handleGoToCart}>Go to Cart</button>
                            ) : (
                                <button className="addToCartButton" onClick={(e) => handleAddToCart(prod._id, e)}>Add to Cart</button>
                            )}
                        </div>
                    ))
                )}
            </div>
            <ToastContainer position="top-center" autoClose={3000} hideProgressBar={true} />
        </div>
    );
};

export default ShopPage;
