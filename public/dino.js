const socket = io();

//canvas
let canvas;
let canvasWidth = 750;
let canvasHeight = 250;
let context;

//dino
let dinoWidth = 60;
let dinoHeight = 78;
let dinoX = 50;
let dinoY = canvasHeight - dinoHeight;
let dinoImg;

let dino = {
  x: dinoX,
  y: dinoY,
  width: dinoWidth,
  height: dinoHeight,
};

//cactus
let cactusArray = [];

let cactus1Width = 34;
let cactus2Width = 69;
let cactus3Width = 102;

let cactusHeight = 70;
let cactusX = 700;
let cactusY = canvasHeight - cactusHeight;

let cactus1Img;
let cactus2Img;
let cactus3Img;

let velocityX = -8;
let velocityY = 0;
let gravity = 0.4;

let gameOver = false;
let score = 0;

window.onload = function () {
  canvas = document.getElementById("canvas");
  canvas.height = canvasHeight;
  canvas.width = canvasWidth;

  context = canvas.getContext("2d");

  dinoImg = new Image();
  dinoImg.src = "./img/dino.png";
  dinoImg.onload = function () {
    context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
  };

  rueImg = new Image();
  rueImg.src = "./img/rue.png";
  rueImg.onload = function () {
    context.drawImage(rueImg, 0, canvasHeight - 20, canvasWidth, 20);
  };

  cactus1Img = new Image();
  cactus1Img.src = "./img/cactus1.png";

  cactus2Img = new Image();
  cactus2Img.src = "./img/cactus2.png";

  cactus3Img = new Image();
  cactus3Img.src = "./img/cactus3.png";

  requestAnimationFrame(update);
  setInterval(placeCactus, 1000);
  socket.on("button clicked", () => {
    if (gameOver) {
    } else {
      if (dino.y == dinoY) {
        velocityY = -10;
      }
    }
  });
};
function update() {
  requestAnimationFrame(update);
  if (gameOver) {
    gameOver = false;
    score = 0;
    velocityY = 0;
    dino.y = dinoY;
    cactusArray = [];

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
    context.drawImage(rueImg, 0, canvasHeight - 20, canvasWidth, 20);
  }
  context.clearRect(0, 0, canvas.width, canvas.height);
  //dino
  velocityY += gravity;
  dino.y = Math.min(dino.y + velocityY, dinoY);
  context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
  context.drawImage(rueImg, 0, canvasHeight - 20, canvasWidth, 20);

  //cactus
  for (let i = 0; i < cactusArray.length; i++) {
    let cactus = cactusArray[i];
    cactus.x += velocityX;
    context.drawImage(
      cactus.img,
      cactus.x,
      cactus.y,
      cactus.width,
      cactus.height
    );

    if (detectCollision(dino, cactus)) {
      gameOver = true;
    }
  }

  context.fillStyle = "black";
  context.font = "20px courier";
  score++;
  context.fillText(score, 5, 20);
}

function moveDino(e) {
  if (gameOver) {
  }

  if ((e.code == "Space" || e.code == "ArrowUp") && dino.y == dinoY) {
    velocityY = -10;
  }
}

function placeCactus() {
  if (gameOver) {
    return;
  }

  let cactus = {
    img: null,
    x: cactusX,
    y: cactusY,
    width: null,
    height: cactusHeight,
  };

  let placeCactusChance = Math.random();
  console.log(placeCactusChance);
  if (placeCactusChance > 0.9) {
    //10% cactus3
    cactus.img = cactus3Img;
    cactus.width = cactus3Width;
    cactusArray.push(cactus);
  } else if (placeCactusChance > 0.7) {
    //30% cactus2
    cactus.img = cactus2Img;
    cactus.width = cactus2Width;
    cactusArray.push(cactus);
  } else if (placeCactusChance > 0.5) {
    //50% cactus1
    cactus.img = cactus1Img;
    cactus.width = cactus1Width;
    cactusArray.push(cactus);
  }

  if (cactusArray.length > 5) {
    cactusArray.shift();
  }
}

function detectCollision(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}
