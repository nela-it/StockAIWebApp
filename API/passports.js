const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const {
    ExtractJwt
} = require('passport-jwt');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../model/user');
var CryptoJS = require("crypto-js");


// JSON WEB TOKENS STRATEGY
passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: 'mSenseSECRET'
}, async (payload, done) => {
    try {
        // Find the user specified in token
        const user = await User.findById(payload.sub);
        // If user doesn't exists, handle it
        if (!user) {
            return done(null, false);
        }

        // Otherwise, return the user
        done(null, user);
    } catch (error) {
        done(error, false);
    }
}));

// LOCAL STRATEGY
passport.use(new LocalStrategy({
    usernameField: 'email'
}, async (email, password, done) => {
    try {
        // Find the user given the email
        const user = await User.findOne({
            email
        });
        // If not, handle it
        if (!user) {
            return done(null, false);
        }
        // Decrypt
        const bytes = CryptoJS.AES.decrypt(password, 'mSenseSECRET');
        const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

        // Check if the password is correct
        const isMatch = await user.isValidPassword(decryptedData);
        // If not, handle it
        if (!isMatch) {
            return done(null, false);
        }

        // Otherwise, return the user
        done(null, user);
    } catch (error) {
        done(error, false);
    }
}));