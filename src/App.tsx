/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Sparkles,
  Music,
  BookOpen,
  Compass,
  Flashlight,
  Box,
} from 'lucide-react';
import {
  PIP_IDENTITY,
  INITIAL_GUESTBOOK_ENTRIES,
} from './data/pipData';
import {
  GuestbookEntry,
  LULLABY_NOTES,
  LULLABY_NOTES as NOTES_LIST,
  LullabyNote,
  VisitorMemoryState,
  advanceEasterEggProgress,
} from './utils/dreamEngine';
import {
  playMusicBoxNote,
  playUiClick,
  playEasterEggArpeggio,
} from './utils/soundEngine';
import { SparkleCursorOverlay } from './components/SparkleCursorOverlay';
import { InteractivePipPortrait } from './components/InteractivePipPortrait';
import { Tier3LegendaryHub } from './components/Tier3LegendaryHub';
import { ShowcaseBentoSection } from './components/ShowcaseBentoSection';
import { OriginStorySection } from './components/OriginStorySection';
import { NurseryGuestbookSection } from './components/NurseryGuestbookSection';
import { CreativeDirectorSection } from './components/CreativeDirectorSection';

const STORAGE_KEY_GUESTBOOK = 'pip_midnight_nursery_guestbook_v1';
const STORAGE_KEY_ODOMETER = 'pip_midnight_nursery_odometer_v1';
const STORAGE_KEY_VISITOR_MEMORY = 'pip_midnight_nursery_visitor_memory_v1';

export default function App() {
  const [isNightMode, setIsNightMode] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [sparkleEnabled, setSparkleEnabled] = useState<boolean>(true);
  const [lanternBeamEnabled, setLanternBeamEnabled] = useState<boolean>(false);
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number }>({ x: 480, y: 320 });
  const [bowClicks, setBowClicks] = useState<number>(0);
  const [easterEggUnlocked, setEasterEggUnlocked] = useState<boolean>(false);
  const [lastPlayedNote, setLastPlayedNote] = useState<LullabyNote>(LULLABY_NOTES[0]);

  // Tier 3 Returning Visitor Memory (persisted in localStorage, increments visitCount on each page load)
  const [visitorMemory, setVisitorMemory] = useState<VisitorMemoryState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_VISITOR_MEMORY);
      if (saved) {
        const parsed = JSON.parse(saved) as VisitorMemoryState;
        if (parsed && typeof parsed.visitCount === 'number') {
          const updated: VisitorMemoryState = {
            ...parsed,
            visitCount: parsed.visitCount + 1,
            lastSeenIso: new Date().toISOString(),
          };
          localStorage.setItem(STORAGE_KEY_VISITOR_MEMORY, JSON.stringify(updated));
          return updated;
        }
      }
    } catch {
      // Ignore storage errors
    }
    const initialMemory: VisitorMemoryState = {
      visitCount: 1,
      visitorName: 'Starlight Traveler',
      creatureType: 'Cozy Night-Watch Owlet',
      favoriteNote: 'C5',
      lastSeenIso: new Date().toISOString(),
      unlockedEasterEgg: false,
    };
    try {
      localStorage.setItem(STORAGE_KEY_VISITOR_MEMORY, JSON.stringify(initialMemory));
    } catch {
      // Ignore storage errors
    }
    return initialMemory;
  });

  const [guestbookEntries, setGuestbookEntries] = useState<GuestbookEntry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_GUESTBOOK);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Ignore storage errors
    }
    return INITIAL_GUESTBOOK_ENTRIES;
  });

  const [visitorCount, setVisitorCount] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ODOMETER);
      if (saved) {
        const parsed = parseInt(saved, 10);
        if (!Number.isNaN(parsed) && parsed >= 10428) return parsed;
      }
    } catch {
      // Ignore storage errors
    }
    return 10428;
  });

  // Sync Guestbook & Odometer with Real Express Backend (/api/guestbook)
  useEffect(() => {
    let active = true;
    fetch('/api/guestbook')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!active || !data) return;
        if (Array.isArray(data.entries) && data.entries.length > 0) {
          setGuestbookEntries(data.entries);
          try {
            localStorage.setItem(STORAGE_KEY_GUESTBOOK, JSON.stringify(data.entries));
          } catch {
            // Ignore
          }
        }
        if (typeof data.visitorCount === 'number' && data.visitorCount >= 10428) {
          setVisitorCount(data.visitorCount);
          try {
            localStorage.setItem(STORAGE_KEY_ODOMETER, String(data.visitorCount));
          } catch {
            // Ignore
          }
        }
      })
      .catch(() => {
        // Keep local cache if offline
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!lanternBeamEnabled) return;
    const handleMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMove);
  }, [lanternBeamEnabled]);

  const handleUpdateVisitorMemory = (patch: Partial<VisitorMemoryState>) => {
    setVisitorMemory((prev) => {
      const updated = { ...prev, ...patch, lastSeenIso: new Date().toISOString() };
      try {
        localStorage.setItem(STORAGE_KEY_VISITOR_MEMORY, JSON.stringify(updated));
      } catch {
        // Ignore
      }
      return updated;
    });
  };

  const handleBowEasterEggClick = () => {
    const progress = advanceEasterEggProgress(bowClicks, 3);
    setBowClicks(progress.clicks);

    if (progress.justUnlocked) {
      setEasterEggUnlocked(true);
      handleUpdateVisitorMemory({ unlockedEasterEgg: true });
      playEasterEggArpeggio(isMuted);
      try {
        confetti({
          particleCount: 65,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#a34063', '#f59e0b', '#fff8f1', '#7c3aed'],
        });
      } catch {
        // Ignore confetti errors in headless mode
      }
    } else {
      playMusicBoxNote(659.25 + progress.clicks * 60, isMuted, 0.7);
    }
  };

  const handleQuickChime = () => {
    const randomNote = NOTES_LIST[Math.floor(Math.random() * NOTES_LIST.length)];
    setLastPlayedNote(randomNote);
    playMusicBoxNote(randomNote.frequency, isMuted, 1.0);
  };

  const handleAddGuestbookEntry = async (newEntry: GuestbookEntry) => {
    // Also remember the visitor's name & species in Tier 3 Returning Visitor Memory!
    handleUpdateVisitorMemory({
      visitorName: newEntry.visitorName,
      creatureType: newEntry.creatureType,
    });

    const optimisticEntries = [newEntry, ...guestbookEntries];
    const optimisticCount = visitorCount + 1;
    setGuestbookEntries(optimisticEntries);
    setVisitorCount(optimisticCount);

    try {
      localStorage.setItem(STORAGE_KEY_GUESTBOOK, JSON.stringify(optimisticEntries));
      localStorage.setItem(STORAGE_KEY_ODOMETER, String(optimisticCount));
    } catch {
      // Ignore storage errors
    }

    // Persist to Real Express Backend (/api/guestbook)
    try {
      const response = await fetch('/api/guestbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visitorName: newEntry.visitorName,
          creatureType: newEntry.creatureType,
          bedtimeWish: newEntry.bedtimeWish,
          favoriteProject: newEntry.favoriteProject,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data.entries)) {
          setGuestbookEntries(data.entries);
          localStorage.setItem(STORAGE_KEY_GUESTBOOK, JSON.stringify(data.entries));
        }
        if (typeof data.visitorCount === 'number') {
          setVisitorCount(data.visitorCount);
          localStorage.setItem(STORAGE_KEY_ODOMETER, String(data.visitorCount));
        }
      }
    } catch {
      // Optimistic state already saved locally
    }
  };

  const themeRootClass = isNightMode
    ? 'bg-[#13101c] text-[#f9f1e6]'
    : 'bg-[#fff8f1] text-[#3a251c]';

  const cardSurfaceClass = isNightMode
    ? 'bg-[#1c1729] border-[#33294a] text-[#f9f1e6]'
    : 'bg-[#f8efe4] border-[#e6d5c3] text-[#3a251c]';

  return (
    <div className={`min-h-screen transition-colors duration-200 relative ${themeRootClass}`}>
      {/* Sparkle Cursor Trail Side Quest */}
      <SparkleCursorOverlay enabled={sparkleEnabled} />

      {/* Optional Tier 2 Lantern Torchlight Overlay */}
      {lanternBeamEnabled && (
        <div
          className="pointer-events-none fixed inset-0 z-40 transition-opacity duration-200"
          aria-hidden="true"
          style={{
            background: `radial-gradient(320px circle at ${cursorPos.x}px ${cursorPos.y}px, rgba(251, 191, 36, 0.12) 0%, rgba(19, 16, 28, 0.78) 100%)`,
          }}
        />
      )}

      {/* STRICT 3-ZONE TOP BAR CONTRACT */}
      <header
        className={`sticky top-0 z-30 border-b backdrop-blur-md transition-colors duration-200 ${
          isNightMode
            ? 'bg-[#13101c]/90 border-[#33294a]'
            : 'bg-[#fff8f1]/90 border-[#e6d5c3]'
        }`}
      >
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-8">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="#identity"
            className="font-serif-editorial text-lg sm:text-xl font-bold tracking-tight text-[#a34063] whitespace-nowrap shrink-0"
          >
            Pip · Midnight Nursery
          </a>

          {/* Zone 2: 5 concise single-line text navigation links */}
          <nav
            className="hidden md:flex items-center gap-6 text-sm font-medium"
            aria-label="Primary Portfolio Navigation"
          >
            <a
              href="#identity"
              className="hover:text-[#a34063] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Identity
            </a>
            <a
              href="#legendary-tier3"
              className="hover:text-[#a34063] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              3D & Chat
            </a>
            <a
              href="#creations"
              className="hover:text-[#a34063] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Creations
            </a>
            <a
              href="#origin-story"
              className="hover:text-[#a34063] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Origin Story
            </a>
            <a
              href="#guestbook"
              className="hover:text-[#a34063] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Guestbook
            </a>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center shrink-0">
            <a
              href="#creations"
              onClick={() => playMusicBoxNote(523.25, isMuted, 0.8)}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#a34063] rounded-lg hover:bg-[#8d3554] transition-colors whitespace-nowrap shrink-0"
            >
              Open Lullaby Lab
            </a>
          </div>
        </div>
      </header>

      <main>
        {/* WORKSPACE INTERACTIVE TOOLBAR (Mood, Mute Switch, Sparkle Trail, Torchlight) */}
        <div
          className={`border-b transition-colors duration-200 ${
            isNightMode ? 'bg-[#181324] border-[#33294a]' : 'bg-[#f8efe4] border-[#e6d5c3]'
          }`}
        >
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              {/* Day / Night Nursery Mood Toggle */}
              <button
                type="button"
                onClick={() => {
                  playUiClick(isMuted, isNightMode ? 1.15 : 0.9);
                  setIsNightMode((prev) => !prev);
                }}
                aria-pressed={isNightMode}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  isNightMode
                    ? 'bg-[#a34063] text-white border-[#a34063]'
                    : 'bg-[#fff8f1] text-[#3a251c] border-[#d8c3ae] hover:border-[#a34063]'
                }`}
              >
                {isNightMode ? (
                  <>
                    <Sun className="w-3.5 h-3.5 text-[#fbbf24]" aria-hidden="true" />
                    <span>Mood: Midnight Dream (#13101c)</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-3.5 h-3.5 text-[#a34063]" aria-hidden="true" />
                    <span>Mood: Warm Cream (#fff8f1)</span>
                  </>
                )}
              </button>

              {/* Required Accessible Audio Mute Toggle (+3 pts Side Quest) */}
              <button
                type="button"
                onClick={() => setIsMuted((prev) => !prev)}
                aria-pressed={isMuted}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  !isMuted
                    ? 'bg-[#a34063]/15 text-[#a34063] border-[#a34063]/40'
                    : 'opacity-75 border-current/20'
                }`}
              >
                {isMuted ? (
                  <>
                    <VolumeX className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Audio: Muted</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Audio Chimes: On</span>
                  </>
                )}
              </button>

              {/* Sparkle Cursor Trail Toggle (+2 pts Side Quest) */}
              <button
                type="button"
                onClick={() => {
                  playUiClick(isMuted, 1.1);
                  setSparkleEnabled((prev) => !prev);
                }}
                aria-pressed={sparkleEnabled}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  sparkleEnabled
                    ? 'bg-[#a34063]/15 text-[#a34063] border-[#a34063]/40'
                    : 'opacity-75 border-current/20'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Sparkle Trail: {sparkleEnabled ? 'On' : 'Off'}</span>
              </button>

              {/* Tier 2 Lantern Torchlight Cursor Beam Toggle */}
              <button
                type="button"
                onClick={() => {
                  playUiClick(isMuted, 1.05);
                  setLanternBeamEnabled((prev) => !prev);
                }}
                aria-pressed={lanternBeamEnabled}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  lanternBeamEnabled
                    ? 'bg-[#d97706] text-[#13101c] border-[#d97706] font-semibold'
                    : 'opacity-75 border-current/20 hover:opacity-100'
                }`}
              >
                <Flashlight className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Lantern Torch: {lanternBeamEnabled ? 'On' : 'Off'}</span>
              </button>
            </div>

            <div className="font-mono-tabular opacity-80 hidden sm:block">
              Visit #{visitorMemory.visitCount} ({visitorMemory.visitorName}) · Last Chime: {lastPlayedNote.label}
            </div>
          </div>
        </div>

        {/* SECTION 01: SPLIT-SCREEN HERO & CHARACTER IDENTITY */}
        <section id="identity" className="py-12 sm:py-16">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              {/* Left Column: Character Identity & Story Lead */}
              <div className="lg:col-span-7 flex flex-col justify-between">
                <div>
                  <p className="text-xs font-medium text-[#a34063] mb-3">
                    01 · What Pip Is · Track 1 Official Character Portfolio · Good Things Start Small
                  </p>

                  <h1 className="font-serif-editorial text-4xl sm:text-5xl lg:text-[52px] font-semibold tracking-tight leading-[1.1] text-balance mb-5">
                    Meet Pip, The Sleepy Skull Baby Who Engineers Bedtime.
                  </h1>

                  <p className="text-base sm:text-lg opacity-90 leading-relaxed mb-6 max-w-[64ch]">
                    {PIP_IDENTITY.appearance} As Midnight Nursery’s youngest{' '}
                    <strong className="font-semibold text-[#a34063]">Junior Dream Engineer</strong>, Pip builds brass lullaby boxes, frosted twilight lanterns, and cloud glider routes so every little creature falls asleep safe and warm.
                  </p>

                  {/* Character Sheet Grid (Species, Personality, Voice) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div className={`rounded-xl border p-4 ${cardSurfaceClass}`}>
                      <div className="text-xs font-mono-tabular text-[#a34063] mb-1">
                        Species & Quirks
                      </div>
                      <p className="text-xs sm:text-sm leading-relaxed opacity-90">
                        <strong>{PIP_IDENTITY.species}.</strong> {PIP_IDENTITY.personality}
                      </p>
                    </div>
                    <div className={`rounded-xl border p-4 ${cardSurfaceClass}`}>
                      <div className="text-xs font-mono-tabular text-[#a34063] mb-1">
                        Voice & Bedtime Motto
                      </div>
                      <p className="text-xs sm:text-sm leading-relaxed opacity-90">
                        {PIP_IDENTITY.voice}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Hero Action Row */}
                <div className="pt-2 flex flex-wrap items-center gap-2.5">
                  <a
                    href="#legendary-tier3"
                    onClick={() => playMusicBoxNote(783.99, isMuted, 0.9)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#a34063] text-white text-xs sm:text-sm font-semibold hover:bg-[#8d3554] transition-colors whitespace-nowrap shrink-0"
                  >
                    <Box className="w-4 h-4" aria-hidden="true" />
                    <span>3D Pip & Live Chat</span>
                  </a>

                  <a
                    href="#creations"
                    onClick={() => playMusicBoxNote(659.25, isMuted, 0.9)}
                    className={`inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-medium transition-colors whitespace-nowrap shrink-0 ${
                      isNightMode
                        ? 'border-[#33294a] hover:border-[#a34063]'
                        : 'border-[#d8c3ae] hover:border-[#a34063]'
                    }`}
                  >
                    <Music className="w-4 h-4 text-[#a34063]" aria-hidden="true" />
                    <span>6 Inventions</span>
                  </a>

                  <a
                    href="#origin-story"
                    onClick={() => playUiClick(isMuted, 1.05)}
                    className={`inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-medium transition-colors whitespace-nowrap shrink-0 ${
                      isNightMode
                        ? 'border-[#33294a] hover:border-[#a34063]'
                        : 'border-[#d8c3ae] hover:border-[#a34063]'
                    }`}
                  >
                    <BookOpen className="w-4 h-4 text-[#a34063]" aria-hidden="true" />
                    <span>Origin Story</span>
                  </a>

                  <a
                    href="#director-kit"
                    onClick={() => playUiClick(isMuted, 1.15)}
                    className={`inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-medium transition-colors whitespace-nowrap shrink-0 ${
                      isNightMode
                        ? 'border-[#33294a] hover:border-[#a34063]'
                        : 'border-[#d8c3ae] hover:border-[#a34063]'
                    }`}
                  >
                    <Compass className="w-4 h-4 text-[#a34063]" aria-hidden="true" />
                    <span>48h Playbook</span>
                  </a>
                </div>
              </div>

              {/* Right Column: Interactive Eye-Tracking Pip Portrait */}
              <div className="lg:col-span-5">
                <InteractivePipPortrait
                  isNightMode={isNightMode}
                  isMuted={isMuted}
                  bowClicks={bowClicks}
                  easterEggUnlocked={easterEggUnlocked}
                  onBowClick={handleBowEasterEggClick}
                  onQuickChime={handleQuickChime}
                />
              </div>
            </div>

            {/* Full-Width 4-Column Character Telemetry Row Below Hero Split */}
            <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  metric: '2,200K Amber',
                  label: 'Eye-Socket Pinprick Warmth',
                  detail: 'Follows visitor cursor in 2D & 3D',
                },
                {
                  metric: '1,240 Rooftops',
                  label: 'Safe Cumulus Cloud Landings',
                  detail: 'Zero spilled cinnamon-bun dreams',
                },
                {
                  metric: '6 Brass Tines',
                  label: 'C-Major Pentatonic Music Box',
                  detail: 'Synthesized live via Web Audio API',
                },
                {
                  metric: `Visit #${visitorMemory.visitCount}`,
                  label: `Remembered: ${visitorMemory.visitorName}`,
                  detail: `Favorite Chime: ${visitorMemory.favoriteNote} · Persistent Memory`,
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className={`rounded-xl border p-4 transition-colors ${cardSurfaceClass}`}
                >
                  <div className="font-serif-editorial font-mono-tabular text-xl sm:text-2xl font-bold text-[#a34063]">
                    {stat.metric}
                  </div>
                  <div className="text-xs font-semibold mt-1 truncate">{stat.label}</div>
                  <div className="text-xs opacity-75 mt-0.5 truncate">{stat.detail}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SUBTLE EDITORIAL MARQUEE RIBBON DIVIDER */}
        <div
          className={`border-y py-2.5 overflow-hidden select-none text-xs font-mono-tabular tracking-wide ${
            isNightMode
              ? 'bg-[#181324] border-[#33294a] text-[#e6d5c3]/80'
              : 'bg-[#f8efe4] border-[#e6d5c3] text-[#5c4033]/80'
          }`}
          aria-hidden="true"
        >
          <div className="animate-marquee-ribbon">
            {[1, 2].map((group) => (
              <div key={group} className="flex items-center gap-8 px-4">
                <span>pip the skull baby</span>
                <span>·</span>
                <span>tier 3 legendary 3d webgl studio</span>
                <span>·</span>
                <span>returning visitor memory</span>
                <span>·</span>
                <span>character chats back in voice</span>
                <span>·</span>
                <span>live backend dream guestbook</span>
                <span>·</span>
                <span>rooftop cloud glider routes</span>
                <span>·</span>
                <span>hax.baby first website hackathon</span>
                <span>·</span>
              </div>
            ))}
          </div>
        </div>

        {/* TIER 3 LEGENDARY HUB: 3D WEBGL MODEL + RETURNING VISITOR MEMORY + CHARACTER CHATS BACK */}
        <Tier3LegendaryHub
          isNightMode={isNightMode}
          isMuted={isMuted}
          visitorMemory={visitorMemory}
          onUpdateVisitorMemory={handleUpdateVisitorMemory}
          onNotePlayed={(note) => setLastPlayedNote(note)}
        />

        {/* SECTION 02: BENTO SHOWCASE OF 6 INTERACTIVE CREATIONS */}
        <ShowcaseBentoSection
          isNightMode={isNightMode}
          isMuted={isMuted}
          onNotePlayed={(note) => setLastPlayedNote(note)}
        />

        {/* SECTION 03: INTERACTIVE BEDTIME ORIGIN STORY (<150 WORDS/SCENE) */}
        <OriginStorySection isNightMode={isNightMode} isMuted={isMuted} />

        {/* SECTION 04: LIVE NURSERY GUESTBOOK (REAL EXPRESS BACKEND) & VINTAGE HIT ODOMETER */}
        <NurseryGuestbookSection
          isNightMode={isNightMode}
          isMuted={isMuted}
          entries={guestbookEntries}
          visitorCount={visitorCount}
          onAddEntry={handleAddGuestbookEntry}
        />

        {/* SECTION 05: PAIR-PROGRAMMER & CREATIVE DIRECTOR PLAYBOOK + CODE SNIPPETS */}
        <CreativeDirectorSection isNightMode={isNightMode} isMuted={isMuted} />
      </main>

      {/* QUIET EDITORIAL FOOTER */}
      <footer
        className={`border-t py-10 text-xs transition-colors ${
          isNightMode
            ? 'bg-[#100d18] border-[#33294a] text-[#e6d5c3]/75'
            : 'bg-[#f8efe4] border-[#e6d5c3] text-[#5c4033]/80'
        }`}
      >
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="font-serif-editorial text-sm font-semibold text-[#a34063]">
              Pip’s Midnight Nursery · Baby’s First Website Hackathon (haX.baby)
            </p>
            <p className="mt-1">
              Tier 1 + Tier 2 + Tier 3 Legendary Build · 3D WebGL Model · Live Backend Guestbook · Returning Visitor Memory · Character Chat
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <a href="#identity" className="hover:text-[#a34063] hover:underline">
              Back to Top
            </a>
            <span aria-hidden="true">·</span>
            <a href="#legendary-tier3" className="hover:text-[#a34063] hover:underline">
              3D Studio & Chat
            </a>
            <span aria-hidden="true">·</span>
            <a href="#director-kit" className="hover:text-[#a34063] hover:underline">
              Starter Code Kit
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
