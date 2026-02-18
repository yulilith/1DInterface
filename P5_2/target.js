// Target block - spawns on left or right, moves toward center. Players must match its length.

class Target {

    constructor(_color, _displaySize) {
        this.color = _color;
        this.displaySize = _displaySize;
        this.length = 1;
        this.leftEdge = 0;
        this.rightEdge = 0;
        this.direction = -1;  // -1 = moving left, 1 = moving right
        this.spawnNew();
    }

    // Spawn a new target: random length (1-7), random side (left or right)
    spawnNew() {
        this.length = parseInt(random(1, 8));  // 1 to 7 inclusive
        // Randomly spawn on left or right
        if (random() < 0.5) {
            // Spawn on left, travel right
            this.leftEdge = 0;
            this.rightEdge = this.length - 1;
            this.direction = 1;
        } else {
            // Spawn on right, travel left
            this.rightEdge = this.displaySize - 1;
            this.leftEdge = this.rightEdge - this.length + 1;
            this.direction = -1;
        }
    }

    // Move the target one pixel in its travel direction
    move() {
        this.leftEdge += this.direction;
        this.rightEdge += this.direction;
    }

    // Check if target has moved off-screen (timeout)
    isOffScreen() {
        if (this.direction === -1) {
            return this.rightEdge < 0;  // moved off left
        } else {
            return this.leftEdge >= this.displaySize;  // moved off right
        }
    }

    // Check if target overlaps with the player block
    overlapsWithBlock(playerLeft, playerRight) {
        return this.rightEdge >= playerLeft && this.leftEdge <= playerRight;
    }

}
