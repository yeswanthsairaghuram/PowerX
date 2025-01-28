import React, { useEffect, useState } from "react";

import { useParams, Link, useNavigate } from "react-router-dom";

import axios from "axios";

import "./proOverview.css";

import { FaShippingFast, FaShieldAlt } from "react-icons/fa";

import { MdVerifiedUser } from "react-icons/md";

import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";



const ProductOverview = () => {

    const { name } = useParams(); // Get the product name from the URL

    const [product, setProduct] = useState(null); // State to store the product data

    const [suggestedProducts, setSuggestedProducts] = useState([]); // State to store suggested products

    const [isInCart, setIsInCart] = useState(false); // State to track if the product is in the cart

    const navigate = useNavigate(); // Hook to navigate between pages



    // Fetch the user email from localStorage

    const userEmail = localStorage.getItem("email");



    // Fetch the product and check if it's in the cart

    useEffect(() => {

        const fetchProduct = async () => {

            try {

                // Fetch product by name

                const productResponse = await axios.get(`http://localhost:9000/prod-get/${name}`);

                setProduct(productResponse.data);

                console.log("Fetched Product:", productResponse.data);

    

                // Fetch cart items to check if the product is in the cart

                const cartItemsResponse = await axios.get(`http://localhost:9000/cart/${userEmail}`);

                const cartItems = cartItemsResponse.data;

                console.log("Fetched Cart Items:", cartItems);

    

                // Convert product ID to string for comparison

                const productIdStr = String(productResponse.data._id).trim(); // Convert and trim

                console.log("Product ID String:", productIdStr);



                const productsResponse = await axios.get('http://localhost:9000/prod-get');

                const products = productsResponse.data;

                const productIndex = products.findIndex(p => p.name === name);

                let suggested = [];

                for (let i = 1; i <= 3; i++) {

                    const nextIndex = (productIndex + i) % products.length;

                    suggested.push(products[nextIndex]);

                }

                setSuggestedProducts(suggested);

    

                // Check if the product is in the cart

                const isProductInCart = cartItems.some(item => {

                    // Ensure the productId exists in the item

                    const cartProductIdStr = item.productId ? String(item.productId).trim() : '';

                    console.log("Comparing:", productIdStr, "with", cartProductIdStr); // Log comparison

                    return cartProductIdStr === productIdStr; // Compare as strings

                });

    

                setIsInCart(isProductInCart); // Update the state accordingly

                console.log("Is Product in Cart:", isProductInCart);

            } catch (error) {

                console.error("Error fetching product:", error);

                toast.error('Error fetching product details');

            }

        };

    

        fetchProduct();

    }, [name, userEmail]); // Only run when name or userEmail changes

    

    // Function to add product to cart

    const handleAddToCart = async (productId) => {

        try {

            await axios.patch(`http://localhost:9000/cart-add`, { email: userEmail, productId, quantity: 1 });

            setIsInCart(true); // Set state to true after adding

            const event = new Event('cartUpdated');

            window.dispatchEvent(event);

            toast.success('Item added to cart!');

        } 
        
        catch (error) {

            console.error("Error adding to cart:", error.response ? error.response.data : error.message);

            toast.error(`Failed to add item to cart: ${error.response ? error.response.data.message : error.message}`);

        }

    };



    // Function to handle button click

    const handleButtonClick = () => {

        if (isInCart) {

            navigate('/cart'); // Navigate to cart if the product is in the cart

        } else {

            handleAddToCart(product._id); // Add to cart if not in cart

        }

    };



    const handleBuyNowClick = () => {

        navigate(`/buy-now/${name}`); // Navigate to the Buy Now page with the product name

    };

    



    // Loading state

    if (!product) {

        return <div>Loading...</div>;

    }



    return (

        <div className="productOverviewContainer">

            <div className="productOverview">

                <div className="productImageContainer">

                    <img src={product.imageadd1} alt={product.name} className="productOverviewImage" />

                    <div className="smallImagesContainer">

                        <img src={product.imageadd2} alt={product.name} className="smallImage" />

                        <img src={product.imageadd3} alt={product.name} className="smallImage" />

                    </div>

                </div>

                <div className="productDetails-po">

                    <h1>{product.name}</h1>

                    <p>{product.longdescription}</p>

                    <span>

                        <h2>₹ {product.costInRupees}</h2>

                        {product.discount && (

                            <small className="discountTag">{product.discount}% off</small>

                        )}

                    </span>

                    <div className="buts">

                        <div className="buyNowButtonContainer">

                            <button className="buyNowButton" onClick={handleBuyNowClick}>Buy Now</button>

                        </div>

                        <div className="addToCartButtonContainer">

                            <button

                                className="addToCartButton"

                                onClick={handleButtonClick}

                            >

                                {isInCart ? "Go to Cart" : "Add To Cart"}

                            </button>

                        </div>

                    </div>

                    <div className="productFeatures">

                        <div className="featureItem">

                            <FaShippingFast className="featureIcon" />

                            <span>Fast Delivery</span>

                        </div>

                        <div className="featureItem">

                            <MdVerifiedUser className="featureIcon" />

                            <span>1 Year Warranty</span>

                        </div>

                        <div className="featureItem">

                            <FaShieldAlt className="featureIcon" />

                            <span>Assured Quality</span>

                        </div>

                    </div>

                </div>

            </div>



            <div className="suggestedProductsSection">

                <center><h1>Suggested Products</h1></center>

                <div className="suggestedProducts">

                    {suggestedProducts.map((suggestedProduct) => (

                        <div key={suggestedProduct._id} className="suggestedProductCard">

                            <img

                                src={suggestedProduct.imageadd1}

                                alt={suggestedProduct.name}

                                className="suggestedProductImage"

                            />

                            <h4 className="sugg-prod-name">{suggestedProduct.name}</h4>

                            <Link to={`/product-overview/${encodeURIComponent(suggestedProduct.name)}`} className="viewProductLink">

                                View Product

                            </Link>

                        </div>

                    ))}

                </div>

            </div>

            <ToastContainer position="top-center" autoClose={3000} hideProgressBar={true} />

        </div>

    );

};



export default ProductOverview;

