const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { savedRedirectUrl } = require("../middleware.js");

router.get("/signup", (req, res) => {
  res.render("users/signup.ejs");
});

router.post(
  "/signup",
  wrapAsync(async (req, res) => {
    try {
      let { username, email, password } = req.body;
      const newUser = new User({ email, username });
      const registeredUser = await User.register(newUser, password);
      console.log(registeredUser);
      req.login(registeredUser, (err) => {
        if(err){
            return next(err);
        }
        req.flash("success", "Welcome back to Explore World!");
      res.redirect("/listings");
    });
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/signup");
    }
  })
);

router.get("/login", (req, res) => {
  res.render("users/login.ejs");
});

router.post(
  "/login", savedRedirectUrl,
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  (req, res) => {
    req.flash("success", "Welcome to Explore Word! You are logged in!");
    res.redirect(res.locals.redirectUrl || "/listings");
  }
);

router.get("/logout", (req, res,next) => {
  req.logout((err) => {
    if (err) {
       next(err);
    }
    req.flash("success", "You are Logged Out!");
    res.redirect("/listings");
  });
});

module.exports = router;
