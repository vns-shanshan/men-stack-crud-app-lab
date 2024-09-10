const express = require("express");
const app = express();
const port = 3000;

const dotenv = require("dotenv");
dotenv.config();

const methodOverride = require("method-override");
const morgan = require("morgan");
const session = require("express-session");

const foodCtrl = require("./controllers/food");
const authCtrl = require("./controllers/auth");

// ------ Middleware ----------
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(morgan("dev"));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));
// --------- ----------------

const mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on("connected", () => {
    console.log("MongoDb connected");
});

app.get("/", function (req, res) {
    console.log(req.session);
    res.render("index.ejs", { user: req.session.user });
});

app.use("/food", foodCtrl);
app.use("/auth", authCtrl);

app.listen(port, () => {
    console.log(`Food app listening on port ${port}`);
});