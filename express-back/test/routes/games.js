var expect = require('chai').expect;
var httpMocks = require('node-mocks-http');
var GameRoutes = require('../../routes/games');

let res = {};
let req = {};

res = {
  result: {},
  locals: {
    err: {},
    loggedUserId: ''
  }
};

req = {};

describe('GameRoutes', function(){

  beforeEach(function() {
    res = {
      result: {},
      locals: {
        err: {},
        loggedUserId: ''
      }
    };

    req = {};
  });


  describe('requireUserAndSetUserId', function() {

    it('req.user._id → res.locals.loggedUserId', function() {
      req.headers = {};
      req.headers.authorization = 'JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YjIyYjJmMjQxYTM1NjVkM2Y1NjFiMGYiLCJ1c2VybmFtZSI6Imxlb3giLCJwYXNzd29yZCI6IiQyYSQxMCRKbksuQ2l5VE5DcUQzTVN6aXhyYkFld29Kby83ZUlGVWR2ZlFnRThpVUY4V1JjeFFMSUNDRyIsIl9fdiI6MCwiaWF0IjoxNTI5MzQwMTg3fQ.6wa23_Ks4YjPjpYUEXEfnlqeHIOwixIgwxI9Y0KmIhg';
      req.user = { _id: '123' };
      GameRoutes.requireUserAndSetUserId(req, res, function next(error){
        expect(error).to.not.exist;
        expect(res.locals.loggedUserId).to.equal('123');
      });
    });

    it('req.user._id → res.locals.loggedUserId（トークン入ってないのでエラー発生）', function() {
      req.headers = {};
      req.user = { _id: '123' };
      GameRoutes.requireUserAndSetUserId(req, res, function next(error){
        expect(error).to.exist;
        expect(error.httpStatusCode).to.equal(401);
      });
    });
  });



  describe('returnData', function() {

    it('エラーが入ってた', function() {
      res.locals.err = { }
      GameRoutes.returnData(req, res, function next(error){
        expect(error).to.exist;
        expect(error.httpStatusCode).to.equal(500);
      });
    });

    it('データがArray', function() {
      res.locals.err = null;
      res.locals.result = [];
      GameRoutes.returnData(req, res, function next(error){
        expect(error).to.exist;
        expect(error.httpStatusCode).to.equal(404);
        expect(error.errorMessage).to.deep.equal([]);
      });
    });

    it('データがnull', function() {
      res.locals.err = null;
      res.locals.result = null;
      GameRoutes.returnData(req, res, function next(error){
        expect(error).to.exist;
        expect(error.httpStatusCode).to.equal(404);
        expect(error.errorMessage).to.deep.equal({});
      });
    });
  });



  describe('authorizeGame', function() {

    it('AUTH認証に成功した　ID == ID', function() {

      res.locals.err = null;
      res.locals.loggedUserId = 'qwerty';
      res.locals.result = {
        owner: {
          _id: 'qwerty'
        }
      };

      GameRoutes.authorizeGame(req, res, function next(error){
        expect(error).to.not.exist;
      });
    });

    it('game空っぽ', function() {

      res.locals.err = null;
      res.locals.loggedUserId = 'qwerty';
      res.locals.result = {};

      GameRoutes.authorizeGame(req, res, function next(error){
        expect(error).to.exist;
        expect(error.httpStatusCode).to.equal(404);
      });

      res.locals.result = null;

      GameRoutes.authorizeGame(req, res, function next(error){
        expect(error).to.exist;
        expect(error.httpStatusCode).to.equal(404);
      });
    });

    it('AUTH認証に成功した　ID != ID', function() {

      res.locals.err = null;
      res.locals.loggedUserId = 'qwertyx';
      res.locals.result = {
        owner: {
          _id: 'qwerty'
        }
      };

      GameRoutes.authorizeGame(req, res, function next(error){
        expect(error).to.exist;
        expect(error.httpStatusCode).to.equal(401);
      });
    });

    it('エラーがあった場合（トークンが一致する）', function() {

      res.locals.err = { httpStatusCode: 404 };
      res.locals.loggedUserId = 'qwerty';
      res.locals.result = {
        owner: {
          _id: 'qwerty'
        }
      };

      GameRoutes.authorizeGame(req, res, function next(error){
        expect(error).to.exist;
        expect(error.httpStatusCode).to.equal(404);
      });
    });

    it('エラーがあった場合（デフォルトエラー、500）', function() {

      res.locals.err = { };
      res.locals.loggedUserId = 'qwerty';
      res.locals.result = {
        owner: {
          _id: 'qwerty'
        }
      };

      GameRoutes.authorizeGame(req, res, function next(error){
        expect(error).to.exist;
        expect(error.httpStatusCode).to.equal(500);
      });
    });


    it('resultはnullの場合にエラーが出る', function() {

      res.locals.err = null;
      res.locals.loggedUserId = 'qwerty';
      res.locals.result = null;

      GameRoutes.authorizeGame(req, res, function next(error){
        expect(error).to.exist;
        expect(error.httpStatusCode).to.equal(404);
      });
    });


  });

});
