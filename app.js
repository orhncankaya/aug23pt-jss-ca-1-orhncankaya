const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const users = require('./data/users.json');
const createError = require('http-errors');

const indexRouter = require('./routes/index');
const memeRouter = require('./routes/meme');
const memesRouter = require('./routes/memes');

const app = express();

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Session setup
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
}));

// Passport setup
passport.use(new LocalStrategy((username, password, done) => {
  const user = users.find(user => user.username === username && user.password === password);
  if (user) {
    return done(null, user);
  } else {
    return done(null, false, { message: 'Invalid credentials' });
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.username);
});

passport.deserializeUser((username, done) => {
  const user = users.find(user => user.username === username);
  done(null, user);
});

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/', indexRouter);
app.use('/meme', memeRouter);
app.use('/memes', memesRouter);

// Error Handling
app.use((req, res, next) => {
  next(createError(404));
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
