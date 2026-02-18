// State machine and game logic for the rhythm game
// States: READY → SELECT → PLAY → END

class Controller {

    constructor() {
        this.gameState = "READY";
        this.playMode = "hardcoded";   // "hardcoded" or "mp3"
        this.beats = [];               // active beats on screen
        this.animations = [];          // active feedback animations
        this.endAnimation = null;

        this.p1Score = 0;
        this.p2Score = 0;
        this.p1Combo = 0;
        this.p2Combo = 0;

        this.songStartTime = 0;        // millis() when song started
        this.nextBeatIndex = 0;        // index into SONG_PATTERN

        this.TRAVEL_TIME = 1.43;       // seconds for a beat to travel center-to-edge
        this.MP3_BEAT_SPEED = 1.5;     // faster speed for MP3 beats (reaches edge in ~0.33s)

        this.readyPulse = 0;           // for pulsing animations
    }

    reset() {
        if (this.playMode === "mp3") {
            mp3Analyzer.stop();
        }
        stopBackground();
        this.playMode = "hardcoded";
        playMode = "hardcoded";        // sync global
        this.beats = [];
        this.animations = [];
        this.endAnimation = null;
        this.p1Score = 0;
        this.p2Score = 0;
        this.p1Combo = 0;
        this.p2Combo = 0;
        this.nextBeatIndex = 0;
        this.readyPulse = 0;
        this.gameState = "READY";
    }

    update() {
        switch (this.gameState) {

            case "READY":
                display.clear();

                // Pulsing hit zones
                this.readyPulse += 0.05;
                let pulse = (Math.sin(this.readyPulse) + 1) / 2;

                let p1Glow = color(255 * pulse * 0.5, 80 * pulse * 0.3, 150 * pulse * 0.5);
                let p2Glow = color(80 * pulse * 0.3, 150 * pulse * 0.5, 255 * pulse * 0.5);

                display.setPixel(0, p1Glow);
                display.setPixel(displaySize - 1, p2Glow);
                break;

            case "SELECT":
                display.clear();

                // Left half pulses pink, right half pulses blue
                this.readyPulse += 0.05;
                let selectPulse = (Math.sin(this.readyPulse) + 1) / 2;
                let halfPoint = Math.floor(displaySize / 2);

                // Left half = option 1 (hardcoded)
                for (let i = 0; i < halfPoint; i++) {
                    let brightness = selectPulse * 0.3;
                    display.setPixel(i, color(255 * brightness, 80 * brightness, 150 * brightness));
                }
                // Right half = option 2 (MP3) - only if loaded
                if (mp3Analyzer && mp3Analyzer.loaded) {
                    for (let i = halfPoint; i < displaySize; i++) {
                        let brightness = selectPulse * 0.3;
                        display.setPixel(i, color(80 * brightness, 150 * brightness, 255 * brightness));
                    }
                }
                break;

            case "PLAY":
                display.clear();

                if (this.playMode === "hardcoded") {
                    // Spawn beats from hardcoded SONG_PATTERN
                    let elapsed = (millis() - this.songStartTime) / 1000;

                    while (this.nextBeatIndex < SONG_PATTERN.length) {
                        let beatDef = SONG_PATTERN[this.nextBeatIndex];
                        if (elapsed >= beatDef.time - this.TRAVEL_TIME) {
                            let newBeat = new Beat(beatDef.player, beatDef.sound, displaySize);
                            this.beats.push(newBeat);
                            this.nextBeatIndex++;
                        } else {
                            break;
                        }
                    }
                } else if (this.playMode === "mp3") {
                    // Real-time beat detection from MP3
                    let detectedBeats = mp3Analyzer.analyze();
                    for (let bd of detectedBeats) {
                        let newBeat = new Beat(bd.player, bd.sound, displaySize, this.MP3_BEAT_SPEED);
                        this.beats.push(newBeat);
                    }
                }

                // Update all beats
                for (let b of this.beats) {
                    b.update();
                }

                // Check for missed beats (passed hit zone without being hit)
                for (let b of this.beats) {
                    if (b.active && !b.hit) {
                        let pastZone = false;
                        if (b.player === 1 && b.position < -1.0) pastZone = true;
                        if (b.player === 2 && b.position > displaySize) pastZone = true;

                        if (pastZone) {
                            b.active = false;
                            this.animations.push(new FeedbackAnimation(b.hitZone, 'miss', displaySize));
                            if (b.player === 1) this.p1Combo = 0;
                            else this.p2Combo = 0;
                        }
                    }
                }

                // Remove inactive beats
                this.beats = this.beats.filter(b => b.active);

                // Draw dim hit-zone glow
                display.blendPixel(0, color(255, 80, 150), 0.15);
                display.blendPixel(displaySize - 1, color(80, 150, 255), 0.15);

                // Draw beats
                for (let b of this.beats) {
                    let px = b.displayPosition();
                    if (px >= 0 && px < displaySize) {
                        display.setPixel(px, b.beatColor);
                    }
                }

                // Update and render feedback animations
                for (let a of this.animations) {
                    a.update();
                    a.render(display);
                }
                this.animations = this.animations.filter(a => a.active);

                // Check if song is done
                let songDone = false;
                if (this.playMode === "hardcoded") {
                    songDone = (this.nextBeatIndex >= SONG_PATTERN.length
                                && this.beats.length === 0
                                && this.animations.length === 0);
                } else if (this.playMode === "mp3") {
                    let mp3Over = mp3Analyzer.isFinished() || !mp3Analyzer.playing;
                    songDone = (mp3Over
                                && this.beats.length === 0
                                && this.animations.length === 0);
                }
                if (songDone) {
                    this.startEnd();
                }

                break;

            case "END":
                display.clear();

                if (this.endAnimation) {
                    this.endAnimation.update();
                    this.endAnimation.render(display);
                }

                break;

            default:
                break;
        }
    }

    // Start playing
    startPlay() {
        this.beats = [];
        this.animations = [];
        this.endAnimation = null;
        this.p1Score = 0;
        this.p2Score = 0;
        this.p1Combo = 0;
        this.p2Combo = 0;
        this.nextBeatIndex = 0;
        this.songStartTime = millis();

        if (this.playMode === "mp3") {
            mp3Analyzer.start();
        } else {
            startBackground();
        }

        this.gameState = "PLAY";
    }

    // Transition to END state — collaborative: always show both colors together
    startEnd() {
        if (this.playMode === "mp3") {
            mp3Analyzer.stop();
        }
        stopBackground();
        // Collaborative game: always split-fill with both player colors
        this.endAnimation = new EndAnimation(displaySize, null, true);
        this.gameState = "END";
    }

    // Try to hit a beat for a given player
    tryHit(_player) {
        if (this.gameState !== "PLAY") return;

        let bestBeat = null;
        let bestDist = Infinity;

        for (let b of this.beats) {
            if (b.player === _player && b.active && !b.hit) {
                let d = b.distanceFromHitZone();
                if (d < bestDist) {
                    bestDist = d;
                    bestBeat = b;
                }
            }
        }

        // Wider window for MP3 mode since beats move faster
        let hitWindow = (this.playMode === "mp3") ? 4.0 : 2.5;
        let perfectWindow = (this.playMode === "mp3") ? 2.0 : 1.0;

        if (bestBeat && bestDist <= hitWindow) {
            bestBeat.hit = true;
            bestBeat.active = false;

            let hitType;
            let volume;

            if (bestDist <= perfectWindow) {
                hitType = 'perfect';
                volume = 1.0;
                if (_player === 1) { this.p1Combo++; this.p1Score += 300; }
                else { this.p2Combo++; this.p2Score += 300; }
            } else {
                hitType = 'good';
                volume = 0.6;
                if (_player === 1) { this.p1Combo++; this.p1Score += 100; }
                else { this.p2Combo++; this.p2Score += 100; }
            }

            playSound(bestBeat.sound, volume);
            this.animations.push(new FeedbackAnimation(bestBeat.hitZone, hitType, displaySize));
        }
    }
}


// Keyboard input
function keyPressed() {

    if (controller.gameState === "READY") {
        // Go to mode selection
        controller.gameState = "SELECT";
        return;
    }

    if (controller.gameState === "SELECT") {
        // Press 1 for hardcoded mode
        if (key === '1') {
            controller.playMode = "hardcoded";
            playMode = "hardcoded";
            controller.startPlay();
        }
        // Press 2 for MP3 mode (only if loaded)
        if (key === '2' && mp3Analyzer && mp3Analyzer.loaded) {
            controller.playMode = "mp3";
            playMode = "mp3";
            controller.startPlay();
        }
        return;
    }

    if (controller.gameState === "PLAY") {
        // P1: A or D
        if (key === 'A' || key === 'a' || key === 'D' || key === 'd') {
            controller.tryHit(1);
        }
        // P2: J or L
        if (key === 'J' || key === 'j' || key === 'L' || key === 'l') {
            controller.tryHit(2);
        }
    }

    if (controller.gameState === "END") {
        // R to restart
        if (key === 'R' || key === 'r') {
            controller.reset();
        }
    }
}
