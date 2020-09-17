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

let keys = [];



requestAnimationFrame(main);

function main() {
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, cnv.width, cnv.height); // Reset grid drawing to draw next frame

  playerMovement();

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
