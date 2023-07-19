const config = require("config")
const passport = require("passport"); 
const GithubStrategy = require("passport-github2").Strategy;
const User = require("../models/mysql/user-symbol"); 
const gitConfig = config.get("github"); 

passport.use(new GithubStrategy(
    gitConfig
, (accessToken, refreshToken, profile, done)=>{

})); 

module.exports = passport; 