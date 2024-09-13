let board;
let boardwidth = 800;
let boardheight = 600;
let context;

// Player settings
let playerwidth = 80;
let playerheight = 100;
let playerX = 50;
let playerY = boardheight - 190;
let playerimg, jumpimg;
let player = {
    x: playerX,
    y: playerY,
    width: playerwidth,
    height: playerheight
};

// Game state
let over = false;
let score = 0;
let time = 0;
let lives = 3;  // Initialize lives

// Create obstacle
let boximg;
let boxwidth = 60;
let boxheight = 110;
let boxX = 700;
let boxY = boardheight - 177;

// Setting obstacles
let boxesarray = [];
let boxspeed = -3;

// Gravity & velocity
let velocityY = 0;
let gravity = 0.25;

// Store the animation frame ID
let animationId;

// Life images
let lifeimg;  // Image for life

window.onload = function() {
    // Display
    board = document.getElementById('board');
    board.height = boardheight;
    board.width = boardwidth;
    context = board.getContext("2d");

    // Player images
    playerimg = new Image();
    playerimg.src = "niab.png";  // Normal state image

    jumpimg = new Image();
    jumpimg.src = "jump.png";  // Jump state image

    // Load life image
    lifeimg = new Image();
    lifeimg.src = "life.png";  // Image representing a life

    playerimg.onload = function() {
        context.drawImage(playerimg, player.x, player.y, player.width, player.height);
    };

    // Start game loop
    animationId = requestAnimationFrame(update);

    // Listen for player jump
    document.addEventListener("keydown", moveplayer);

    // Create box
    boximg = new Image();
    boximg.src = "sake.png";

    // Start the obstacle creation process with random intervals
    createboxWithRandomInterval();
};

// Function to update game loop
function update() {
    if (over) {
        return;
    }

    animationId = requestAnimationFrame(update);  // always update animation
    velocityY += gravity;

    context.clearRect(0, 0, board.width, board.height);  // clear previous frame

    // Check if player is on the ground or jumping
    if (player.y < playerY) {
        context.drawImage(jumpimg, player.x, player.y, player.width, player.height);  // Jumping image
    } else {
        context.drawImage(playerimg, player.x, player.y, player.width, player.height);  // Normal image
    }

    // Create array box
    for (let i = 0; i < boxesarray.length; i++) {
        let box = boxesarray[i];
        box.x += boxspeed;
        context.drawImage(box.img, box.x, box.y, box.width, box.height);

        // Check if you crash
        if (onCollision(player, box)) {
            if(lives > 1){
            over = true;
            // Display game over message
            context.font = "normal bold 40px Arial";
            context.textAlign = "center";
            context.fillText("Game Over", board.width / 2, board.height / 2);
            context.font = "normal bold 20px Arial";
            context.fillText("Final Score : " + score, board.width / 2, 350);
        }
        else if(lives <= 1 ){
            
                btn.disabled = true; 
                cancelAnimationFrame(animationId); 
                over = true;
                context.font = "normal bold 40px Arial";
                context.textAlign = "center";
                context.fillText("U Have no ability to pass TT", board.width / 2, board.height / 2);
                context.font = "normal bold 20px Arial";
                context.fillText("Final Score : " + score, board.width / 2, 350);
                return;
                
        }
        
    }
}

if(over){
    lives--
}

    // Update score, time, and lives
    score++;
    context.font = "normal bold 20px Arial";
    context.textAlign = "left";
    context.fillText("Score : " + score + " Point", 30, 40);

    time += 0.012;
    context.font = "normal bold 20px Arial";
    context.textAlign = "left";
    context.fillText("Time  : " + time.toFixed(2) + " Sec", 30, 100);

    // Display remaining lives as images
    context.fillText("lives  : "  ,30, 160);
    let lifeImageX = 110;
    for (let i = 0; i < lives; i++) {
        context.drawImage(lifeimg, lifeImageX, 140, 30, 30);  // Adjust size as needed
        lifeImageX += 60;  // Space between life images
    }

    // Apply gravity and stop falling when player reaches the ground
    player.y = Math.min(player.y + velocityY, playerY);

    // End the game after 60 seconds
    if (time >= 60) {
        over = true;
        context.font = "normal bold 40px Arial";
        context.textAlign = "center";
        context.fillText("You Won!", board.width / 2, board.height / 2);
        context.font = "normal bold 20px Arial";
        context.fillText("Final Score : " + score, board.width / 2, 350);
        cancelAnimationFrame(animationId);  // Stop the game
    }
}

// Reset player position after losing a life
function resetPlayerPosition() {
    player.x = playerX;
    player.y = playerY;
    velocityY = 0;  // Reset velocity
}

// Player move function
function moveplayer(e) {
    if (over) {
        return;
    }

    // Only allow jumping if the player is on the ground
    if (e.code == "Space" && player.y == playerY) {
        velocityY = -10;  // Apply upward force to jump
    }
}

// Function to create boxes (obstacles)
function createbox() {
    if (over) {
        return;
    }
    let box = {
        img: boximg,
        x: boxX,
        y: boxY,
        width: boxwidth,
        height: boxheight
    };

    boxesarray.push(box);

    if (boxesarray.length > 5) {
        boxesarray.shift();
    }
}

// Function to generate a random interval between 1.7 to 3 seconds (1700ms to 3000ms)
function getRandomInterval() {
    return Math.random() * (3000 - 1700) + 1700;  // Random time between 1.7 and 3 seconds
}

// Function to create a box at a random interval
function createboxWithRandomInterval() {
    createbox();  // Create the box
    let randomInterval = getRandomInterval();  // Get a random interval
    setTimeout(createboxWithRandomInterval, randomInterval);  // Schedule next box creation
}

function onCollision(obj1, obj2) {
    return obj1.x < (obj2.x + obj2.width) && 
           (obj1.x + obj1.width) > obj2.x &&
           obj1.y < (obj2.y + obj2.height) && 
           (obj1.y + obj1.height) > obj2.y;
}

// Reset button with cooldown logic and displaying remaining cooldown time
let btn = document.getElementById('btn');
let cooldownActive = false;
let cooldownTime = 3000;  // Cooldown duration in milliseconds (3 seconds)
let cooldownInterval;

btn.addEventListener("click", function() {
    if (!cooldownActive) {
        btn1();  // Call the reset function
        activateCooldown();  // Activate cooldown
    }
});

function btn1() {
    // Cancel any previous animation frames
    if (animationId) {
        cancelAnimationFrame(animationId);
    }

    // Reset game state
    over = false;
    score = 0;
    time = 0;

    // Reset player's position and velocity
    velocityY = 0;
    player.x = playerX;
    player.y = playerY;

    // Reset speed of obstacles
    boxspeed = -3;

    // Clear the boxes array
    boxesarray = [];

    // Start the animation again
    animationId = requestAnimationFrame(update);
}

// Cooldown function to disable button for a certain period and show countdown
function activateCooldown() {
    cooldownActive = true;  // Set cooldown active
    let cooldownRemaining = cooldownTime / 1000;  // In seconds

    btn.disabled = true;  // Disable button
    btn.textContent = `Cooldown: ${cooldownRemaining}s`;  // Display initial cooldown text

    cooldownInterval = setInterval(function() {
        cooldownRemaining--;
        btn.textContent = `Cooldown: ${cooldownRemaining}s`;  // Update the button text

        if (cooldownRemaining <= 0) {
            clearInterval(cooldownInterval);  // Stop countdown
            btn.disabled = false;  // Enable button
            btn.textContent = "Reset";  // Reset the button text
            cooldownActive = false;  // End cooldown
        }
    }, 1000);  // Update every second
}
