const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

//   .then((message) => console.log(message.sid));
const client = require("twilio")(accountSid, authToken);
let val;
// Get the signup form
router.get("/register", async (req, res) => {
  res.render("auth/signup");
});

router.post("/register", async (req, res) => {
  try {
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      number: req.body.number,
    });
    const newUser = await User.register(user, req.body.password);
    req.flash("success", "Registered Successfully,Please Login to Continue");
    val = `+91${req.body.number}`;
    client.messages.create({
      body: req.flash("success"),
      from: "+12489491504",
      to: `+91${req.body.number}`,
    });
    //   .then((message) => console.log(message.sid));
    res.redirect("/login");
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/register");
  }
});

// Get the login form
router.get("/login", async (req, res) => {
  res.render("auth/login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  (req, res) => {
    req.flash("success", `Welcome Back!! ${req.user.username}`);
    client.messages.create({
      body: `Welcome Back!! ${req.user.username}`,
      from: "+12489491504",
      to: `+91${req.user.number}`,
    });
    //   .then((message) => console.log(message.sid));
    res.redirect("/products");
  }
);

// Logout the user from the current session
router.get("/logout", (req, res) => {
  req.flash("success", "Logged Out Successfully");
  client.messages.create({
    body: req.flash("success"),
    from: "+12489491504",
    to: `+91${req.user.number}`,
  });
  req.logout();
  res.redirect("/login");
});

module.exports = router;
