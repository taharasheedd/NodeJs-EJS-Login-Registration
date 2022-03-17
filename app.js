require('dotenv').config();
const ejs = require('ejs');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const encrypt = require('mongoose-encryption');
const app = express();
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');


app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    secret: 'I am a Secret.',
    resave: false,
    saveUninitialized: true,
}));

mongoose.connect("mongodb://localhost:27017/encryptedUserWithBcryptDB", { useNewUrlParser: true }, (err) => {
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

// userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] });

const User = mongoose.model("User", userSchema);

const saltRounds = 10;



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
    const passwordToHashLogin = req.body.password;
    User.findOne({ username: req.body.username }, (err, userFound) => {
        if (err) {
            console.log(err);
        } else {
            if (userFound) {
                bcrypt.compare(passwordToHashLogin, userFound.password, (err, result) => {
                    if (result === true) {
                        res.render("secrets");
                    } else {
                        console.log("IDK PW " + err);
                    }
                });
            }

        }
    });
});


app.post("/register", (req, res) => {
    passwordToHashRegister = req.body.password;
    bcrypt.hash(passwordToHashRegister, saltRounds, (err, hashedPassword) => {
        if (err) {
            console.log(err);
        } else {
            const newUser = new User({
                username: req.body.username,
                password: hashedPassword
            });
            newUser.save((err) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log("success");
                    res.render("secrets");
                }
            });
        }
    });

});

app.get("/logout", (req, res) => {
    res.redirect("/");
});