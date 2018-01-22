import _ from 'lodash';
// NOTE: Phaser3 will be importable: e.g. import Phaser from 'phaser';
require('pixi.js');
require('p2');
require('phaser');

let SCREEN_WIDTH = 960;
let SCREEN_HEIGHT = 640;

let game = new Phaser.Game(SCREEN_WIDTH, SCREEN_HEIGHT, Phaser.CANVAS, 'game');

let PhaserGame = function (game) {
  this.map = null;
  this.layer = null;
  this.hero = null;
  this.activeTile = null;
  this.gridsize = 32;
  this.marker = new Phaser.Point();
  this.attack = null;
  this.attacks = null;
  this.attackTime = null;
  // eventually load attributes from cached state
  this.heroAttributes = {
    speed: 300,
    health: 100,
    attack: 1,
    defense: 1,
    magic: 48
  };

  this.statusBar = {};
  this.statusBarDimensions = {};

  this.statusBarDimensions.width = this.gridsize * 5;
  this.statusBarDimensions.padding = this.gridsize;
  this.statusBarDimensions.x = SCREEN_WIDTH - this.statusBarDimensions.width + this.statusBarDimensions.padding;
  this.statusBarDimensions.y = this.statusBarDimensions.padding;
};

PhaserGame.prototype = {

  init: function () {
    this.physics.startSystem(Phaser.Physics.ARCADE);
  },

  preload: function () {
    this.load.tilemap('map', 'assets/firstMap.json', null, Phaser.Tilemap.TILED_JSON);
    this.load.image('tiles', 'assets/tiles.png');
    this.load.image('attack', 'assets/attackArea3.png');
    this.load.spritesheet('ship', 'assets/UFO.png', this.gridsize, this.gridsize)
  },

  create: function () {

    // map
    this.map = this.add.tilemap('map');
    this.map.addTilesetImage('tiles', 'tiles');
    this.layer = this.map.createLayer('Tile Layer 1');
    this.map.setCollision(20, true, this.layer);


    // attack group
    this.attacks = this.add.sprite(null, null, 'attack');
    this.attacks.anchor.set(0.5)


    // hero
    this.hero = this.add.sprite(48, 48, 'ship');
    this.hero.anchor.set(0.5);
    this.hero.setHealth(this.heroAttributes.health);
    this.physics.arcade.enable(this.hero);
    this.hero.animations.add('spin', [0,1,2,3], 10, true);
    this.hero.animations.play('spin');

    //input object
    this.cursors = this.input.keyboard.createCursorKeys();

    let index = 0;
    for (let attribute in this.heroAttributes) {
      this.statusBar[attribute] = this.add.text(null, null, null, { fill: "#fff", fontSize: this.gridsize / 2 });

      const { x, y, width, height } = this.statusBarDimensions;

      this.statusBar[attribute].setTextBounds.apply(this.statusBar[attribute], [x, y, width, height])
      this.statusBar[attribute].top = index * this.gridsize / 2;
      
      index += 1;
    }

  },

  update: function () {
    this.physics.arcade.collide(this.hero, this.layer);

    // It would be nice if this could be conditionally performed
    for (let attribute in this.heroAttributes) {
      this.statusBar[attribute].setText(_.capitalize(attribute)+": "+this.heroAttributes[attribute]);
    }

    this.marker.x = this.math.snapToFloor(Math.floor(this.hero.x), this.gridsize) / this.gridsize;
    this.marker.y = this.math.snapToFloor(Math.floor(this.hero.y), this.gridsize) / this.gridsize;
    this.activeTile = this.map.getTile(this.marker.x, this.marker.y, 'Tile Layer 1');

    this.hero.body.velocity.x = 0;
    this.hero.body.velocity.y = 0;

    if (this.cursors.left.isDown)
    {
      this.hero.body.velocity.x = -this.heroAttributes.speed;
    }
    if (this.cursors.right.isDown)
    {
      this.hero.body.velocity.x = this.heroAttributes.speed;
    }
    if (this.cursors.up.isDown)
    {
      this.hero.body.velocity.y = -this.heroAttributes.speed;
    }
    if (this.cursors.down.isDown)
    {
      this.hero.body.velocity.y = this.heroAttributes.speed;
    }
    if (this.input.keyboard.isDown(16))
    {
      this.attackArea();
    }

    this.resetAttack();
  },

  render: function () { },    

  attackArea: function () {
    if (this.time.now > this.attackTime)
    {

      if (this.attacks)
      {
        //  And fire it
        this.attacks.reset(this.activeTile.worldX+16, this.activeTile.worldY+16);
        this.attackTime = this.time.now + 1500;
        // example side effects for debugging purposes
        this.heroAttributes.speed -= 10;
        this.heroAttributes.health -= 3;
      }
    }
  },

  resetAttack: function () {
    if (this.attacks && this.time.now > this.attackTime-100)
    {
      this.attacks.kill();
      this.attacks.alpha = 1;
    }
    else
    {
      if (this.attacks.alpha >= .015)
      {
        this.attacks.alpha -= .015;
      }
    }
  }

}

game.state.add('Game', PhaserGame, true);

