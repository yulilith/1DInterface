

// Win animation: a wave sweeps from left to right in yellow

class Animation {

    constructor() {

        this.numberOfFrames = 50;    // how many frames the animation has
        this.pixels = 50;            // how wide the animation is

        this.animation = new Array(this.numberOfFrames);

        this.currentFrameCount = -1;

        // Build a left-to-right sweep animation
        for (let i = 0; i < this.numberOfFrames; i++) {

            this.animation[i] = new Array(this.pixels);

            // Start with all black
            for (let j = 0; j < this.pixels; j++) {
                this.animation[i][j] = color(0, 0, 0);
            }

            // Light up pixels from left to current frame position
            for (let j = 0; j <= i; j++) {
                this.animation[i][j] = color(255, 255, 0);
            }
        }
    }

    // Advance to next frame and return frame number
    currentFrame() {

        this.currentFrameCount = this.currentFrameCount + 1;

        if (this.currentFrameCount >= this.numberOfFrames) {
            this.currentFrameCount = 0;
        }

        return this.currentFrameCount;
    }

    grabPixel(_index) {
        return this.animation[this.currentFrameCount][_index];
    }

}
