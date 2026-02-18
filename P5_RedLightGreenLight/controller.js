
// Red Light Green Light - State Machine & Game Logic


class Controller {

    constructor() {
        this.gameState = "PLAY";

        // Light state: true = green, false = red
        this.lightIsGreen = true;

        // Timer for light switching (in frames)
        this.lightTimer = 0;
        this.lightDuration = 0;
        this.setNewLightDuration();

        // Winner color
        this.winner = null;
    }

    // Set a random duration for the current light phase
    setNewLightDuration() {
        if (this.lightIsGreen) {
            // Green lasts 90-240 frames (1.5-4 seconds at 60fps)
            this.lightDuration = parseInt(random(90, 240));
        } else {
            // Red lasts 60-180 frames (1-3 seconds at 60fps)
            this.lightDuration = parseInt(random(60, 180));
        }
        this.lightTimer = 0;
    }

    // Switch the light between red and green
    toggleLight() {
        this.lightIsGreen = !this.lightIsGreen;
        this.setNewLightDuration();
    }

    // This is called from draw() in sketch.js with every frame
    update() {

        switch(this.gameState) {

            // Main game state
            case "PLAY":

                // Clear screen
                display.clear();

                // Update light timer
                this.lightTimer++;
                if (this.lightTimer >= this.lightDuration) {
                    this.toggleLight();
                }

                // Draw the signal light at rightmost position (this is also the target)
                if (this.lightIsGreen) {
                    display.setPixel(lightPos, color(0, 255, 0));   // Green light
                } else {
                    display.setPixel(lightPos, color(255, 0, 0));   // Red light
                }

                // Draw both players
                display.setPixel(playerOne.position, playerOne.playerColor);
                display.setPixel(playerTwo.position, playerTwo.playerColor);

                // Check if either player reached the light (target)
                if (playerOne.position >= lightPos) {
                    this.winner = playerOne.playerColor;
                    winAnimation.currentFrameCount = -1;
                    this.gameState = "WIN_ANIMATION";
                }

                if (playerTwo.position >= lightPos) {
                    this.winner = playerTwo.playerColor;
                    winAnimation.currentFrameCount = -1;
                    this.gameState = "WIN_ANIMATION";
                }

                break;

            // Win animation - sweep of winner's color
            case "WIN_ANIMATION":

                display.clear();

                let frameToShow = winAnimation.currentFrame();

                for (let i = 0; i < winAnimation.pixels; i++) {
                    display.setPixel(i, winAnimation.animation[frameToShow][i]);
                }

                // After animation completes, show winner
                if (frameToShow == winAnimation.animation.length - 1) {
                    this.gameState = "SCORE";
                }

                break;

            // Game over - show winner color
            case "SCORE":

                // Fill display with winner's color
                display.setAllPixels(this.winner);

                break;

            default:
                break;
        }
    }
}


// Handle player input
function keyPressed() {

    // Only allow movement during PLAY state
    if (controller.gameState == "PLAY") {

        // Player One moves right with D
        if (key == 'D' || key == 'd') {
            if (controller.lightIsGreen) {
                playerOne.moveRight();
            } else {
                // Moved on red light! Reset to start
                playerOne.resetToStart();
            }
        }

        // Player Two moves right with L
        if (key == 'L' || key == 'l') {
            if (controller.lightIsGreen) {
                playerTwo.moveRight();
            } else {
                // Moved on red light! Reset to start
                playerTwo.resetToStart();
            }
        }
    }

    // Press R to reset the game
    if (key == 'R' || key == 'r') {
        playerOne.resetToStart();
        playerTwo.resetToStart();
        controller.lightIsGreen = true;
        controller.setNewLightDuration();
        controller.gameState = "PLAY";
    }
}
