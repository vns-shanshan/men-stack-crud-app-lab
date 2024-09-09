const express = require("express");
const app = express();
const port = 3000;

const methodOverride = require("method-override");
const morgan = require("morgan");

// ------ Middleware ----------
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(morgan("dev"));
// --------- ----------------

const dotenv = require("dotenv");
dotenv.config();

const mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on("connected", () => {
    console.log("MongoDb connected");
});

const FoodModel = require("./models/food");

// ------------- Endpoint -------------
app.get("/", function (req, res) {
    res.render("index.ejs");
});

app.get("/food/new", function (req, res) {
    res.render("food/new.ejs");
});

app.post("/food", async function (req, res) {
    if (req.body.isDelivered === "on") {
        req.body.isDelivered = true;
    } else {
        req.body.isDelivered = false;
    }

    await FoodModel.create(req.body);

    res.redirect("/food/new");
});

app.get("/food", async function (req, res) {
    const foodList = await FoodModel.find({});

    console.log(foodList);

    res.render("food/index.ejs", { foodList: foodList });
});

app.get("/food/:foodId", async function (req, res) {
    const requestedFood = req.params.foodId;

    const food = await FoodModel.findById(requestedFood);

    res.render("food/show.ejs", { food: food });
});

app.delete("/food/:foodId", async function (req, res) {
    const deletedFood = await FoodModel.findByIdAndDelete(req.params.foodId);

    res.redirect("/food");
});

app.get("/food/:foodId/edit", async function (req, res) {
    const food = await FoodModel.findById(req.params.foodId)
    res.render("food/edit.ejs", { food: food });
});

app.put("/food/:foodId", async function (req, res) {
    req.body.isDelivered = !!req.body.isDelivered;
    await FoodModel.findByIdAndUpdate(req.params.foodId, req.body, { new: true });

    res.redirect(`/food/${req.params.foodId}`);
});

// ------------ ---------------------

app.listen(port, () => {
    console.log(`Food app listening on port ${port}`);
});