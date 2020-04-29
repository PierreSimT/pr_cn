var passport = require('passport');
var JWTstrategy = require('passport-jwt').Strategy;
var extractJWT = require('passport-jwt').ExtractJwt;
var localStrategy = require('passport-local').Strategy;
const User = require('../models/user');

const jwtSecret = 'secret';

passport.use('login', new localStrategy(User.authenticate()));
passport.use('register', new localStrategy({
    usernameField: 'username',
    passwordField: 'password',
    session: false,
}, (username, password, done) => {
    try {
        User.findOne({
            where: {
                username: username
            }
        }).then(user => {
            if (user !== null) {
                console.log('Username already taken');
                return done(null, false, { message: 'username already taken' });
            } else {
                User.register(new User({
                    username: username,
                }),
                    password, (err, acc) => {
                        if (err) {
                            console.log(err)
                            return done(null, false, { message: err.message });
                        } else {
                            return done(null, acc);
                        }
                    })
            }
        })
    } catch (err) {
        done(err);
    }
}));

const cookieExtractor = (req) => {
    var token = null;
    if (req && req.cookies) {
        token = req.cookies.jwt;
    }
    return token;
}

const opts = {
    jwtFromRequest: extractJWT.fromExtractors([cookieExtractor]),
    secretOrKey: jwtSecret,
}

passport.use('jwt', new JWTstrategy(opts, (jwt_payload, done) => {
    try {
        console.log(jwt_payload.id);
        User.findOne({
            username: jwt_payload.id,
        }).then(user => {
            if (user) {
                console.log('User found in database');
                done(null, user);
            } else {
                console.log('User not found in db');
                done(null, false);
            }
        })
    } catch (err) {
        done(err);
    }
}))