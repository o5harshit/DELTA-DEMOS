const express = require("express");
const app = express();
const router = express.Router({ mergeParams: true });
const Review = require("../model/review.js");
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../model/listing.js");
const { validateReview, isLoggedIn, isReviewOwner } = require("../middleware.js");
const reviewControllers = require("../controllers/review.js");
// validate review

//Reviews
//Post route
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(reviewControllers.createReview)
);

//delete Review Route
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewOwner,
  wrapAsync(reviewControllers.deleteReveiw)
);

module.exports = router;
