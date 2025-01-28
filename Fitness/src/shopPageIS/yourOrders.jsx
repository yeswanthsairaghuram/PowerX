import React, { useEffect, useState } from "react";

import axios from "axios";

import "./yourOrders.css";

import { Link, useNavigate } from "react-router-dom";



const YourOrdersPage = () => {

    const [items, setItems] = useState([]);

    const userEmail = localStorage.getItem("email");



    useEffect(() => {

        const fetchOrders = async () => {

            try {

                const response = await axios.get(`http://localhost:9000/orders/${userEmail}`);



                // Log the entire response object to see its structure

                console.log("API Response:", response);



                // If response.data is an array, flatten the items into a single array

                if (Array.isArray(response.data)) {

                    const allItems = response.data.flatMap(order =>

                        order.items.map(item => ({

                            ...item,

                            date: new Date(order.datePlaced).toLocaleDateString(), // Add date to item

                            productName: item.name // Store product name for later use

                        }))

                    );

                    // Fetch product details for each item

                    const itemsWithImages = await Promise.all(allItems.map(async (item) => {

                        const productResponse = await axios.get(`http://localhost:9000/prod-get/${item.productName}`);

                        return {

                            ...item,

                            imageadd1: productResponse.data.imageadd1 // Assuming this is the correct path to the image

                        };

                    }));

                    setItems(itemsWithImages);

                } else {

                    console.error("Expected an array but received:", response.data);

                }

            } catch (error) {

                console.error("Error fetching orders:", error);

            }

        };



        fetchOrders();

    }, [userEmail]);





    return (

        <div className="orders-container">

            <h1>Your Orders</h1>

            {items.length > 0 ? (

                <div className="items-grid">

                    {items.map((item, index) => (

                        <div key={index} className="item-card">

                            {item.imageadd1 && <img src={item.imageadd1} alt={item.name} className="item-image" />}

                            <div className="item-details">

                                <Link to={`/product-overview/${item.name}`}>

                                    <h4>{item.name}</h4>

                                </Link> 
                                <p>Quantity: {item.quantity}</p>
                                <p>Purchased on {item.date}</p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No items found.</p>
            )}
        </div>
    );
};
export default YourOrdersPage;
