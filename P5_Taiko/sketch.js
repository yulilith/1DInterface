/* /////////////////////////////////////

  4.043 / 4.044 Design Studio: Interaction Intelligence
  1D Rhythm Game (Taiko-style)

*/ /////////////////////////////////////

let displaySize = 60;   // how many pixels are visible
let pixelSize = 15;     // how big each 'pixel' looks on screen

let display;            // display buffer
let controller;         // state machine and game logic
let mp3Analyzer;        // MP3 loader + beat detector
let playMode = "hardcoded";  // "hardcoded" or "mp3"


function preload() {
  mp3Analyzer = new MP3Analyzer();
  mp3Analyzer.loadTrack('Chala_Head_Chala.mp3');
}

function setup() {
  createCanvas(displaySize * pixelSize, pixelSize);
  frameRate(60);

  display = new Display(displaySize, pixelSize);
  controller = new Controller();
}

function draw() {
  background(0, 0, 0);
  controller.update();
  display.show();

  // Update background chord progression while playing in hardcoded mode
  if (bgPlaying && playMode === "hardcoded") {
    updateBackgroundChords();
  }
}


// =========================================================
// BACKGROUND MUSIC — warm guitar-like pad with chord changes
// =========================================================

// Chord progression (low octave, pentatonic-friendly)
// C major → A minor → C major → G sus (no B, stays pentatonic)
const BG_CHORDS = [
  [130.81, 164.81, 196.00],  // C3, E3, G3  (C major)
  [110.00, 130.81, 164.81],  // A2, C3, E3  (A minor)
  [130.81, 164.81, 196.00],  // C3, E3, G3  (C major)
  [98.00,  146.83, 196.00],  // G2, D3, G3  (G5 power chord)
];

let bgOscs = [];           // 3 sawtooth oscillators for the pad
let bgPlaying = false;
let bgChordIndex = 0;
let bgChordStartTime = 0;
const BG_CHORD_DURATION = 3600;  // ms per chord (~6 beats at 100bpm)
const BG_VOLUME = 0.035;         // very subtle

function startBackground() {
  if (bgPlaying) return;

  if (getAudioContext().state !== 'running') {
    getAudioContext().resume();
  }

  bgChordIndex = 0;
  bgChordStartTime = millis();

  let chord = BG_CHORDS[0];
  bgOscs = [];

  for (let i = 0; i < 3; i++) {
    let osc = new p5.Oscillator('sawtooth');
    osc.freq(chord[i]);
    osc.amp(0);
    osc.start();
    // Fade in gently
    osc.amp(BG_VOLUME, 1.0);
    bgOscs.push(osc);
  }

  bgPlaying = true;
}

function updateBackgroundChords() {
  if (!bgPlaying || bgOscs.length === 0) return;

  let elapsed = millis() - bgChordStartTime;

  // Time to change chord?
  if (elapsed >= BG_CHORD_DURATION) {
    bgChordIndex = (bgChordIndex + 1) % BG_CHORDS.length;
    bgChordStartTime = millis();

    let chord = BG_CHORDS[bgChordIndex];
    for (let i = 0; i < 3; i++) {
      // Glide to new frequencies smoothly over 0.3s
      bgOscs[i].freq(chord[i], 0.3);
    }
  }
}

function stopBackground() {
  if (!bgPlaying) return;

  for (let osc of bgOscs) {
    osc.amp(0, 0.5);  // fade out over 0.5s
    setTimeout(() => { osc.stop(); osc.dispose(); }, 600);
  }

  bgOscs = [];
  bgPlaying = false;
}


// =========================================================
// HIT SOUNDS — drums and melody notes
// =========================================================

// Helper: create a melodic note with warm sine tone and gentle envelope
function playMelodyNote(freq, vol, duration) {
  let osc = new p5.Oscillator('sine');
  let env = new p5.Envelope();
  env.setADSR(0.02, 0.15, 0.25, 0.4);
  env.setRange(vol * 0.35, 0);
  osc.freq(freq);
  osc.amp(0);
  osc.start();
  env.play(osc);
  setTimeout(() => { osc.stop(); osc.dispose(); }, duration);
}

function playSound(_type, _volume) {
  // In MP3 mode, the MP3 is the soundtrack — skip oscillator sounds
  if (playMode === "mp3") return;

  if (getAudioContext().state !== 'running') {
    getAudioContext().resume();
  }

  let vol = _volume || 1.0;

  switch (_type) {

    case 'don': {
      // Soft, warm drum — sine @ 120Hz with gentle decay
      let osc = new p5.Oscillator('sine');
      let env = new p5.Envelope();
      env.setADSR(0.005, 0.2, 0.0, 0.15);
      env.setRange(vol * 0.4, 0);
      osc.freq(120);
      osc.amp(0);
      osc.start();
      env.play(osc);
      setTimeout(() => { osc.stop(); osc.dispose(); }, 450);
      break;
    }

    case 'ka': {
      // Gentle tap — soft noise
      let noise = new p5.Noise('white');
      let env = new p5.Envelope();
      env.setADSR(0.001, 0.04, 0.0, 0.03);
      env.setRange(vol * 0.18, 0);
      noise.amp(0);
      noise.start();
      env.play(noise);
      setTimeout(() => { noise.stop(); noise.dispose(); }, 150);
      break;
    }

    // Pentatonic scale: C D E G A  +  high C5
    case 'note_C':  { playMelodyNote(262, vol, 800); break; }
    case 'note_D':  { playMelodyNote(294, vol, 800); break; }
    case 'note_E':  { playMelodyNote(330, vol, 800); break; }
    case 'note_G':  { playMelodyNote(392, vol, 800); break; }
    case 'note_A':  { playMelodyNote(440, vol, 800); break; }
    case 'note_C5': { playMelodyNote(523, vol, 900); break; }

    default:
      break;
  }
}
