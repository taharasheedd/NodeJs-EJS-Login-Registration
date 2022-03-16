const ejs = require('ejs');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');
const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true }, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("Connection to Database Succesful");
    }
});


const userSchema = new mongoose.Schema({
    username: String,
    password: String
});

var secret = "IamaSecret"
userSchema.plugin(encrypt, { secret: secret, encryptedFields: ["password"] });

const User = mongoose.model("User", userSchema);


app.listen(3000, (req, res) => {
    console.log("Server is up");
});

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/register", (req, res) => {
    res.render("register");
});

app.post("/login", (req, res) => {
    User.findOne({ username: req.body.username }, (err, userFound) => {
        if (err) {
            console.log(err);
        } else {
            if (userFound) {
                if (userFound.password == req.body.password) {
                    res.render("secrets")
                } else {
                    console.log(err);
                }
            }

        }
    });
});


app.post("/register", (req, res) => {

    const newUser = new User({
        username: req.body.username,
        password: req.body.password
    });
    newUser.save((err) => {
        if (err) {
            console.log(err);
        } else {
            console.log("success");
            res.render("secrets");
        }
    });
});

app.get("/logout", (req, res) => {
    res.redirect("/");
});