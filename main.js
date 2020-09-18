// JAVASCRIPT

// Set up Canvas
let cnv = document.getElementById("mainCanvas");
let ctx = cnv.getContext("2d");
cnv.width = 500;
cnv.height = 700;

// Player Object
let player = {
  x: 250,
  y: 350,
  r: 15,
  speed: 5,
  xSpd: 0
}

// Bullet array
let bullets = [];

for(let i = 0; i < 9; i++) {
//  addBullet((i * 50) + 50, 50, 5, player, 3);
  
  bullets.push([50 * (i + 1), 50, 5, 0, 0, 3]);
}

setTimeout(() => setBulletDirection(), 1000);
setInterval(() => {
//  for(let i = 0; i < 4; i++) {
  let angle = Math.atan2(player.y - 150, player.x - 150)
  console.log(angle);
  
  addBullet(150, 150, 5, player, 3);
  // setTimeout(() => addBullet(150, 150, 5, angle, 3), 100);
  // setTimeout(() => addBullet(150, 150, 5, angle, 3), 200);
  // setTimeout(() => addBullet(150, 150, 5, angle, 3), 300);
//  }
}, 1500);

let keys = [];


requestAnimationFrame(main);

function main() {
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, cnv.width, cnv.height); // Reset grid drawing to draw next frame

  playerMovement();
  
  bulletLogic();

  requestAnimationFrame(main);
}



function playerMovement() {
  // Logic


  // Movement
  if(keys.includes("ShiftLeft")) { // If player hits lShift then slow down player
    player.speed = 2.5;
  }

  // Standard Player movement. if player press button, move player.
  if(keys.includes("ArrowRight")) {
    player.x += player.speed;
  } 
  if(keys.includes("ArrowLeft")) {
    player.x -= player.speed;
  }
  if(keys.includes("ArrowUp")) {
    player.y -= player.speed;
  }
  if(keys.includes("ArrowDown")) {
    player.y += player.speed;
  }

  player.speed = 5; // Reset player speed (Incase player stops holding lShift)

  // Keep player in grid by constraining playerx and playery in the canvas space
  player.y = constrain(0, cnv.height, player.y);
  player.x = constrain(0, cnv.width, player.x);


  // Draw a player
  ctx.fillStyle = "#ffb7c5";
  fillCircle(player.x, player.y, player.r);
  strokeCircle(player.x, player.y, player.r);
  if(keys.includes("ShiftLeft")) {
    ctx.fillStyle = "white";
    fillCircle(player.x, player.y, 3);
  }  
}

function bulletLogic() {
  ctx.fillStyle = "white"
  // Draw bullets
  for(let i = 0; i < bullets.length; i++) {
    fillCircle(bullets[i][0], bullets[i][1], bullets[i][2]);
    strokeCircle(bullets[i][0], bullets[i][1], bullets[i][2]);
    bullets[i][0] += bullets[i][3] * bullets[i][5];
    bullets[i][1] += bullets[i][4] * bullets[i][5];

    if(bullets[i][1] > cnv.height + 5) {
      bullets.splice(i, 1);
      i--;
    } else if(bullets[i][0] > cnv.width + 5) {
      bullets.splice(i, 1);
      i--;
    }
  }

  // Draw basic enemy
  fillCircle(150, 150, 10);
  strokeCircle(150, 150, 10);

  
}

function setBulletDirection() {
  console.log("yeet");

  for(let i = 0; i < bullets.length; i++) {
    bullets[i][3] = Math.cos(Math.atan2(player.y - bullets[i][1], player.x - bullets[i][0]));
    bullets[i][4] = Math.sin(Math.atan2(player.y - bullets[i][1], player.x - bullets[i][0]));
  }
}

function addBullet(x, y, r, angle, spd) {
  console.log(angle);
  let xAngle = 0;
  let yAngle = 0;
  if(angle == player) {
    xAngle = Math.cos(Math.atan2(player.y - y, player.x - x));
    yAngle = Math.sin(Math.atan2(player.y - y, player.x - x));
  } else {
    xAngle = Math.cos(toRadians(angle));
    yAngle = Math.sin(toRadians(angle));
  }
  console.log(xAngle + ", " + yAngle);
  bullets.push([x, y, r, xAngle, yAngle, spd]);
}

function addMultipleBullets(x, y) {
  
}

// Math Helper Functions
function constrain(min, max, int) {
  // returns a number constrained in min and max
  if(int > max) {
    return max;
  } else if(int < min) {
    return min;
  } else {
    return int;
  }
}

function toDegrees(radians) {
  return radians * (180 / Math.PI);
}

function toRadians(degrees) {
  return degrees / (180 / Math.PI);
}

// Event Listeners and Functions

document.addEventListener("keydown", handleKeyAction);
document.addEventListener("keyup", handleKeyAction);

// When player presses or releases a key add or remove it to an array.
function handleKeyAction(event) {
  if(event.type === "keydown" && !keys.includes(event.code)) {
    keys.push(event.code);
  }
  if(event.type === "keyup") {
    for(let i = 0; i < keys.length; i++) {
      if(keys[i] === event.code) {
        keys.splice(i, 1);
        break;
      }
    }
  }
  
}
