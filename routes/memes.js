const express = require('express');
const router = express.Router();
const axios = require('axios');
const apiUrl = 'http://jss.restapi.co.za/memes';

let memeData = null;  // Store memes in memory

// GET memes overview
router.get('/', async (req, res, next) => {
  try {
    if (!memeData) {
      const response = await axios.get(apiUrl);
      memeData = response.data;
    }

    const searchQuery = req.query.search;
    let filteredMemes = memeData;

    if (searchQuery) {
      filteredMemes = memeData.filter(meme =>
        meme.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    res.render('memes', {
      memes: filteredMemes,
      loggedIn: req.isAuthenticated(),
      username: req.user ? req.user.username : 'Guest'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
