var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

var alive = false;

var eat = new Audio('audio/eat.mp3');
var border = new Audio('audio/border.mp3');
border.volume = 0.4;
var theme = new Audio('audio/theme.mp3');
theme.volume = 0.5;
if (typeof theme.loop == 'boolean') {
    theme.loop = true;
}
else {
    theme.addEventListener('ended', function() {
        this.currentTime = 0;
        this.play();
    }, false);
}

addEventListener( "keydown", function(e) {
    theme.play();
}, false);

//Background image
var bgReady=false;
var bgImage=new Image();

// After image is loaded
bgImage.onload = function() {
    bgReady = true;
};
bgImage.src = "images/background.png";

//Hero image
var heroReady = false;
var heroImage = new Image();

// After image is loaded
heroImage.onload=function(){
    heroReady=true;
};
heroImage.src = "images/hero.png";

//Monsteer image
var monsterReady = false;
var monsterImage = new Image();

// After image is loaded
monsterImage.onload = function(){
    monsterReady = true;
};

monsterImage.src = "images/monster.png";

var hero = {
    speed: 256 //movement in pixels per second
};

var monster = {};
var monstersCaught = 0

// Pressed keys
var keysDown = {};

addEventListener( "keydown", function(e) {
    keysDown[e.keyCode] = true;
}, false);

addEventListener( "keyup", function(e) {
    delete keysDown[e.keyCode];
}, false);

//Reset the game when the player catches a monster
var reset = function(){

    // Center hero on game start
    if (hero.x == undefined) {
      hero.x = (canvas.width / 2) - 16;
      hero.y = (canvas.height / 2) - 16;
    }
//Throw the monster somewhere on the screen randomly
   monster.x = Math.floor(32 + Math.random() * (canvas.width - 64 + 1 - 32));
   monster.y = Math.floor(32 + Math.random() * (canvas.height - 64 + 1 - 32));
};


//modifier
var update = function(modifier){
    if (38 in keysDown){
        //Player holding up
        hero.y -= hero.speed * modifier;
    }
    if (40 in keysDown){
        //Player holding down
        hero.y += hero.speed * modifier;
    }
    if (37 in keysDown){
        //Player holding left
        hero.x -= hero.speed * modifier;
    }
    if (39 in keysDown){
        //Player holding right
        hero.x += hero.speed * modifier;
    }

    // On border collision
    if (hero.x < 32) {
      hero.x = 32;
      border.play();
    }

    if (hero.y < 32) {
      hero.y = 32;
      border.play();
    }

    if (hero.x > canvas.width - 64) {
      hero.x = canvas.width - 64;
      border.play();
    }

    if (hero.y > canvas.height - 64) {
      hero.y = canvas.height - 64;
      border.play();
    }

    //are they touching?
    if(
        hero.x <= (monster.x + 32)
        &&monster.x <= (hero.x + 32)
        &&hero.y <= (monster.y + 32)
        &&monster. y<= (hero.y + 32)
    ){
        eat.play();
        ++monstersCaught;
        reset();

    }
};

//Draw everything
var render = function(){
    if (bgReady){
        ctx.drawImage(bgImage, 0, 0);
    }
    if (heroReady){
        ctx.drawImage(heroImage, hero.x, hero.y);
    }
    if (monsterReady){
        ctx.drawImage(monsterImage, monster.x, monster.y);
    }

    //score styles
    ctx.fillStyle = "rgb(250,250,250)";
    ctx.font = "24px Helvetica";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText("Goblins caught:" + monstersCaught, 32, 32);
};

var main = function(){
    var now = Date.now();

    var delta = now - then;

    //console.log(delta);
    update(delta / 1000);
    render();

    then = now;

    //Redraw again ASAP
    window.requestAnimationFrame(main);
};

// On start
var then = Date.now();
reset();
main();
