var LocalStrategy = require('passport-local').Strategy,
    User = require('./models/user');

module.exports = function(passport) {

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    passport.use('local-login', new LocalStrategy({
        passReqToCallback : true
    },
    function(req, username, password, done) {
        if (username)
            username = username.toLowerCase();

        process.nextTick(function() {
            User.findOne({ 'username' :  username }, function(err, user) {
                if (err)
                    return done(err);
                if (!user)
                    return done(null, false, req.flash('loginMessage', 'No user found.'));

                if (!user.password)
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));

                else
                    return done(null, user);
            });
        });

    }));

    passport.use('local-signup', new LocalStrategy({
        passReqToCallback : true
    },
    function(req, username, password, done) {
        if (username)
            username = username.toLowerCase();


        process.nextTick(function() {
            if (!req.user) {
                User.findOne({ 'username' :  username }, function(err, user) {
                    if (err)
                        return done(err);

                    if (user) {
                        return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
                    } else {
                        var newUser = new User();

                        newUser.username    = username;
                        newUser.password = password;

                        newUser.save(function(err) {
                            if (err)
                                return done(err);

                            return done(null, newUser);
                        });
                    }

                });
            } else if ( !req.user.username ) {
                User.findOne({ 'username' :  username }, function(err, user) {
                    if (err)
                        return done(err);
                    
                    if (user) {
                        return done(null, false, req.flash('loginMessage', 'That username is already taken.'));
                    } else {
                        var user = req.user;
                        user.username = username;
                        user.password = password;
                        user.save(function (err) {
                            if (err)
                                return done(err);
                            
                            return done(null, user);
                        });
                    }
                });
            } else {
                 return done(null, req.user);
            }

        });

    }));
};
