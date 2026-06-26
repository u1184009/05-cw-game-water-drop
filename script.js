// Variables to control game state
let gameRunning = false; // Keeps track of whether game is active or not
let dropMaker; // Will store our timer that creates drops regularly
let timerValue; // Will store the total time for timer
let lives; // Will store lives
let livesDisplay = document.querySelector("#lives");
let timeDisplay = document.querySelector("#time");
let filled = 0;
let score = 0;
let scoreDisplay = document.querySelector("#score");
const waterCan = document.getElementById("water-can");
const gameContainer = document.getElementById("game-container");


let holdingCan = false;

// Jerry Can states

const canStates = ["img/water-can-transparent.png","img/can-fill1.png","img/can-fill2.png","img/can-fill3.png","img/can-fill4.png"];

// Wait for button click to start the game
document.getElementById("start-btn").addEventListener("click", startGame);

function startGame() {
  lives = 3;
  score = 0;
  filled = 0;
  livesDisplay.textContent =   "💧 ".repeat(lives);;
  timerValue = 30;
  waterCan.src = canStates[0];
  // Prevent multiple games from running at once
  if (gameRunning) return;

  gameRunning = true;

  // Create new drops every second (1000 milliseconds)
  dropMaker = setInterval(createDrop, 500);

  // Start timer
  startCountDown();
}

function createDrop() {
  // Create a new div element that will be our water drop
  const drop = document.createElement("div");
  drop.className = "water-drop";

  const dropImage = document.createElement("img");
  dropImage.src = "img/waterDrop.png";

  let isBad = Math.random() < 0.3;
  let isSnow =Math.random() < 0.5;

  if(isBad){
    drop.classList.add("bad-drop");
    dropImage.src = "img/stick.png";
  }else{
    if(isSnow){
      dropImage.src = "img/snowflake.png";
    }
  }
  dropImage.alt = "Water Drop";

  drop.appendChild(dropImage);

  // Make drops different sizes for visual variety
  const initialSize = 100;
  const sizeMultiplier = Math.random() * 0.8 + 0.5;
  const size = initialSize * sizeMultiplier;
  drop.style.width = drop.style.height = `${size}px`;

  // Position the drop randomly across the game width
  // Subtract 60 pixels to keep drops fully inside the container
  const gameWidth = document.getElementById("game-container").offsetWidth;
  const xPosition = Math.random() * (gameWidth - 60);
  drop.style.left = xPosition + "px";

  // Make drops fall for 4 seconds
  drop.style.animationDuration = "3s";
  // Add the new drop to the game screen
  document.getElementById("game-container").appendChild(drop);

  // Check drop collison
  checkCollision(drop);
  // Remove drops that reach the bottom (weren't clicked)
  drop.addEventListener("animationend", () => {
    drop.remove(); // Clean up drops that weren't caught
  });
}

// Count down function
function startCountDown(){
  const countDownInterval = setInterval(function(){
    // Decrement timer value
    timerValue--;

    timeDisplay.textContent = timerValue;

    // Timer has reached 0
    if(timerValue <= 0){
      clearInterval(countDownInterval);
      gameOver();
    }
  }, 1000);
}

// Desktop + Mobile press
function pickUpCan(event){

    if(event.target === waterCan){
        holdingCan = true;
        waterCan.style.cursor = "grabbing";
        if (event.touches && event.cancelable) {
            event.preventDefault();
        }
    }

}


// Release
function dropCan(){

    holdingCan = false;
    waterCan.style.cursor = "grab";

}


// Move function (works for mouse + touch)
function moveCan(event){

    if(!holdingCan) return;


    const rect = gameContainer.getBoundingClientRect();


    let clientX;
    let clientY;


    // Mobile touch position
    if(event.touches){

        if (event.cancelable) {
            event.preventDefault();
        }
        clientX = event.touches[0].clientX;
        clientY = event.touches[0].clientY;

    }
    // Desktop mouse position
    else{

        clientX = event.clientX;
        clientY = event.clientY;

    }


    let x = clientX - rect.left - waterCan.offsetWidth / 2;
    let y = clientY - rect.top - waterCan.offsetHeight / 2;


    // Keep can inside game area
    x = Math.max(
        0,
        Math.min(x, gameContainer.clientWidth - waterCan.offsetWidth)
    );


    y = Math.max(
        0,
        Math.min(y, gameContainer.clientHeight - waterCan.offsetHeight)
    );


    waterCan.style.left = x + "px";
    waterCan.style.top = y + "px";

}


// Mouse controls
gameContainer.addEventListener("mousedown", pickUpCan);

gameContainer.addEventListener("mousemove", moveCan);

document.addEventListener("mouseup", dropCan);


// Mobile controls
gameContainer.addEventListener("touchstart", pickUpCan);

gameContainer.addEventListener("touchmove", moveCan);

document.addEventListener("touchend", dropCan);

// Collision check function
function checkCollision(drop){
  const collisonInterval = setInterval(()=>{
    if (!drop.parentElement){
      clearInterval(collisionInterval);
      return;
    }

    const dropRect = drop.getBoundingClientRect();
    const canRect = waterCan.getBoundingClientRect();

    const hit =
      dropRect.left < canRect.right &&
      dropRect.right > canRect.left &&
      dropRect.top < canRect.bottom &&
      dropRect.bottom > canRect.top;

    if(hit){
      // WATER DROP
      if(drop.classList.contains("bad-drop") === false){
        filled++;
        waterCan.src = canStates[filled];
        if(filled == 5){
          filled = 0;
          score++;
          scoreDisplay.textContent = score;
          waterCan.src = canStates[0];
        }
      }
      // OBSTACLE
      else {
        console.log("Hit");
        lives--;
        // update hearts
        livesDisplay.textContent =
          "💧 ".repeat(lives);
        if(lives <= 0){
          gameOver();
        }
      }
      drop.remove();
      clearInterval(collisionInterval);
    }
  },50);
}

function gameOver(){

  gameRunning = false;

  clearInterval(dropMaker);

  alert("Game Over! Score: " + score);

}