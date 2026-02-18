// Beat class for the rhythm game
// Beats spawn from the center and scroll outward toward hit zones at each end

class Beat {

    constructor(_player, _sound, _displaySize, _speed) {
        this.player = _player;           // 1 or 2
        this.sound = _sound;             // sound type string
        this.displaySize = _displaySize;
        this.speed = _speed || 0.35;     // pixels per frame (default for hardcoded mode)

        let center = Math.floor(this.displaySize / 2);

        // Both players' beats spawn from the center
        // P1 beats travel left toward pixel 0
        // P2 beats travel right toward the last pixel
        if (this.player === 1) {
            this.position = center;                      // start at center
            this.direction = -1;                          // move left
            this.hitZone = 0;                             // target pixel 0
            this.beatColor = color(255, 80, 150);         // pink
        } else {
            this.position = center;                      // start at center
            this.direction = 1;                           // move right
            this.hitZone = this.displaySize - 1;          // target last pixel
            this.beatColor = color(80, 150, 255);         // blue
        }

        this.active = true;    // still on screen
        this.hit = false;      // has been hit by player
    }

    // Move the beat one frame
    update() {
        if (!this.active) return;
        this.position += this.speed * this.direction;

        // If beat has gone past the hit zone, it's a miss
        if (this.player === 1 && this.position < -2) {
            this.active = false;
        } else if (this.player === 2 && this.position > this.displaySize + 1) {
            this.active = false;
        }
    }

    // Distance from the hit zone (used for timing judgment)
    distanceFromHitZone() {
        return Math.abs(this.position - this.hitZone);
    }

    // Get the rounded pixel position for display
    displayPosition() {
        return Math.round(this.position);
    }
}
