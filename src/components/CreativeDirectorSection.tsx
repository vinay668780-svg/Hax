import React, { useState } from 'react';
import { Copy, Check, Compass, Code2, Clock, Sparkles, Layers } from 'lucide-react';
import {
  CREATIVE_CONCEPTS,
  EXECUTION_ROADMAP,
  STARTER_CODE_SNIPPETS,
} from '../data/pipData';
import { playUiClick } from '../utils/soundEngine';

interface CreativeDirectorSectionProps {
  isNightMode: boolean;
  isMuted: boolean;
}

export const CreativeDirectorSection: React.FC<CreativeDirectorSectionProps> = ({
  isNightMode,
  isMuted,
}) => {
  const [activeTab, setActiveTab] = useState<'brief' | 'concepts' | 'roadmap' | 'snippets'>('brief');
  const [trackFilter, setTrackFilter] = useState<'all' | 'track1' | 'track2'>('all');
  const [completedHours, setCompletedHours] = useState<Record<string, boolean>>({
    'phase-1': true,
    'phase-2': true,
  });
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopySnippet = (id: string, code: string) => {
    playUiClick(isMuted, 1.2);
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(code).catch(() => {});
    }
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleRoadmapPhase = (id: string) => {
    playUiClick(isMuted, 1.05);
    setCompletedHours((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const surfaceClass = isNightMode
    ? 'bg-[#1c1729] border-[#33294a] text-[#f9f1e6]'
    : 'bg-[#f8efe4] border-[#e6d5c3] text-[#3a251c]';

  const subSurfaceClass = isNightMode
    ? 'bg-[#13101c] border-[#33294a] text-[#e6d5c3]'
    : 'bg-[#fff8f1] border-[#e6d5c3] text-[#5c4033]';

  const filteredConcepts = CREATIVE_CONCEPTS.filter((c) => {
    if (trackFilter === 'all') return true;
    if (trackFilter === 'track1') return c.track.includes('Track 1');
    return c.track.includes('Track 2');
  });

  return (
    <section id="director-kit" className="py-16 sm:py-20 border-t border-current/10">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="max-w-2xl">
            <p className="text-xs font-medium text-[#a34063] mb-2">
              05 · Pair-Programmer & Creative Director Studio · haX.baby 48h Playbook
            </p>
            <h2 className="font-serif-editorial text-3xl sm:text-4xl font-semibold tracking-tight text-balance">
              Your Complete “Baby’s First Website” Winning Strategy & Code Kit
            </h2>
            <p className="mt-3 text-sm sm:text-base opacity-80 leading-relaxed">
              Everything above is a live, playable Track 1 winning build. Below is your interactive Creative Director briefing: plain-English rubric breakdown, 6 Track 1 & Track 2 concepts, recommended stack, 48-hour roadmap, and copy-paste starter snippets.
            </p>
          </div>

          {/* 4-Tab Switcher */}
          <div
            className={`inline-flex flex-wrap items-center gap-1 p-1 rounded-xl border self-start ${subSurfaceClass}`}
            role="tablist"
            aria-label="Hackathon Creative Director Playbook Sections"
          >
            {[
              { id: 'brief', label: '1. Plain-English Brief', icon: Sparkles },
              { id: 'concepts', label: '2. 6 Track Concepts', icon: Compass },
              { id: 'roadmap', label: '3. Stack & 48h Roadmap', icon: Clock },
              { id: 'snippets', label: '4. Starter Code (5)', icon: Code2 },
            ].map((tab) => {
              const Icon = tab.icon;
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => {
                    playUiClick(isMuted, 1.08);
                    setActiveTab(tab.id as typeof activeTab);
                  }}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    isSelected
                      ? 'bg-[#a34063] text-white shadow-xs'
                      : 'opacity-75 hover:opacity-100'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* TAB 1: PLAIN-ENGLISH BRIEF & JUDGING STRATEGY */}
        {activeTab === 'brief' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className={`lg:col-span-7 rounded-2xl border p-6 sm:p-8 ${surfaceClass}`}>
              <p className="text-xs font-mono-tabular text-[#a34063] mb-2">
                17–19 October 2026 · 48 Hours · $400 Prize Pool ($160 / $120 / $80 / $40)
              </p>
              <h3 className="font-serif-editorial text-2xl font-semibold mb-3">
                What This Hackathon Actually Is (In Plain English)
              </h3>
              <p className="text-sm leading-relaxed opacity-90 mb-4">
                Forget corporate SaaS dashboards! <strong>“Baby’s First Website”</strong> by{' '}
                <strong>haX.baby</strong> asks you to build a cozy, storybook-style personal portfolio for a fictional baby character. Think of it as an interactive digital toybox that answers three simple questions:
              </p>
              <ol className="space-y-3 text-sm mb-6">
                <li className={`p-3.5 rounded-xl border ${subSurfaceClass}`}>
                  <strong className="font-semibold text-[#a34063]">1. Who is the baby?</strong>{' '}
                  Introduce their species, cozy personality, tiny quirks, and voice. (Choose Track 1: <em>Pip, The Skull Baby</em> using official transparent PNGs, or Track 2: <em>Your Own Original Baby</em>).
                </li>
                <li className={`p-3.5 rounded-xl border ${subSurfaceClass}`}>
                  <strong className="font-semibold text-[#a34063]">2. What do they make?</strong>{' '}
                  Showcase at least <strong>3 signature projects or inventions</strong> (like Pip’s Lullaby Lab, Nightlight Lanterns, and Rooftop Dream Delivery Map).
                </li>
                <li className={`p-3.5 rounded-xl border ${subSurfaceClass}`}>
                  <strong className="font-semibold text-[#a34063]">3. What is their bedtime origin story?</strong>{' '}
                  Tell a short, scrollable or scene-by-scene story (strictly <strong>under 150 words per scene</strong>) with at least one delightful interactive moment and one hidden Easter egg.
                </li>
              </ol>

              <div className={`p-4 rounded-xl border ${subSurfaceClass}`}>
                <h4 className="font-serif-editorial text-base font-semibold text-[#a34063] mb-1">
                  The Golden Rule to Win
                </h4>
                <p className="text-xs sm:text-sm leading-relaxed opacity-90">
                  A 100% working, ultra-cozy <strong>Tier 1 + Tier 2</strong> website with zero console errors, responsive mobile layout, and tactile Web Audio chimes will beat a laggy, half-broken Tier 3 Three.js scene every single time.
                </p>
              </div>
            </div>

            <div className={`lg:col-span-5 rounded-2xl border p-6 sm:p-8 flex flex-col justify-between ${surfaceClass}`}>
              <div>
                <p className="text-xs font-mono-tabular text-[#a34063] mb-2">
                  Official Judging Rubric + Bonus Side Quests
                </p>
                <h3 className="font-serif-editorial text-2xl font-semibold mb-4">
                  Where Your Winning Points Come From
                </h3>

                <div className="space-y-3 mb-6">
                  {[
                    {
                      weight: '35%',
                      title: 'Functionality & Polish',
                      desc: 'Every button works, zero console errors, smooth hover/click transitions.',
                    },
                    {
                      weight: '30%',
                      title: 'Early-Web Soul',
                      desc: 'Warm 90s/00s personal-web charm, guestbooks, odometers, handmade love.',
                    },
                    {
                      weight: '20%',
                      title: 'Creativity & Surprises',
                      desc: 'Eye-tracking gaze, playable Web Audio music box, confetti Easter egg.',
                    },
                    {
                      weight: '15%',
                      title: 'Clean Craft',
                      desc: 'Flawless mobile responsiveness (390px), fast load, semantic HTML.',
                    },
                  ].map((item) => (
                    <div key={item.title} className={`p-3 rounded-xl border ${subSurfaceClass}`}>
                      <div className="flex items-center justify-between text-xs font-semibold mb-1">
                        <span>{item.title}</span>
                        <span className="font-mono-tabular text-[#a34063]">{item.weight}</span>
                      </div>
                      <p className="text-xs opacity-80 leading-snug">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-current/10 text-xs space-y-1.5">
                <div className="font-semibold text-[#a34063]">
                  All +13 Bonus Side Quest Points Included in This App:
                </div>
                <p className="opacity-85">
                  · Click Sounds + Accessible Mute Switch (+3 pts) · Live Guestbook Wall (+2 pts) · Sparkle Cursor Trail (+2 pts) · Vintage Hit Odometer (+1 pt) · Responsive Nursery Mode (+5 pts)
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: 6 CREATIVE CONCEPTS (3 TRACK 1 + 3 TRACK 2) */}
        {activeTab === 'concepts' && (
          <div>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <p className="text-sm opacity-85">
                Compare 3 distinct creative directions for <strong>Track 1 (Pip)</strong> and 3 original character concepts for <strong>Track 2 (Your Own Baby)</strong>:
              </p>
              <div className={`inline-flex rounded-lg p-1 border ${subSurfaceClass}`}>
                {[
                  { id: 'all', label: 'All 6 Concepts' },
                  { id: 'track1', label: 'Track 1: Pip (3)' },
                  { id: 'track2', label: 'Track 2: Original Baby (3)' },
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setTrackFilter(f.id as typeof trackFilter)}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                      trackFilter === f.id ? 'bg-[#a34063] text-white' : 'opacity-75 hover:opacity-100'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredConcepts.map((concept) => (
                <article
                  key={concept.id}
                  className={`rounded-2xl border p-6 flex flex-col justify-between ${surfaceClass}`}
                >
                  <div>
                    <p className="text-xs font-mono-tabular text-[#a34063] mb-2">
                      {concept.track}
                    </p>
                    <h3 className="font-serif-editorial text-xl font-semibold mb-2">
                      {concept.title}
                    </h3>
                    <p className="text-xs opacity-75 mb-4">
                      <strong>Vibe:</strong> {concept.vibe} · <strong>Palette:</strong> {concept.palette}
                    </p>

                    <div className={`p-3.5 rounded-xl border mb-4 text-xs space-y-2 ${subSurfaceClass}`}>
                      <p>
                        <strong className="font-semibold text-[#a34063]">Signature Mechanic:</strong>{' '}
                        {concept.signatureMechanic}
                      </p>
                      <p>
                        <strong className="font-semibold">3 Showcase Projects:</strong>
                      </p>
                      <ul className="space-y-1 pl-3 list-disc opacity-90">
                        {concept.threeProjects.map((proj) => (
                          <li key={proj}>{proj}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <p className="text-xs opacity-85 pt-3 border-t border-current/10">
                    <strong className="font-semibold text-[#a34063]">Why Judges Love It:</strong>{' '}
                    {concept.whyItWins}
                  </p>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: RECOMMENDED TECH STACK & 48-HOUR ROADMAP */}
        {activeTab === 'roadmap' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Recommended Stack Column */}
            <div className={`lg:col-span-4 rounded-2xl border p-6 flex flex-col justify-between ${surfaceClass}`}>
              <div>
                <div className="flex items-center gap-2 text-xs font-mono-tabular text-[#a34063] mb-2">
                  <Layers className="w-4 h-4" aria-hidden="true" />
                  <span>Optimal 48-Hour Tech Stack</span>
                </div>
                <h3 className="font-serif-editorial text-2xl font-semibold mb-3">
                  Fastest Path to Ultra-Polished Tier 2
                </h3>
                <p className="text-xs sm:text-sm opacity-85 leading-relaxed mb-4">
                  Don’t waste 10 hours fighting complex backend servers or heavy 3D shaders. Use this exact lightweight stack (already pre-configured in this project):
                </p>

                <div className="space-y-3 text-xs">
                  {[
                    {
                      pkg: 'React 19 + Vite + TypeScript',
                      role: 'Instant component state for the Lullaby Synth, Lightbox, and Guestbook.',
                    },
                    {
                      pkg: 'Tailwind CSS v4',
                      role: 'Rapid styling with exact haX.baby tokens (#fff8f1 cream, #a34063 berry, #5c4033 cocoa).',
                    },
                    {
                      pkg: 'Native Web Audio API',
                      role: 'Zero external MP3 failures! Pure sine + triangle wave synthesis for music box chimes.',
                    },
                    {
                      pkg: 'lucide-react + canvas-confetti',
                      role: 'Clean nursery affordance icons + 1-line Easter egg celebratory confetti burst.',
                    },
                    {
                      pkg: 'Google Fonts (Fraunces + Fredoka)',
                      role: 'Editorial picture-book serif headers paired with bubbly early-web accents.',
                    },
                  ].map((item) => (
                    <div key={item.pkg} className={`p-3 rounded-xl border ${subSurfaceClass}`}>
                      <div className="font-mono-tabular font-semibold text-[#a34063] mb-0.5">
                        {item.pkg}
                      </div>
                      <p className="opacity-85 leading-snug">{item.role}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-current/10 text-xs opacity-80">
                <strong>Deployment Recommendation:</strong> Push to GitHub and connect to Vercel or Cloud Run—deploys in under 45 seconds with automatic HTTPS.
              </div>
            </div>

            {/* 48-Hour Hourly Execution Roadmap */}
            <div className={`lg:col-span-8 rounded-2xl border p-6 ${surfaceClass}`}>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                <div>
                  <p className="text-xs font-mono-tabular text-[#a34063]">
                    Interactive 48-Hour Execution Checklist
                  </p>
                  <h3 className="font-serif-editorial text-2xl font-semibold">
                    Hour-by-Hour Sprint Plan (Click to Check Off)
                  </h3>
                </div>
                <span className="text-xs font-mono-tabular">
                  Completed: {Object.values(completedHours).filter(Boolean).length} / {EXECUTION_ROADMAP.length} Phases
                </span>
              </div>

              <div className="space-y-4">
                {EXECUTION_ROADMAP.map((phase) => {
                  const isDone = !!completedHours[phase.id];
                  return (
                    <div
                      key={phase.id}
                      className={`rounded-xl border p-4 transition-colors ${subSurfaceClass} ${
                        isDone ? 'border-[#a34063]/60' : ''
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2.5">
                          <button
                            type="button"
                            onClick={() => toggleRoadmapPhase(phase.id)}
                            aria-pressed={isDone}
                            className={`px-2.5 py-1 rounded-md text-xs font-mono-tabular font-semibold border cursor-pointer transition-colors whitespace-nowrap shrink-0 ${
                              isDone
                                ? 'bg-[#a34063] text-white border-[#a34063]'
                                : 'border-current/25 hover:border-[#a34063]'
                            }`}
                          >
                            {isDone ? '✓ Done' : 'Mark Done'} · {phase.hours}
                          </button>
                          <h4 className="font-serif-editorial text-base sm:text-lg font-semibold">
                            {phase.title}
                          </h4>
                        </div>
                      </div>
                      <p className="text-xs opacity-80 mb-2">{phase.focus}</p>
                      <ul className="space-y-1 text-xs pl-4 list-disc opacity-90 mb-2">
                        {phase.deliverables.map((d) => (
                          <li key={d}>{d}</li>
                        ))}
                      </ul>
                      <p className="text-xs font-medium text-[#a34063] pt-2 border-t border-current/10">
                        ★ {phase.goldenTip}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: 5 PRODUCTION-READY COPY-PASTE CODE SNIPPETS */}
        {activeTab === 'snippets' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {STARTER_CODE_SNIPPETS.map((snippet) => {
              const isCopied = copiedId === snippet.id;
              return (
                <article
                  key={snippet.id}
                  className={`rounded-2xl border p-6 flex flex-col justify-between ${surfaceClass}`}
                >
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <span className="text-xs font-mono-tabular text-[#a34063]">
                        {snippet.tierBadge}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopySnippet(snippet.id, snippet.code)}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#a34063] text-white text-xs font-medium hover:bg-[#8d3554] transition-colors cursor-pointer whitespace-nowrap shrink-0"
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>Copied Snippet</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>Copy Code</span>
                          </>
                        )}
                      </button>
                    </div>
                    <h3 className="font-serif-editorial text-lg font-semibold mb-1">
                      {snippet.title}
                    </h3>
                    <p className="text-xs opacity-75 mb-3">{snippet.subtitle}</p>
                  </div>

                  <pre className="rounded-xl bg-[#13101c] text-[#f9f1e6] p-4 text-xs font-mono-tabular overflow-x-auto border border-[#33294a] leading-relaxed">
                    <code>{snippet.code}</code>
                  </pre>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
