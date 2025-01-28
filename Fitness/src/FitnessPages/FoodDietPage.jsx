import React, { useState, useEffect } from "react";
import "./FoodDietPage.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  IoArrowForwardCircleOutline,
  IoArrowBackCircleOutline,
} from "react-icons/io5";
import ShimmerCard from "./ShimmerCards";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const FoodDietPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    category: "all",
    type: "all",
    foodType: "all",
  });
  const [dietData, setDietData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showImage, setShowImage] = useState({});
  const [showDelete, setShowDelete] = useState({});
  const [timers, setTimers] = useState({});
  const [doneFoods, setCompletedFoods] = useState({});

  const navigate = useNavigate();
  const userEmail = localStorage.getItem("email");
  const userName = localStorage.getItem("username");
  const user = { email: userEmail, name: userName };

  const cardsPerPage = 8;

  useEffect(() => {
    const fetchDiets = async () => {
      try {
        const response = await axios.get("http://localhost:9000/get-all-diets");
        setDietData(response.data);
        setLoading(false);
      } catch (error) {
        setError("Failed to fetch diets");
        setLoading(false);
      }
    };

    fetchDiets();
  }, []);

  const handleFilterChange = (filterType, value) => {
    setFilters((prevFilters) => ({ ...prevFilters, [filterType]: value }));
    setCurrentPage(1); // Reset to the first page when filters change
  };

  const filteredDiets = dietData.filter((diet) => {
    const matchesSearch = diet.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      filters.category === "all" ||
      diet.category.toLowerCase() === filters.category.toLowerCase();
    const matchesType =
      filters.type === "all" ||
      diet.type.toLowerCase() === filters.type.toLowerCase();
    const matchesFoodType =
      filters.foodType === "all" ||
      diet.foodType.toLowerCase() === filters.foodType.toLowerCase() ||
      (filters.foodType === "non-veg" && diet.foodType.toLowerCase() === "veg");

    return matchesSearch && matchesCategory && matchesType && matchesFoodType;
  });

  const totalPages = Math.ceil(filteredDiets.length / cardsPerPage);
  const indexOfLastDiet = currentPage * cardsPerPage;
  const indexOfFirstDiet = indexOfLastDiet - cardsPerPage;
  const currentDiets = filteredDiets.slice(indexOfFirstDiet, indexOfLastDiet);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleDotClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    setCurrentPage(1); // Reset to the first page when searchQuery changes
  }, [searchQuery]);

  const handleDoneClick = async (foodName, type, calories, event) => {
    event.stopPropagation();

    try {
      const payload = {
        foodName: foodName,
        type: type,
        email: user.email,
        name: user.name,
        caloriesIntake: calories
      };

      const response = await axios.post(
        "http://localhost:9000/food-taken", // Change to food-related API
        payload
      );

      if (response.status === 201) {
        toast.success("Successfully completed food diet");

        setCompletedFoods((prev) => ({ ...prev, [foodName]: true }));

        setShowImage((prev) => ({ ...prev, [foodName]: true }));

        setTimeout(() => {
          setShowImage((prev) => ({ ...prev, [foodName]: false }));
          setShowDelete((prev) => ({ ...prev, [foodName]: true }));

          // Start countdown timer
          setTimers((prev) => ({ ...prev, [foodName]: 7 }));

          // Hide delete button after 8 seconds
          setTimeout(() => {
            setShowDelete((prev) => ({ ...prev, [foodName]: false }));
          }, 8000);
        }, 4000);

        navigate("/FoodDiet#Diets");
      }
    } catch (error) {
      console.error("Error submitting food data:", error);
      toast.error("This diet is recommended only once a day");
    }
  };

  useEffect(() => {
    const countdownTimers = Object.keys(timers);

    if (countdownTimers.length > 0) {
      const interval = setInterval(() => {
        setTimers((prev) => {
          const newTimers = { ...prev };

          countdownTimers.forEach((foodName) => {
            if (newTimers[foodName] > 0) {
              newTimers[foodName] -= 1;
            } else {
              delete newTimers[foodName];
            }
          });

          return newTimers;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [timers]);

  const handleDeleteClick = async (foodName) => {
    const payload = {
      email: user.email,
      name: user.name,
      foodName: foodName,
    };

    try {
      const response = await axios.delete("http://localhost:9000/delete-food", {
        data: payload,
      });

      if (response.status === 200) {
        console.log(`Deleted food: ${foodName}`);
        setShowDelete((prev) => ({ ...prev, [foodName]: false }));
        toast.success("Food diet deleted successfully!");
      }
    } catch (error) {
      console.error("Error deleting food diet:", error);
      toast.error("Failed to delete food diet.");
    }
  };

  if (loading) {
    return (
      <div className="shimmer-container">
        <ShimmerCard />
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="food-diet-page-wrapper">
      <ToastContainer />

      <div className="filter-section">
        <input
          type="text"
          placeholder="Search Food Diets..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-bar-input"
        />
        <div className="filters-container">
          <label>Weight Gain/Weight Loss:</label>
          <select
            onChange={(e) => handleFilterChange("category", e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="weight gain">Weight Gain</option>
            <option value="weight loss">Weight Loss</option>
          </select>
          <label>Meal Type:</label>
          <select onChange={(e) => handleFilterChange("type", e.target.value)}>
            <option value="all">All Meals</option>
            <option value="Breakfast">Breakfast</option>
            <option value="Lunch">Lunch</option>
            <option value="Dinner">Dinner</option>
            <option value="Snacks">Snacks</option>
          </select>
          <label>Veg/Non-Veg:</label>
          <select
            onChange={(e) => handleFilterChange("foodType", e.target.value)}
          >
            <option value="all">All</option>
            <option value="veg">Vegetarian</option>
            <option value="non-veg">Non-Vegetarian</option>
          </select>
        </div>
      </div>

      <div className="diet-cards-container">
        {currentDiets.length > 0 ? (
          currentDiets.map((diet, index) => (
            <div key={index} className="diet-card-wrapper">
              <div>
              <Link to={`/FoodDiet/${diet.name}`} className="diet-card-link">
                <div className="diet-card">
                  <span
                    className={`diet-category ${diet.category.toLowerCase()}`}
                  >
                    {diet.category}
                  </span>
                  <img
                    src={diet.svgImageUrl}
                    alt={diet.name}
                    className="diet-image"
                  />
                  <h3 className="diet-name">{diet.name}</h3>
                  <p className="diet-info">
                    <span className="diet-kcal">{diet.kcalBurnt} kcal</span>
                    <span className={`diet-type ${diet.type.toLowerCase()}`}>
                      {diet.type}
                    </span>
                  </p>
                  <p className="diet-benefits">
                    <strong>Benefits:</strong> {diet.benefits}
                  </p>
                </div>
              </Link>

              <div className="done-delete-section">
                <button type="button" onClick={(event) => {handleDoneClick(diet.name, diet.type, diet.kcalBurnt, event)}} className="done-button" disabled={showImage[diet.name]} >
                  {showImage[diet.name] ? (
                      <img
                        src="/nn.gif"
                        alt="done"
                        className="done-image small-tick"
                      />
                    ) : (
                      <span className="done-text">Add</span>
                    )}
                </button>

                {showDelete[diet.name] && (
                  <div>
                    <button
                      type="button"
                      onClick={() => handleDeleteClick(diet.name)}
                      className="delete-button"
                    >
                      <img src="/image.png" alt="Delete" />

                      {timers[diet.name] > 0 && (
                        <span className="timer">{timers[diet.name]}s</span>
                      )}
                    </button>
                  </div>
                )}
              </div>
              </div>

              {/* Done/Delete Button Section */}
              {/* <div className="done-delete-section">
                {doneFoods[diet.name] ? (
                  showDelete[diet.name] ? (
                    <button
                      className="delete-diet-btn"
                      onClick={(event) => handleDeleteClick(diet.name, event)}
                    >
                      Delete
                    </button>
                  ) : (
                    <div>
                      <p>Completed</p>
                      {timers[diet.name] && (
                        <p>Hide in {timers[diet.name]} seconds</p>
                      )}
                    </div>
                  )
                ) : (
                  <button
                    className="done-diet-btn"
                    onClick={(event) =>
                      handleDoneClick(diet.name, diet.type, diet.kcalBurnt, event)
                    }
                  >
                    Mark as Done
                  </button>
                )}
              </div> */}
            </div>
          ))
        ) : (
          <p>No diets match your search or filters.</p>
        )}
      </div>

      <div className="pagination-section">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className="pagination-arrow"
        >
          <IoArrowBackCircleOutline />
        </button>

        <div className="dots">
          {[...Array(totalPages)].map((_, index) => (
            <span
              key={index}
              className={`dot ${currentPage === index + 1 ? "active" : ""}`}
              onClick={() => handleDotClick(index + 1)}
            >
              •
            </span>
          ))}
        </div>

        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="pagination-arrow"
        >
          <IoArrowForwardCircleOutline />
        </button>
      </div>
    </div>
  );
};

export default FoodDietPage;
