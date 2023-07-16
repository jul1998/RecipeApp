const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const usersRouter = require('./routes/users');
const recipesRouter = require('./routes/recipes');

const app = express();

// Connect to MongoDB
mongoose.connect("mongodb+srv://jultech:1234@recipes.pvbrrqn.mongodb.net/recipes?retryWrites=true&w=majority")
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// Apply middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/auth', usersRouter);
app.use('/recipes', recipesRouter);

// Start the server
app.listen(3001, () => {
  console.log('Server is running on port 3001');
});
