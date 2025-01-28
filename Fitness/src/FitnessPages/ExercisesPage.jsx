import React, { useState, useEffect } from "react";
import "./ExercisesPage.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import ShimmerCard from "./ShimmerCards";
import { IoArrowForwardCircleOutline, IoArrowBackCircleOutline } from "react-icons/io5";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const ExercisePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    category: "all",
    exercisetype: "all",
    targetMuscle: "all",
  });

  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [completedExercises, setCompletedExercises] = useState([]);
  const [showImage, setShowImage] = useState({});
  const [showDelete, setShowDelete] = useState({});
  const [timers, setTimers] = useState({}); // Store countdown timers for each exercise
  const cardsPerPage = 8;
  const navigate = useNavigate();
  const userEmail = localStorage.getItem("email");
  const userName = localStorage.getItem("username");
  const user = { email: userEmail, name: userName };

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await axios.get(
          "http://localhost:9000/get-exercises-data"
        );

        setExercises(response.data);
      } catch (error) {
        setError("Failed to fetch exercises. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, []);

  const handleFilterChange = (filterType, value) => {
    setFilters((prevFilters) => ({ ...prevFilters, [filterType]: value }));

    setCurrentPage(1);
  };

  const filteredExercises = exercises.filter((exercise) => {
    const matchesSearch = exercise.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchesCategory =
      filters.category === "all" ||
      exercise.category.toLowerCase() === filters.category.toLowerCase();

    const matchesExerciseType =
      filters.exercisetype === "all" ||
      exercise.exercisetype.toLowerCase() ===
        filters.exercisetype.toLowerCase();

    const matchesTargetMuscle =
      filters.targetMuscle === "all" ||
      exercise.targetMuscle.toLowerCase() ===
        filters.targetMuscle.toLowerCase();

    return (
      matchesSearch &&
      matchesCategory &&
      matchesExerciseType &&
      matchesTargetMuscle
    );
  });

  const totalPages = Math.ceil(filteredExercises.length / cardsPerPage);
  const indexOfLastExercise = currentPage * cardsPerPage;
  const indexOfFirstExercise = indexOfLastExercise - cardsPerPage;
  const currentExercises = filteredExercises.slice(
    indexOfFirstExercise,
    indexOfLastExercise
  );

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
    setCurrentPage(1);
  }, [searchQuery]);

  const handleDoneClick = async (exerciseName, caloriesBurnt, event) => {
    event.stopPropagation();

    try {
      const payload = {
        cardname: exerciseName,
        email: user.email,
        name: user.name,
        caloriesBurnt,
      };

      const response = await axios.post(
        "http://localhost:9000/exercise-done",
        payload
      );

      if (response.status === 201) {
        toast.success("Successfully completed exercise");

        setCompletedExercises((prev) => [...new Set([...prev, exerciseName])]);

        setShowImage((prev) => ({ ...prev, [exerciseName]: true }));

        setTimeout(() => {
          setShowImage((prev) => ({ ...prev, [exerciseName]: false }));

          setShowDelete((prev) => ({ ...prev, [exerciseName]: true }));

          // Start countdown timer

          setTimers((prev) => ({ ...prev, [exerciseName]: 7 }));

          // Hide delete button after 8 seconds

          setTimeout(() => {
            setShowDelete((prev) => ({ ...prev, [exerciseName]: false }));
          }, 8000);
        }, 4000);

        navigate("/Exercises#Workouts");
      }
    } catch (error) {
      console.error("Error submitting exercise data:", error);
      toast.error("We recommend the exercise only once a day");
    }
  };

  useEffect(() => {
    const countdownTimers = Object.keys(timers);

    if (countdownTimers.length > 0) {
      const interval = setInterval(() => {
        setTimers((prev) => {
          const newTimers = { ...prev };

          countdownTimers.forEach((exerciseName) => {
            if (newTimers[exerciseName] > 0) {
              newTimers[exerciseName] -= 1;
            } else {
              delete newTimers[exerciseName];
            }
          });

          return newTimers;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [timers]);

  const handleDeleteClick = async (exerciseName) => {
    const payload = {
      email: user.email,
      username: user.name,
      cardname: exerciseName,
    };

    try {
      const response = await axios.delete("http://localhost:9000/delete-data", {
        data: payload,
      });

      if (response.status === 200) {
        console.log(`Deleted exercise: ${exerciseName}`);
        setShowDelete((prev) => ({ ...prev, [exerciseName]: false }));
        toast.success("Exercise deleted successfully!");
      }
    } catch (error) {
      console.error("Error deleting exercise:", error);

      toast.error("Failed to delete exercise.");
    }
  };

  if (loading) {
    return <ShimmerCard />;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="exercise-page-wrapper">
      <ToastContainer />

      <div className="filter-section">
        <input
          type="text"
          placeholder="Search Exercises..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-bar-input"
        />

        <div className="filters-container">
          <label>Exercise Category:</label>

          <select
            onChange={(e) => handleFilterChange("category", e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="Back">Back</option>
            <option value="Cardio">Cardio</option>
            <option value="Chest">Chest</option>
            <option value="Lower Arms">Lower Arms</option>
            <option value="Upper Arms">Upper Arms</option>
            <option value="Waist">Waist</option>
          </select>
          <label>Exercise Type:</label>
          <select
            onChange={(e) => handleFilterChange("exercisetype", e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="Weight Gain">Weight Gain</option>
            <option value="Weight Loss">Weight Loss</option>
          </select>
          <label>Target Muscle:</label>
          <select
            onChange={(e) => handleFilterChange("targetMuscle", e.target.value)}
          >
            <option value="all">All Muscles</option>
            <option value="Back">Back</option>
            <option value="Chest">Chest</option>
            <option value="Biceps">Biceps</option>
            <option value="Triceps">Triceps</option>
            <option value="Obliques">Obliques</option>
            <option value="Lower Back">Lower Back</option>
            <option value="Legs">Legs</option>
            <option value="Full Body">Full Body</option>
            <option value="Forearms">Forearms</option>
          </select>
        </div>
      </div>

      <div className="exercise-cards-container">
        {currentExercises.length > 0 ? (
          currentExercises.map((exercise, index) => (
            <div key={index} className="exercise-card">
              <Link
                to={`/Exercise/${exercise.name}`}
                className="exercise-card-link"
              >
                <span
                  className={`exercise-category ${exercise.category.toLowerCase()}`}
                >
                  {exercise.category}
                </span>
                <img
                  src={exercise.gifImageUrl}
                  alt={exercise.name}
                  className="exercise-image"
                />
                <h3 className="exercise-name">{exercise.name}</h3>
                <p className="exercise-info">
                  <span className="exercise-sets">Sets: {exercise.sets}</span>
                  <span className="exercise-reps">Reps: {exercise.reps}</span>
                </p>
                <p className="exercise-benefits">
                  <strong>Benefits:</strong> {exercise.benefits}
                </p>
              </Link>
              <div className="done-button-section">
                <button
                  type="button"
                  onClick={(event) =>
                    handleDoneClick(
                      exercise.name,
                      exercise.caloriesBurnt,
                      event
                    )
                  }
                  className="done-button"
                  disabled={showImage[exercise.name]}
                >
                  {showImage[exercise.name] ? (
                    <img
                      src="/nn.gif"
                      alt="done"
                      className="done-image small-tick"
                    />
                  ) : (
                    <span className="done-text">Done</span>
                  )}
                </button>

                {showDelete[exercise.name] && (
                  <div>
                    <button
                      type="button"
                      onClick={() => handleDeleteClick(exercise.name)}
                      className="delete-button"
                    >
                      <img src="/image.png" alt="Delete" />
                      
                      {timers[exercise.name] > 0 && (
                        <span className="timer">{timers[exercise.name]}s</span>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div>No exercises found for "{searchQuery}"</div>
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

export default ExercisePage;
