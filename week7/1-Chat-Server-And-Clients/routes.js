var passport = require('passport');
var Chat = require('./Chat');
module.exports = function(app) {

    var chat = new Chat();

    app.post('/createRoom', isLoggedIn, function(req, res) {
        console.log(req.body);
        chat.createRoom(req).then(function () {
              res.redirect('/');
        })
    });

	app.get('/', isLoggedIn, function(req, res) {
        chat.getRooms().then(function (rooms) {
            res.render('index.ejs', {
                user : req.user,
                rooms: rooms
            });
        })

	});

	app.get('/profile', isLoggedIn, function(req, res) {
		res.render('profile.ejs', {
			user : req.user
		});
	});

	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	app.get('/login', function(req, res) {
		res.render('login.ejs', { message: req.flash('loginMessage') });
	});

	app.post('/login', passport.authenticate('local-login', {
		successRedirect : '/',
		failureRedirect : '/login',
		failureFlash : true
	}));

	app.get('/signup', function(req, res) {
		res.render('signup.ejs', { message: req.flash('signupMessage') });
	});

	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/',
		failureRedirect : '/signup',
		failureFlash : true
	}));
};

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated())
		return next();

	res.redirect('/login');
}
