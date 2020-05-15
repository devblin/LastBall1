let gamePiece;
function startGame() {
    gameArea.start();
    gamePiece = new gameBall(200, gameArea.canvas.height -  250, ballColor); 
}
//........GAME AREA LOAD.........//
let gameArea = {
    canvas : document.createElement('canvas'),
    start : function() {
        this.canvas.width = 400;
        this.canvas.height = window.innerHeight;
        this.canvas.style.backgroundColor = 'rgb(59, 59, 59)';
        this.context = this.canvas.getContext('2d');
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        requestAnimationFrame(updateGameArea);
        window.addEventListener('keydown', function (e) {
            gameArea.keys = (gameArea.keys || []);
            gameArea.keys[e.keyCode] = true;
        })
        window.addEventListener('keyup', function (e) {
            gameArea.keys[e.keyCode] = false;
        })
    },
    clear: function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}
//.........BALLS....................................................................................//
let by = 200;
let dy = 0 ;
let distance = 0;

let bI = Math.floor(Math.random() * 4);
let ballColor = color[bI];

function gameBall(x, y, color) {
    this.canvasHeight = gameArea.canvas.height;
    this.x = x;
    this.color = color;
    this.y = y;    
    ctx = gameArea.context;
    this.update = function(){
        ctx.beginPath();
        ctx.arc(this.x, this.y, 10, 0, 2*Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    //...........BALL - A...............
        let x = dy;
        if (gameArea.keys && gameArea.keys[87]) {
            dy = 2;
            distance = 0;
        }
        if(gamePiece.y < Math.floor(gamePiece.canvasHeight/2)) {     
            by += 8;   
        } 
        if((gamePiece.y >= gamePiece.canvasHeight - 15) && (gamePiece.y <= gamePiece.canvasHeight - 13)) {
            dy = 0;
        }
        if((distance == 8) || (gamePiece.y < Math.floor(gamePiece.canvasHeight/2))) {     
            dy = -1;     
        }
        gamePiece.y -= 3*x; 
        distance++;
    }
}
//........................OBSTACLES.........................//
let c = 0;
var angle = 0;
let Obstacles = [
    function circleObs (x, by,r, distanceObs, d) {
        this.r = r;
        this.direction = d;
        this.distanceObs = distanceObs;
        this.x = x;
        this.y = by + this.distanceObs;
        ctx.save();
        ctx.translate(this.x,this.y);
        ctx.rotate(this.direction*c*Math.PI/180);
        ctx.translate(-this.x,-this.y);
        for(var i = 0; i <= 3; i++) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, (0 + angle)*Math.PI/180, (90 + angle)*Math.PI/180);
            angle += 90;
            ctx.lineWidth = 20;
            ctx.strokeStyle = color[i];
            ctx.stroke();
            ctx.closePath();
        }
        ctx.restore();
    },
    function plusObs (x, by, r, distanceObs, d) {
        this.r = r;
        this.direction = d;
        this.distanceObs = distanceObs;
        this.y = by + distanceObs;
        this.x = x + this.r/1.3*this.direction;
        ctx.save();
        ctx.translate(this.x,this.y);
        ctx.rotate(this.direction*c*Math.PI/180);
        ctx.translate(-this.x,-this.y);
        for(var i = 0; i <= 3; i++) {
            ctx.beginPath();
            ctx.translate(this.x, this.y);
            ctx.rotate(angle*Math.PI/180);
            ctx.translate(-this.x, -this.y);
            angle += 90;
            ctx.moveTo(this.x - this.r, this.y);
            // this.parts == 2 ? ctx.lineTo(this.x + this.r, this.y) : ctx.lineTo(this.x, this.y);
            ctx.lineTo(this.x, this.y)
            ctx.lineCap = "round";
            ctx.lineWidth = 20;
            ctx.strokeStyle = color[i];
            ctx.stroke();
            ctx.closePath();
        }
        ctx.restore();
    }
];
let pixel1;
let pixel2;
let rgb1;
let rgb2;

function collision() {
    pixel1 = ctx.getImageData(gamePiece.x - 3, gamePiece.y - 2, 6, 1).data;
    pixel2 = ctx.getImageData(gamePiece.x - 3, gamePiece.y + 2, 6, 1).data;

    rgb1 = 'rgb(' + pixel1[0] + ', ' + pixel1[1] +', ' + pixel1[2] +')';
    rgb2 = 'rgb(' + pixel2[0] + ', ' + pixel2[1] +', ' + pixel2[2] +')';
    
    if(rgb1 != rgb || rgb2 != rgb) {
        if((pixel1[0] >= rMin[bI] && pixel1[1] >= gMin[bI] && pixel1[2] >= bMin[bI] && pixel1[0] <= rMax[bI] && pixel1[1] <= gMax[bI] && pixel1[2] <= bMax[bI]) || (pixel2[0] >= rMin[bI] && pixel2[1] >= gMin[bI] && pixel2[2] >= bMin[bI] && pixel2[0] <= rMax[bI] && pixel2[1] <= gMax[bI] && pixel2[2] <= bMax[bI])) {
            gameRunning = gameRunning;
        }
        else {
            gameRunning = !gameRunning;
            gameOver.style.display = 'flex';
            playerA.innerHTML = 'You Lost';
            playerA.style.color = 'red';
            playerB.innerHTML = 'You Won';
            playerB.style.color = 'green';
        }
    } 
}

function gamePause() {
gameRunning = !gameRunning;
gameRunningB = !gameRunningB;
if(gameRunning) {
    updateGameArea();
}
if(gameRunningB) {
    updateGameAreaB();
}
}
//....................UPDATE GAME AREA...........................
var i = 0;
var j = 0;
var r = 0;
var direcType = [];
var obsType = [];
var radType = []; 
var disType = [];
var myArr = [0,1,2,3];
var someArr = [1,-1];
var t = 4;
for(var k = 0; k < myArr.length; k++) {
    j = Math.floor(Math.random() * 2);
    r = Math.floor(Math.random() * (151 - 90)) + 90;
    direcType.push(someArr[j]);
    obsType.push(j);
    radType.push(r); 
    disType.push(i);
    i -= 450;
}
function updateGameArea() {
    gameArea.clear();
    if(Obstacles.y > -10) {
        direcType.shift();
            direcType.push(someArr[j]);
        obsType.shift();
            obsType.push(Math.floor(Math.random() * 2));
        radType.shift();
            radType.push(Math.floor(Math.random() * (151 - 90)) + 90);
        disType.shift();
            disType.push(i);
        i -= 450;
    }
    //....PLAYER - A
    for(var k = 0; k < myArr.length; k++) {
        Obstacles[obsType[myArr[k]]](gamePiece.x, by, radType[myArr[k]], disType[myArr[k]], direcType[myArr[k]]);
    }
    if(Obstacles.y > 0) {   
        myArr.shift();  
        myArr.push(t);  
        t++;    
    }
    c += 1;
    if(c == 360) {  
        c = 0; 
    }
    if(angle == 360) {  
        angle = 0; 
    }
    collision();
    gamePiece.update();
    if(gameRunning) {
        requestAnimationFrame(updateGameArea);
    }
}
