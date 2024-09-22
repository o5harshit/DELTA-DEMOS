const express = require("express");
const router = express.Router();
const User = require("../model/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const MongoStore = require('connect-mongo');
const { savedRedirectUrl } = require("../middleware.js");
const UserControtllers = require("../controllers/users.js");


router.route("/signup")
.get(UserControtllers.renderSignupform)
.post(wrapAsync(UserControtllers.signup))


// login = 

router.route("/login")
.get(UserControtllers.renderLoginForm)
.post(
  savedRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  UserControtllers.login
)

router.get("/logout",UserControtllers.logout);


module.exports = router;