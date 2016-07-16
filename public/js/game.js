'use strict';
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {
    game.load.image('hero', 'assets/hero1.png');
    game.load.image('asteroid', 'assets/asteroid1.png');
}

var sprite;
var cursor;
var hero;
var asteroids;
function create() {
    asteroids = game.add.group();

    game.physics.startSystem(Phaser.Physics.P2JS);

    game.stage.backgroundColor = '#0072bc';

    sprite = game.add.sprite(400, 300, 'hero');
    sprite.anchor.setTo(0.5, 0.5);

    cursor = game.input.keyboard.createCursorKeys();
    hero = game.add.sprite(256, game.world.height - 150, 'hero');
    hero.scale = new Phaser.Point(2, 2);
    game.physics.p2.enable(hero);

    for (var i = 0; i < 10; i++) {
        var asteroid = asteroids.create(game.rnd.integerInRange(200, 1700), game.rnd.integerInRange(-200, 400), 'asteroid');
        game.physics.p2.enable(asteroid, false);
    }

    //  Enable Arcade Physics for the sprite
    game.physics.enable(sprite, Phaser.Physics.ARCADE);

    //  Tell it we don't want physics to manage the rotation
    sprite.body.allowRotation = false;

}

function update() {

    sprite.rotation = game.physics.arcade.moveToPointer(sprite, 60, game.input.activePointer, 500);
    if (cursor.left.isDown) {hero.body.rotateLeft(100);}
    else if (cursor.right.isDown) {hero.body.rotateRight(100);}
    else {hero.body.setZeroRotation();}
    if (cursor.up.isDown) {hero.body.thrust(400);}
    if (cursor.down.isDown) {hero.body.thrust(400);}

}

function render() {

    game.debug.spriteInfo(sprite, 32, 32);

}
