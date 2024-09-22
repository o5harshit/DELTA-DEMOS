if(process.env.Node_ENV != "production"){
  require('dotenv').config();
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./model/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const joi = require("joi");
const MongoStore = require('connect-mongo');
const { listingSchema,reviewSchema } = require("./schema.js");



const ReviewRouter = require("./model/review.js");
const listingsRouter = require("./routes/listing.js");
const userRouter = require("./routes/user.js");
const reviews = require("./routes/review.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStratgey = require("passport-local");
const User = require("./model/user.js");


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const port = 8080;
const dbUrl = process.env.ATLASTDB_URL;

main()
  .then(() => {
    console.log("connected to db");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);
}

app.listen(port, () => {
  console.log("app is listening on 8080");
});

const store = MongoStore.create({
  mongoUrl : dbUrl,
  crypto : {
    secret : process.env.SECRET
  },
  touchAfter : 24 * 3600,
});

store.on("error",() => {
  console.log("Error occured",err);
})

const sessionOptions ={
  store,
  secret : process.env.SECRET,
  resave : false,
  saveUninitialized : true,
  cookie : {
    expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge : 7 * 24 * 60 * 60 * 1000,
    httpOnly : true,
  }
}

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStratgey(User.authenticate()))

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
})

app.use("/demouser",async(req,res) =>{ 
  let fakeuser = new User({
    email : "srivasatavaharshit400@gmail.com",
    username : "delta-student",
  });
 let registeredUser = await User.register(fakeuser,"helloworld");
 res.send(registeredUser);
})

// app.get("/", (req, res) => {
//   res.send("Hi,I am root");
// });

app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews",ReviewRouter);
app.use("/",userRouter);

// send request to all pages
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "page not found"));
});

// error handling
app.use((err, req, res, next) => {
//  let { status, message } = err;
  //res.status(status).send(message);
  res.render("./listings/error.ejs",{err});
});


