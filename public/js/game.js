'use strict';
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {
    game.load.image('hero', 'assets/hero1.png');
    game.load.image('asteroid', 'assets/asteroid1.png');
    game.load.tilemap('map', 'assets/collision_test.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('ground_1x1', 'assets/ground_1x1.png');
}

var mousePointerSprite;
var cursor;
var hero;
var asteroids;
var map; // For Tilemap
var layer; // For Tilemap
var asteroidCollisionGroup; //these are basically collision layers with defined overlaps
var heroCollisionGroup;

function create() {
    asteroids = game.add.group();
    game.physics.startSystem(Phaser.Physics.P2JS);
    game.physics.p2.restitution = 0.8; //no idea what this means
    asteroidCollisionGroup = game.physics.p2.createCollisionGroup();
    heroCollisionGroup = game.physics.p2.createCollisionGroup();
    game.physics.p2.setImpactEvents(true); //yes I do want callbacks
    game.physics.p2.updateBoundsCollisionGroup(); //yes i do want the edge of the screen to be a wall 
    game.stage.backgroundColor = '#0072bc';

    // For Tilemap
    map = game.add.tilemap('map');
    map.addTilesetImage('ground_1x1');
    layer = map.createLayer('Tile Layer 1');
    layer.resizeWorld();
    map.setCollisionBetween(1, 12);
    
    mousePointerSprite = game.add.sprite(400, 300, 'hero');
    mousePointerSprite.anchor.setTo(0.5, 0.5);

    cursor = game.input.keyboard.createCursorKeys();
    hero = game.add.sprite(256, game.world.height - 150, 'hero');
    hero.health = 5;
console.log(hero.health);
    hero.scale = new Phaser.Point(2, 2);
    game.physics.p2.enable(hero);

    for (var i = 0; i < 10; i++) {
        var asteroid = asteroids.create(game.rnd.integerInRange(200, 1700), game.rnd.integerInRange(-200, 400), 'asteroid');
        game.physics.p2.enable(asteroid, false);
        asteroid.body.setCollisionGroup(asteroidCollisionGroup);
        asteroid.body.collides([asteroidCollisionGroup, heroCollisionGroup]);
    }
    hero.body.collides(asteroidCollisionGroup, hitsteroid, this);

    //  Enable Arcade Physics for the sprite
    game.physics.enable(mousePointerSprite, Phaser.Physics.ARCADE);

    //  Tell it we don't want physics to manage the rotation
    mousePointerSprite.body.allowRotation = false;

    // For bouncing off of Tilemap
    mousePointerSprite.body.bounce.set(0.6);
    mousePointerSprite.body.tilePadding.set(32);
    hero.body.setCollisionGroup(asteroidCollisionGroup);

}
function hitsteroid(body1, body2) {

    //  body1 is the space ship (as it's the body that owns the callback)
    //  body2 is the body it impacted with, in this case our panda
    //  As body2 is a Phaser.Physics.P2.Body object, you access its own (the sprite) via the sprite property:
//    body2.sprite.alpha -= 0.1; example code
hero.health--;
}

function update() {

    mousePointerSprite.rotation = game.physics.arcade.moveToPointer(mousePointerSprite, 60, game.input.activePointer, 500);

    if (cursor.left.isDown) {hero.body.rotateLeft(100);}
    else if (cursor.right.isDown) {hero.body.rotateRight(100);}
    else {hero.body.setZeroRotation();}
    if (cursor.up.isDown) {hero.body.thrust(400);}
    if (cursor.down.isDown) {hero.body.thrust(400);}

    // For bouncing off of Tilemap
    game.physics.arcade.collide(mousePointerSprite, layer);
    //  Un-comment these to gain full control over the sprite
    // sprite.body.velocity.x = 0;
    // sprite.body.velocity.y = 0;
}

function render() {

    game.debug.spriteInfo(mousePointerSprite, 32, 32);

}
