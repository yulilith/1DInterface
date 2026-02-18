// Feedback animations for hit results and end-of-game fill

// Flash animation for perfect/good/miss feedback
class FeedbackAnimation {

    constructor(_position, _type, _displaySize) {
        this.position = _position;       // center pixel of the flash
        this.displaySize = _displaySize;
        this.frame = 0;
        this.maxFrames = 15;             // ~0.25s at 60fps
        this.active = true;

        // Set color based on hit type
        if (_type === 'perfect') {
            this.flashColor = color(255, 255, 0);   // yellow
            this.radius = 3;
        } else if (_type === 'good') {
            this.flashColor = color(0, 255, 100);   // green
            this.radius = 2;
        } else {
            this.flashColor = color(255, 40, 40);   // dim red
            this.radius = 1;
        }
    }

    update() {
        if (!this.active) return;
        this.frame++;
        if (this.frame >= this.maxFrames) {
            this.active = false;
        }
    }

    // Draw this animation into the display buffer
    render(_display) {
        if (!this.active) return;

        let progress = this.frame / this.maxFrames;
        let alpha = 1.0 - progress;                     // fade out
        let spread = Math.floor(this.radius * progress); // expand outward

        for (let offset = -spread; offset <= spread; offset++) {
            let idx = this.position + offset;
            _display.blendPixel(idx, this.flashColor, alpha * 0.8);
        }
    }
}


// End-of-game animation: center-outward fill in winner's color
class EndAnimation {

    constructor(_displaySize, _winnerColor, _isTie) {
        this.displaySize = _displaySize;
        this.winnerColor = _winnerColor;
        this.isTie = _isTie;
        this.frame = 0;
        this.maxFrames = 45;   // ~0.75s fill
        this.active = true;
        this.done = false;

        // For tie: pink from left, blue from right
        this.p1Color = color(255, 80, 150);
        this.p2Color = color(80, 150, 255);
    }

    update() {
        if (!this.active) return;
        this.frame++;
        if (this.frame >= this.maxFrames) {
            this.done = true;
        }
    }

    render(_display) {
        if (!this.active) return;

        let center = Math.floor(this.displaySize / 2);
        let progress = Math.min(this.frame / this.maxFrames, 1.0);
        let reach = Math.floor(center * progress);

        for (let offset = 0; offset <= reach; offset++) {
            let leftIdx = center - offset;
            let rightIdx = center + offset;

            if (this.isTie) {
                _display.setPixel(leftIdx, this.p1Color);
                if (rightIdx < this.displaySize) {
                    _display.setPixel(rightIdx, this.p2Color);
                }
            } else {
                _display.setPixel(leftIdx, this.winnerColor);
                if (rightIdx < this.displaySize) {
                    _display.setPixel(rightIdx, this.winnerColor);
                }
            }
        }
    }
}
