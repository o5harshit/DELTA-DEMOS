const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../model/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingcontroller = require("../controllers/listing.js");
const multer = require("multer");
const { storage } = require("../cloudconfig.js");
const upload = multer({ storage });

//validate listing

router
  .route("/")
  .get(wrapAsync(listingcontroller.index))
  .post(
    isLoggedIn,
    // validateListing,
    upload.single("listing[image]"),
    wrapAsync(listingcontroller.CreateListings)
  );

// new route

router.get("/new", isLoggedIn, listingcontroller.renderNewForm);

router
  .route("/:id")
  .get(wrapAsync(listingcontroller.showListings))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingcontroller.UpdateListings)
  )
  .delete(isOwner, isLoggedIn, wrapAsync(listingcontroller.destoryListings));

//edit

router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingcontroller.renderEditForm)
);

module.exports = router;
