const User = require("../models/user");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;

const GOOGLE_CLIENT_ID = "911673691065-nl92775gblek0q7eua8nsoid87tnuece.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";

passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:3000/auth/google/callback"
},

  async function (accessToken, refreshToken, profile, done) {

    try {

      let user = await User.findOne({ email: profile.email });

      if (!user) {
        
        const encryptDisplayName = await bcrypt.hash(profile.displayName, 10);
        const encryptGoogleId = await bcrypt.hash(profile.id, 10);

        user = await User.create({ email: profile.email, displayName: encryptDisplayName, googleId: encryptGoogleId });
      }

      return done(null, user);

    } catch (err) {
      console.log(err);
    }

  }
));

const userLogin = passport.authenticate('google', { scope: ['profile', 'email'] });

const callbackUserLogin = passport.authenticate('google', { failureRedirect: '/login', session: false });

const generateToken = async function (req, res) {

  const token = await jwt.sign({ email: req.user.email }, 'Secret_Key_123', { expiresIn: "24h" });

  console.log(token)
  res.cookie('access_token', token);
  res.redirect('/addbook');
}

const userLogout = function (req, res) {
  res.clearCookie("access_token").redirect('/');
}

module.exports = { userLogin, userLogout, callbackUserLogin, generateToken }
