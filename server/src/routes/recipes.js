const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const Recipe = require('../models/Recipes');
const User = require('../models/Users');

// Get all recipes
router.get("/", async (req, res) => {

    try {
        const recipes = await Recipe.find();
        res.json(recipes);

    } catch (err) {
        res.status(500).json({error: err.message});
    }

})

// Create recipe

router.post("/add", async (req, res)=>{

    try {
        const {title, ingredients, instructions, userID} = req.body;

        // validate
        if (!title || !ingredients || !instructions || !userID)
            return res.status(400).json({msg: "Not all fields have been entered."});

        //Validate if user exists
        const user = await User.findById(userID).exec();
        if (!user)
            return res.status(400).json({msg: "User does not exist."});



        const newRecipe = new Recipe({
            title,
            ingredients,
            instructions,
            userID,
        });
        
        const savedRecipe = await newRecipe.save();
        res.json(savedRecipe);

    } catch (err) {
        res.status(500).json({error: err.message});
    }   

})

// Update recipe

router.put("/update", async (req, res)=>{
    try {
        const {recipeID, userID} = req.body;

        // validate
        if (!recipeID || !userID)
            return res.status(400).json({msg: "Not all fields have been entered."});

        //Validate if user exists
        const user = await User.findById(userID).exec();
        if (!user)
            return res.status(400).json({msg: "User does not exist."});

        const recipe = await Recipe.findById(recipeID).exec();
        if (!recipe)
            return res.status(400).json({msg: "Recipe does not exist."});

        //Validate if user already has recipe
        if (user.userRecipes.includes(recipeID))
            return res.status(400).json({msg: "Recipe already exists."});
       

        
        //Update recipe
            user.userRecipes.push(recipe);
            const savedUser = await user.save();
            res.json({"Saved recipes":savedUser});

        
    } catch (err) {
        res.status(500).json({error: err.message});
    }
})

// Get recipes by user

router.get("/user/:userID", async (req,res)=>{

    try{

        const {userID} = req.params;
        
        // validate
        if (!userID)
            return res.status(400).json({msg: "Not all fields have been entered."});

        //Validate if user exists
        const user = await User.findById(userID).exec();
        if (!user)
            return res.status(400).json({msg: "User does not exist."});

        const recipes = await User.findById(userID).populate('userRecipes').exec();
        res.json(recipes.userRecipes);

    }catch(err){
        res.status(500).json({error: err.message});
    }   
})




module.exports = router;