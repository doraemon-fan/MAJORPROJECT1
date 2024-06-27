const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {reviewSchema} = require("../schema.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const {isLoggedIn, validateListing, validateReview, isOwner, isAuthor} = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");


//REVIEWS POST ROUTE
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));
//Delete Review Route
router.delete("/:reviewId", isLoggedIn, isAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router;