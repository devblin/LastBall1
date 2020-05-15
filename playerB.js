// 'use strict'
let gamePieceB;
function startGameB() {
    gameAreaB.startB();
    gamePieceB = new gameBallB(200, gameAreaB.canvasB.height -  250, ballColorB); 
}
//........GAME AREA LOAD.........//
let gameAreaB = {
    canvasB : document.createElement('canvas'),
    startB : function() {
        this.canvasB.width = 400;
        this.canvasB.height = window.innerHeight;
        this.canvasB.style.backgroundColor = 'rgb(59, 59, 59)';
        this.context = this.canvasB.getContext('2d');
        document.body.insertBefore(this.canvasB, document.body.childNodes[1]);
        requestAnimationFrame(updategameAreaB);
        document.addEventListener('keydown', function (e) {
            gameAreaB.keys = (gameAreaB.keys || []);
            gameAreaB.keys[e.keyCode] = true;
        })
        document.addEventListener('keyup', function (e) {
            gameAreaB.keys[e.keyCode] = false;
        })
    },
    clear: function() {
        this.context.clearRect(0, 0, this.canvasB.width, this.canvasB.height);
    }
}
//.........BALLS....................................................................................//
let byB = 200;
let dyB = 0 ;
let distanceB = 0;

let bIB = Math.floor(Math.random() * 4);
let ballColorB = color[bIB];

function gameBallB(x, y, color) {
    this.canvasHeightB = gameAreaB.canvasB.height;
    this.x = x;
    this.color = color;
    this.y = y;    
    ctxB = gameAreaB.context;
    this.update = function(){
        ctxB.beginPath();
        ctxB.arc(this.x, this.y, 10, 0, 2*Math.PI);
        ctxB.fillStyle = this.color;
        ctxB.fill();
        ctxB.closePath();
    //...........BALL - A...............
        let xB = dyB;
        if (gameAreaB.keys && gameAreaB.keys[38]) {
            dyB = 2;
            distanceB = 0;
        }
        if(gamePieceB.y < Math.floor(gamePieceB.canvasHeightB/2)) {     
            byB += 8;   
        } 
        if((gamePieceB.y >= gamePieceB.canvasHeightB - 15) && (gamePieceB.y <= gamePieceB.canvasHeightB - 13)) {
            dyB = 0;
        }
        if((distanceB == 8) || (gamePieceB.y < Math.floor(gamePieceB.canvasHeightB/2))) {     
            dyB = -1;     
        }
        gamePieceB.y -= 3*xB; 
        distanceB++;
    }
}

//........................OBSTACLES.........................//
let cB = 0;
var angleB = 0;
let ObstaclesB = [
    function circleObsB (x, by,r, distanceObs, d) {
        this.r = r;
        this.direction = d;
        this.distanceObs = distanceObs;
        this.x = x;
        this.y = by + this.distanceObs;
        ctxB.save();
        ctxB.translate(this.x,this.y);
        ctxB.rotate(this.direction*cB*Math.PI/180);
        ctxB.translate(-this.x,-this.y);
        for(var i = 0; i <= 3; i++) {
            ctxB.beginPath();
            ctxB.arc(this.x, this.y, this.r, (0 + angleB)*Math.PI/180, (90 + angleB)*Math.PI/180);
            angleB += 90;
            ctxB.lineWidth = 20;
            ctxB.strokeStyle = color[i];
            ctxB.stroke();
            ctxB.closePath();
        }
        ctxB.restore();
    },
    function plusObsB (x, by, r, distanceObs, d) {
        this.r = r;
        this.direction = d;
        this.distanceObs = distanceObs;
        this.y = by + distanceObs;
        this.x = x + this.r/1.3*this.direction;
        ctxB.save();
        ctxB.translate(this.x,this.y);
        ctxB.rotate(this.direction*cB*Math.PI/180);
        ctxB.translate(-this.x,-this.y);
        for(var i = 0; i <= 3; i++) {
            ctxB.beginPath();
            ctxB.translate(this.x, this.y);
            ctxB.rotate(angleB*Math.PI/180);
            ctxB.translate(-this.x, -this.y);
            angleB += 90;
            ctxB.moveTo(this.x - this.r, this.y);
            // this.parts == 2 ? ctx.lineTo(this.x + this.r, this.y) : ctx.lineTo(this.x, this.y);
            ctxB.lineTo(this.x, this.y)
            ctxB.lineCap = "round";
            ctxB.lineWidth = 20;
            ctxB.strokeStyle = color[i];
            ctxB.stroke();
            ctxB.closePath();
        }
        ctxB.restore();
    }
];
let rgb3;
let rgb4;
let pixel3;
let pixel4;

function collisionB() {
    pixel3 = ctxB.getImageData(gamePieceB.x - 3, gamePieceB.y - 2, 6, 1).data;
    pixel4 = ctxB.getImageData(gamePieceB.x - 3, gamePieceB.y + 2, 6, 1).data;

    rgb3 = 'rgb(' + pixel3[0] + ', ' + pixel3[1] +', ' + pixel3[2] +')';
    rgb4 = 'rgb(' + pixel4[0] + ', ' + pixel4[1] +', ' + pixel4[2] +')';
    
    if(rgb3 != rgb || rgb4 != rgb) {
        if((pixel3[0] >= rMin[bIB] && pixel3[1] >= gMin[bIB] && pixel3[2] >= bMin[bIB] && pixel3[0] <= rMax[bIB] && pixel3[1] <= gMax[bIB] && pixel3[2] <= bMax[bIB]) || (pixel4[0] >= rMin[bIB] && pixel4[1] >= gMin[bIB] && pixel4[2] >= bMin[bIB] && pixel4[0] <= rMax[bIB] && pixel4[1] <= gMax[bIB] && pixel4[2] <= bMax[bIB])) {
            gameRunning = gameRunning;
        }
        else {
            gameRunning = !gameRunning;
            gameOver.style.display = 'flex';
            playerB.innerHTML = 'You Lost';
            playerB.style.color = 'red';
            playerA.innerHTML = 'You Won';
            playerA.style.color = 'green';
        }
    }
}

function gamePauseB() {
    gameRunningB = !gameRunningB;
    if(gameRunningB) {
        updateGameAreaB();
    }
}
//....................UPDATE GAME AREA...........................
var iB = 0;
var jB = 0;
var rB = 0;
var direcTypeB = [];
var obsTypeB = [];
var radTypeB = []; 
var disTypeB = [];
var myArrB = [0,1,2,3];
var someArrB = [1,-1];
var tB = 4;
for(var k = 0; k < myArrB.length; k++) {
    jB = Math.floor(Math.random() * 2);
    rB = Math.floor(Math.random() * (151 - 90)) + 90;
    direcTypeB.push(someArrB[jB]);
    obsTypeB.push(jB);
    radTypeB.push(rB); 
    disTypeB.push(iB);
    iB -= 450;
}
function updategameAreaB() {
    gameAreaB.clear();
    if(ObstaclesB.y > -10) {
        direcTypeB.shift();
            direcTypeB.push(someArrB[jB]);
        obsTypeB.shift();
            obsTypeB.push(Math.floor(Math.random() * 2));
        radTypeB.shift();
            radTypeB.push(Math.floor(Math.random() * (151 - 90)) + 90);
        disTypeB.shift();
            disTypeB.push(iB);
        iB -= 450;
    }
    //....PLAYER - A
    for(var k = 0; k < myArrB.length; k++) {
        ObstaclesB[obsTypeB[myArrB[k]]](gamePieceB.x, byB, radTypeB[myArrB[k]], disTypeB[myArrB[k]], direcTypeB[myArrB[k]]);
    }
    if(ObstaclesB.y > 0) {   
        myArrB.shift();  
        myArrB.push(tB);  
        tB++;    
    }
    cB += 1;
    if(cB == 360) {  
        cB = 0; 
    }
    if(angleB == 360) {  
        angleB = 0; 
    }
    collisionB();
    gamePieceB.update();
    if(gameRunning) { 
    requestAnimationFrame(updategameAreaB);
    }
}
