import { GuestbookEntry } from '../utils/dreamEngine';

export interface ShowcaseProject {
  id: string;
  number: string;
  title: string;
  category: string;
  year: string;
  status: string;
  summary: string;
  craftNotes: string;
  metrics: string;
  image: string;
  imageAlt: string;
  spanWide?: boolean;
  interactiveType: 'lullaby-lab' | 'nightlight' | 'delivery-map' | 'rattle-toy' | 'storybook' | 'growth-chart';
}

export interface StoryScene {
  id: string;
  chapter: string;
  timeOfNight: string;
  title: string;
  location: string;
  narrative: string;
  pipQuote: string;
  image: string;
  accentColor: string;
}

export interface CreativeConcept {
  id: string;
  track: 'Track 1 · Pip the Skull Baby' | 'Track 2 · Original Baby Character';
  title: string;
  vibe: string;
  palette: string;
  signatureMechanic: string;
  whyItWins: string;
  threeProjects: string[];
}

export interface RoadmapPhase {
  id: string;
  hours: string;
  title: string;
  focus: string;
  deliverables: string[];
  goldenTip: string;
}

export interface CodeSnippetItem {
  id: string;
  title: string;
  subtitle: string;
  tierBadge: string;
  code: string;
}

export const PIP_IDENTITY = {
  name: 'Pip, The Skull Baby',
  role: 'Junior Dream Engineer · Midnight Nursery',
  species: 'Porcelain-Smooth Nocturnal Skull Sprite',
  age: '404 Nights Old (Still Teething on Starlight)',
  appearance:
    'Round ivory-cream skull face, oversized velvet eye sockets with warm 2,200K amber pinpricks, a tiny crooked toothless grin, and a quilted indigo nightcap tied with a berry-pink ribbon.',
  personality:
    'Earnest, whisper-quiet, and endlessly proud of small cozy inventions. Takes bedtime punctuality very seriously despite nodding off mid-blueprint.',
  voice:
    'Soft music-box chimes, polite little skull rattles when giggling, and sleepy margin notes scribbled in warm berry ink.',
  motto: 'Good things start small — especially the dreams that tuck a whole neighborhood in.',
};

export const SHOWCASE_PROJECTS: ShowcaseProject[] = [
  {
    id: 'lullaby-lab',
    number: '01',
    title: 'The Lullaby Lab · Brass Cylinder Music Box',
    category: 'Acoustic Dream Synthesis',
    year: 'Autumn 2026',
    status: 'Deployed in 412 Cribs',
    summary:
      'A hand-cranked pentatonic celesta synthesizer that converts restless toss-and-turn frequencies into warm harmonic bell chimes.',
    craftNotes:
      'Built with a 6-pin brass comb tuned to C Major Pentatonic (C5–C6). Every note releases a floating paper-cut star and calms nursery room acoustics by 18 decibels.',
    metrics: '99.4% Yawn Induction within 90 Seconds',
    image: '/baby/assets/pip_lullaby_box.png',
    imageAlt: 'Pip Lullaby Music Box official studio render',
    spanWide: true,
    interactiveType: 'lullaby-lab',
  },
  {
    id: 'nightlight-collection',
    number: '02',
    title: 'Nightlight Collection · Moth-Safe Bedside Lanterns',
    category: 'Warm-Spectrum Illumination',
    year: 'Autumn 2026',
    status: 'Zero Scary Shadows',
    summary:
      'Frosted star-glass lanterns filled with bottled twilight, calibrated between 1,800K Candle Amber and 2,400K Berry Rose.',
    craftNotes:
      'Uses double-diffused cloud glass so bedroom coat racks never cast monster silhouettes on nursery wallpaper.',
    metrics: '3 Tunable Glow Modes · 0% Blue Light',
    image: '/baby/assets/pip_dream_lantern.png',
    imageAlt: 'Pip Dream Nightlight Lantern official studio render',
    spanWide: false,
    interactiveType: 'nightlight',
  },
  {
    id: 'dream-delivery-routes',
    number: '03',
    title: 'Dream Delivery Routes · Rooftop Cloud Glider Map',
    category: 'Nocturnal Logistics & Navigation',
    year: 'Autumn 2026',
    status: '4 Active Chimney Stops',
    summary:
      'Interactive flight telemetry charting Pip’s cumulus cloud glider across Whispering Chimneys, Owlet Hollow, and Baker’s Attic.',
    craftNotes:
      'Plots tailwinds and chimney draft thermals so fragile cinnamon-bun dreams arrive warm before 11:15 PM.',
    metrics: '1,240 Safe Rooftop Landings',
    image: '/baby/assets/pip_avatar_cloud.png',
    imageAlt: 'Pip riding a fluffy cloud glider',
    spanWide: false,
    interactiveType: 'delivery-map',
  },
  {
    id: 'rattle-block-toys',
    number: '04',
    title: 'Rattle & Block Toys · Tactile Sleepiness Blocks',
    category: 'Kinetic Nursery Hardware',
    year: 'Summer 2026',
    status: 'Child & Ghost Tested',
    summary:
      'Playable beechwood alphabet blocks stamped with sleepy runes (A, B, Z) that chime in harmony when stacked or tumbled.',
    craftNotes:
      'Each block is weighted with dried lavender seeds and rounded to a 12mm baby-safe bevel.',
    metrics: '4 Interactive Wooden Blocks',
    image: '/baby/assets/pip_portrait.png',
    imageAlt: 'Pip character portrait with starry nightcap',
    spanWide: false,
    interactiveType: 'rattle-toy',
  },
  {
    id: 'bedtime-storybook',
    number: '05',
    title: 'Bedtime Storybook · The Little Crooked Moonbeam',
    category: 'Illustrated Mini-Folio',
    year: 'Summer 2026',
    status: '3-Page Interactive Flipbook',
    summary:
      'A pocket-sized cloth book sewn with glow-in-the-dark thread for hedgehogs who are afraid of the dark.',
    craftNotes:
      'Printed on crinkle-free cotton rag paper so turning pages never wakes a sleeping sibling.',
    metrics: 'Read Aloud in 1,800+ Burrows',
    image: '/baby/assets/pip_dream_lantern.png',
    imageAlt: 'Bedtime lantern illuminating Pip storybook',
    spanWide: false,
    interactiveType: 'storybook',
  },
  {
    id: 'nursery-growth-chart',
    number: '06',
    title: 'Pip’s Growth Chart · Nursery Wall Skill Marks',
    category: 'Career & Craft Milestones',
    year: '2025 – 2026',
    status: '32.5 Cloud-Inches Tall',
    summary:
      'Pencil marks on the Midnight Nursery doorframe tracking Pip’s promotion from Apprentice Pillow Fluffer to Junior Dream Engineer.',
    craftNotes:
      'Measured every full moon while wearing the official pink-bow nightcap (which adds 1.5 inches of purely decorative height).',
    metrics: '5 Certified Dream-Craft Badges',
    image: '/baby/assets/pip_avatar_cloud.png',
    imageAlt: 'Pip growth chart portrait',
    spanWide: true,
    interactiveType: 'growth-chart',
  },
];

// Each scene is strictly < 75 words (well under the 150-word hackathon limit)
export const ORIGIN_STORY_SCENES: StoryScene[] = [
  {
    id: 'scene-1',
    chapter: 'Scene 01 · 08:30 PM',
    timeOfNight: 'Dusk at the Nursery Window',
    title: 'The Little Skull Who Couldn’t Spook',
    location: 'Attic Crib #4, Midnight Nursery',
    narrative:
      'When Pip hatched from a fallen dandelion star, the older night-sprites expected a spooky rattling skeleton. Instead, Pip had a smooth teacup-warm skull, huge velvet eye sockets glowing with gentle amber pinpricks, and a crooked little smile. Whenever Pip tried to say "Boo!", it came out as a soft music-box chord that made the attic mice curl up and purr.',
    pipQuote: '“Maybe spooky is overrated. What if the dark was just a softer blanket?”',
    image: '/baby/assets/pip_portrait.png',
    accentColor: '#a34063',
  },
  {
    id: 'scene-2',
    chapter: 'Scene 02 · 09:45 PM',
    timeOfNight: 'The First Tinker Bench',
    title: 'Winding the Brass Lullaby Box',
    location: 'The Clockwork Toy Chest',
    narrative:
      'Down in the village, baby badgers and owlets were tossing and turning because the wind whistled too sharply through the eaves. Pip climbed into a cedar toy chest, borrowed three brass clock gears and a pink ribbon bow, and soldered together the very first Lullaby Box. One turn of its key filled the rafters with warm cinnamon-sweet chimes.',
    pipQuote: '“Three turns to the right, one tap on the star—every note needs a place to land.”',
    image: '/baby/assets/pip_lullaby_box.png',
    accentColor: '#d97706',
  },
  {
    id: 'scene-3',
    chapter: 'Scene 03 · 11:00 PM',
    timeOfNight: 'Midnight Rooftop Flight',
    title: 'Bottling Starlight for Scaredy-Creatures',
    location: 'Above Whispering Chimney Lane',
    narrative:
      'A good melody needed a warm glow to match. Pip scooped stray moonbeams into frosted glass lanterns, tinting each flame to 2,200K amber so coat-rack shadows turned into friendly rabbits. Hitching a ride on a plump cumulonimbus cloud, Pip began gliding from chimney to chimney, lowering bottled dreams down on silk threads.',
    pipQuote: '“Cloud altitude steady at four rooftops high. Parcel #14: one dream about floating pancakes.”',
    image: '/baby/assets/pip_dream_lantern.png',
    accentColor: '#7c3aed',
  },
  {
    id: 'scene-4',
    chapter: 'Scene 04 · 11:59 PM',
    timeOfNight: 'Tucked In Before Twelve',
    title: 'Junior Dream Engineer on Duty',
    location: 'Cloud Dock & Nursery Wall',
    narrative:
      'By order of the Grand Sandman, Pip was officially badged as Midnight Nursery’s youngest Junior Dream Engineer. Now, once every little creature in the neighborhood is safely asleep, Pip parks the cloud glider by the window, hangs the lantern on the bedpost, and curls up under a patchwork quilt—saving one last tiny daydream for tomorrow.',
    pipQuote: '“Shift complete. Zero monsters reported. Goodnight, world.”',
    image: '/baby/assets/pip_avatar_cloud.png',
    accentColor: '#0d9488',
  },
];

export const INITIAL_GUESTBOOK_ENTRIES: GuestbookEntry[] = [
  {
    id: 'gb-1',
    visitorName: 'Barnaby Featherwit',
    creatureType: 'Fledgling Barn Owlet',
    bedtimeWish: 'Thank you for the warm lantern by the oak hollow, Pip! No scary branch shadows tonight.',
    favoriteProject: 'Nightlight Collection',
    timestamp: '10:42 PM · Chimney Stop #2',
  },
  {
    id: 'gb-2',
    visitorName: 'Mochi & Thimble',
    creatureType: 'Twin Dormice',
    bedtimeWish: 'Could we request a dream about a wheel of brie the size of a carousel? Love the C5 chime!',
    favoriteProject: 'The Lullaby Lab',
    timestamp: '11:05 PM · Attic Baseboard',
  },
  {
    id: 'gb-3',
    visitorName: 'Bramble Paws',
    creatureType: 'Sleepy Hedgehog Kit',
    bedtimeWish: 'The cloth storybook didn’t crinkle on my quills at all. 10/10 cozy craftsmanship.',
    favoriteProject: 'Bedtime Storybook',
    timestamp: '11:18 PM · Garden Burrow #7',
  },
];

export const CREATIVE_CONCEPTS: CreativeConcept[] = [
  {
    id: 'track1-concept1',
    track: 'Track 1 · Pip the Skull Baby',
    title: 'Concept A: The Midnight Nursery Tinker-Desk (Implemented Live Here)',
    vibe: 'Editorial Picture-Book Monograph meets Tactile Early-Web Toybox',
    palette: 'Warm Cream (#fff8f1) · Rich Berry (#a34063) · Cocoa Ink (#5c4033) · Starlight Indigo (#13101c)',
    signatureMechanic:
      'Interactive 6-Note Web Audio Celesta Music Box + Cursor-Tracking Amber Eye Pinpricks + Day/Night Nursery Switch',
    whyItWins:
      'Nails the exact haX.baby brand aesthetic ("Good things start small"), uses all 4 official high-res PNG renders seamlessly, and hits every Tier 1 + Tier 2 + Side Quest point with zero lag.',
    threeProjects: [
      '01. The Lullaby Lab (playable Web Audio synthesizer)',
      '02. Nightlight Collection (interactive Kelvin warmth dimmer)',
      '03. Dream Delivery Routes (clickable rooftop chimney flight map)',
    ],
  },
  {
    id: 'track1-concept2',
    track: 'Track 1 · Pip the Skull Baby',
    title: 'Concept B: PipOS 98 — Bedtime Edition (Retro 90s Desktop)',
    vibe: 'Playful 1998 Macintosh / Windows 98 Pastel Toy Operating System',
    palette: 'Buttercream Bezel (#fdf6e9) · Berry Titlebars (#a34063) · Pixel Mint (#2dd4bf)',
    signatureMechanic:
      'Draggable mini-windows for `lullaby_synth.exe`, `nightlight_control.cpl`, and `pip_readme.txt` with a sleeping screensaver.',
    whyItWins:
      'Maximizes the 30% Early-Web Soul rubric category immediately—judges love nostalgic desktop metaphors when they remain clean and mobile-friendly.',
    threeProjects: [
      'Lullaby Tracker 98 (8-bit music box step sequencer)',
      'Lantern Saver (interactive starlight screensaver preview)',
      'Chimney Radar v1.4 (pixel map of dream drop-offs)',
    ],
  },
  {
    id: 'track1-concept3',
    track: 'Track 1 · Pip the Skull Baby',
    title: 'Concept C: The Torchlight Attic Observatory',
    vibe: 'Cozy Pop-Up Book in the Dark with Interactive Lantern Cursor Mask',
    palette: 'Velvet Indigo (#0f0c1b) · Warm Lantern Gold (#f59e0b) · Soft Rose (#f472b6)',
    signatureMechanic:
      'CSS radial-gradient lantern beam attached to the cursor/touch that illuminates hidden chalk blueprints and sleeping critters on the nursery wall.',
    whyItWins:
      'Directly fulfills the Tier 2 "Flashlight / Torch Cursor" challenge and creates instant sense of discovery for the 20% Creativity & Surprises rubric.',
    threeProjects: [
      'Constellation Mobile (connect-the-stars ceiling projector)',
      'Bottled Twilight Jars (click to uncork glowing fireflies)',
      'Cloud Glider Blueprint (annotated chalk schematic)',
    ],
  },
  {
    id: 'track2-concept1',
    track: 'Track 2 · Original Baby Character',
    title: 'Concept D: Barnaby, The Teacup Cloudling (Junior Weather Baker)',
    vibe: 'Cozy Patisserie & Sky Bakery Illustration Portfolio',
    palette: 'Whipped Cream (#fff8f1) · Cinnamon Crust (#8c4a27) · Berry Jam (#a34063)',
    signatureMechanic:
      'Interactive "Cloud Dough Kneader"—clicking stretches and puffs Barnaby’s cumulus hair while baking rainbow drizzle pastries.',
    whyItWins:
      'Instant visual warmth and tactile joy; baking weather phenomena (meringue thunderheads, sugar-glass raindrops) makes for unforgettable project cards.',
    threeProjects: [
      'Sunbeam Croissant Oven (interactive temperature dial)',
      'Rainbow Glaze Dispenser (color-mixing drizzle tool)',
      'Dewdrop Delivery Basket (morning meadow route)',
    ],
  },
  {
    id: 'track2-concept2',
    track: 'Track 2 · Original Baby Character',
    title: 'Concept E: Beeper-01, The Sprout-Bot (Apprentice Moss Gardener)',
    vibe: 'CRT Terrarium & Lo-Fi Botanical Pocket Computer',
    palette: 'Warm Paper (#fbf7f0) · Terracotta Pot (#b45309) · Moss Green (#15803d)',
    signatureMechanic:
      'A tiny round cathode-ray-tube baby robot with a living clover sprout on its head; watering the sprout changes Beeper’s LED face expressions.',
    whyItWins:
      'Blends retro hardware charm with cozy nature; every click grows pixel flowers across the portfolio borders.',
    threeProjects: [
      'Dewdrop Sprinkler Arm (clickable plant watering mini-toy)',
      'Photosynthesis Hum-Box (solar-powered lo-fi synth)',
      'Terrarium Seed Vault (illustrated seed catalog)',
    ],
  },
  {
    id: 'track2-concept3',
    track: 'Track 2 · Original Baby Character',
    title: 'Concept F: Lumi, The Postage-Stamp Moth Baby (Midnight Mail Carrier)',
    vibe: 'Vintage Air-Mail Scrapbook & Philatelic Stamp Collector Book',
    palette: 'Parchment Cream (#fff8f1) · Postmark Berry (#a34063) · Air-Mail Navy (#1e293b)',
    signatureMechanic:
      'Visitors can stamp pages with a rubber postmark tool (with satisfying ink-thump audio) and fold paper airplanes.',
    whyItWins:
      'Early-web scrapbook soul at its finest—perforated stamp borders, cancellation marks, and whispered Tiny Letters.',
    threeProjects: [
      'Pollen-Ink Postmark Press (interactive stamp maker)',
      'Dandelion Parachute Parcels (wind-drift simulator)',
      'Lantern-Light Sorting Desk (night mail route)',
    ],
  },
];

export const EXECUTION_ROADMAP: RoadmapPhase[] = [
  {
    id: 'phase-1',
    hours: 'Hours 00 – 12',
    title: 'Foundation, Visual Identity & 3 Core Projects (MVP Tier 1)',
    focus: 'Lock in the 35% Functionality & 15% Clean Craft baseline before touching fancy effects.',
    deliverables: [
      'Scaffold Vite + React + Tailwind CSS with Fraunces, Fredoka, Plus Jakarta Sans, and JetBrains Mono fonts.',
      'Download official haX.baby transparent PNG assets (/baby/assets/pip_*.png) into public/baby/assets/.',
      'Build the 3-zone Top Bar Contract and Split-Screen Hero introducing Pip (species, quirks, voice, role).',
      'Build the Bento Grid showcasing at least 3 interactive projects with zero dead buttons.',
    ],
    goldenTip:
      'Golden Rule Checkpoint: At Hour 12, your site should already be a valid, submittable hackathon entry if time stopped right now.',
  },
  {
    id: 'phase-2',
    hours: 'Hours 12 – 24',
    title: 'Interactive Bedtime Origin Story & Mobile Responsiveness',
    focus: 'Complete Core Requirements #3 and #5 with <150 words per scene.',
    deliverables: [
      'Write 4 concise origin story scenes (55–75 words each) tracing Pip’s journey from hatched dandelion star to Junior Dream Engineer.',
      'Add an interactive Chapter Switcher + Scroll Progress indicator so visitors can read at their own pace.',
      'Test 390x844 mobile viewport: ensure touch targets are >= 44px, no horizontal overflow, and clean single-column stacking.',
    ],
    goldenTip:
      'Keep each story scene under 80 words so judges can scan all 4 scenes in 30 seconds with delight.',
  },
  {
    id: 'phase-3',
    hours: 'Hours 24 – 36',
    title: 'Tier 1 & Tier 2 Interactive Magic (Eyes, Web Audio & Mood Toggle)',
    focus: 'Win the 20% Creativity & Surprises rubric with tactile, zero-dependency browser magic.',
    deliverables: [
      'Add clamping eye-tracking math so Pip’s warm amber eye pinpricks gently follow the visitor’s cursor.',
      'Wire a Web Audio API pentatonic music box synthesizer (C5–C6) + wooden button clicks with an accessible Mute Toggle.',
      'Implement the Warm Cream (#fff8f1) <-> Midnight Starlight (#13101c) Day/Night mood switch.',
    ],
    goldenTip:
      'Always initialize AudioContext inside a user click handler and provide a visible Mute button in the toolbar (+3 bonus pts!).',
  },
  {
    id: 'phase-4',
    hours: 'Hours 36 – 44',
    title: 'High-Value Bonus Side Quests (+13 Pts) & Hidden Easter Egg',
    focus: 'Capture the 30% Early-Web Soul points with nostalgic 90s/00s web artifacts.',
    deliverables: [
      'Add the Live Nursery Guestbook with strict form validation and localStorage persistence (+2 pts).',
      'Add the tabular-nums 7-digit Vintage Hit Counter Odometer (+1 pt) and toggleable Sparkle Cursor Trail (+2 pts).',
      'Hide the "Golden Dream Weaver" Easter egg on Pip’s nightcap bow (3 clicks -> confetti burst + secret arpeggio).',
    ],
    goldenTip:
      'Hint at your Easter egg subtly in the footer or character bio so judges actually discover it during their 2-minute review!',
  },
  {
    id: 'phase-5',
    hours: 'Hours 44 – 48',
    title: 'Zero-Error Polish, Lighthouse Audit & Unstop Submission',
    focus: 'Protect your 35% Functionality & Polish score with ruthless QA.',
    deliverables: [
      'Open DevTools Console and Network tab: verify 0 console errors and 0 broken image requests.',
      'Verify every button, lightbox modal, ESC key handler, and mobile layout on a real phone screen.',
      'Deploy to Vercel / Netlify / Cloud Run and submit the live link + repo on Unstop before 17:17 IST!',
    ],
    goldenTip:
      'Never start a new Tier 3 feature in the final 4 hours. Polish existing transitions and write a charming README.',
  },
];

export const STARTER_CODE_SNIPPETS: CodeSnippetItem[] = [
  {
    id: 'snippet-cursor-eyes',
    title: '1. Interactive Eye-Tracking + Sparkle Cursor Trail',
    subtitle: 'Clamped trigonometric pupil offset + lightweight canvas/DOM star trail',
    tierBadge: 'Tier 1 + Side Quest (+2 pts)',
    code: `// Clamped eye-tracking calculation for Pip's glowing amber pinpricks
export function calculateEyeOffset(
  cursorX: number,
  cursorY: number,
  centerX: number,
  centerY: number,
  maxRadius = 7
) {
  const dx = cursorX - centerX;
  const dy = cursorY - centerY;
  const distance = Math.hypot(dx, dy);
  if (distance === 0) return { x: 0, y: 0 };

  const clamped = Math.min(distance / 18, maxRadius);
  const angle = Math.atan2(dy, dx);
  return {
    x: Math.cos(angle) * clamped,
    y: Math.sin(angle) * clamped,
  };
}`,
  },
  {
    id: 'snippet-web-audio',
    title: '2. Web Audio API Music Box Chime & Accessible Mute Switch',
    subtitle: 'Zero external MP3s required — pure sine + triangle harmonic bell synthesis',
    tierBadge: 'Tier 2 + Side Quest (+3 pts)',
    code: `// Synthesize a warm celesta music-box note using native Web Audio API
export function playMusicBoxNote(frequency: number, isMuted: boolean) {
  if (isMuted) return;
  const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
  const ctx = new AudioCtx();
  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(frequency, now);

  gain.gain.setValueAtTime(0.001, now);
  gain.gain.linearRampToValueAtTime(0.14, now + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0008, now + 1.15);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 1.15);
}`,
  },
  {
    id: 'snippet-theme-toggle',
    title: '3. Day/Night Nursery Mood Toggle (#fff8f1 <-> #13101c)',
    subtitle: 'Instant palette shift between Warm Cream Nursery and Midnight Starlight',
    tierBadge: 'Tier 1 Core Requirement',
    code: `// Accessible Day/Night Mood Switch with haX.baby palette tokens
const [isNightMode, setIsNightMode] = useState(false);

<div
  className={
    isNightMode
      ? 'bg-[#13101c] text-[#f9f1e6] transition-colors duration-200'
      : 'bg-[#fff8f1] text-[#3a251c] transition-colors duration-200'
  }
>
  <button
    type="button"
    onClick={() => setIsNightMode((prev) => !prev)}
    aria-pressed={isNightMode}
    className="px-3.5 py-2 rounded-lg border text-xs font-medium"
  >
    {isNightMode ? 'Switch to Warm Cream Day' : 'Switch to Midnight Dream'}
  </button>
</div>`,
  },
  {
    id: 'snippet-easter-egg',
    title: '4. Hidden Easter Egg Trigger with Confetti & Golden Chord',
    subtitle: '3-click discovery on Pip’s nightcap bow with canvas-confetti burst',
    tierBadge: 'Tier 1 Core + 20% Surprise Rubric',
    code: `import confetti from 'canvas-confetti';

function handleBowClick() {
  const next = bowClicks + 1;
  setBowClicks(next);
  if (next === 3) {
    setEasterEggUnlocked(true);
    confetti({
      particleCount: 70,
      spread: 65,
      origin: { y: 0.6 },
      colors: ['#a34063', '#f59e0b', '#fff8f1', '#7c3aed'],
    });
    playEasterEggArpeggio(isMuted);
  }
}`,
  },
  {
    id: 'snippet-palette-layout',
    title: '5. Responsive haX.baby Editorial Bento Layout (#fff8f1 & #a34063)',
    subtitle: 'Mobile-first Bento grid with Fraunces serif headings & unboxed metadata',
    tierBadge: '15% Clean Craft Rubric',
    code: `<section className="max-w-[1200px] mx-auto px-4 sm:px-6 py-16 bg-[#fff8f1] text-[#3a251c]">
  <header className="max-w-2xl mb-10">
    <p className="text-xs font-medium text-[#a34063] mb-2">
      Midnight Nursery · Selected Inventions · 2026
    </p>
    <h2 className="font-serif text-3xl sm:text-4xl font-semibold tracking-tight text-balance">
      Crafted for Sleepy Little Creatures
    </h2>
  </header>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {/* Wide 2-col featured card + 1-col companion cards */}
  </div>
</section>`,
  },
];
