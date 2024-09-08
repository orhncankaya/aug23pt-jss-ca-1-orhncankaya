var express = require('express');
var router = express.Router();
var passport = require('passport');

// GET home page
router.get('/', function (req, res) {
  res.render('index', {
    loggedIn: req.isAuthenticated(),  // Pass loggedIn status (true if logged in, false if not)
    username: req.user ? req.user.username : 'Guest',  // Pass username, or "Guest" if not logged in
    error: req.session.error || ''  // Pass any login error messages
  });
  req.session.error = null;  // Clear the error after rendering
});

// POST login
router.post('/login', function (req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    if (err) { return next(err); }
    if (!user) {
      req.session.error = 'Invalid credentials';  // Set error message
      return res.redirect('/');  // Redirect back to home page on login failure
    }
    req.logIn(user, function (err) {
      if (err) { return next(err); }
      return res.redirect('/');  // Redirect to home page on successful login
    });
  })(req, res, next);
});

// GET logout
router.get('/logout', function (req, res, next) {
  req.logout(function (err) {
    if (err) { return next(err); }
    res.redirect('/');  // Redirect to home page after logout
  });
});

module.exports = router;
