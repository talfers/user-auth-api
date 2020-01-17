const express = require('express');
const router = express.Router();
const requireAuth = require('../config/auth');
const passport = require('passport');
const User = require('../models/User');

router.get('/', requireAuth, (req, res) => {
  res.send({message: "You are authenticated!"});
})

router.get('/login', (req, res) => {
  res.send({errors: ["You must be logged in to view our resources"]})
})

router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: false
  })(req, res, next);
})

router.post('/signup', (req, res) => {
  const { email, password, password2 } = req.body;

  let errors = [];

  if(!email || !password || !password2) {
    errors.push("Please complete all fields");
  }

  if(password !== password2) {
    errors.push("Passwords don't match");
  }

  if(password.length < 8) {
    errors.push("Password must be at least 8 characters");
  }

  if(errors.length > 0) {
    res.send({errors: errors});
  } else {
    User.findOne({email:email})
      .then(async (user) => {
        if(user) {
          res.send({errors: ["User already exists!"]})
        } else {
          const newUser = new User({
            email,
            password
          });
          await newUser.save()
          res.send({user: newUser.email})
        }
      })
  }
})

module.exports = router;
