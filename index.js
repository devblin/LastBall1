let homePage = document.getElementById('main');
let homeBut = document.getElementById('home');
let pauseBut = document.getElementById('pause');
let pauseMain = document.getElementById('pause-main');
let pausePage = document.getElementById('game-paused');
let gameTap = document.getElementById('balltap');
let gameOver = document.getElementById('gameover');
let overMessage = document.getElementById('game-over');
let showHighScore = document.querySelector('#high-score div');
let screenWidth = window.innerWidth > 600 ? 540 : window.innerWidth;
let screenWidthStyle = 'width:' + String(screenWidth) + 'px';

pauseMain.style.cssText = screenWidthStyle;
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
    pauseMain.style.cssText = 'z-index:4';
}
function gameStart() {
    homePage.style.display = 'none';
    pauseBut.style.display = 'flex';
}
function gameResumed() {
    pausePage.style.display = 'none';
    homeBut.style.display = 'none';
    pauseBut.style.display = 'flex';
    pauseMain.style.cssText = 'z-index:2';
}
function gamePaused() {
    pausePage.style.display = 'flex';
    homeBut.style.display = 'flex';
    pauseBut.style.display = 'none';
    pauseMain.style.cssText = 'z-index:4';
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
        this.canvas.width = screenWidth;
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
let bI = Math.floor(Math.random() * 4);
let ballColor = color[bI];
function gameBall() {
    ctx = gameArea.context;
    this.canvasHeight = gameArea.canvas.height;
    this.x = (gameArea.canvas.width)/2;
    this.y = gameArea.canvas.height -  250;
    this.color = ballColor;
    ctx.beginPath();
    this.update = function() {
        ctx.arc(this.x, this.y, 10, 0, 2*Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();
        let x = dy;
        document.addEventListener('click',function() {
            gameTap.play();
            dy = 2;
            distance = 0;
        })
        if(gamePiece.y < Math.floor(gamePiece.canvasHeight/2)) {     
            by += 8;   
            score++;
        } 
        if((gamePiece.y >= gamePiece.canvasHeight - 15) && (gamePiece.y <= gamePiece.canvasHeight - 13)) {
            dy = 0;
        }
        if((distance == 11) || (gamePiece.y < Math.floor(gamePiece.canvasHeight/2))) {     
            dy = -1;     
        }
        gamePiece.y -= 3*x; 
        distance++;
    }
    ctx.closePath();
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
            ctx.lineCap = "round";
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
highScore.sort(function(a, b){return b - a;});
highScore.splice(5);
function gameScore() {
    ctx.font = "50px" + " " + "monospace";;
    ctx.fillStyle = "whitesmoke";
    ctx.fillText(score, 20, 60);
}
//............COLLISION...............//
let rgb = 'rgb(0, 0, 0)';
let pixel1;
let pixel2;
let rgb1;
let rgb2;
let rMax = [255, 170, 255, 117];
let gMax = [255, 40, 100, 220];
let bMax = [100, 200, 162, 255];
let rMin = [220, 72, 200, 0];
let gMin = [183, 0, 0, 138];
let bMin = [0, 100, 100, 184];
var gameRunning = true;
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
            Over();
            highScore.push(score);
            localStorage.setItem('CSH',JSON.stringify(highScore));
        }
    }
}
//..............GAME COMPONENTS.................//
function multiColorBall() {
    bW = gameArea.canvas.width/2;
    bH = luck + by;
    this.image = new Image();
    this.image.src = 'IconAndSound/ball.svg';
    ctx.drawImage(this.image, bW - 10, bH, 20, 20); 
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
    i -= 450;
}
var luck = 0;
//.................UPDATE GAME AREA....................//
function updateGameArea() {
    gameArea.clear();
    multiColorBall();
    if(gamePiece.y - bH >= 35 && gamePiece.y - bH <= 50) {
        gamePiece.color = color[Math.floor(Math.random() * 4)];
        bI = color.indexOf(gamePiece.color);
        luck -= 900;
    }
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
    for(var k = 0; k < myArr.length; k++) {
        Obstacles[obsType[myArr[k]]](radType[myArr[k]], disType[myArr[k]], direcType[myArr[k]]);
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
    gameScore();
    gamePiece.update();
    if(gameRunning) {
        requestAnimationFrame(updateGameArea);
    }
}
showHighScore.innerHTML = highScore.length != 0 ?  highScore[0] : 'No Score';
