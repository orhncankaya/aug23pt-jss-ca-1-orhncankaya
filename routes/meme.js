const express = require('express');
const router = express.Router();
let memeData = require('./memes').memeData;

// GET meme details
router.get('/:id', (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/login');
  }

  const memeId = req.params.id;
  const meme = memeData.find(m => m.id === memeId);

  if (!meme) {
    return res.status(404).render('error', { message: "Meme not found" });
  }

  res.render('meme', {
    meme,
    loggedIn: req.isAuthenticated(),
    username: req.user ? req.user.username : 'Guest'
  });
});

module.exports = router;
