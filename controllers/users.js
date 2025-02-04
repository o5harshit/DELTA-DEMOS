const User = require("../model/user.js");

module.exports.signup = async(req,res) => {
    try {
    let {username,email,password} = req.body;
    const newUser =  new User({email,username});
    const registeredUser = await  User.register(newUser,password);
    console.log(registeredUser);
    req.login(registeredUser,(err) => {
      req.login(registeredUser,(err) => {
        if(err){
          return next(err)
        }
        req.flash("success","Welcome to WanderLust!");
        res.redirect("/listings");
      })
    })
    req.flash("success",`Welcome ${username}..How are You ?`);
    res.redirect("/listings");
    } catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
}


module.exports.renderSignupform = (req,res) => {
    res.render("users/signup.ejs");
}

module.exports.renderLoginForm = (req,res)=>{
    res.render("users/login.ejs");
}

module.exports.login =   async (req, res) => {
    req.flash("success","Welcome back to Wanderlust! You are logged in!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}

module.exports.logout = (req,res,next) => {
    console.log(req);
    req.logOut((err) => {
      if(err){
        next(err);
      }
      req.flash("Success you are logged out now");
      res.redirect("/listings");
    });
}