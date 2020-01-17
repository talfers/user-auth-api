const express = require('express');
const router = express.Router();
const requireAuth = require('../config/auth');
const passport = require('passport');
const User = require('../models/User');

router.get('/', requireAuth, (req, res) => {
  res.status(200).send({message: "You are authenticated!"});
})

router.get('/notfound', (req, res) => {
  res.status(404).send({errors: ["Entered credentials incorrect"]})
})

router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/notfound',
    failureFlash: false
  })(req, res, next);
})

router.post('/signup', (req, res) => {
  const { email, password, password2 } = req.body;

  let errors = [];

  if(!email || !password || !password2) {
    errors.push("You must complete all fields");
  }

  if(password !== password2) {
    errors.push("Passwords don't match");
  }

  if(password.length < 8) {
    errors.push("Password must be at least 8 characters");
  }

  if(errors.length > 0) {
    res.status(401).send({errors: errors});
  } else {
    User.findOne({email:email})
      .then(async (user) => {
        if(user) {
          res.status(403).send({errors: ["User already exists!"]})
        } else {
          const newUser = new User({
            email,
            password
          });
          await newUser.save()
          res.status(200).send({user: newUser.email})
        }
      })
  }
})

module.exports = router;
