'use strict';
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {
    game.load.spritesheet('blast', 'assets/blast.png', 16, 16);
    game.load.spritesheet('hero', 'assets/hero1.png', 16, 16);
    game.load.spritesheet('rcf', 'assets/hero2.png', 16, 16);
    game.load.image('asteroid', 'assets/asteroid1.png');
    game.load.tilemap('level1', 'assets/levels/Level1.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.tilemap('level2', 'assets/levels/Level2.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.tilemap('level3', 'assets/levels/Level3.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.tilemap('level4', 'assets/levels/Level4.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.tilemap('level5', 'assets/levels/Level5.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.tilemap('level6', 'assets/levels/Level6.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('SpaceShipTiles', 'assets/tilemaps/SpaceShipTiles.png');
    game.load.image('Pickup', 'assets/tilemaps/Pickup.png');
}
var blast;
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
var rotateEverythingGroup;
var blastCollisionGroup;
var camera;
var counter = 0;

function create() {
    asteroids = game.add.group();
    game.physics.startSystem(Phaser.Physics.P2JS);
    game.physics.p2.restitution = 0.8; //no idea what this means
    asteroidCollisionGroup = game.physics.p2.createCollisionGroup();
    heroCollisionGroup = game.physics.p2.createCollisionGroup();
    blastCollisionGroup = game.physics.p2.createCollisionGroup();
    game.physics.p2.setImpactEvents(true); //yes I do want callbacks
    game.physics.p2.updateBoundsCollisionGroup(); //yes i do want the edge of the screen to be a wall 
    game.stage.backgroundColor = '#000000';

    // For Tilemap
    map = game.add.tilemap('level1');
    map.addTilesetImage('SpaceShipTiles');
    map.addTilesetImage('Pickup');
    layer = map.createLayer('Tile Layer 1');
    layer.resizeWorld();
    map.setCollisionBetween(1, 140);
    tileObjects = game.physics.p2.convertTilemap(map, layer);
    tilesCollisionGroup = this.physics.p2.createCollisionGroup();
    
    rcf = game.add.sprite(400, 300, 'rcf');
    rcf.anchor.setTo(0.5, 0.5);

    cursor = game.input.keyboard.createCursorKeys();
    game.input.addPointer();
    hero = game.add.sprite(256, game.world.height - 150, 'hero');
    blast = game.add.sprite(-50, -50, 'blast');
    hero.health = 5;
    hero.scale = new Phaser.Point(2, 2);
    game.physics.p2.enable(hero);//physics the players
    game.physics.p2.enable(blast);
    game.physics.p2.enable(rcf);

    for (var i = 0; i < 10; i++) {
        var asteroid = asteroids.create(game.rnd.integerInRange(200, 1700), game.rnd.integerInRange(-200, 400), 'asteroid');
        game.physics.p2.enable(asteroid, false);
        asteroid.body.setCollisionGroup(asteroidCollisionGroup);
        asteroid.body.collides([asteroidCollisionGroup, heroCollisionGroup, blastCollisionGroup]);
    }
    hero.body.collides(asteroidCollisionGroup, hitsteroid, this);
    blast.body.setCollisionGroup(blastCollisionGroup);
    blast.body.collides(asteroidCollisionGroup, blastHit, this);
    blast.kill();

    // For Tilemap
    for (var i = 0; i < tileObjects.length; i++) {
        var tileBody = tileObjects[i];
        tileBody.setCollisionGroup(tilesCollisionGroup);
        tileBody.collides(heroCollisionGroup);
        tileBody.collides(blastCollisionGroup);
    }
    hero.body.collides(tilesCollisionGroup);
    rcf.body.collides(tilesCollisionGroup);

    hero.body.setCollisionGroup(heroCollisionGroup);
    rcf.body.setCollisionGroup(heroCollisionGroup);
    rcf.body.damping = 0.95;
    hero.body.collides(asteroidCollisionGroup, hitsteroid, this);
    rcf.body.collides(asteroidCollisionGroup, hitsteroid, this);
    rcf.body.collides(heroCollisionGroup);
    hero.body.collides(heroCollisionGroup);

    hero.animations.add('move', [0, 1, 2], 20, true);
    hero.animations.add('stop', [2], 20, true);
    hero.animations.add('slow', [3], 20, true);
    hero.animations.add('splat', [5], 20, true);
    rcf.animations.add('move', [0, 1, 2], 20, true);
    rcf.animations.add('splat', [5], 20, true);
    blast.animations.add('move', [0, 1, 2, 3], 20, true);
    hero.animations.play('stop');
    rcf.animations.play('move');

    camera = game.camera;
    camera.follow(hero);

    // Rotate the universe!
    rotateEverythingGroup = game.add.group();
    rotateEverythingGroup.add(layer);
    rotateEverythingGroup.add(hero);
    rotateEverythingGroup.add(rcf);
    rotateEverythingGroup.add(asteroids);
}
function hitsteroid(body1, body2) {
    //  body1 is the space ship (as it's the body that owns the callback)
    //  body2 is the body it impacted with, in this case our panda
    //  As body2 is a Phaser.Physics.P2.Body object, you access its own (the sprite) via the sprite property:
//    body2.sprite.alpha -= 0.1; example code
hero.health--;
console.log(hero.health);
}
function blastHit(body1, body2) {
body2.sprite.kill();
body1.sprite.kill();
console.log(body1);
counter = 0;
}
function blastReset(body1, body2) {

    //  body1 is the space ship (as it's the body that owns the callback)
    //  body2 is the body it impacted with, in this case our panda
    //  As body2 is a Phaser.Physics.P2.Body object, you access its own (the sprite) via the sprite property:
//    body2.sprite.alpha -= 0.1; example code
//hero.health--;
//console.log(hero.health);
}

function update() {
    accelrcf(rcf);

    if (blast.alive) {
        counter++;
        console.log(counter);
        if (counter > 25) {
            counter = 0;
            blast.kill();
        }
        var speed = 10000;
        var angle = Math.atan2(hero.body.y - blast.body.y, hero.body.x - blast.body.x);
        blast.body.rotation = angle + game.math.degToRad(90);
        blast.body.force.x = Math.cos(angle) * speed;
        blast.body.force.y = Math.sin(angle) * speed;
    }

    if(hero.health > 0 && cursor.right.isDown) {
        console.log('fire');
        blast.alive = true;
        blast.exists = true;
        blast.visable = true;
        blast.body.x = rcf.body.x;
        blast.body.y = rcf.body.y;
        blast.body.force.x = 0;
        blast.body.force.y = 0;
        blast.body.damping = 0.8;
        var speed = 10000;
        var angle = Math.atan2(hero.body.y - blast.body.y, hero.body.x - blast.body.x);
        blast.body.rotation = angle + game.math.degToRad(90);
        blast.body.force.x = Math.cos(angle) * speed;
        blast.body.force.y = Math.sin(angle) * speed;
    }   

    if (cursor.left.isDown) {
        if (cursor.left.shiftKey)
        {
            rotateSpaceShip('counterClockWise');
            // rotateEverythingGroup.rotation = -1*hero.rotation;
        } else {
            hero.body.rotateLeft(250);
        }
    }
    else if (cursor.right.isDown) {
        if (cursor.right.shiftKey) {
            rotateSpaceShip();
            // rotateEverythingGroup.rotation = rotateEverythingGroup.rotation - 0.1;
            // rotateEverythingGroup.rotation = 1;
        } else {
            hero.body.rotateRight(250);
        }
    }
    else {hero.body.setZeroRotation();}
    if (cursor.down.isDown) {
        hero.body.damping = 0.95;
    }
    if (cursor.up.isDown && hero.health > 0) {
        hero.animations.play('move');
        hero.body.damping = 0.1;
        hero.body.thrust(800);
   } else if(hero.body.damping > .5 && hero.health > 0) {hero.animations.play('slow');} else if (hero.health > 0) {hero.animations.play('stop');} else {hero.animations.play('splat'); rcf.animations.play('splat');}


    rotateEverythingGroup.pivot.x = hero.x;
    rotateEverythingGroup.pivot.y = hero.y;
    rotateEverythingGroup.x = rotateEverythingGroup.pivot.x;
    rotateEverythingGroup.y = rotateEverythingGroup.pivot.y;
    camera.focusOnXY(hero.x, hero.y + hero.height - camera.view.halfHeight);
}

function rotateSpaceShip(direction) {
    var rotationIncrement = 0.1;
    if (direction === 'counterClockWise') {
        rotationIncrement = -rotationIncrement;
    }
    rotateEverythingGroup.rotation = rotateEverythingGroup.rotation + rotationIncrement;
    hero.body.rotation = hero.body.rotation - rotationIncrement;
}

function render() {


}



function accelrcf (obj1, speed) {
    if (typeof speed === 'undefined') {speed = 1200;}
    var angle = Math.atan2(game.input.mousePointer.y - obj1.world.y, game.input.mousePointer.x - obj1.world.x);
    angle = angle - rotateEverythingGroup.rotation;
    if (angle > 180) {
        angle -= 360;
    } else if (angle < -180) {
        angle += 360;
    }
    obj1.body.rotation = angle + game.math.degToRad(90);
    obj1.body.force.x = Math.cos(angle) * speed;
    obj1.body.force.y = Math.sin(angle) * speed;
}
