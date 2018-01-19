var game = new Phaser.Game(960, 640, Phaser.CANVAS, 'game');

var PhaserGame = function (game) {
  this.map = null;
  this.layer = null;
  this.hero = null;
  this.speed = 300;
  this.activeTile = null;
  this.gridsize = 32;
  this.marker = new Phaser.Point();
  this.attack = null;
  this.attacks = null;
  this.attackTime = null;

};

PhaserGame.prototype = {

  init: function () {
    this.physics.startSystem(Phaser.Physics.ARCADE);
  },

  preload: function () {
    this.load.tilemap('map', 'assets/firstMap.json', null, Phaser.Tilemap.TILED_JSON);
    this.load.image('tiles', 'assets/tiles.png');
    this.load.image('attack', 'assets/attackArea3.png');
    this.load.spritesheet('ship', 'assets/UFO.png', 32, 32)
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
    this.physics.arcade.enable(this.hero);
    this.hero.animations.add('spin', [0,1,2,3], 10, true);
    this.hero.animations.play('spin');

    //input object
    this.cursors = this.input.keyboard.createCursorKeys();

  },


  update: function () {

    this.physics.arcade.collide(this.hero, this.layer);


    this.marker.x = this.math.snapToFloor(Math.floor(this.hero.x), this.gridsize) / this.gridsize;
    this.marker.y = this.math.snapToFloor(Math.floor(this.hero.y), this.gridsize) / this.gridsize;
    this.activeTile = this.map.getTile(this.marker.x, this.marker.y, 'Tile Layer 1');


    this.hero.body.velocity.x = 0;
    this.hero.body.velocity.y = 0;

    if (this.cursors.left.isDown)
    {
      this.hero.body.velocity.x = -this.speed;
    }
    if (this.cursors.right.isDown)
    {
      this.hero.body.velocity.x = this.speed;
    }
    if (this.cursors.up.isDown)
    {
      this.hero.body.velocity.y = -this.speed;
    }
    if (this.cursors.down.isDown)
    {
      this.hero.body.velocity.y = this.speed;
    }
    if (this.input.keyboard.isDown(16))
    {
      this.attackArea();
    }

    this.resetAttack();


  },

  render: function () {
    //this.game.debug.geom(new Phaser.Rectangle(this.activeTile.worldX, this.activeTile.worldY, 32, 32), '#ffff00', false);
    //console.log(this.activeTile.x)
  },    

  attackArea: function () {
    if (this.time.now > this.attackTime)
    {

      if (this.attacks)
      {
        //  And fire it
        this.attacks.reset(this.activeTile.worldX+16, this.activeTile.worldY+16);
        this.attackTime = this.time.now + 1500;
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

