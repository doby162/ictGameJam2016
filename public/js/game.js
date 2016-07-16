'use strict';
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {
    game.load.image('hero', 'assets/hero1.png');
    game.load.image('asteroid', 'assets/asteroid1.png');
    game.load.tilemap('map', 'assets/collision_test.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('ground_1x1', 'assets/ground_1x1.png');
}

var rcf;
var cursor;
var hero;
var asteroids;
var map; // For Tilemap
var layer; // For Tilemap
var tileObjects; // For Tilemap
var tilesCollisionGroup; // For Tilemap
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
    map.addTilesetImage('walls_1x2');
    map.addTilesetImage('tiles2');
    layer = map.createLayer('Tile Layer 1');
    layer.resizeWorld();
    map.setCollisionBetween(1, 12);
    tileObjects = game.physics.p2.convertTilemap(map, layer);
    tilesCollisionGroup   = this.physics.p2.createCollisionGroup();
    
    rcf = game.add.sprite(400, 300, 'hero');
    rcf.anchor.setTo(0.5, 0.5);

    cursor = game.input.keyboard.createCursorKeys();
    hero = game.add.sprite(256, game.world.height - 150, 'hero');
    hero.health = 5;
console.log(hero.health);
    hero.scale = new Phaser.Point(2, 2);
    game.physics.p2.enable(hero);//physics the players
    game.physics.p2.enable(rcf);

    for (var i = 0; i < 10; i++) {
        var asteroid = asteroids.create(game.rnd.integerInRange(200, 1700), game.rnd.integerInRange(-200, 400), 'asteroid');
        game.physics.p2.enable(asteroid, false);
        asteroid.body.setCollisionGroup(asteroidCollisionGroup);
        asteroid.body.collides([asteroidCollisionGroup, heroCollisionGroup]);
    }
    hero.body.collides(asteroidCollisionGroup, hitsteroid, this);

    // For Tilemap
    for (var i = 0; i < tileObjects.length; i++) {
        var tileBody = tileObjects[i];
        tileBody.setCollisionGroup(tilesCollisionGroup);
        tileBody.collides(heroCollisionGroup);    }
    hero.body.collides(tilesCollisionGroup);

    hero.body.setCollisionGroup(heroCollisionGroup);
    rcf.body.setCollisionGroup(heroCollisionGroup);

    game.camera.follow(hero);

}
function hitsteroid(body1, body2) {

    //  body1 is the space ship (as it's the body that owns the callback)
    //  body2 is the body it impacted with, in this case our panda
    //  As body2 is a Phaser.Physics.P2.Body object, you access its own (the sprite) via the sprite property:
//    body2.sprite.alpha -= 0.1; example code
hero.health--;
console.log(hero.health);
}

function update() {


    if (cursor.left.isDown) {hero.body.rotateLeft(250);}
    else if (cursor.right.isDown) {hero.body.rotateRight(250);}
    else {hero.body.setZeroRotation();}
    if (cursor.down.isDown) {
        hero.body.damping = 0.95;
    }
    if (cursor.up.isDown) {
        hero.body.damping = 0;
        hero.body.thrust(650);
    }

}

function render() {


}
