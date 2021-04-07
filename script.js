var canvas, ctx, WIDTH, HEIGHT, FPS = 12, tileSize, playing;
var snake, playLabel, food, foodEaten, dirLocked, test;
var keys = {
    left: 37,
    up: 38,
    right: 39,
    down: 40,
    a: 65,
    w: 87,
    d: 68,
    s: 83
};

window.addEventListener("keydown", keyDown);
window.addEventListener("resize", resizeWindow);

function keyDown(e) {

    if (!playing && (e.keyCode == keys.up || e.keyCode == keys.down || e.keyCode == keys.left || e.keyCode == keys.right || e.keyCode == keys.w || e.keyCode == keys.s || e.keyCode == keys.a || e.keyCode == keys.d)) {
	playing = true;
    }

    if (!dirLocked) {
	if ((e.keyCode == keys.up || e.keyCode == keys.w) && snake.direction[1] != 1)
	    snake.direction = [0, -1];

	else if ((e.keyCode == keys.right || e.keyCode == keys.d) && snake.direction[0] != -1)
	    snake.direction = [1, 0];

	else if ((e.keyCode == keys.left || e.keyCode == keys.a) && snake.direction[0] != 1) 
	    snake.direction = [-1, 0];

	else if ((e.keyCode == keys.down || e.keyCode == keys.s) && snake.direction[1] != -1) 
	    snake.direction = [0, 1];

	dirLocked = true;
    }
}

function resizeWindow() {
    WIDTH = window.innerWidth;
    HEIGHT = window.innerHeight;

    canvas.width = WIDTH;
    canvas.height = HEIGHT;

    tileSize = Math.max(Math.floor(WIDTH/60),Math.floor(HEIGHT/60));

    if (tileSize == Math.floor(WIDTH/60))
	largMaior = true;
    else
	largMaior = false;
}

function isMobileDevice () {
    return /Android|iPhone|iPad|iPod|Windows Phone/i.test(navigator.userAgent);
}

function newGame () {
    snake = new Snake();
    playLabel = new PlayLabel();
    food = new Food();
    playing = false;
}

function PlayLabel() {  
    this.text;
    this.color = "#5d8357";

    this.messages = {
	pc: "Press the arrow keys to play"
    };

    if (isMobileDevice()) {

    }
    
    else {
	this.text = this.messages["pc"];
    }

    this.draw = function() {
	ctx.fillStyle = this.color;
	ctx.font = tileSize + "px Arial";
	ctx.fillText(this.text, WIDTH / 2 - ctx.measureText(this.text).width / 2, HEIGHT / 2);
    }
}

function Food() {
    var invalidPos;
    this.color = "#ff3333";
    this.position = [0, 0];
    this.nextPos = [0, 0];

    this.position[0] = (Math.floor(Math.random() * (Math.floor(WIDTH / tileSize) - 3)) + 1);
    this.position[1] = (Math.floor(Math.random() * (Math.floor(HEIGHT / tileSize) - 2)) + 1);

    this.update = function() {

	//Verifica se a cobra comeu a comida:

	if (snake.body[0][0] == this.position[0] && snake.body[0][1] == this.position[1]) {
	    foodEaten = true;

	    do {
		invalidPos = false;

		this.position[0] = (Math.floor(Math.random() * (Math.floor(WIDTH / tileSize) - 3)) + 1);
		this.position[1] = (Math.floor(Math.random() * (Math.floor(HEIGHT / tileSize) - 2)) + 1);

		//Verifica se a comida nasceu dentro da cobra:

		for (var k = 0; k < snake.body.length; k++) {
		    if (this.position[0] == snake.body[k][0] && this.position[1] == snake.body[k][1]) {
			invalidPos = true;
			break;
		    }
		}
	    } 
	    while (invalidPos);
	}
	else 
	    foodEaten = false;
    }

    this.draw = function() {
	ctx.fillStyle = this.color;

	ctx.fillRect(this.position[0] * tileSize, this.position[1] * tileSize, tileSize, tileSize);
    }
}

function  Snake() {
    this.body = [[10, 10], [10, 11], [10, 12], [10, 13]]; 
    this.color = "#000";
    this.direction = [0, -1];

    this.update = function() {
	var nextPos = [this.body[0][0] + this.direction[0], this.body[0][1] + this.direction[1]];

	//Cobra em modo espera:

	if (!playing) { 
	    if (this.direction[1] == -1 && nextPos[1] <= (HEIGHT / tileSize * 0.1))
		this.direction = [1, 0];

	    else if (this.direction[0] == 1 && nextPos[0] >= (WIDTH / tileSize * 0.9))
		this.direction = [0, 1];
	    
	    else if (this.direction[1] == 1 && nextPos[1] >= (HEIGHT / tileSize * 0.9))
		this.direction = [-1, 0];

	    else if (this.direction[0] == -1 && nextPos[0] <= (WIDTH / tileSize * 0.1))
		this.direction = [0, -1];
	}

	//Verifica se a cobra colidiu na parede:

	if (this.body[0][0] == 0 && this.direction[0] == -1) 
	    newGame();

	else if (this.body[0][1] == 0 && this.direction[1] == -1)
	    newGame();

	else if (this.body[0][0] == (Math.floor(WIDTH/tileSize) - 1) && this.direction[0] == 1)
	    newGame();

	else if (this.body[0][1] == (Math.floor(HEIGHT/tileSize))  && this.direction[1] == 1)
	    newGame();

	//Verifica se a cobra colidiu em si mesma:

	for (var j = 1; j < this.body.length; j++) {
	    if (this.body[0][0] == this.body[j][0] &&  this.body[0][1] == this.body[j][1])
		newGame();
	}
	
	//Retira o último tile da cobra e acrescenta o novo:

	if (!foodEaten) {
	    this.body.pop();
	}

	this.body.splice(0, 0, nextPos);

	dirLocked = false;
    }

    this.draw = function() {
	ctx.fillStyle = this.color;

	for (var i = 0; i < this.body.length; i++)
	    ctx.fillRect(this.body[i][0] * tileSize, this.body[i][1] * tileSize, tileSize, tileSize);
    }   
    
}

function init() {
    canvas = document.createElement("canvas");
    resizeWindow();
    document.body.appendChild(canvas);
    ctx = canvas.getContext("2d");   

    newGame();
    run();
}

function update() {
    snake.update();
    food.update();
}

function run() {
    update();
    draw();
    setTimeout(run, 1000/FPS);
}

function draw() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    food.draw();
    snake.draw(); 
    if (test == true) {
	ctx.fillRect((Math.floor(Math.random() * (Math.floor(WIDTH / tileSize) - 3)) + 1) * tileSize, (Math.floor(Math.random() * (Math.floor(HEIGHT / tileSize) - 2)) + 1) * tileSize, tileSize, tileSize);
    }

    if (!playing) 
	playLabel.draw();            
}

init();
