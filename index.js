let homePage = document.getElementById('main');
let homeBut = document.getElementById('home');
let pauseBut = document.getElementById('pause');
let pausePage = document.getElementById('game-paused');
let gameTrack = document.getElementById('LastBallSong');
let gameTap = document.getElementById('balltap');
let gameOver = document.getElementById('gameover');
let overMessage = document.getElementById('game-over');
let screenWidth = window.innerWidth > 600 ? 540 : window.innerWidth;
let screenWidthStyle = 'width:'+String(screenWidth)+'px';
homePage.style.cssText = screenWidthStyle;
pauseBut.style.cssText = screenWidthStyle;
homeBut.style.cssText = screenWidthStyle;
pausePage.style.cssText  = screenWidthStyle;
overMessage.style.cssText = screenWidthStyle;

function Over() {
    gameOver.play();
    overMessage.style.display = 'flex';
    pauseBut.style.display = 'none';
    homeBut.style.display = 'flex';
}
function trackPlay() {
    gameTrack.play();
    gameTrack.loop = true;
}
function gameStart() {
    homePage.style.display = 'none';
    pauseBut.style.display = 'flex';
}
function gamePaused() {
    pausePage.style.display = 'flex';
    homeBut.style.display = 'flex';
    pauseBut.style.display = 'none';
}
function gameResumed() {
    pausePage.style.display = 'none';
    homeBut.style.display = 'none';
    pauseBut.style.display = 'flex';
}
function mainMenu() {
    window.location.reload();
}
//++++++++++++++++++LOGIC++++++++++++++++++++//
var gamePiece;
function startGame() {
    gameArea.start(); 
    gamePiece = new gameBall(); 
}
//........GAME AREA LOAD.........//
let gameArea = {
    canvas : document.createElement('canvas'),
    start : function() {
        this.canvas.width = window.innerWidth > 600 ? 540 : window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.canvas.style.backgroundColor = 'rgb(59, 59, 59)';
        this.context = this.canvas.getContext('2d');
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        requestAnimationFrame(updateGameArea);
    },
    clear: function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}
//........GAMEBALL.........//
let color = ['rgb(255, 215, 0)','rgb(110, 15, 179)','rgb(255, 20, 147)','rgb(0, 191, 255)'];
let c = 0;
let by = 200;
let dy = 0 ;
let distance = 0;
let ctx;
function gameBall() {
    ctx = gameArea.context;
    this.canvasHeight = gameArea.canvas.height;
    this.x = (gameArea.canvas.width)/2;
    this.y = gameArea.canvas.height -  250;
    this.r = 10;
    this.color = color[Math.floor(Math.random() * 4)];
    this.update = function() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, 10, 0, 2*Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
        let x = dy;
        document.addEventListener('click', function() {
            gameTap.play();
            dy = 2; 
            distance = 0;
        });
        if(this.y < Math.floor(this.canvasHeight/2)) {     
            by += 8;   
            score++;
        } 
        if((this.y >= this.canvasHeight - 15) && (this.y <= this.canvasHeight - 13)) {
            dy = 0;
        }
        if((distance == 8) || (this.y < Math.floor(this.canvasHeight/2))) {     
            dy = -1;     
        }
        this.y -= 4*x; 
        distance += 1;
    }
}
//........OBSTACLES.........//
var angle = 0;
let Obstacles = [
    function circleObs (r, distanceObs, d) {
        this.r = r;
        this.direction = d;
        this.distanceObs = distanceObs;
        this.x = gameArea.canvas.width/2;
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
    function plusObs (r, distanceObs, d) {
        this.r = r;
        this.direction = d;
        this.distanceObs = distanceObs;
        this.y = by + distanceObs;
        this.x = gameArea.canvas.width/2 + this.r/1.3*this.direction;
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
            ctx.lineWidth = 20;
            ctx.strokeStyle = color[i];
            ctx.stroke();
            ctx.closePath();
        }
        ctx.restore();
    }
];
//.......SCORE........//
var highScore = JSON.parse(localStorage.getItem('CSH')) || [];
let text;
function gameScore() {
    text = score;
    ctx.font = "50px" + " " + "monospace";;
    ctx.fillStyle = "whitesmoke";
    ctx.fillText(text, 20, 60);
}
//............COLLISION...............//
let rgb = 'rgb(0, 0, 0)';
let pixel1;
let rgb1;
var gameRunning = true;
function collision() {
    pixel1 = ctx.getImageData(gamePiece.x, gamePiece.y - 15, 1, 30).data;
    rgb1 = 'rgb(' + pixel1[0] + ', ' + pixel1[1] +', ' + pixel1[2] +')';
    if(rgb1 != rgb) {
        if(rgb1 == gamePiece.color) {
            gameRunning = gameRunning;
        }
        else {
            gameRunning = !gameRunning;
            Over();
            highScore.push(score);
            highScore.sort(function(a, b){return b - a;});
            highScore.splice(5);
            localStorage.setItem('CSH',JSON.stringify(highScore));
        }
    }
}
//..............GAME PAUSE...........//
function gamePause() {
    gameRunning = !gameRunning;
    if(gameRunning) {
        updateGameArea();
    }
}
//////........UPDATING GAME AREA........../////////
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
var score = 0;
for(var k = 0; k < myArr.length; k++) {
    j = Math.floor(Math.random() * 2);
    r = Math.floor(Math.random() * (151 - 90)) + 90;
    direcType.push(someArr[j]);
    obsType.push(j);
    radType.push(r); 
    disType.push(i);
    i -= 400;
}
//.................UPDATE GAME AREA....................//
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
            i -= 400;
        }
        for(var k = 0; k < myArr.length; k++) {
            Obstacles[obsType[myArr[k]]](radType[myArr[k]], disType[myArr[k]], direcType[myArr[k]]);
        }
        if(Obstacles.y > 0) {
            myArr.shift();
            myArr.push(t);
            t++;
        }
        gameScore();
        c += 1;
        if(c == 360) {  c = 0; }
        if(angle == 360) {  angle = 0; }
        collision();
    gamePiece.update();
    if(gameRunning) {
        requestAnimationFrame(updateGameArea);
    }
}
highScore.length != 0 ? document.querySelector('#high-score div').innerHTML = highScore[0] : document.querySelector('#high-score div').innerHTML = 'No Score';
