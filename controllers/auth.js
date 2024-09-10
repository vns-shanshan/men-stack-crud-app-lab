const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();

const UserModel = require("../models/user");

// ------------ Endpoints -------------
router.get("/sign-up", function (req, res) {
    res.render("auth/sign-up.ejs");
});

router.post("/sign-up", async function (req, res) {
    // console.log(req.body);

    const userInTheDatabase = await UserModel.findOne({ username: req.body.username });
    if (userInTheDatabase) {
        return res.send("Username already taken");
    };

    if (req.body.password !== req.body.confirmPassword) {
        return res.send("Password and Confirm Password must match");
    };

    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    req.body.password = hashedPassword;
    const userDoc = await UserModel.create(req.body);

    res.send(`Thank you for signing up ${userDoc.username}`);
});

router.get("/sign-in", function (req, res) {
    res.render("auth/sign-in.ejs");
});

router.post("/sign-in", async function (req, res) {
    // console.log(req.body);
    const userInTheDatabase = await UserModel.findOne({ username: req.body.username });
    if (!userInTheDatabase) {
        return res.send("Login failed. Please try again");
    };

    const isValidPassword = bcrypt.compare(req.body.password, userInTheDatabase.password);
    if (!isValidPassword) {
        return res.send("Login failed. Please try again");
    };

    req.session.user = {
        username: userInTheDatabase.username,
        _id: userInTheDatabase._id,
    };

    res.redirect("/");
});

router.get("/sign-out", function (req, res) {
    req.session.destroy();
    res.redirect("/");
})
// --------------------------------------

module.exports = router;