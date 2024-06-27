const Listing = require("./models/listing.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema, reviewSchema} = require("./schema.js");
const wrapAsync = require("./utils/wrapAsync.js");
const Review = require("./models/review.js");

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in to proceed!");
        res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = wrapAsync(async (req, res, next) => {
    try {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!req.user || !listing.owner._id.equals(res.locals.currUser._id)) {
        req.flash("error", "You don't have permissions to edit or delete");
        return res.redirect(`/listings/${id}`);
    } }catch(err) {
        res.send("Error occurred!");
    }
    next();
} ) ;

module.exports.isAuthor = wrapAsync(async (req, res, next) => {
    try {
    let {id, reviewId} = req.params;
    let listing = await Listing.findById(id);
    let review = await Review.findById(reviewId);
    if(!req.user && (!review.author._id.equals(res.locals.currUser._id) ||!listing.owner._id.equals(res.locals.currUser._id))) {
        req.flash("error", "You don't have permissions to edit or delete");
        return res.redirect(`/listings/${id}`);
    } }catch(err) {
        console.log(err);
    }
    next();
} ) ;

module.exports.validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    if(error) {
        throw new ExpressError(400, error);
    } else {
        next();
    }
}

module.exports.validateReview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error) {
        throw new ExpressError(400, error);
    } else {
        next();
    }
}