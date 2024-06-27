const User = require("../models/user.js");

module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
}

module.exports.signup = async(req, res) => {
    try {
        let {username, email, password} = req.body;
        const newUser = new User({email, username});
        const registeredUser = await User.register(newUser, password);
        console.log("Registered User");
        req.login(registeredUser, (err) => {
            if(err) {
                return next(err);
            }
            req.flash("success", `Welcome to Wanderlust, ${username}!`);
            res.redirect("/listings");
        })
        
    } catch(err) {
        req.flash("error", err.message);
        res.redirect("/signup");
    }

}

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");   
};

module.exports.login = async (req, res) => {
    req.flash("success", `Welcome to Wanderlust! You are logged in, ${req.user.username}!`);
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
    if(req.isAuthenticated()) {
        req.logout((err) => {
            if(err) {
                return next(err);
            }
            req.flash("success", "You are now logged out!");
            res.redirect("/listings");
        })
    } else {
        req.flash("error", "You are not logged in!");
        res.redirect("/listings");
    }
};