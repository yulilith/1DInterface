// Success animation - impact burst that expands from the collision point
// Feels like the target and player block created a physical impact

class SuccessAnimation {

    constructor(_displaySize) {
        this.pixels = _displaySize;
        this.numberOfFrames = 28;   // ~0.47 sec at 60fps
        this.template = new Array(this.numberOfFrames);  // centered burst template
        this.currentFrameCount = -1;
        this.impactPoint = parseInt(this.pixels / 2);   // where the collision happened
        this.center = parseInt(this.pixels / 2);

        for (let i = 0; i < this.numberOfFrames; i++) {
            this.template[i] = new Array(this.pixels);
            for (let j = 0; j < this.pixels; j++) {
                this.template[i][j] = color(0, 0, 0);
            }

            if (i === 0) {
                // Frame 0: Sharp impact flash - bright white at collision point
                this.template[i][this.center] = color(255, 255, 255);
            } else if (i === 1) {
                // Frame 1: Instant expansion - small bright core (the "pop")
                let r = 255, g = 255, b = 200;
                for (let k = -2; k <= 2; k++) {
                    let idx = this.center + k;
                    if (idx >= 0 && idx < this.pixels) {
                        let f = 1 - Math.abs(k) * 0.3;
                        this.template[i][idx] = color(r * f, g * f, b * f);
                    }
                }
            } else {
                // Frames 2+: Shockwave expands outward, gold to warm ember, fades
                let radius = i + 1;  // faster initial expansion
                let fade = 1 - ((i - 2) / (this.numberOfFrames - 2)) * 0.95;
                let r = parseInt(255 * fade);
                let g = parseInt(240 * fade);
                let b = parseInt(0 * fade);
r
                for (let k = -radius; k <= radius; k++) {
                    let idx = this.center + k;
                    if (idx >= 0 && idx < this.pixels) {
                        let dist = Math.abs(k) / (radius + 1);
                        let edgeFade = 1 - dist * 0.6;  // sharper falloff = more impact-like
                        this.template[i][idx] = color(
                            parseInt(r * edgeFade),
                            parseInt(g * edgeFade),
                            parseInt(b * edgeFade)
                        );
                    }
                }
            }
        }
    }

    // Start animation at the collision point (leading edge of target when it hit)
    start(_impactPoint) {
        this.impactPoint = _impactPoint;
        this.currentFrameCount = -1;
    }

    currentFrame() {
        this.currentFrameCount++;
        if (this.currentFrameCount >= this.numberOfFrames) {
            this.currentFrameCount = 0;
        }
        return this.currentFrameCount;
    }

    isDone() {
        return this.currentFrameCount >= this.numberOfFrames - 1;
    }

    // Get the display buffer for current frame, offset so burst originates at impact point
    getFrameForDisplay() {
        let frame = this.template[this.currentFrameCount];
        let result = [];
        for (let i = 0; i < this.pixels; i++) {
            let srcIdx = i - this.impactPoint + this.center;
            if (srcIdx >= 0 && srcIdx < this.pixels) {
                result[i] = frame[srcIdx];
            } else {
                result[i] = color(0, 0, 0);
            }
        }
        return result;
    }

    reset() {
        this.currentFrameCount = -1;
    }
}
