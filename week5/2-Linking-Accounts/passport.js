var GitHubStrategy = require('passport-github').Strategy,
    FacebookStrategy = require('passport-facebook').Strategy;

module.exports = function(passport){
    var GITHUB_CLIENT_ID = "73f78a2a79c6879ca6c4";
    var GITHUB_CLIENT_SECRET = "08dc061f1558f003523218ba4140d976292d0cac";

    var FB_CLIENT_ID = "512902828793538";
    var FB_SECRET = "22e5d279d0089ca463477026b030c2e7";

    var User = require('./user');

    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    passport.deserializeUser(function(obj, done) {
        done(null, obj);
    });

    passport.use(new GitHubStrategy({
            clientID: GITHUB_CLIENT_ID,
            clientSecret: GITHUB_CLIENT_SECRET,
            callbackURL: "http://localhost:3000/auth/github/callback",
            passReqToCallback : true
        },
        function(req, accessToken, refreshToken, profile, done) {
            process.nextTick(function () {

                if (!req.user) {
                    User.findOne({ 'github.id': profile.id }, function (err, user) {

                        if (err)
                            return done(err);

                        if (user) {

                            if (!user.github.token) {
                                user.github.token = token;
                                user.github.username  = profile.username;
                                user.github.id = profile.id;

                                user.save(function(err) {
                                    if (err)
                                        throw err;
                                    return done(null, user);
                                });
                            }

                            return done(null, user);
                        } else {
                            console.log("new Github user created");
                            var newUser = new User();
                            newUser.github.id = profile.id;
                            newUser.github.token = accessToken;
                            newUser.github.username = profile.username;
                            newUser.save(function (err) {
                                if (err)
                                    throw err;
                                return done(null, newUser);
                            });
                        }

                    });
                } else {
                    var user = req.user;

                    user.github.id = profile.id;
                    user.github.token = accessToken;
                    user.github.username = profile.username;
                    user.save(function (err) {
                        if (err)
                            throw err;
                        return done(null, user);
                    });
                }
            });
        }
    ));

    passport.use(new FacebookStrategy({

            clientID        : FB_CLIENT_ID,
            clientSecret    : FB_SECRET,
            callbackURL     : "http://localhost:3000/auth/facebook/callback",
            passReqToCallback : true
        },

        function(req, token, refreshToken, profile, done) {

            process.nextTick(function() {

                if (!req.user) {
                    User.findOne({ 'facebook.id': profile.id }, function (err, user) {

                        if (err)
                            return done(err);

                        if (user) {
                            if (!user.facebook.token) {
                                console.log("linking...")
                                user.facebook.token = token;
                                user.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName;
                                user.facebook.email = profile.emails[0].value;

                                user.save(function(err) {
                                    if (err)
                                        throw err;
                                    return done(null, user);
                                });
                            } else {
                                return done(null, user);
                            }

                        } else {
                            var newUser = new User();
                            newUser.facebook.id = profile.id;
                            newUser.facebook.token = token;
                            newUser.facebook.name = profile.name.givenName + " " + profile.name.familyName;
                            newUser.facebook.email = profile.emails[0].value;

                            newUser.save(function (err) {
                                if (err)
                                    throw err;
                                return done(null, newUser);
                            });
                        }
                    });
                }
                else {
                    User.findOne({ _id: req.user._id}, function(err, u){
                        if (err)
                            return done(err);
                        u.facebook = {
                            id    : profile.id,
                            token : token,
                            name  : profile.name.givenName + ' ' + profile.name.familyName,
                            email : profile.emails[0].value
                        };
                        u.save(function(err) {
                            if (err)
                                throw err;
                            return done(null, u);
                        });
                    });
                }
            });
        }));

    return passport;
};