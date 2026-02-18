
// This holds some player information, like color and position.
// Modified for Red Light Green Light - players only move right, no wrapping.


class Player {

    constructor(_color, _position, _displaySize) {
        this.playerColor = _color;
        this.position = _position;
        this.displaySize = _displaySize;
    }

    // Move player one step to the right
    moveRight() {
        if (this.position < this.displaySize - 1) {  // can't move past the light position (49)
            this.position = this.position + 1;
        }
    }

    // Reset player back to the start
    resetToStart() {
        this.position = 0;
    }
}
