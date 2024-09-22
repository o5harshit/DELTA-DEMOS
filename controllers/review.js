const Listing = require("../model/listing.js");
const Review = require("../model/review.js");

module.exports.createReview = async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    console.log(req.body.review);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();

    console.log("new review saved");
    req.flash("success", "New review added!!");
    res.redirect(`/listings/${listing._id}`);
}

module.exports.deleteReveiw = async (req, res) => {
    let { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", " review Deleted!!");
    res.redirect(`/listings/${id}`);
  }