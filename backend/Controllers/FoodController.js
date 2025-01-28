const express = require('express');
const DietModel = require("../Models/FoodModel");
const CaloriesTaken = require('../Models/FoodTaken');
const FoodTaken = require('../Models/FoodTaken');


const AddDietData = async (req, res) => {
  const dietData = req.body;

  try {
    const result = await DietModel.insertMany(dietData);
    return res.status(201).json({ message: "Diet data added successfully!", result });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const GetAllDiets = async (req, res) => {
  try {
    const diets = await DietModel.find({});
    return res.status(200).json(diets);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const GetDietByName = async (req, res) => {
  const foodName = req.params.foodName;

  try {
    const diet = await DietModel.findOne({ name: foodName });

    if (!diet) {
      return res.status(404).json({ message: 'Food not found' });
    }

    return res.status(200).json(diet);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};


const CaloriesTakenController = async (req, res) => {
    const { foodName, type, email, name, caloriesIntake } = req.body;

    const getTodayDate = () => {
      const today = new Date(Date.now());
        return new Date(today.toISOString().slice(0, 10)); // Slice to get the date part (YYYY-MM-DD)
    };
  
    if (!foodName || !type || !email || !name || !caloriesIntake) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const todayDate = getTodayDate();
        const existingRecord = await CaloriesTaken.findOne({ email, name, foodName, todayDate });

        if (existingRecord) {
            return res.status(409).json({ error: 'Calories intake data for this food already exists for today' });
        }

        const newCaloriesTaken = new CaloriesTaken({
            foodName,
            type,
            email,
            name,
            caloriesIntake,
        });
        await newCaloriesTaken.save();

        return res.status(201).json({ message: 'Calories intake data saved successfully!' });
    } catch (error) {
        console.error('Error saving calories intake data:', error);
        return res.status(500).json({ error: 'Failed to save calories intake data' });
    }
};

const deleteCaloriesController = async (req, res) => {
  const { email, name, foodName } = req.body;

  const getTodayDate = () => {
    const today = new Date(Date.now());
    return new Date(today.toISOString().slice(0, 10));
};

  try {
      const todayDate = getTodayDate();

      const deletedCalories = await CaloriesTaken.findOneAndDelete({
          email,
          name,
          foodName,
          todayDate
      });

      if (!deletedCalories) {
          return res.status(404).json({ message: 'Calories intake entry not found' });
      }

      res.status(200).json({ message: 'Calories intake entry successfully deleted' });
  } catch (error) {
      console.error('Error deleting calories intake:', error);
      res.status(500).json({ message: 'Server error' });
  }
};


const GetFoodData = async (req, res) => {
  const userEmail = req.query.email;

  if (!userEmail) {
    return res.status(400).json({ error: 'Email is required.' });
  }

  try {
    const foodData = await FoodTaken.find({ email: userEmail });
    if (!foodData || foodData.length === 0) {
      console.log('No food data found for this user.');
      return res.status(404).json({ message: 'No food data found for this user.' });
    }

    res.status(200).json(foodData);
  } catch (error) {
    console.error('Error fetching food data:', error);
    res.status(500).json({ message: 'Failed to fetch food data due to server error.' });
  }
};



exports.GET_DIET_BY_NAME = GetDietByName;

exports.ADD_DIET_DATA = AddDietData;
exports.GET_ALL_DIETS = GetAllDiets;

exports.CaloriesTakenController = CaloriesTakenController;
exports.deleteCaloriesController = deleteCaloriesController;

exports.GetFoodData = GetFoodData;