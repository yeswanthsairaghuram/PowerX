import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./CartPage.css";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const userEmail = localStorage.getItem("email");

  useEffect(() => {
    const fetchCartItems = async () => {
      if (!userEmail) {
        return navigate("/"); // Redirect if not logged in
      }

      try {
        const response = await axios.get(
          `http://localhost:9000/cart/${userEmail}`
        );
        const cartData = response.data;

        // Fetch details for each product in the cart
        const productsWithDetails = await Promise.all(
          cartData.map(async (item) => {
            const productResponse = await axios.get(
              `http://localhost:9000/prod-getid/${item.productId}`
            );
            return {
              ...item,
              productDetails: productResponse.data, // Attach product details to cart item
            };
          })
        );

        setCartItems(productsWithDetails);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, [userEmail, navigate]);

  const handleQuantityChange = async (itemId, change) => {
    const currentItem = cartItems.find((item) => item._id === itemId);
    const updatedQuantity = currentItem.quantity + change;

    if (updatedQuantity < 1) {
      // If the updated quantity is less than 1, ask to remove item or set to 0
      if (window.confirm("Remove item from cart?")) {
        await handleRemoveItem(itemId);
      }
    } else {
      try {
        await axios.patch(`http://localhost:9000/cart-add`, {
          email: userEmail,
          productId: currentItem.productId,
          quantity: updatedQuantity,
        });

        const event = new Event("cartUpdated");
        window.dispatchEvent(event);

        setCartItems((prevItems) =>
          prevItems.map((item) =>
            item._id === itemId ? { ...item, quantity: updatedQuantity } : item
          )
        );
      } catch (error) {
        console.error("Error updating item quantity:", error);
      }
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      const productId = cartItems.find((item) => item._id === itemId).productId;
      await axios.delete(`http://localhost:9000/cart-remove`, {
        data: { email: userEmail, productId },
      });

      const event = new Event("cartUpdated");
      window.dispatchEvent(event);

      setCartItems((prevItems) =>
        prevItems.filter((item) => item._id !== itemId)
      );
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };

  const totalCost = cartItems.reduce(
    (acc, item) => acc + item.productDetails.costInRupees * item.quantity,
    0
  );

  if (loading) {
    return (
      <div className="cartPage">
        <h1>Your Cart</h1>
        <div className="shimmerContainer">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="shimmerItem">
              <div className="shimmerImage"></div>
              <div className="shimmerDetails"></div>
              <div className="shimmerCounter"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="cartPage">
      <h1>Your Cart</h1>
      {cartItems.length === 0 ? (
        <div className="empty-image">
          <img src={"/cart-empty.jpg"} alt="Empty Cart" />
        </div>
      ) : (
        <>
          <div className="cartItemsContainer">
            {cartItems.map((item) => (
              <div key={item._id} className="cartItem">
                <div className="image-counter-div">
                  <Link to={`/product-overview/${item.productDetails.name}`}>
                    <img
                      src={item.productDetails.imageadd1}
                      alt={item.productDetails.name}
                      className="cartItemImage"
                    />
                  </Link>

                  <div className="quantityControls">
                    <button onClick={() => handleQuantityChange(item._id, -1)}>
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button onClick={() => handleQuantityChange(item._id, 1)}>
                      +
                    </button>
                  </div>
                </div>

                <div className="cartItemDetailsContainer">
                  <div className="cartItemDetails">
                    <Link to={`/product-overview/${item.productDetails.name}`}>
                      <h3>{item.productDetails.name}</h3>
                    </Link>
                    <p>Price: ₹ {item.productDetails.costInRupees}</p>
                  </div>
                </div>

                <button
                  className="removeButton"
                  onClick={() => handleRemoveItem(item._id)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="cart-price-out">
            <div className="cart-price-checkout">
              <button
                className="checkoutButton"
                onClick={() => navigate("/checkout")}
              >
                Proceed to Checkout
              </button>

              <button
                className="returnToProductsButton"
                onClick={() => navigate("/Products")}
              >
                Return to Products
              </button>
            </div>

            <h2>Total Cost: ₹ {totalCost}</h2>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
