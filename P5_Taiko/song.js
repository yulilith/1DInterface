// Collaborative song — pentatonic melody over gentle drums
// P1 (pink) = DRUMS: don (warm bass), ka (soft tap)
// P2 (blue) = MELODY: C D E G A C5 pentatonic scale (always consonant)
// The melody uses real musical phrases that repeat and develop
// ~70 beats at 100 BPM over ~28 seconds

const TEMPO_BPM = 100;
const BEAT_DURATION = 60 / TEMPO_BPM; // 0.6s per quarter note

const SONG_PATTERN = [

  // === INTRO: Drums alone, then melody gently enters (0.6s - 4.8s) ===

  { time: 0.6,  player: 1, sound: 'don' },
  { time: 1.2,  player: 1, sound: 'don' },
  { time: 1.8,  player: 1, sound: 'ka' },
  { time: 2.4,  player: 1, sound: 'don' },

  // Melody enters with Phrase A: E - G - A - G  (a gentle, singable motif)
  { time: 3.0,  player: 1, sound: 'don' },
  { time: 3.0,  player: 2, sound: 'note_E' },
  { time: 3.6,  player: 1, sound: 'ka' },
  { time: 3.6,  player: 2, sound: 'note_G' },
  { time: 4.2,  player: 1, sound: 'don' },
  { time: 4.2,  player: 2, sound: 'note_A' },
  { time: 4.8,  player: 1, sound: 'don' },
  { time: 4.8,  player: 2, sound: 'note_G' },

  // === SECTION 1: Phrase A repeats, then resolves down (5.4s - 10.2s) ===

  // Phrase A again: E - G - A - G
  { time: 5.4,  player: 1, sound: 'ka' },
  { time: 5.4,  player: 2, sound: 'note_E' },
  { time: 6.0,  player: 1, sound: 'don' },
  { time: 6.0,  player: 2, sound: 'note_G' },
  { time: 6.6,  player: 1, sound: 'don' },
  { time: 6.6,  player: 2, sound: 'note_A' },
  { time: 7.2,  player: 1, sound: 'ka' },
  { time: 7.2,  player: 2, sound: 'note_G' },

  // Phrase B — resolving descent: E - D - C (landing home)
  { time: 7.8,  player: 1, sound: 'don' },
  { time: 7.8,  player: 2, sound: 'note_E' },
  { time: 8.4,  player: 1, sound: 'don' },
  { time: 8.4,  player: 2, sound: 'note_D' },
  { time: 9.0,  player: 1, sound: 'ka' },
  { time: 9.0,  player: 2, sound: 'note_C' },

  // Breath — drums alone
  { time: 9.6,  player: 1, sound: 'don' },
  { time: 10.2, player: 1, sound: 'ka' },

  // === SECTION 2: Melody reaches higher — Phrase C (10.8s - 16.8s) ===

  // Phrase C — ascending to the peak: C - E - G - A - C5
  { time: 10.8, player: 1, sound: 'don' },
  { time: 10.8, player: 2, sound: 'note_C' },
  { time: 11.4, player: 1, sound: 'don' },
  { time: 11.4, player: 2, sound: 'note_E' },
  { time: 12.0, player: 1, sound: 'ka' },
  { time: 12.0, player: 2, sound: 'note_G' },
  { time: 12.6, player: 1, sound: 'don' },
  { time: 12.6, player: 2, sound: 'note_A' },
  { time: 13.2, player: 1, sound: 'don' },
  { time: 13.2, player: 2, sound: 'note_C5' },

  // Phrase D — gentle descent from the peak: A - G - E - D - C
  { time: 13.8, player: 1, sound: 'ka' },
  { time: 13.8, player: 2, sound: 'note_A' },
  { time: 14.4, player: 1, sound: 'don' },
  { time: 14.4, player: 2, sound: 'note_G' },
  { time: 15.0, player: 1, sound: 'don' },
  { time: 15.0, player: 2, sound: 'note_E' },
  { time: 15.6, player: 1, sound: 'ka' },
  { time: 15.6, player: 2, sound: 'note_D' },
  { time: 16.2, player: 1, sound: 'don' },
  { time: 16.2, player: 2, sound: 'note_C' },

  // Breath
  { time: 16.8, player: 1, sound: 'don' },

  // === SECTION 3: Development — phrases woven together (17.4s - 22.8s) ===

  // Phrase A variation with eighth-note melody: E G A G E D
  { time: 17.4, player: 1, sound: 'ka' },
  { time: 17.4, player: 2, sound: 'note_E' },
  { time: 17.7, player: 2, sound: 'note_G' },
  { time: 18.0, player: 1, sound: 'don' },
  { time: 18.0, player: 2, sound: 'note_A' },
  { time: 18.3, player: 2, sound: 'note_G' },
  { time: 18.6, player: 1, sound: 'don' },
  { time: 18.6, player: 2, sound: 'note_E' },
  { time: 19.2, player: 1, sound: 'ka' },
  { time: 19.2, player: 2, sound: 'note_D' },

  // Leap up and back: C - G - A - C5 - A - G
  { time: 19.8, player: 1, sound: 'don' },
  { time: 19.8, player: 2, sound: 'note_C' },
  { time: 20.1, player: 2, sound: 'note_G' },
  { time: 20.4, player: 1, sound: 'don' },
  { time: 20.4, player: 2, sound: 'note_A' },
  { time: 20.7, player: 2, sound: 'note_C5' },
  { time: 21.0, player: 1, sound: 'ka' },
  { time: 21.0, player: 2, sound: 'note_A' },
  { time: 21.6, player: 1, sound: 'don' },
  { time: 21.6, player: 2, sound: 'note_G' },

  // Settling: E - D - C
  { time: 22.2, player: 1, sound: 'don' },
  { time: 22.2, player: 2, sound: 'note_E' },
  { time: 22.5, player: 1, sound: 'ka' },
  { time: 22.8, player: 1, sound: 'don' },
  { time: 22.8, player: 2, sound: 'note_D' },

  // === SECTION 4: Finale — Phrase A one last time, rising to C5 (23.4s - 27.6s) ===

  // Final statement of the melody, slow and full
  { time: 23.4, player: 1, sound: 'don' },
  { time: 23.4, player: 2, sound: 'note_E' },
  { time: 24.0, player: 1, sound: 'don' },
  { time: 24.0, player: 2, sound: 'note_G' },
  { time: 24.6, player: 1, sound: 'ka' },
  { time: 24.6, player: 2, sound: 'note_A' },
  { time: 25.2, player: 1, sound: 'don' },
  { time: 25.2, player: 2, sound: 'note_G' },

  // Final ascent to high C — the climax
  { time: 25.8, player: 1, sound: 'don' },
  { time: 25.8, player: 2, sound: 'note_A' },
  { time: 26.4, player: 1, sound: 'ka' },
  { time: 26.4, player: 2, sound: 'note_C5' },

  // Last note — both land together
  { time: 27.0, player: 1, sound: 'don' },
  { time: 27.0, player: 2, sound: 'note_C' },
];
