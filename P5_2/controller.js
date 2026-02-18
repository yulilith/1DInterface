// This is where your state machines and game logic lives

// Base speed: move target every N frames (higher = slower)
let targetMoveIntervalBase = 12;
let targetMoveIntervalMin = 3;  // minimum (fastest)
let speedDecayFactor = 2;       // sqrt scaling: early rounds speed up more, later rounds less

class Controller {

    constructor() {
        this.gameState = "PLAY";
        this.frameCounter = 0;
        this.roundsCleared = 0;  // increases speed each success
    }

    getTargetMoveInterval() {
        // Diminishing returns: sqrt means rate of speed increase slows over time
        let reduction = Math.floor(Math.sqrt(this.roundsCleared) * speedDecayFactor);
        return max(targetMoveIntervalBase - reduction, targetMoveIntervalMin);
    }
    
    update() {

        switch(this.gameState) {

            case "PLAY":

                display.clear();

                let playerLeft = min(playerOne.position, playerTwo.position);
                let playerRight = max(playerOne.position, playerTwo.position);
                let blockLength = playerRight - playerLeft + 1;

                display.setPixelRange(playerLeft, playerRight, blockColor);
                display.setPixelRange(target.leftEdge, target.rightEdge, target.color);

                this.frameCounter++;
                if (this.frameCounter >= this.getTargetMoveInterval()) {
                    this.frameCounter = 0;
                    target.move();
                }

                if (target.isOffScreen()) {
                    this.gameState = "GAME_OVER";
                    break;
                }

                if (target.overlapsWithBlock(playerLeft, playerRight)) {
                    if (blockLength == target.length) {
                        // Success - impact at leading edge of target
                        let impactPoint = target.direction === -1 ? target.rightEdge : target.leftEdge;
                        successAnimation.start(impactPoint);
                        this.gameState = "SUCCESS";
                    } else {
                        this.gameState = "GAME_OVER";
                    }
                }

                break;

            case "SUCCESS":

                display.clear();
                successAnimation.currentFrame();
                let frameData = successAnimation.getFrameForDisplay();
                for (let i = 0; i < successAnimation.pixels; i++) {
                    display.setPixel(i, frameData[i]);
                }
                if (successAnimation.isDone()) {
                    this.roundsCleared++;
                    target.spawnNew();
                    this.frameCounter = 0;
                    this.gameState = "PLAY";
                }

                break;

            case "GAME_OVER":

                display.clear();
                display.setAllPixels(color(255, 0, 0));

                break;

            default:
                break;
        }
    }
}

function keyPressed() {

    if (key == 'A' || key == 'a') {
        playerOne.move(-1);
    }
    if (key == 'D' || key == 'd') {
        playerOne.move(1);
    }
    if (key == 'J' || key == 'j') {
        playerTwo.move(-1);
    }
    if (key == 'L' || key == 'l') {
        playerTwo.move(1);
    }

    if (key == 'R' || key == 'r') {
        if (controller.gameState == "GAME_OVER") {
            let center = parseInt(displaySize / 2);
            playerOne.position = center - 1;
            playerTwo.position = center + 1;
            target.spawnNew();
            controller.frameCounter = 0;
            controller.roundsCleared = 0;
            controller.gameState = "PLAY";
        }
    }
}
