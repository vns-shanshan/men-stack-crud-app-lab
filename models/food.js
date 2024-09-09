const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema({
    name: String,
    category: String,
    calories: Number,
    isDelivered: Boolean
});

const FoodModel = mongoose.model("Food", foodSchema);

module.exports = FoodModel;