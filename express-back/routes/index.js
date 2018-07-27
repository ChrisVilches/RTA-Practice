var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var passport = require('passport');
var Game = require("../models/game");
var User = require("../models/user");


let banjokazooie = {
  name: 'bankazoo',
  owner: '5b22b260bb6efb5ce2dfb2e6',
  backgroundImage: 'http://i58.servimg.com/u/f58/14/26/98/51/banosp10.png',
  children: [
    { name: '1', children: [{name: 'a'}] },
    { name: '2' },
    { name: '3', children: [{name: 'c'}]  }
  ]
}
/*
let banjokazooie = {
  name: 'bankazoo',
  owner: '5b22b260bb6efb5ce2dfb2e6',
  backgroundImage: 'https://hdwallsbox.com/wallpapers/l/1920x1200/49/video-games-banjo-kazooie-1920x1200-48921.jpg',
  children: [
    { name: '1' },
    { name: '2' },
    { name: '3' }
  ]
}
*/
let mario64 = {
  name: 'Super Mario 64 120枚',
  backgroundImage: 'https://cdn.videogamesblogger.com/wp-content/uploads/2010/04/super-mario-64-star-locations-guide-walkthrough-screenshot.jpg',
  owner: '5b22ac1e06e7e4555bfc9d7e',
  children: [
    {
      name: 'ケツバグ',
      children: [
        { name: "clip" },
        { name: "long jump" },
        { name: "mash" },
        { name: "moonwalk(?)" }
      ]
    },
    {
      name: '闇の世界',
      children: [
        { name: "一番目" },
        { name: "サイクル（リフト）" },
        { name: "２番目のサイクル" },
        { name: "壁ジャンプ" }
      ]
    },
    {
      name: 'WF',
      children: [
        {
          name: '梟なし',
          children: [
            { name: "移動" },
            { name: "頂上" },
            { name: "ジャンプ" }
          ]
        },
        {
          name: '大砲なしOG'
        },
        {
          name: '大砲なし'
        },
        {
          name: '100',
          children: [
            {
              name: '直線'
            },
            {
              name: '円'
            },
            {
              name: '壁ジャンプ'
            },
            {
              name: 'サイクル'
            }
          ]
        },
        {
          name: '砦1',
          children: [
            {
              name: '1111'
            },
            {
              name: '2222',
              children: [
                {
                  name: 'aaa'
                },
                {
                  name: 'bbb'
                },
                {
                  name: 'ccc'
                }
              ]
            },
            {
              name: '3333'
            },
            {
              name: '4444'
            },
          ]
        },
        {
          name: '砦2',
          children: [
            { name: "desplazamiento" },
            { name: "llegar hasta arriba" }
          ]
        }
      ]
    },
    {
      name: 'JRB'
    },
    {
      name: 'BOB',
      children: [
        { name: "bomb clip" },
        {
          name: "100 coins",
          children: [
            { name: "第一" },
            { name: "第二" },
            { name: "第三" },
            { name: "第四" }
          ]
        }
      ]
    }
  ]
};



router.get('/populate', function(req, res, next){

  var m = new Game(mario64);
  var b = new Game(banjokazooie);
  var b2 = new Game(banjokazooie);
  b2.set({ name: 'bankazoo2' });

  Game.remove({}, function(){

    User.findOne({ username: 'leox' }, function(err, res){

      m.set({ owner: res._id.toString() });
      m.save();

      b2.set({ owner: res._id.toString() });
      b2.save();
    });
    User.findOne({ username: 'felox' }, function(err, res){
      banjokazooie.owner = res._id.toString();
      Game.create(banjokazooie, function(res, res){
        console.log(res);
      });
    });
  });

  return res.status(200).send();

});



module.exports = router;
