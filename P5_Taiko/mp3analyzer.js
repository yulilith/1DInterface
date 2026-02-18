// MP3 Analyzer: loads an MP3 and detects beats using spectral flux
// Uses 3 frequency bands for variety:
//   Bass → P1 (don), Mid → alternates (note_C/E/G), Treble → P2 (ka)
// Includes player balancing so both players stay engaged

class MP3Analyzer {

    constructor() {
        this.sound = null;
        this.fft = null;
        this.loaded = false;
        this.playing = false;

        // 30-second limit for prototype
        this.MAX_DURATION = 30;
        this.startTime = 0;

        // Previous frame energy per band (for spectral flux)
        this.prevBass = 0;
        this.prevMid = 0;
        this.prevTreble = 0;

        // Rolling flux history per band (short window for local comparison)
        this.bassFluxHistory = [];
        this.midFluxHistory = [];
        this.trebleFluxHistory = [];
        this.HISTORY_LENGTH = 30;       // 0.5s window

        // How much the flux must exceed the local average to trigger
        this.FLUX_MULTIPLIER = 1.6;

        // Minimum flux to avoid triggering on silence
        this.MIN_FLUX = 8;

        // Cooldowns per player (not per band) to prevent overwhelming
        this.p1Cooldown = 0;
        this.p2Cooldown = 0;
        this.COOLDOWN_FRAMES = 12;      // ~0.2s at 60fps

        // Player balance tracking
        this.p1Count = 0;
        this.p2Count = 0;

        // Mid-band note rotation
        this.noteIndex = 0;
        this.notes = ['note_C', 'note_E', 'note_G'];
    }

    loadTrack(path) {
        this.sound = loadSound(path,
            () => { this.loaded = true; },
            (err) => { console.warn('MP3 load failed:', err); this.loaded = false; }
        );
    }

    start() {
        if (!this.loaded) return;

        if (getAudioContext().state !== 'running') {
            getAudioContext().resume();
        }

        this.fft = new p5.FFT(0.6, 512);
        this.fft.setInput(this.sound);
        this.sound.play();
        this.playing = true;
        this.startTime = millis();

        // Reset state
        this.prevBass = 0;
        this.prevMid = 0;
        this.prevTreble = 0;
        this.bassFluxHistory = [];
        this.midFluxHistory = [];
        this.trebleFluxHistory = [];
        this.p1Cooldown = 0;
        this.p2Cooldown = 0;
        this.p1Count = 0;
        this.p2Count = 0;
        this.noteIndex = 0;
    }

    analyze() {
        if (!this.playing || !this.sound.isPlaying()) return [];

        // Enforce 30-second limit
        let elapsed = (millis() - this.startTime) / 1000;
        if (elapsed >= this.MAX_DURATION) {
            this.stop();
            return [];
        }

        this.fft.analyze();

        // Get energy per band (0-255)
        let bass = this.fft.getEnergy("bass");
        let mid = this.fft.getEnergy("mid");
        let treble = this.fft.getEnergy("treble");

        // Spectral flux = positive energy change from previous frame
        let bassFlux = Math.max(0, bass - this.prevBass);
        let midFlux = Math.max(0, mid - this.prevMid);
        let trebleFlux = Math.max(0, treble - this.prevTreble);

        this.prevBass = bass;
        this.prevMid = mid;
        this.prevTreble = treble;

        // Update flux history
        this.bassFluxHistory.push(bassFlux);
        this.midFluxHistory.push(midFlux);
        this.trebleFluxHistory.push(trebleFlux);
        if (this.bassFluxHistory.length > this.HISTORY_LENGTH) this.bassFluxHistory.shift();
        if (this.midFluxHistory.length > this.HISTORY_LENGTH) this.midFluxHistory.shift();
        if (this.trebleFluxHistory.length > this.HISTORY_LENGTH) this.trebleFluxHistory.shift();

        // Compute local average flux per band
        let bassAvg = this.bassFluxHistory.reduce((a, b) => a + b, 0) / this.bassFluxHistory.length;
        let midAvg = this.midFluxHistory.reduce((a, b) => a + b, 0) / this.midFluxHistory.length;
        let trebleAvg = this.trebleFluxHistory.reduce((a, b) => a + b, 0) / this.trebleFluxHistory.length;

        // Decrement cooldowns
        if (this.p1Cooldown > 0) this.p1Cooldown--;
        if (this.p2Cooldown > 0) this.p2Cooldown--;

        let newBeats = [];

        // Bass onset → P1 (don)
        let bassPeak = bassFlux > Math.max(this.MIN_FLUX, bassAvg * this.FLUX_MULTIPLIER);
        // Treble onset → P2 (ka)
        let treblePeak = trebleFlux > Math.max(this.MIN_FLUX, trebleAvg * this.FLUX_MULTIPLIER);
        // Mid onset → whichever player needs more beats (melodic notes)
        let midPeak = midFlux > Math.max(this.MIN_FLUX, midAvg * this.FLUX_MULTIPLIER);

        if (bassPeak && this.p1Cooldown === 0) {
            newBeats.push({ player: 1, sound: 'don' });
            this.p1Cooldown = this.COOLDOWN_FRAMES;
            this.p1Count++;
        }

        if (treblePeak && this.p2Cooldown === 0) {
            newBeats.push({ player: 2, sound: 'ka' });
            this.p2Cooldown = this.COOLDOWN_FRAMES;
            this.p2Count++;
        }

        // Mid-band: assign to whichever player is behind, for balance
        if (midPeak) {
            let sound = this.notes[this.noteIndex % this.notes.length];
            this.noteIndex++;

            if (this.p1Count <= this.p2Count && this.p1Cooldown === 0) {
                newBeats.push({ player: 1, sound: sound });
                this.p1Cooldown = this.COOLDOWN_FRAMES;
                this.p1Count++;
            } else if (this.p2Cooldown === 0) {
                newBeats.push({ player: 2, sound: sound });
                this.p2Cooldown = this.COOLDOWN_FRAMES;
                this.p2Count++;
            }
        }

        return newBeats;
    }

    stop() {
        if (this.sound && this.sound.isPlaying()) {
            this.sound.stop();
        }
        this.playing = false;
    }

    isFinished() {
        if (!this.loaded || !this.playing) return false;
        let elapsed = (millis() - this.startTime) / 1000;
        return !this.sound.isPlaying() || elapsed >= this.MAX_DURATION;
    }
}
