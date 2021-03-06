// JAVASCRIPT

// Set up Canvas
let cnv = document.getElementById("mainCanvas");
let ctx = cnv.getContext("2d");
cnv.width = 400;
cnv.height = 600;

// Player Object
let player = {
  x: 200,
  y: 350,
  r: 15,
  speed: 5,
  xSpd: 0,
  lives: 3,
  score: 0,
  invincible: false
}

let hit;
let finalScore = 0;

let cheats = {
  konami: false, // 30 lives + 5s invincibility if not invincible rn
  starman: false
}

// Bullet array
let bullets = [];


// for(let i = 0; i < 9; i++) {
// //  addBullet((i * 50) + 50, 50, 5, player, 3);
  
//   bullets.push([50 * (i + 1), 50, 5, 0, 0, 3]);
// }


//setTimeout(() => setBulletDirection(), 1000);
// setInterval(() => {
// //  for(let i = 0; i < 4; i++) {
//   addMultipleBullets(150, 150, 4);
//   addMultipleBullets(350, 150, 4);
// //  }
// }, 1500);

//setInterval(spirals, 3650);
// setInterval(() => {
//   addMultipleBullets(250, 150, 7);
// }, 4000);


let keys = [];
let code = [];
let stage = 0;

let colors = ["crimson", "DarkOrange", "Gold", "GreenYellow", "Blue", "Indigo", "Violet"];

let x1 = 0;

requestAnimationFrame(main);

function main() {
  if(player.lives > 0) { // if game is running & player is alive
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, cnv.width, cnv.height); // Reset grid drawing to draw next frame

    playerMovement();
    
    bulletLogic();

    collision();
    
    if(stage == 0) {
      let rand = Math.random()
      stage = -1;
      if(rand > 0.66) {
        stage = 1;
      } else if(rand > 0.33) {
        stage = 2;
      } else {
        stage = 3;
      }
      console.log("stage change");
    }

    if(player.lives > 0) {
      player.score += 1;
      document.getElementById("score").innerHTML = player.score;
    }
    
    if(code.join() == ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "KeyB", "KeyA"].join()
    && cheats.konami == false) {
      console.log("yeet");
      player.lives = 30;
      document.getElementById("lives").innerHTML = player.lives;
      player.invincible = true;
      if(player.invincible = true) {
        clearTimeout(hit);
      }
      setTimeout(() => {player.invincible = false;}, 5000);
      cheats.konami = true;
    } else if(code.join() == ["KeyS", "KeyT", "KeyO", "KeyP", "KeyA", "KeyN", "KeyD", "KeyA", "KeyW", "KeyE"]
    && cheats.starman == false) {
      if(player.invincible = true) {
        clearTimeout(hit);
      }
      player.invincible = true;
      setTimeout(() => {player.invincible = false;}, 30000);
      cheats.starman = false;
    }

    // if(stage == 0) {
    //   stage = -1;
    //   let rand = Math.random();
    //   if(rand < 0.5) {
    //     stage = 1;
    //   } else {
    //     stage = 2;
    //   }
    // }

    spirals();
    homeCircles();
    carousel();
  } else {
    gameOver();
  }
  

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
  if(!player.invincible) {
    ctx.fillStyle = "#ffb7c5";
    fillCircle(player.x, player.y, player.r);
    strokeCircle(player.x, player.y, player.r);
    if(keys.includes("ShiftLeft")) {
      ctx.fillStyle = "white";
      fillCircle(player.x, player.y, 3);
    }  
  } else {
    if(Date.now() % 2 == 0) {
      ctx.fillStyle = "#ffb7c5";
      fillCircle(player.x, player.y, player.r);
      strokeCircle(player.x, player.y, player.r);
      if(keys.includes("ShiftLeft")) {
        ctx.fillStyle = "white";
        fillCircle(player.x, player.y, 3);
      }  
    }
  }
}

function bulletLogic() {
  
  // Draw bullets
  for(let i = 0; i < bullets.length; i++) {
    ctx.fillStyle = bullets[i][7];
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
    } else if(bullets[i][0] < 0) {
      bullets.splice(i, 1);
      i--;
    } else if(bullets[i][1] < 0) {
      bullets.splice(i, 1);
      i--;
    }
  }

  // Draw basic enemy
  //strokeCircle(100, 100, 10);

  //strokeCircle(300, 100, 10);

  
}

function setBulletDirection() {
  console.log("yeet");

  for(let i = 0; i < bullets.length; i++) {
    bullets[i][3] = Math.cos(Math.atan2(player.y - bullets[i][1], player.x - bullets[i][0]));
    bullets[i][4] = Math.sin(Math.atan2(player.y - bullets[i][1], player.x - bullets[i][0]));
  }
}

function addBullet(x, y, r, angle, spd, type, color) { // n = normal
  let xAngle = 0;                               // h = starts normal, but can be set to target player
  let yAngle = 0;
  if(angle == player) { // angle = at player
    xAngle = Math.cos(Math.atan2(player.y - y, player.x - x));
    yAngle = Math.sin(Math.atan2(player.y - y, player.x - x));
  } else if(angle == "playerRough") { // angle = roughly around player
    xAngle = Math.cos(Math.atan2(player.y - y, player.x - x) + toRadians(Math.random() * 5));
    yAngle = Math.sin(Math.atan2(player.y - y, player.x - x) + toRadians(Math.random() * 5));
  } else { // angle = specified angle
    xAngle = Math.cos(toRadians(angle));
    yAngle = Math.sin(toRadians(angle));
  }

  if(color == "random") {
    color = colors[Math.floor(Math.random() * colors.length)];
    //color = rgb(Math.random() * 255, Math.random() * 255, Math.random() * 255);
  }

  bullets.push([x, y, r, xAngle, yAngle, spd, type, color]);
}

function addMultipleBullets(x, y, num) {
  let angle = toDegrees(Math.atan2(player.y - y, player.x - x));
  
  for(let i = 0; i < num; i++) {
    setTimeout(() => addBullet(x, y, 15, angle, 3, "n"), i * 100, "white");
  }
  
/*  addBullet(x, y, 5, angle, 3);
  setTimeout(() => addBullet(x, y, 5, angle, 3), 100);
  setTimeout(() => addBullet(x, y, 5, angle, 3), 200);
  setTimeout(() => addBullet(x, y, 5, angle, 3), 300);*/
}

function collision() {
  for(let i = 0; i < bullets.length; i++) {
    // check distance between bullet and player
    let a = player.y - bullets[i][1];
    let b = player.x - bullets[i][0];
    let c = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2)); // c = distance between bullet & player

    // check if distance > player radius + bullet radius
    if(c < bullets[i][2]) {
      // delete bullet if true
      bullets.splice(i, 1);
      i--;
      // console.log / damage player.
      if(!player.invincible) {
        console.log("HIT!");
        player.lives -= 1;
        if(cheats.konami == true) {
          player.lives = constrain(0, 30, player.lives);
        } else {
          player.lives = constrain(0, 5, player.lives);
        }
        document.getElementById("lives").innerHTML = player.lives;
        player.invincible = true;
        hit = setTimeout(() => {player.invincible = false}, 1800);
      }
      // document.body.style.backgroundColor = "red";
      // setTimeout(() => document.body.style.backgroundColor = "", 20)

    }

      
  }
}

function spirals() {
  if(stage == 1) {
    stage = -1;
    setTimeout(() => stage = 0, 4750); // change stage = 0 after stage finishes (normally 3650);

    // spirally thingies
    for(let i = 0; i < 360; i += 10) {
      setTimeout(() => addBullet(300, 100, 6, i, 3, "n", "random"), i * 10);
    }
    for(let i = 0; i < 360; i += 10) {
      setTimeout(() => addBullet(300, 100, 6, 90 + i, 3, "n", "random"), i * 10);
    }
    for(let i = 0; i < 360; i += 10) {
      setTimeout(() => addBullet(300, 100, 6,  180 + i, 3, "n", "random"), i * 10);
    }
    for(let i = 0; i < 360; i += 10) {
      setTimeout(() => addBullet(300, 100, 6, 270 + i, 3, "n", "random"), i * 10);
    }
    for(let i = 0; i < 360; i += 10) {
      setTimeout(() => addBullet(100, 100, 6, -i, 3, "n", "random"), i * 10);
    }
    for(let i = 0; i < 360; i += 10) {
      setTimeout(() => addBullet(100, 100, 6, 90 - i, 3, "n", "random"), i * 10);
    }
    for(let i = 0; i < 360; i += 10) {
      setTimeout(() => addBullet(100, 100, 6,  180 - i, 3, "n", "random"), i * 10);
    }
    for(let i = 0; i < 360; i += 10) {
      setTimeout(() => addBullet(100, 100, 6, 270 - i, 3, "n", "random"), i * 10);
    }

    //circular thingies
    for(let n = 0; n < 45; n += 5) {
      setTimeout(() => {
        for(let i = 0; i < 360; i += 14) {
          addBullet(200, 150, 5, i, 3.5, "n", "white");
        }
      }, n * 80); 
    }

    for(let n = 0; n < 45; n += 5) {
      setTimeout(() => {
        for(let i = 0; i < 360; i += 14) {
          addBullet(200, 150, 10, i + 7 + n/3, 3, "n", "white");
        }
      }, (n * 80) + 180); 
    }
  }
}

function homeCircles() {
  if(stage == 2) {
    stage = -1;
    setTimeout(() => {stage = 0}, 7250); // reset stage (normal length = 5250)

    for(let f = 0; f < 5; f++) {
      setTimeout(() => {
        // one loop
        for(let n = 0; n <= 360; n += 30) { // add two circles of homing bullets
          addBullet(100, 100, 5, n, 1.25, "h", "white");
        }
        for(let n = 0; n <= 360; n += 30) {
          addBullet(300, 100, 5, n, 1.25, "h", "white");
        }

        for(let i = 0; i < 10; i++) { // add random bullet fall
          setTimeout(() => addBullet(Math.random() * cnv.width, 5, 5, 90, Math.random() * 2 + 1, "n", "random"), i * 120);
        }
        
        setTimeout(() => hTrack(5.5, true), 750); // set circles to track after x seconds
      }, f * 1050)
    }
  }
}

function carousel() {
  if(stage == 3) {
    stage = -1;
    let x1 = 0;
    setTimeout(() => {stage = 3.5; console.log("right");}, 5900); //reset stage (goes backwards a bit)


    for(let y = 0; y < 55; y += 3) {
      setTimeout(() => {
        for(let i = 0; i <= 360; i+= 51) { // one circle of bullet
          for(let n = 0; n <= 7; n++) {
            setTimeout(() => {addBullet(200, 100, 5, 90 - i + y, 4 - (n / 4), "n", "random")}, n * 80);
          }
        }
      }, y * 100);
    }

    for(let i = 0; i < 400; i += 5) { // two circles travel across the screen spreading bullets
      setTimeout(() => addBullet(i, 150, 8, 90 * (Math.random() * 4), 1.25, "n", "white"), i * 8);
      setTimeout(() => addBullet(400 - i, 150, 8, 90 * (Math.random() * 4), 1.25, "n", "white"), i * 8);
    }
  }

  if(stage == 3.5) {
    stage = -1;
    setTimeout(() => {stage = 0; console.log("left");}, 6500);
    for(let y = 0; y < 55; y += 3) {
      setTimeout(() => {
        for(let i = 360; i >= 0; i-= 51) { // one circle of bullet
          for(let n = 0; n <= 7; n++) {
            setTimeout(() => {addBullet(200, 100, 5, 90 - i - y, 4 - (n / 4), "n", "random")}, n * 80);
          }
        }
      }, y * 100);
    }

    for(let i = 0; i < 400; i += 5) { // two circles travel across the screen spreading bullets
      setTimeout(() => addBullet(i, 550, 8, 90 * (Math.random() * 4), 1.25, "n", "white"), i * 12);
      setTimeout(() => addBullet(400 - i, 550, 8, 90 * (Math.random() * 4), 1.25, "n", "white"), i * 12);
    }
  }
}


function hTrack(speed, rough) {
  for(let i = 0; i < bullets.length; i++) { // go through all bullets
    if(bullets[i][6] == "h") { // check if bullet is homing
      bullets[i][6] = "n"; // change it to normal bullet after
      if(rough) { // roughly aim at player
        bullets[i][3] = Math.cos(Math.atan2(player.y - bullets[i][1], player.x - bullets[i][0]) + toRadians(Math.random() * 10 - 5));
        bullets[i][4] = Math.sin(Math.atan2(player.y - bullets[i][1], player.x - bullets[i][0]) + toRadians(Math.random() * 10 - 5));
      } else { // aim directly at player
        bullets[i][3] = Math.cos(Math.atan2(player.y - bullets[i][1], player.x - bullets[i][0]));
        bullets[i][4] = Math.sin(Math.atan2(player.y - bullets[i][1], player.x - bullets[i][0]));
      }

      bullets[i][5] = speed; // let 'em rip
    }
  }
}

function gameOver() {
  ctx.fillStyle = "white";
  ctx.fillRect(85, 200, 230, 250); // prepare square for drawing over

  ctx.font = "35px Comic Sans MS";
  ctx.fillStyle = "cadetBlue"
  ctx.fillText("Game Over!", 105, 270);
  ctx.font = "15px Comic Sans MS";
  ctx.fillText("score: ", 175, 300);
  if(finalScore + 4000 < player.score) {
    finalScore += 12;
  } else if(finalScore + 400 < player.score) {
    finalScore += 3;
  } else if(finalScore < player.score) {
    finalScore++;
  }

  ctx.font = "50px Comic Sans MS";
  ctx.fillText(finalScore, 150, 380);
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
  if(event.type === "keydown") {
    if(!keys.includes(event.code)) {
      keys.push(event.code);
    }
    code.push(event.code);
    if(code.length > 10) {
      code.shift();
    }
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
