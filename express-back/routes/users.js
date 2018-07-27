var mongoose = require('mongoose');
var passport = require('passport');
var config = require('../config/database');
require('../config/passport')(passport);
var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();
var User = require("../models/user");
var Game = require("../models/game");

router.post('/signup', function(req, res) {

  if(!req.body.username || !req.body.password) {
    res.json({success: false, msg: 'Please pass username and password.'});
  } else {
    var newUser = new User({
      username: req.body.username,
      password: req.body.password
    });
    // save the user
    newUser.save(function(err, user) {
      if (err) {
        return res.json({success: false, msg: 'Username already exists.'});
      }
      res.json({success: true, msg: 'Successful created new user.', user: user});
    });
  }
});


router.get('/list', function(req, res, next) {
  res.setHeader('Content-Type', 'application/json');
  User.find({}, function(err, users) {
    res.send(JSON.stringify(users));
  });
});


router.get('/:username/games', function(req, res, next) {
  res.setHeader('Content-Type', 'application/json');

  User.findOne({ username: req.params.username }, function(err, user){

    if(err) return res.status(500);
    if(!user) return res.status(404);

    Game.find({ owner: user._id }).select('_id name').exec(function(err, games){
      if(err) return res.status(500);
      if(games) return res.send(JSON.stringify(games));
    });
  });
});


router.post('/signin', function(req, res) {
  User.findOne({
    username: req.body.username
  }, function(err, user) {
    if (err) throw err;

    if (!user) {
      res.status(401).send({success: false, msg: 'Authentication failed. User not found.'});
    } else {

      // check if password matches
      user.comparePassword(req.body.password, function (err, isMatch) {
        if (isMatch && !err) {
          // if user is found and password is right create a token
          var token = jwt.sign(user.toJSON(), config.secret);
          // return the information including token as JSON
          res.json({success: true, token: 'JWT ' + token, user: user});
        } else {
          res.status(401).send({success: false, msg: 'Authentication failed. Wrong password.'});
        }
      });
    }
  });
});

module.exports = router;
