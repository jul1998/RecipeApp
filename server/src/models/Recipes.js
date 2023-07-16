const mongoose = require('mongoose');

const RecipeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        min: 3,
        max: 20,
        unique: true,
    },
    ingredients: [{
        type: String,
        required: true,
        max: 50,
    }],
    instructions: {
        type: String,
        required: true,
        min: 6,
    },
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        min: 6,
    },

}
);


module.exports = mongoose.model("Recipe", RecipeSchema);