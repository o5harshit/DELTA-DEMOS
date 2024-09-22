const Listing = require("../model/listing.js");

module.exports.index = async (req, res) => {
  const listings = await Listing.find({});
  res.render("./listings/index.ejs", { listings });
};

module.exports.renderNewForm = (req, res) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "You must be logged in to create listing!");
    res.redirect("/login");
  }
  res.render("./listings/new.ejs");
};

module.exports.showListings = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  const listings = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  console.log(listings);
  if (!listings) {
    req.flash("error", "Listing you requested for does not exist");
    res.redirect("/listings");
  }
  console.log(listings);
  res.render("./listings/show.ejs", { listings });
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  const list = await Listing.findById(id);
  if (!list) {
    req.flash("error", "Listing you requested for does not exist");
    res.redirect("/listings");
  }
  let originalImage = list.image.url;
  let imageurl = originalImage.replace("/upload","/upload/ar_1.0,c_fill,w_250/r_max/f_auto/")
  res.render("./listings/edit.ejs", { list,imageurl });
};

module.exports.UpdateListings = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if(typeof req.file !== "undefined"){
  let url = req.file.path;
  let filename = req.file.filename;
  listing.image = { url, filename };
  await listing.save();
  }
  req.flash("success", "Listing Updated");
  res.redirect(`/listings/${id}`);
};

module.exports.destoryListings = async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "you have Deleted the Lisiting");
  res.redirect("/listings");
};

module.exports.CreateListings = async (req, res, next) => {
  let url = req.file.path;
  let filename = req.file.filename;
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  await newListing.save();
  req.flash("success", "New Listing Created");
  res.redirect("/listings");
};
