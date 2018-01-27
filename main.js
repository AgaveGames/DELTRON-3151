var screenWidth = 1200;
var screenHeight = 640;

var game = new Phaser.Game(screenWidth, screenHeight, Phaser.CANVAS, 'game');

var PhaserGame = function (game) {
    
    this.map = null;
    this.tilesHigh = 130;
    this.tilesWide = 130;
    this.layer = null;
    
    this.hero = null;
    this.speed = 300;
    
    this.gridsize = 32;
    this.marker = new Phaser.Point();
    
    this.attacks = null;
    this.attackTime = null;
    this.attackCounter = 1500;
    this.attackFadeRate = 0.015;
    
    this.panel = null;
    this.panelWidth = 192;
    this.wallTileNum = 20;

};

PhaserGame.prototype = {

    init: function () {
        this.physics.startSystem(Phaser.Physics.ARCADE);
    },

    preload: function () {
        this.load.tilemap('map', 'assets/playground2.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.image('tiles', 'assets/tiles.png');
        this.load.image('panel', 'assets/panel.png');
        this.load.image('attack', 'assets/attackArea3.png');
        this.load.spritesheet('ship', 'assets/UFO.png', this.gridsize, this.gridsize)
    },

    create: function () {

        // map
        this.map = this.add.tilemap('map');
        this.map.addTilesetImage('tiles', 'tiles');
        this.layer = this.map.createLayer('Tile Layer 1');
        this.map.setCollision(this.wallTileNum, true, this.layer);
        this.world.setBounds(0, 0, (this.gridsize*this.tilesHigh)+this.panelWidth, this.gridsize*this.tilesWide);


        // attack group
        this.attacks = this.add.sprite(null, null, 'attack');
        this.attacks.anchor.set(0.5)
    

        // hero
        this.hero = this.add.sprite(this.world.centerX-(this.gridsize*3), this.world.centerY, 'ship');
        this.hero.anchor.set(0.5);
        this.physics.arcade.enable(this.hero);
        this.hero.animations.add('spin', [0,1,2,3], 10, true);
        this.hero.animations.play('spin');
      
        this.panel = this.add.sprite(this.camera.x+(screenWidth-this.panelWidth), this.camera.y, 'panel');
        this.panel.fixedToCamera = true;
      
      
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
    this.camera.focusOnXY(this.hero.x+(this.panelWidth/2), this.hero.y);

    },
   

  attackArea: function () {
    if (this.time.now > this.attackTime)
    {

      if (this.attacks)
      {
        
        this.attacks.reset(this.activeTile.worldX+(this.gridsize/2), this.activeTile.worldY+(this.gridsize/2));
        this.attackTime = this.time.now + this.attackCounter;
      }
    }
  },
    
    
  resetAttack: function () {
    if (this.attacks && this.time.now > this.attackTime)
    {
      this.attacks.kill();
      this.attacks.alpha = 1;
    }
    else
    {
      if (this.attacks.alpha >= this.attackFadeRate)
      {
        this.attacks.alpha -= this.attackFadeRate;
      }
    }
  }
    
    
}

game.state.add('Game', PhaserGame, true);

