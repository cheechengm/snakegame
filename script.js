// Define constants
const CANVAS_SIZE = 400;
const GRID_SIZE = 20;
const INITIAL_SNAKE_LENGTH = 3;
const GAME_SPEED = 100; // in milliseconds

// Initialize variables
let canvas, ctx;
let snake, food;
let dx = GRID_SIZE;
let dy = 0;
let score = 0;
let isGameOver = false;

// Initialize the game
function init() {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');

    // Initialize snake
    snake = [];
    for (let i = INITIAL_SNAKE_LENGTH - 1; i >= 0; i--) {
        snake.push({ x: i * GRID_SIZE, y: 0 });
    }

    // Generate initial food position
    generateFood();

    // Start game loop
    gameLoop();
}

// Generate random food position
function generateFood() {
    food = {
        x: Math.floor(Math.random() * (CANVAS_SIZE / GRID_SIZE)) * GRID_SIZE,
        y: Math.floor(Math.random() * (CANVAS_SIZE / GRID_SIZE)) * GRID_SIZE
    };
}

// Main game loop
function gameLoop() {
    update();
    draw();
    if (!isGameOver) {
        setTimeout(gameLoop, GAME_SPEED);
    }
}

// Update game state
function update() {
    if (isGameOver) {
        return;
    }
    // Move snake
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);

    // Check for collision with food
    if (head.x === food.x && head.y === food.y) {
        score++;
        generateFood();
    } else {
        snake.pop();
    }

    // Check for collision with walls or self
    if (head.x < 0 || head.x >= CANVAS_SIZE || head.y < 0 || head.y >= CANVAS_SIZE || isCollisionWithSelf(head)) {
        gameOver();
    }
}

// Function to check collision with self
function isCollisionWithSelf(head) {
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }
    return false;
}

// Draw game objects
function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Draw snake
    ctx.fillStyle = '#008000'; // Green
    snake.forEach(segment => {
        ctx.fillRect(segment.x, segment.y, GRID_SIZE, GRID_SIZE);
    });

    // Draw food
    ctx.fillStyle = '#FF0000'; // Red
    ctx.fillRect(food.x, food.y, GRID_SIZE, GRID_SIZE);

    // Draw score
    ctx.fillStyle = '#000';
    ctx.fillText('Score: ' + score, 10, 20);
}

// Game over
function gameOver() {
    isGameOver = true;
    // Show game over message and restart button
    const gameOverDiv = document.getElementById('game-over');
    gameOverDiv.classList.remove('hidden');
    document.getElementById('score-display').textContent = 'Your score: ' + score;
    document.getElementById('restart-button').addEventListener('click', restartGame);
}

// Function to restart the game
function restartGame() {
    // Reset variables
    snake = [];
    for (let i = INITIAL_SNAKE_LENGTH - 1; i >= 0; i--) {
        snake.push({ x: i * GRID_SIZE, y: 0 });
    }
    dx = GRID_SIZE;
    dy = 0;
    score = 0;
    generateFood();
    isGameOver = false;

    // Hide game over message
    document.getElementById('game-over').classList.add('hidden');
    
    // Restart game loop
    gameLoop();
}

// Handle keyboard input
document.addEventListener('keydown', e => {
    switch (e.key) {
        case 'ArrowUp':
            if (dy === 0) {
                dx = 0;
                dy = -GRID_SIZE;
            }
            break;
        case 'ArrowDown':
            if (dy === 0) {
                dx = 0;
                dy = GRID_SIZE;
            }
            break;
        case 'ArrowLeft':
            if (dx === 0) {
                dx = -GRID_SIZE;
                dy = 0;
            }
            break;
        case 'ArrowRight':
            if (dx === 0) {
                dx = GRID_SIZE;
                dy = 0;
            }
            break;
    }
});

// Start the game
init();
