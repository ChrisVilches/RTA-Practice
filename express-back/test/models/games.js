var expect = require('chai').expect;

var Game = require('../../models/game');

describe('Game', function() {
  it('nameが指定されなければエラー発生', function(done) {
    var g = new Game({ });
    g.validate(function(err) {
        expect(err.errors.name).to.exist;
        done();
    });
  });

  it('childrenが自動的に作成される', function() {
    var g = new Game({ name: 'x' });

    expect(g.children).to.exist;
    expect(g.children).to.be.an('array').that.is.empty;
    g.validate();
    expect(g.children).to.exist;
    expect(g.children).to.be.an('array').that.is.not.empty;

    var g2 = new Game({ name: 'x', children: [{ name: 'xx'}] });

    expect(g2.children).to.exist;
    expect(g2.children).to.be.an('array').that.is.not.empty;
    g2.validate();
    expect(g2.children).to.exist;
    expect(g2.children).to.be.an('array').that.is.not.empty;

  });

  it('nameが空文字列の場合、エラー発生', function(done) {
    var g = new Game({ name: '' });
    g.validate(function(err) {
        expect(err.errors.name).to.exist;
        done();
    });
  });

  it('nameが空文字列の場合、エラー発生（Trim）', function(done) {
    var g = new Game({ name: '  ' });
    g.validate(function(err) {
        expect(err.errors.name).to.exist;
        done();
    });
  });

  it('ownerが指定されなければエラー発生', function(done) {
    var g = new Game({ name: 'xxx' });
    g.validate(function(err) {
        expect(err.errors.owner).to.exist;
        expect(err.errors.name).to.not.exist;
        done();
    });
  });

  it('木にデフォルト節点を正しく追加します（１）', function(){

    let children = [
      { name: '1', children: [{name: 'a'}] },
      { name: '2' },
      { name: '3' }
    ];

    var g = new Game({ children });

    expect(g.children[0].children).to.exist;
    expect(g.children[1].children).to.not.exist;
    expect(g.children[2].children).to.not.exist;
    g.validate();
    expect(g.children[0].children).to.exist;
    expect(g.children[1].children).to.exist;
    expect(g.children[2].children).to.exist;

  });


  it('木にデフォルト節点を正しく追加します（２）', function(){

    let children = [
      { name: '1' }
    ];

    var g = new Game({ children });

    expect(g.children[0].children).to.not.exist;
    g.validate();
    expect(g.children[0].children).to.exist;

  });

  it('木にデフォルト節点を正しく追加します（３）', function(){

    let children = [
      { name: '1' },
      { name: '2' },
      { name: '3' }
    ];

    var g = new Game({ children });

    expect(g.children[0].children).to.not.exist;
    expect(g.children[1].children).to.not.exist;
    expect(g.children[2].children).to.not.exist;
    g.validate();
    expect(g.children[0].children).to.exist;
    expect(g.children[1].children).to.exist;
    expect(g.children[2].children).to.exist;

  });

  it('木にデフォルト節点を正しく追加します（４）', function(){

    let children = [
      { name: '1', children: [{name: 'a', children: [{ name: 'xxxx' }]}] },
      { name: '2' },
      { name: '3', children: [{name: 'c'}]  }
    ];

    var g = new Game({ children });

    expect(g.children[0].children[0].children[0].name).to.equal('xxxx');
    expect(g.children[0].children[0].children[0].children).to.not.exist;
    expect(g.children[1].children).to.not.exist;
    expect(g.children[2].children).to.exist;
    expect(g.children[2].children[0].children).to.not.exist;
    g.validate();
    expect(g.children[0].children[0].children[0].name).to.equal('xxxx');
    expect(g.children[0].children[0].children[0].children).to.not.exist;
    expect(g.children[1].children).to.exist;
    expect(g.children[2].children).to.exist;
    expect(g.children[2].children[0].children).to.not.exist;

  });


  it('ゲームのchildrenというメンバが指定されなければデフォルト節点を正しく追加します', function(){

    var game = Game({ name: '名前' });
    game.validate();

    expect(game.children[0].name).to.be.a('string').to.be.empty;
    expect(game.children[0].nodeId).to.be.a('number');

    expect(game.children[0].children[0].name).to.be.a('string').to.be.empty;
    expect(game.children[0].children[0].nodeId).to.be.a('number');

  });

  it('children配列が空っぽの場合、ノードを追加します', function(){

    var game = Game({ name: '名前', children: [{ name: 'a' }, { name: 'b', children: [{ name: 'c' }, { name: 'd', children: [] }] }] });

    let a = game.children[0];
    let b = game.children[1];
    let c = b.children[0];
    let d = b.children[1];

    expect(d.children).to.be.an('array').to.be.empty; // validate()した後、not.emptyになることを確認します。

    game.validate();

    expect(a.children).to.be.an('array').to.not.be.empty;
    expect(c.children).to.be.an('array').to.not.be.empty;
    expect(d.children).to.be.an('array').to.not.be.empty;

  });






});
