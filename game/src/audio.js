// Every sound in the game, synthesised with WebAudio: no audio files, no
// network, nothing to load. The context is created on the first user gesture
// (a click or a key), so the game stays silent on the title screen until the
// player touches it, and muted state is remembered for the visit.

export function createSoundBank() {
  let context = null;
  let muted = false;
  let master = null;

  function ensureContext() {
    if (context) return context;
    const AudioContext = window.AudioContext ?? window.webkitAudioContext;
    if (!AudioContext) return null;
    context = new AudioContext();
    master = context.createGain();
    master.gain.value = 0.5;
    master.connect(context.destination);
    return context;
  }

  function tone({ frequency, endFrequency, type, duration, volume, delay }) {
    if (muted) return;
    const audio = ensureContext();
    if (!audio) return;
    if (audio.state === 'suspended') void audio.resume();
    const startAt = audio.currentTime + (delay ?? 0);
    const oscillator = audio.createOscillator();
    const gain = audio.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, startAt);
    if (endFrequency) oscillator.frequency.exponentialRampToValueAtTime(endFrequency, startAt + duration);
    gain.gain.setValueAtTime(0.0001, startAt);
    gain.gain.exponentialRampToValueAtTime(volume, startAt + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);
    oscillator.connect(gain);
    gain.connect(master);
    oscillator.start(startAt);
    oscillator.stop(startAt + duration + 0.05);
  }

  return {
    /** Call from any click or key handler so later sounds are allowed. */
    unlock() {
      ensureContext();
    },

    get muted() {
      return muted;
    },

    toggleMute() {
      muted = !muted;
      return muted;
    },

    /** A soft UI blip for buttons and menu moves. */
    click() {
      tone({ frequency: 660, type: 'sine', duration: 0.07, volume: 0.25 });
    },

    /** The satisfying two-note chime when a difference is found. */
    found() {
      tone({ frequency: 659.25, type: 'sine', duration: 0.16, volume: 0.4 });
      tone({ frequency: 880, type: 'sine', duration: 0.28, volume: 0.4, delay: 0.09 });
      tone({ frequency: 1318.5, type: 'triangle', duration: 0.2, volume: 0.18, delay: 0.09 });
    },

    /** A low buzz for a click on nothing. */
    wrong() {
      tone({ frequency: 160, endFrequency: 90, type: 'square', duration: 0.18, volume: 0.2 });
    },

    /** A rising sparkle when a hint reveals a difference. */
    hint() {
      tone({ frequency: 523.25, type: 'sine', duration: 0.12, volume: 0.3 });
      tone({ frequency: 783.99, type: 'sine', duration: 0.12, volume: 0.3, delay: 0.08 });
      tone({ frequency: 1046.5, type: 'sine', duration: 0.2, volume: 0.3, delay: 0.16 });
    },

    /** A short tick when the timer runs low. */
    tick() {
      tone({ frequency: 1200, type: 'square', duration: 0.04, volume: 0.12 });
    },

    /** A little fanfare when a level is cleared. */
    levelClear() {
      [523.25, 659.25, 783.99, 1046.5].forEach((frequency, index) => {
        tone({ frequency, type: 'triangle', duration: 0.22, volume: 0.35, delay: index * 0.11 });
      });
    },

    /** A longer fanfare for finishing all three scenes. */
    victory() {
      [523.25, 659.25, 783.99, 1046.5, 783.99, 1046.5, 1318.5].forEach((frequency, index) => {
        tone({ frequency, type: 'triangle', duration: 0.26, volume: 0.35, delay: index * 0.13 });
      });
    },
  };
}
