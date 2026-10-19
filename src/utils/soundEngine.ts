// Web Audio API Synthesizer for Pip's Lullaby Lab & Tactile Nursery Clicks

let sharedAudioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtx) return null;
  if (!sharedAudioCtx) {
    sharedAudioCtx = new AudioCtx();
  }
  if (sharedAudioCtx.state === 'suspended') {
    sharedAudioCtx.resume().catch(() => {});
  }
  return sharedAudioCtx;
}

/**
 * Plays a soft wooden nursery button click or toggle sound when not muted.
 */
export function playUiClick(isMuted: boolean, pitchMultiplier = 1): void {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(520 * pitchMultiplier, now);
    osc.frequency.exponentialRampToValueAtTime(780 * pitchMultiplier, now + 0.065);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.075);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.08);
  } catch {
    // Ignore audio context restrictions in headless or un-interacted frames
  }
}

/**
 * Plays a warm celesta / music-box bell note with harmonic overtone.
 */
export function playMusicBoxNote(frequency: number, isMuted: boolean, duration = 1.15): void {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // Primary warm sine bell
    const mainOsc = ctx.createOscillator();
    const mainGain = ctx.createGain();
    mainOsc.type = 'sine';
    mainOsc.frequency.setValueAtTime(frequency, now);

    mainGain.gain.setValueAtTime(0.001, now);
    mainGain.gain.linearRampToValueAtTime(0.14, now + 0.02);
    mainGain.gain.exponentialRampToValueAtTime(0.0008, now + duration);

    // Soft music-box tine overtone (2x harmonic)
    const harmonicOsc = ctx.createOscillator();
    const harmonicGain = ctx.createGain();
    harmonicOsc.type = 'triangle';
    harmonicOsc.frequency.setValueAtTime(frequency * 2, now);

    harmonicGain.gain.setValueAtTime(0.001, now);
    harmonicGain.gain.linearRampToValueAtTime(0.035, now + 0.015);
    harmonicGain.gain.exponentialRampToValueAtTime(0.0005, now + duration * 0.55);

    mainOsc.connect(mainGain);
    harmonicOsc.connect(harmonicGain);
    mainGain.connect(ctx.destination);
    harmonicGain.connect(ctx.destination);

    mainOsc.start(now);
    harmonicOsc.start(now);
    mainOsc.stop(now + duration);
    harmonicOsc.stop(now + duration * 0.6);
  } catch {
    // Ignore audio errors
  }
}

/**
 * Plays a celebratory 4-note golden dream arpeggio when the Easter egg unlocks.
 */
export function playEasterEggArpeggio(isMuted: boolean): void {
  if (isMuted) return;
  const notes = [523.25, 659.25, 783.99, 1046.5];
  notes.forEach((freq, idx) => {
    setTimeout(() => {
      playMusicBoxNote(freq, isMuted, 1.3);
    }, idx * 110);
  });
}
