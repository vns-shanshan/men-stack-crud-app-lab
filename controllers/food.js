const express = require("express");
const router = express.Router();

const FoodModel = require("../models/food");

// ------------- Endpoint -------------

router.get("/new", function (req, res) {
    res.render("food/new.ejs");
});

router.post("/", async function (req, res) {
    if (req.body.isDelivered === "on") {
        req.body.isDelivered = true;
    } else {
        req.body.isDelivered = false;
    }

    await FoodModel.create(req.body);

    res.redirect("/food/new");
});

router.get("/", async function (req, res) {
    const foodList = await FoodModel.find({});

    console.log(foodList);

    res.render("food/index.ejs", { foodList: foodList });
});

router.get("/:foodId", async function (req, res) {
    const requestedFood = req.params.foodId;

    const food = await FoodModel.findById(requestedFood);

    res.render("food/show.ejs", { food: food });
});

router.delete("/:foodId", async function (req, res) {
    const deletedFood = await FoodModel.findByIdAndDelete(req.params.foodId);

    res.redirect("/food");
});

router.get("/:foodId/edit", async function (req, res) {
    const food = await FoodModel.findById(req.params.foodId)
    res.render("food/edit.ejs", { food: food });
});

router.put("/:foodId", async function (req, res) {
    req.body.isDelivered = !!req.body.isDelivered;
    await FoodModel.findByIdAndUpdate(req.params.foodId, req.body, { new: true });

    res.redirect(`/food/${req.params.foodId}`);
});
// ------------ ---------------------


module.exports = router;