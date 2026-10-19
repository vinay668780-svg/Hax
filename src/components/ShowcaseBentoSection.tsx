import React, { useState, useEffect } from 'react';
import { Volume2, Sparkles, Maximize2, X, Compass, Sun, BookOpen, Ruler } from 'lucide-react';
import { SHOWCASE_PROJECTS, ShowcaseProject } from '../data/pipData';
import { LULLABY_NOTES, LullabyNote } from '../utils/dreamEngine';
import { playMusicBoxNote, playUiClick } from '../utils/soundEngine';

interface ShowcaseBentoSectionProps {
  isNightMode: boolean;
  isMuted: boolean;
  onNotePlayed: (note: LullabyNote) => void;
}

const CHIMNEY_STOPS = [
  {
    id: 'owlet-hollow',
    name: 'Stop 01 · Owlet Hollow Oak',
    eta: '10:15 PM',
    parcel: 'Warm Feather-Down Dream + Cricket Hush',
    altitude: '42 ft',
  },
  {
    id: 'bakers-attic',
    name: 'Stop 02 · Baker’s Cinnamon Attic',
    eta: '10:45 PM',
    parcel: 'Floating Brioche & Sugar-Cloud Dream',
    altitude: '58 ft',
  },
  {
    id: 'badger-burrow',
    name: 'Stop 03 · Mossy Badger Burrow',
    eta: '11:10 PM',
    parcel: 'Lantern-Lit Story Quilt Dream',
    altitude: '14 ft',
  },
  {
    id: 'clocktower-eaves',
    name: 'Stop 04 · Village Clocktower Eaves',
    eta: '11:45 PM',
    parcel: 'Velvet Silence for the Night Bell-Ringer',
    altitude: '112 ft',
  },
];

const LANTERN_MODES = [
  { id: '1800k', label: '1,800K Candle Amber', tint: 'rgba(245, 158, 11, 0.28)', note: 587.33 },
  { id: '2200k', label: '2,200K Berry Rose', tint: 'rgba(163, 64, 99, 0.28)', note: 659.25 },
  { id: '2600k', label: '2,600K Starlight Lavender', tint: 'rgba(124, 58, 237, 0.25)', note: 783.99 },
];

const STORYBOOK_PAGES = [
  {
    page: 1,
    heading: 'Page 1 · The Shy Moonbeam',
    text: 'Once there was a crooked little moonbeam who was nervous about shining through dark bedroom curtains.',
  },
  {
    page: 2,
    heading: 'Page 2 · Pip’s Ribbon Polish',
    text: 'Pip polished the moonbeam with a pink nightcap ribbon until it smelled like warm vanilla milk.',
  },
  {
    page: 3,
    heading: 'Page 3 · Safe on the Pillow',
    text: 'Together they landed right on Little Hedgehog’s nose, turning every shadow into a sleepy bunny.',
  },
];

export const ShowcaseBentoSection: React.FC<ShowcaseBentoSectionProps> = ({
  isNightMode,
  isMuted,
  onNotePlayed,
}) => {
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'audio' | 'light-map' | 'toys-craft'>('all');
  const [activeNote, setActiveNote] = useState<LullabyNote>(LULLABY_NOTES[0]);
  const [notesPlayedCount, setNotesPlayedCount] = useState<number>(12);
  const [isPlayingMelody, setIsPlayingMelody] = useState<boolean>(false);
  const [selectedLantern, setSelectedLantern] = useState(LANTERN_MODES[0]);
  const [selectedChimney, setSelectedChimney] = useState(CHIMNEY_STOPS[0]);
  const [stackedBlocks, setStackedBlocks] = useState<string[]>(['A', 'B', 'Z']);
  const [storyPageIdx, setStoryPageIdx] = useState<number>(0);
  const [selectedMilestone, setSelectedMilestone] = useState<number>(2);
  const [lightboxProject, setLightboxProject] = useState<ShowcaseProject | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && lightboxProject) {
        setLightboxProject(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxProject]);

  const handlePlaySingleNote = (note: LullabyNote) => {
    setActiveNote(note);
    setNotesPlayedCount((c) => c + 1);
    playMusicBoxNote(note.frequency, isMuted);
    onNotePlayed(note);
  };

  const handlePlayAutoMelody = () => {
    if (isPlayingMelody) return;
    setIsPlayingMelody(true);
    const sequence = [0, 2, 3, 4, 3, 2, 0];
    sequence.forEach((noteIndex, step) => {
      setTimeout(() => {
        const note = LULLABY_NOTES[noteIndex];
        setActiveNote(note);
        setNotesPlayedCount((c) => c + 1);
        playMusicBoxNote(note.frequency, isMuted, 0.9);
        onNotePlayed(note);
        if (step === sequence.length - 1) {
          setIsPlayingMelody(false);
        }
      }, step * 260);
    });
  };

  const filteredProjects = SHOWCASE_PROJECTS.filter((project) => {
    if (categoryFilter === 'all') return true;
    if (categoryFilter === 'audio') return project.id === 'lullaby-lab' || project.id === 'rattle-block-toys';
    if (categoryFilter === 'light-map') return project.id === 'nightlight-collection' || project.id === 'dream-delivery-routes';
    return project.id === 'bedtime-storybook' || project.id === 'nursery-growth-chart';
  });

  const surfaceClass = isNightMode
    ? 'bg-[#1c1729] border-[#33294a] text-[#f9f1e6]'
    : 'bg-[#f8efe4] border-[#e6d5c3] text-[#3a251c]';

  const subSurfaceClass = isNightMode
    ? 'bg-[#13101c] border-[#33294a] text-[#e6d5c3]'
    : 'bg-[#fff8f1] border-[#e6d5c3] text-[#5c4033]';

  return (
    <section id="creations" className="py-16 sm:py-20 border-t border-current/10">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        {/* Section Header + Interactive Filter Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="max-w-2xl">
            <p className="text-xs font-medium text-[#a34063] mb-2">
              02 · What Pip Does · Midnight Nursery Engineering Showcase
            </p>
            <h2 className="font-serif-editorial text-3xl sm:text-4xl font-semibold tracking-tight text-balance">
              Six Bedtime Inventions for Sleepy Little Creatures
            </h2>
            <p className="mt-3 text-sm sm:text-base opacity-80 leading-relaxed">
              Every mechanism is hand-tested in Attic Crib #4. Click the brass keys, tune the frosted lanterns, or inspect any blueprint in full resolution.
            </p>
          </div>

          {/* Interactive Filter Controls */}
          <div
            className={`inline-flex flex-wrap items-center gap-1 p-1 rounded-xl border self-start ${subSurfaceClass}`}
            role="group"
            aria-label="Filter showcase creations by craft category"
          >
            {[
              { id: 'all', label: 'All Creations (6)' },
              { id: 'audio', label: 'Lullaby & Audio' },
              { id: 'light-map', label: 'Lanterns & Flight' },
              { id: 'toys-craft', label: 'Stories & Growth' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  playUiClick(isMuted, 1.05);
                  setCategoryFilter(tab.id as typeof categoryFilter);
                }}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  categoryFilter === tab.id
                    ? 'bg-[#a34063] text-white shadow-xs'
                    : 'opacity-75 hover:opacity-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Bento Box Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredProjects.map((project) => {
            const isWide = project.spanWide && categoryFilter === 'all';
            return (
              <article
                key={project.id}
                className={`rounded-2xl border p-6 flex flex-col justify-between transition-colors duration-200 ${surfaceClass} ${
                  isWide ? 'md:col-span-2' : 'md:col-span-1'
                }`}
              >
                <div>
                  {/* Clean Unboxed Metadata Line (Zero-Pill Discipline) */}
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs opacity-75 mb-3">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono-tabular font-semibold text-[#a34063]">
                        {project.number}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{project.category}</span>
                      <span aria-hidden="true">·</span>
                      <span>{project.year}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        playUiClick(isMuted, 1.15);
                        setLightboxProject(project);
                      }}
                      aria-label={`Open fullscreen blueprint for ${project.title}`}
                      className="inline-flex items-center gap-1 text-xs font-medium text-[#a34063] hover:underline cursor-pointer whitespace-nowrap shrink-0"
                    >
                      <Maximize2 className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Inspect Blueprint</span>
                    </button>
                  </div>

                  {/* Card Title */}
                  <h3 className="font-serif-editorial text-xl sm:text-2xl font-semibold tracking-tight mb-2 text-balance">
                    {project.title}
                  </h3>
                  <p className="text-sm opacity-85 leading-relaxed mb-4">
                    {project.summary}
                  </p>

                  {/* Visual Asset + Interactive Sandbox per Project */}
                  {project.interactiveType === 'lullaby-lab' && (
                    <div className={`rounded-xl border p-4 mb-4 ${subSurfaceClass}`}>
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                        <div className="lg:col-span-5 relative aspect-4/3 rounded-lg overflow-hidden bg-[#faf6f0] border border-[#a34063]/20 flex items-center justify-center">
                          <img
                            src={project.image}
                            alt={project.imageAlt}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="lg:col-span-7 flex flex-col justify-between">
                          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                            <span className="text-xs font-semibold flex items-center gap-1.5">
                              <Volume2 className="w-3.5 h-3.5 text-[#a34063]" aria-hidden="true" />
                              <span>Interactive 6-Tine Celesta Synthesizer</span>
                            </span>
                            <span className="text-xs font-mono-tabular opacity-75">
                              Chimes Rung: {notesPlayedCount}
                            </span>
                          </div>

                          {/* 6 Playable Music Box Keys */}
                          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 my-2" role="group" aria-label="Lullaby music box notes">
                            {LULLABY_NOTES.map((note) => {
                              const isSelected = activeNote.id === note.id;
                              return (
                                <button
                                  key={note.id}
                                  type="button"
                                  onClick={() => handlePlaySingleNote(note)}
                                  className={`py-2.5 px-2 rounded-lg border text-center transition-transform active:scale-95 cursor-pointer ${
                                    isSelected
                                      ? 'bg-[#a34063] text-white border-[#a34063] font-semibold'
                                      : 'border-current/15 hover:border-[#a34063]'
                                  }`}
                                >
                                  <div className="text-xs font-mono-tabular font-bold">{note.label}</div>
                                  <div className="text-[10px] opacity-80 truncate">
                                    {note.solfege.split(' · ')[0]}
                                  </div>
                                </button>
                              );
                            })}
                          </div>

                          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-current/10">
                            <p className="text-xs opacity-85">
                              <strong className="font-semibold">{activeNote.solfege}:</strong>{' '}
                              {activeNote.dreamEffect}
                            </p>
                            <button
                              type="button"
                              onClick={handlePlayAutoMelody}
                              disabled={isPlayingMelody}
                              className="px-3 py-1.5 rounded-lg bg-[#a34063] text-white text-xs font-medium hover:bg-[#8d3554] disabled:opacity-50 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                            >
                              {isPlayingMelody ? 'Playing Lullaby…' : 'Play Bedtime Melody'}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Acoustic Telemetry & Harmonic Resonance Strip to balance Bento card height */}
                      <div className="mt-4 pt-3 border-t border-current/10 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        <div className="p-2.5 rounded-lg border border-current/10">
                          <div className="opacity-70">Active Pitch & Tuning</div>
                          <div className="font-mono-tabular font-semibold text-[#a34063] mt-0.5">
                            {activeNote.label} · {activeNote.frequency} Hz (432Hz Warm)
                          </div>
                        </div>
                        <div className="p-2.5 rounded-lg border border-current/10">
                          <div className="opacity-70">Harmonic Envelope</div>
                          <div className="font-mono-tabular font-semibold mt-0.5">
                            Sine + 2x Triangle Tine Overtone
                          </div>
                        </div>
                        <div className="p-2.5 rounded-lg border border-current/10">
                          <div className="opacity-70">Nursery Room Acoustics</div>
                          <div className="font-mono-tabular font-semibold text-[#0d9488] mt-0.5">
                            -18 dB Wind Hush · Calm
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {project.interactiveType === 'nightlight' && (
                    <div className={`rounded-xl border p-4 mb-4 ${subSurfaceClass}`}>
                      <div
                        style={{ backgroundColor: selectedLantern.tint }}
                        className="relative aspect-4/3 rounded-lg overflow-hidden border border-current/10 mb-3 flex items-center justify-center transition-colors duration-200"
                      >
                        <img
                          src={project.image}
                          alt={project.imageAlt}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="font-semibold flex items-center gap-1">
                          <Sun className="w-3.5 h-3.5 text-[#d97706]" aria-hidden="true" />
                          <span>Tune Lantern Warmth</span>
                        </span>
                        <span className="font-mono-tabular opacity-75">{selectedLantern.label}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-1.5">
                        {LANTERN_MODES.map((mode) => (
                          <button
                            key={mode.id}
                            type="button"
                            onClick={() => {
                              setSelectedLantern(mode);
                              playMusicBoxNote(mode.note, isMuted, 0.7);
                            }}
                            className={`px-2 py-1.5 rounded-md text-xs font-medium border transition-colors cursor-pointer whitespace-nowrap truncate ${
                              selectedLantern.id === mode.id
                                ? 'bg-[#a34063] text-white border-[#a34063]'
                                : 'border-current/15 hover:border-[#a34063]'
                            }`}
                          >
                            {mode.id.toUpperCase()}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {project.interactiveType === 'delivery-map' && (
                    <div className={`rounded-xl border p-4 mb-4 ${subSurfaceClass}`}>
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="font-semibold flex items-center gap-1">
                          <Compass className="w-3.5 h-3.5 text-[#a34063]" aria-hidden="true" />
                          <span>Active Rooftop Chimney Route</span>
                        </span>
                        <span className="font-mono-tabular text-[#a34063] font-semibold">
                          {selectedChimney.eta}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-1.5 mb-3">
                        {CHIMNEY_STOPS.map((stop, idx) => (
                          <button
                            key={stop.id}
                            type="button"
                            onClick={() => {
                              playUiClick(isMuted, 1 + idx * 0.08);
                              setSelectedChimney(stop);
                            }}
                            className={`px-2.5 py-1.5 rounded-md text-left text-xs font-medium border transition-colors cursor-pointer truncate ${
                              selectedChimney.id === stop.id
                                ? 'bg-[#a34063] text-white border-[#a34063]'
                                : 'border-current/15 hover:border-[#a34063]'
                            }`}
                          >
                            Stop 0{idx + 1} · {stop.name.split(' · ')[1]}
                          </button>
                        ))}
                      </div>
                      <div className="text-xs space-y-1 pt-2 border-t border-current/10">
                        <p>
                          <strong className="font-semibold">Destination:</strong> {selectedChimney.name}
                        </p>
                        <p>
                          <strong className="font-semibold">Dream Parcel:</strong> {selectedChimney.parcel}
                        </p>
                        <p className="font-mono-tabular opacity-75">
                          Glider Altitude: {selectedChimney.altitude} · Wind: Calm 4 kt
                        </p>
                      </div>
                    </div>
                  )}

                  {project.interactiveType === 'rattle-toy' && (
                    <div className={`rounded-xl border p-4 mb-4 ${subSurfaceClass}`}>
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="font-semibold">Tap Blocks to Stack & Chime</span>
                        <span className="font-mono-tabular font-semibold text-[#a34063]">
                          Tower: {stackedBlocks.join(' · ')}
                        </span>
                      </div>
                      <div className="grid grid-cols-4 gap-2 my-2">
                        {[
                          { rune: 'A', label: 'Amber', freq: 523.25 },
                          { rune: 'B', label: 'Bedtime', freq: 659.25 },
                          { rune: 'Z', label: 'Slumber', freq: 783.99 },
                          { rune: 'D', label: 'Dream', freq: 880.0 },
                        ].map((block) => (
                          <button
                            key={block.label}
                            type="button"
                            onClick={() => {
                              playMusicBoxNote(block.freq, isMuted, 0.6);
                              setStackedBlocks((prev) => [...prev.slice(-3), block.rune]);
                            }}
                            className="py-2.5 rounded-lg border border-current/20 hover:border-[#a34063] text-center transition-transform active:scale-95 cursor-pointer"
                          >
                            <div className="font-serif-editorial text-base font-bold text-[#a34063]">
                              {block.rune}
                            </div>
                            <div className="text-[10px] opacity-75">{block.label}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {project.interactiveType === 'storybook' && (
                    <div className={`rounded-xl border p-4 mb-4 ${subSurfaceClass}`}>
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="font-semibold flex items-center gap-1">
                          <BookOpen className="w-3.5 h-3.5 text-[#a34063]" aria-hidden="true" />
                          <span>{STORYBOOK_PAGES[storyPageIdx].heading}</span>
                        </span>
                        <span className="font-mono-tabular opacity-75">
                          {storyPageIdx + 1} / {STORYBOOK_PAGES.length}
                        </span>
                      </div>
                      <p className="text-xs leading-relaxed italic mb-3">
                        “{STORYBOOK_PAGES[storyPageIdx].text}”
                      </p>
                      <div className="flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            playUiClick(isMuted, 0.95);
                            setStoryPageIdx((i) => (i - 1 + STORYBOOK_PAGES.length) % STORYBOOK_PAGES.length);
                          }}
                          className="px-2.5 py-1 rounded-md border border-current/20 text-xs font-medium hover:border-[#a34063] cursor-pointer whitespace-nowrap shrink-0"
                        >
                          Previous Page
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            playUiClick(isMuted, 1.1);
                            setStoryPageIdx((i) => (i + 1) % STORYBOOK_PAGES.length);
                          }}
                          className="px-2.5 py-1 rounded-md bg-[#a34063] text-white text-xs font-medium hover:bg-[#8d3554] cursor-pointer whitespace-nowrap shrink-0"
                        >
                          Turn Cloth Page
                        </button>
                      </div>
                    </div>
                  )}

                  {project.interactiveType === 'growth-chart' && (
                    <div className={`rounded-xl border p-4 mb-4 ${subSurfaceClass}`}>
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs mb-3">
                        <span className="font-semibold flex items-center gap-1.5">
                          <Ruler className="w-3.5 h-3.5 text-[#a34063]" aria-hidden="true" />
                          <span>Nursery Doorframe Height & Skill Log</span>
                        </span>
                        <span className="font-mono-tabular font-semibold text-[#a34063]">
                          Current Height: 32.5 Cloud-Inches
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {[
                          {
                            height: '24.0 in',
                            rank: '01 · Pillow Fluffer',
                            skill: 'Learned to tie the pink starlight nightcap bow without tangles.',
                          },
                          {
                            height: '28.5 in',
                            rank: '02 · Lantern Polisher',
                            skill: 'Calibrated frosted twilight glass to banish coat-rack shadows.',
                          },
                          {
                            height: '32.5 in',
                            rank: '03 · Junior Dream Engineer',
                            skill: 'Certified solo rooftop pilot & 6-pin brass music box composer.',
                          },
                        ].map((m, idx) => (
                          <button
                            key={m.rank}
                            type="button"
                            onClick={() => {
                              playUiClick(isMuted, 1 + idx * 0.1);
                              setSelectedMilestone(idx);
                            }}
                            className={`p-3 rounded-lg border text-left transition-colors cursor-pointer ${
                              selectedMilestone === idx
                                ? 'border-[#a34063] bg-[#a34063]/10'
                                : 'border-current/15 hover:border-[#a34063]/50'
                            }`}
                          >
                            <div className="text-xs font-mono-tabular font-bold text-[#a34063]">
                              {m.height} · {m.rank}
                            </div>
                            <p className="text-xs opacity-85 mt-1 leading-snug">{m.skill}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Footer: Unboxed Craft Proof & Metric */}
                <div className="pt-3 border-t border-current/10 flex flex-wrap items-center justify-between gap-2 text-xs opacity-80">
                  <span>{project.status}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono-tabular font-medium text-[#a34063]">
                    {project.metrics}
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* Fullscreen Blueprint Lightbox Modal */}
      {lightboxProject && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="lightbox-project-title"
        >
          <div
            className={`relative w-full max-w-3xl rounded-2xl border p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto ${
              isNightMode
                ? 'bg-[#1c1729] border-[#33294a] text-[#f9f1e6]'
                : 'bg-[#fff8f1] border-[#e6d5c3] text-[#3a251c]'
            }`}
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <p className="text-xs font-mono-tabular text-[#a34063] mb-1">
                  Blueprint #{lightboxProject.number} · {lightboxProject.category} · {lightboxProject.year}
                </p>
                <h3
                  id="lightbox-project-title"
                  className="font-serif-editorial text-2xl sm:text-3xl font-semibold"
                >
                  {lightboxProject.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setLightboxProject(null)}
                aria-label="Close blueprint viewer"
                className="p-2 rounded-lg border border-current/20 hover:bg-[#a34063] hover:text-white transition-colors cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            <div className="relative aspect-16/9 rounded-xl overflow-hidden bg-[#13101c] border border-current/15 mb-6 flex items-center justify-center">
              <img
                src={lightboxProject.image}
                alt={lightboxProject.imageAlt}
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain p-4"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
              <div>
                <h4 className="font-semibold text-xs uppercase tracking-wider opacity-70 mb-1.5">
                  Invention Summary
                </h4>
                <p className="leading-relaxed opacity-90">{lightboxProject.summary}</p>
              </div>
              <div>
                <h4 className="font-semibold text-xs uppercase tracking-wider opacity-70 mb-1.5">
                  Nursery Craft & Safety Notes
                </h4>
                <p className="leading-relaxed opacity-90">{lightboxProject.craftNotes}</p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-current/10 flex flex-wrap items-center justify-between gap-3 text-xs">
              <span className="font-mono-tabular">
                Status: {lightboxProject.status} · Performance: {lightboxProject.metrics}
              </span>
              <button
                type="button"
                onClick={() => setLightboxProject(null)}
                className="px-4 py-2 rounded-lg bg-[#a34063] text-white font-semibold hover:bg-[#8d3554] transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                Done Inspecting
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
