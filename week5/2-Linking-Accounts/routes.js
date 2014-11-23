module.exports = function(express, passport){
    var User = require('./user');

    var router = express.Router();
    router.get('/', function(req, res){
        res.render('index', { user: req.user });
    });

    router.get('/account', ensureAuthenticated, function(req, res){
        res.render('account', { user: req.user });
    });

    router.get('/login', function(req, res){
        res.render('login', { user: req.user });
    });

    router.get('/auth/github',
        passport.authenticate('github'),
        function(req, res){

        });

    router.get('/auth/github/callback',
        passport.authenticate('github', { failureRedirect: '/login' }),
        function(req, res) {
            res.redirect('/');
        });

    router.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

    router.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            //successRedirect : '/profile',
            failureRedirect : '/login'
        }),
        function(req, res) {
            res.redirect('/');
        });

    router.get('/connect/facebook',
        passport.authorize('facebook',
            { scope : 'email' }));


    router.get('/logout', function(req, res){
        req.logout();
        res.redirect('/login');
    });

    router.get('/unlink/facebook', function(req, res) {
        req.user.facebook.token = undefined;
        User.findOne({ _id: req.user._id }, function(err, user){
            if(err) console.log("/unlink/facebook: " + err);
            if(user){
                user.facebook.token = undefined;
                user.save(function(err) {
                    res.redirect('/account');
                });
            }
        })

    });

    return router;
};

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/login')
}

