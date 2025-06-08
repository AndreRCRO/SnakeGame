// Get DOM elements
const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");

// Game variables
let foodX, foodY;  // Food position coordinates
let gameOver = false;  // Game state
let snakeX = 5, snakeY = 10;  // Initial snake position
let snakeBody = [];  // Array to store snake body segments
let velocityX = 0, velocityY = 0;  // Snake movement direction
let setIntervalId;  // Interval ID for game loop
let score = 0;  // Current score
let wallsActive = localStorage.getItem('wallsActive') !== 'false';  // Get wall setting from localStorage

// Get game speed from localStorage or default to 3
const gameSpeed = parseInt(localStorage.getItem('gameSpeed')) || 3;
// Convert speed level (1-5) to milliseconds (200ms to 50ms)
const speedMs = 200 - ((gameSpeed - 1) * 37.5);

// Get high score from localStorage or set to 0 if not exists
let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerText = `High Score: ${highScore}`;

// Function to randomly position food on the board
const changeFoodPosition = () => {
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
}

// Function to handle game over state
const handleGameOver = () => {
    clearInterval(setIntervalId);
    // Save final score to localStorage
    localStorage.setItem('finalScore', score);
    
    // Create and show game over screen
    const gameOverScreen = document.createElement('div');
    gameOverScreen.className = 'game-over-screen';
    gameOverScreen.innerHTML = `
        <div class="game-over-content">
            <h2>Game Over</h2>
            <p>Final Score: ${score}</p>
            <p>High Score: ${highScore}</p>
            <button onclick="window.location.href='menu.html'">Main Menu</button>
        </div>
    `;
    document.body.appendChild(gameOverScreen);
}

// Function to handle keyboard input and change snake direction
const changeDirection = (e) => {
    if(e.key === "ArrowUp" && velocityY != 1){
        velocityX = 0;
        velocityY = -1;
    } else if(e.key === "ArrowDown" && velocityY != -1){
        velocityX = 0;
        velocityY = 1;
    } else if(e.key === "ArrowLeft" && velocityX != 1){
        velocityX = -1;
        velocityY = 0;
    } else if(e.key === "ArrowRight" && velocityX != -1){
        velocityX = 1;
        velocityY = 0;
    } 
    initGame();
}

// Function to handle wall wrapping
const handleWallWrapping = () => {
    if (snakeX <= 0) snakeX = 30;
    if (snakeX > 30) snakeX = 1;
    if (snakeY <= 0) snakeY = 30;
    if (snakeY > 30) snakeY = 1;
}

// Main game initialization and update function
const initGame = () => {
    if(gameOver) return handleGameOver();
    let htmlMarkup = `<div class="food" style="grid-area: ${foodY} / ${foodX} "></div>`;

    // Check if snake ate food
    if(snakeX === foodX && snakeY === foodY) {
        changeFoodPosition();
        snakeBody.push([foodX,foodY]);
        score++;

        // Update high score if current score is higher
        highScore = score >= highScore ? score : highScore;
        localStorage.setItem("high-score", highScore);
        scoreElement.innerText = `Score: ${score}`;
        highScoreElement.innerText = `High Score: ${highScore}`;
    }

    // Update snake body positions
    for (let i = snakeBody.length - 1; i > 0; i--){
        snakeBody[i] = snakeBody[i - 1];  
    }

    snakeBody[0] = [snakeX, snakeY];

    // Update snake head position
    snakeX += velocityX;
    snakeY += velocityY;

    // Handle wall collisions based on setting
    if (wallsActive) {
        // Check for wall collision
        if(snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30){
            gameOver = true;
        }
    } else {
        // Handle wall wrapping
        handleWallWrapping();
    }

    // Render snake body and check for self collision
    for (let i = 0; i < snakeBody.length; i++) {
        htmlMarkup += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`
        if(i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]){
            gameOver = true;
        }
    }
    playBoard.innerHTML = htmlMarkup;
}

// Initialize game
changeFoodPosition();
setIntervalId = setInterval(initGame, speedMs);
document.addEventListener("keydown", changeDirection)