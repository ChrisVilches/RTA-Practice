var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var passport = require('passport');
var Game = require("../models/game");
var User = require("../models/user");



let requireUserAndSetUserId = function(req, res, next){
  let token = req.headers.authorization;

  if(!!token && !!req.user && !!req.user._id){
    res.locals.loggedUserId = req.user._id.toString();
    return next();
  }

  let err = {};
  err.httpStatusCode = 401;
  err.errorMessage = {};
  return next(err);
}

let authorizeGame = function(req, res, next){
  let game = res.locals.result;
  let err = res.locals.err;

  if(!game){
    err = {};
    err.httpStatusCode = 404;
    err.errorMessage = {};
    return next(err);
  }

  if(err){
    err.httpStatusCode = err.httpStatusCode || 500;
    err.errorMessage = {};
    return next(err);
  }

  if(game && !!game.owner){
    if(game.owner._id.toString() !== res.locals.loggedUserId){
      err = {};
      err.httpStatusCode = 401;
      err.errorMessage = {};
      return next(err);
    }
  } else {
    err = {};
    err.httpStatusCode = 404;
    err.errorMessage = {};
    return next(err);
  }

  next();
}



let returnData = function(req, res, next){

  let err = res.locals.err;

  if(err){
    err.httpStatusCode = 500;
    err.errorMessage = {};
    return next(err);
  }

  let result = res.locals.result;

  if(result == null){
    err = {};
    err.httpStatusCode = 404;
    err.errorMessage = {};
    return next(err);
  }

  if(result.hasOwnProperty('length') && result.length == 0){
    err = {};
    err.httpStatusCode = 404;
    err.errorMessage = [];
    return next(err);
  }

  return res.status(200).json(result);
}



router.get('/all', function(req, res, next){
  Game.find({}).select('name _id').populate('owner', 'username').exec(function(err, games){
    res.locals.result = games;
    res.locals.err = err;
    next();
  });
}, returnData);


router.get('/', passport.authenticate('jwt', { session: false }), requireUserAndSetUserId, function(req, res, next) {

  Game.find({ owner: res.locals.loggedUserId }).select('_id name lastPractice practiceCount').sort({ updatedAt: 'descending' }).exec(function(err, games) {
    res.locals.result = games;
    res.locals.err = err;
    next();

  });

}, returnData);



router.delete('/:id', passport.authenticate('jwt', { session: false }), requireUserAndSetUserId, function(req, res, next) {

  // It should throw "unauthorized" if the logged user isn't the owner.

  Game.deleteOne({ _id: req.params.id.toString(), owner: res.locals.loggedUserId }, function(err, game) {
    if(err){
      res.locals.err = err;
      return next();
    }

    return res.status(200).json({
      message: "Deleted"
    });
  });

});


router.get('/:id', passport.authenticate('jwt', { session: false }), requireUserAndSetUserId, function(req, res, next) {

  let game = Game.findOne({ _id: req.params.id.toString() }).populate('owner', 'username').exec()
  .then(game => { res.locals.result = game; next(); })
  .catch(err => { res.locals.err = err; next(); });

}, authorizeGame, returnData);


router.post('/', passport.authenticate('jwt', { session: false }), requireUserAndSetUserId, function(req, res, next) {

  let name = req.body.name || '';
  let backgroundImage = req.body.backgroundImage || '';

  let game = new Game({ name, owner: res.locals.loggedUserId, backgroundImage });
  game.save(function(err, newGame){
    res.locals.result = newGame;
    res.locals.err = err;
    next();
  });


}, returnData);


router.put('/:id', passport.authenticate('jwt', { session: false }), requireUserAndSetUserId, function(req, res, next) {
  Game.findOne({ _id: req.params.id.toString()}).populate('owner', 'username').exec(function(err, game){
    res.locals.result = game;
    res.locals.err = err;
    next();
  });

},
authorizeGame,
function(req, res, next){

  let game = res.locals.result;
  game.set({
    children: req.body.children,
    lastPractice: Date.now(),
    practiceCount: game.practiceCount + 1
  });
  game.save(function (err, updatedGame) {
    res.locals.result = updatedGame;
    res.locals.err = err;
    next();
  });
}, returnData);

/*
router.get('/:id/fix',
  passport.authenticate('jwt', { session: false }),
  requireUserAndSetUserId,
  function(req, res, next) {
    Game.findOne({ _id: req.params.id.toString() }, function(err, game) {
      res.locals.result = game;
      res.locals.err = err;
      next();
    });
  },
  authorizeGame,
  function(req, res){
    let game = res.locals.result;
    let gameAux = new Game(game);
    gameAux.validate();
    let newChildren = gameAux.children;

    game.set({ children: newChildren });
    game.save(function(err, updatedGame){
      res.status(200).send({
        msg: "Fixed.",
        updatedGame
      });
    });
  }
);
*/



router.use(function(err, req, res, next){
  console.error(err);
  return res.status(err.httpStatusCode).json(err.errorMessage);

});



module.exports = { router, requireUserAndSetUserId, authorizeGame, returnData };
