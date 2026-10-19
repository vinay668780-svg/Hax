export interface EyeOffset {
  x: number;
  y: number;
}

export interface LullabyNote {
  id: string;
  label: string;
  solfege: string;
  frequency: number;
  color: string;
  dreamEffect: string;
}

export interface GuestbookEntry {
  id: string;
  visitorName: string;
  creatureType: string;
  bedtimeWish: string;
  favoriteProject: string;
  timestamp: string;
  source?: 'server' | 'local';
}

export interface GuestbookValidationResult {
  valid: boolean;
  errors: {
    visitorName?: string;
    creatureType?: string;
    bedtimeWish?: string;
  };
}

export interface VisitorMemoryState {
  visitCount: number;
  visitorName: string;
  creatureType: string;
  favoriteNote: string;
  lastSeenIso: string;
  unlockedEasterEgg: boolean;
}

export interface PipChatMessage {
  id: string;
  sender: 'visitor' | 'pip';
  text: string;
  timestamp: string;
  moodTag?: string;
  suggestedNote?: string;
}

export const LULLABY_NOTES: LullabyNote[] = [
  {
    id: 'C5',
    label: 'C5',
    solfege: 'Do · Cloud Pillow',
    frequency: 523.25,
    color: '#a34063',
    dreamEffect: 'Fluffs the nearest cumulonimbus pillow by 14%.',
  },
  {
    id: 'D5',
    label: 'D5',
    solfege: 'Re · Amber Glow',
    frequency: 587.33,
    color: '#d97706',
    dreamEffect: 'Warms up sleepy eye-socket pinpricks to 2,200K.',
  },
  {
    id: 'E5',
    label: 'E5',
    solfege: 'Mi · Starlight Bow',
    frequency: 659.25,
    color: '#b45309',
    dreamEffect: 'Untangles crooked nightmares into cotton-candy ribbons.',
  },
  {
    id: 'G5',
    label: 'G5',
    solfege: 'Sol · Rooftop Breeze',
    frequency: 783.99,
    color: '#7c3aed',
    dreamEffect: 'Guides nocturnal paper lanterns over chimney pots.',
  },
  {
    id: 'A5',
    label: 'A5',
    solfege: 'La · Velvet Yawn',
    frequency: 880.0,
    color: '#0d9488',
    dreamEffect: 'Slows nursery cricket chirps to 48 beats per minute.',
  },
  {
    id: 'C6',
    label: 'C6',
    solfege: 'Do · Midnight Chime',
    frequency: 1046.5,
    color: '#e11d48',
    dreamEffect: 'Seals the dream parcel with a silver wax crescent.',
  },
];

/**
 * Calculates clamped pupil offset (x, y) inside Pip's soft eye sockets.
 */
export function calculateEyeOffset(
  cursorX: number,
  cursorY: number,
  centerX: number,
  centerY: number,
  maxRadius = 7
): EyeOffset {
  if (maxRadius <= 0) {
    return { x: 0, y: 0 };
  }
  const dx = cursorX - centerX;
  const dy = cursorY - centerY;
  const distance = Math.hypot(dx, dy);

  if (distance === 0) {
    return { x: 0, y: 0 };
  }

  const clampedDistance = Math.min(distance / 18, maxRadius);
  const angle = Math.atan2(dy, dx);

  return {
    x: Number((Math.cos(angle) * clampedDistance).toFixed(2)),
    y: Number((Math.sin(angle) * clampedDistance).toFixed(2)),
  };
}

/**
 * Formats a hit counter number into a fixed-width array of digit characters for vintage odometer display.
 */
export function formatOdometerDigits(count: number, totalDigits = 7): string[] {
  const safeCount = Math.max(0, Math.floor(Number.isFinite(count) ? count : 0));
  return String(safeCount).padStart(totalDigits, '0').slice(-totalDigits).split('');
}

/**
 * Validates guestbook input strictly without silently substituting fallback values.
 */
export function validateGuestbookInput(input: {
  visitorName: string;
  creatureType: string;
  bedtimeWish: string;
}): GuestbookValidationResult {
  const errors: GuestbookValidationResult['errors'] = {};
  const trimmedName = input.visitorName.trim();
  const trimmedCreature = input.creatureType.trim();
  const trimmedWish = input.bedtimeWish.trim();

  if (!trimmedName) {
    errors.visitorName = 'Please enter your name or sleepy alias.';
  } else if (trimmedName.length > 40) {
    errors.visitorName = 'Name must be 40 characters or fewer.';
  }

  if (!trimmedCreature) {
    errors.creatureType = 'Please specify what kind of creature you are.';
  }

  if (!trimmedWish) {
    errors.bedtimeWish = 'Please write a short bedtime note or dream request for Pip.';
  } else if (trimmedWish.length < 4) {
    errors.bedtimeWish = 'Bedtime note must be at least 4 characters long.';
  } else if (trimmedWish.length > 220) {
    errors.bedtimeWish = 'Bedtime note must be 220 characters or fewer.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Advances the hidden Easter egg state machine (unlocks at threshold, default 3 clicks).
 */
export function advanceEasterEggProgress(
  currentClicks: number,
  threshold = 3
): { clicks: number; unlocked: boolean; justUnlocked: boolean } {
  const nextClicks = Math.max(0, Math.floor(currentClicks)) + 1;
  const unlocked = nextClicks >= threshold;
  const justUnlocked = nextClicks === threshold;
  return {
    clicks: nextClicks,
    unlocked,
    justUnlocked,
  };
}

/**
 * Counts words in an origin story scene to guarantee strict compliance with the <150 words rule.
 */
export function countSceneWords(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}

/**
 * Formats a personalized in-character greeting based on Returning Visitor Memory (Tier 3).
 */
export function formatReturningGreeting(memory: VisitorMemoryState): string {
  const name = memory.visitorName.trim() || 'Sleepy Traveler';
  const species = memory.creatureType.trim() || 'Night-Shift Friend';
  if (memory.visitCount <= 1) {
    return `First time in Attic Crib #4! Welcome, ${name} (${species}) — I’ve tuned the brass music box to ${memory.favoriteNote} just for your arrival.`;
  }
  const secretSuffix = memory.unlockedEasterEgg
    ? ' Your Golden Dream Weaver badge is still shining on the nursery wall!'
    : ' I saved your favorite cloud pillow by the window.';
  return `Welcome back, ${name} (${species})! This is your Visit #${memory.visitCount} to Midnight Nursery — I kept your ${memory.favoriteNote} chime warm.${secretSuffix}`;
}

/**
 * Deterministic in-character dialogue engine for Pip, The Skull Baby (Tier 3 Character Chats Back).
 */
export function generatePipDialogueReply(
  userMessage: string,
  visitorName = 'Sleepy Friend',
  favoriteNote = 'C5'
): { reply: string; moodTag: string; suggestedNote: string } {
  const clean = userMessage.trim().toLowerCase();
  const safeName = visitorName.trim() || 'Sleepy Friend';

  if (!clean) {
    return {
      reply: `*adjusts pink nightcap bow* Tell me what kind of dream you need tonight, ${safeName}, and I’ll wind the brass music box!`,
      moodTag: 'Attentive · 2,200K Glow',
      suggestedNote: favoriteNote,
    };
  }

  if (clean.includes('scary') || clean.includes('spook') || clean.includes('monster') || clean.includes('skeleton') || clean.includes('skull') || clean.includes('ghost')) {
    return {
      reply: `*giggles with a tiny porcelain rattle* Oh no, I’m never spooky! When I hatched from a dandelion star, my "Boo!" came out as a C-major lullaby chord. I use frosted 1,800K star-glass lanterns so coat racks only cast bunny shadows for you, ${safeName}.`,
      moodTag: 'Reassuring · Zero Shadows',
      suggestedNote: 'D5',
    };
  }

  if (clean.includes('lullaby') || clean.includes('music') || clean.includes('song') || clean.includes('sing') || clean.includes('chime')) {
    return {
      reply: `*winds the brass key three turns to the right* My Lullaby Lab uses 6 celesta tines tuned from C5 to C6! Try tapping G5 (Sol) and E5 (Mi) together—it slows cricket chirps to 48 BPM and fluffs every pillow within four rooftops.`,
      moodTag: 'Musical · Celesta Harmonics',
      suggestedNote: 'G5',
    };
  }

  if (clean.includes('dream') || clean.includes('sleep') || clean.includes('tired') || clean.includes('insomnia') || clean.includes('bedtime')) {
    return {
      reply: `*scribbles in warm berry ink* Prescription for ${safeName}: Parcel #42—one floating cinnamon-brioche cloud dream, lowered down your chimney at 11:15 PM on a silk thread, paired with a soft A5 Velvet Yawn chime.`,
      moodTag: 'Dream Prescription Ready',
      suggestedNote: 'A5',
    };
  }

  if (clean.includes('bow') || clean.includes('hat') || clean.includes('cap') || clean.includes('secret') || clean.includes('easter')) {
    return {
      reply: `*blushes warm amber* My quilted indigo nightcap adds 1.5 cloud-inches to my height on the nursery doorframe! Psst… if you tap my pink ribbon bow 3 times, my secret Golden Dream Weaver chord unlocks!`,
      moodTag: 'Playful · Secret Keeper',
      suggestedNote: 'E5',
    };
  }

  if (clean.includes('3d') || clean.includes('cloud') || clean.includes('fly') || clean.includes('glider') || clean.includes('rooftop')) {
    return {
      reply: `*pats the plump cumulonimbus glider* We cruise at 42 feet above Whispering Chimney Lane! You can spin my 3D Cloud Glider right in the portrait studio to inspect my brass lantern and starry nightcap from every angle.`,
      moodTag: 'Cloud Pilot · 4 kt Tailwind',
      suggestedNote: 'C6',
    };
  }

  return {
    reply: `*tilts smooth round skull with glowing amber eye-pinpricks* I wrote that down in my Midnight Nursery logbook for you, ${safeName}! Remember: good things start small—especially a cozy ${favoriteNote} chime before midnight.`,
    moodTag: 'Cozy · Junior Dream Engineer',
    suggestedNote: favoriteNote,
  };
}
