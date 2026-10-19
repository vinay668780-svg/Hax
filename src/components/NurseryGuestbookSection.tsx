import React, { useState } from 'react';
import { MessageSquareHeart, Send, AlertCircle, CheckCircle2 } from 'lucide-react';
import {
  GuestbookEntry,
  validateGuestbookInput,
  formatOdometerDigits,
} from '../utils/dreamEngine';
import { playMusicBoxNote, playUiClick } from '../utils/soundEngine';

interface NurseryGuestbookSectionProps {
  isNightMode: boolean;
  isMuted: boolean;
  entries: GuestbookEntry[];
  visitorCount: number;
  onAddEntry: (entry: GuestbookEntry) => void;
}

export const NurseryGuestbookSection: React.FC<NurseryGuestbookSectionProps> = ({
  isNightMode,
  isMuted,
  entries,
  visitorCount,
  onAddEntry,
}) => {
  const [visitorName, setVisitorName] = useState('');
  const [creatureType, setCreatureType] = useState('Sleepy Woodland Creature');
  const [favoriteProject, setFavoriteProject] = useState('The Lullaby Lab');
  const [bedtimeWish, setBedtimeWish] = useState('');
  const [errors, setErrors] = useState<{
    visitorName?: string;
    creatureType?: string;
    bedtimeWish?: string;
  }>({});
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const odometerDigits = formatOdometerDigits(visitorCount, 7);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitSuccess(false);

    const validation = validateGuestbookInput({
      visitorName,
      creatureType,
      bedtimeWish,
    });

    if (!validation.valid) {
      setErrors(validation.errors);
      playUiClick(isMuted, 0.75);
      return;
    }

    setErrors({});
    const newEntry: GuestbookEntry = {
      id: `gb-${Date.now()}`,
      visitorName: visitorName.trim(),
      creatureType: creatureType.trim(),
      bedtimeWish: bedtimeWish.trim(),
      favoriteProject,
      timestamp: 'Just Now · Nursery Wall',
    };

    onAddEntry(newEntry);
    playMusicBoxNote(880, isMuted, 1.0);
    setVisitorName('');
    setBedtimeWish('');
    setSubmitSuccess(true);
  };

  const surfaceClass = isNightMode
    ? 'bg-[#1c1729] border-[#33294a] text-[#f9f1e6]'
    : 'bg-[#f8efe4] border-[#e6d5c3] text-[#3a251c]';

  const subSurfaceClass = isNightMode
    ? 'bg-[#13101c] border-[#33294a] text-[#e6d5c3]'
    : 'bg-[#fff8f1] border-[#e6d5c3] text-[#5c4033]';

  return (
    <section id="guestbook" className="py-16 sm:py-20 border-t border-current/10">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        {/* Header + Vintage Odometer Ticker */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="max-w-2xl">
            <p className="text-xs font-medium text-[#a34063] mb-2">
              04 · Early-Web Soul Side Quests · Live Nursery Guestbook & Odometer
            </p>
            <h2 className="font-serif-editorial text-3xl sm:text-4xl font-semibold tracking-tight text-balance">
              Sign Pip’s Midnight Nursery Wall
            </h2>
            <p className="mt-3 text-sm sm:text-base opacity-80 leading-relaxed">
              Leave a bedtime note or request a custom dream delivery. Every signature chimes the nursery bell and advances our vintage early-web hit counter.
            </p>
          </div>

          {/* Vintage Hit Counter Odometer (+1 pt Side Quest) */}
          <div
            className={`rounded-xl border px-4 py-3 flex items-center gap-3 self-start ${subSurfaceClass}`}
            aria-label={`Nursery visitor odometer count: ${visitorCount}`}
          >
            <div className="text-xs">
              <div className="font-semibold text-[#a34063]">Nursery Hit Odometer</div>
              <div className="opacity-70">Tucked-In Visitors</div>
            </div>
            <div className="flex items-center gap-1" data-testid="hit-counter-odometer">
              {odometerDigits.map((digit, index) => (
                <span
                  key={index}
                  className="w-6 h-8 rounded-md bg-[#13101c] text-[#fbbf24] border border-[#33294a] font-mono-tabular font-bold text-sm flex items-center justify-center shadow-inner"
                >
                  {digit}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Guestbook Form */}
          <form
            onSubmit={handleSubmit}
            noValidate
            className={`lg:col-span-5 rounded-2xl border p-6 ${surfaceClass}`}
          >
            <div className="flex items-center gap-2 mb-4">
              <MessageSquareHeart className="w-4 h-4 text-[#a34063]" aria-hidden="true" />
              <h3 className="font-serif-editorial text-xl font-semibold">
                Leave a Bedtime Request
              </h3>
            </div>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="gb-visitor-name"
                  className="block text-xs font-semibold mb-1.5"
                >
                  Your Name or Sleepy Alias *
                </label>
                <input
                  id="gb-visitor-name"
                  type="text"
                  value={visitorName}
                  onChange={(e) => setVisitorName(e.target.value)}
                  placeholder="e.g., Barnaby Owlet"
                  className={`w-full rounded-lg border px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#a34063] ${subSurfaceClass}`}
                />
                {errors.visitorName && (
                  <p className="mt-1 text-xs text-[#e11d48] flex items-center gap-1" role="alert">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    <span>{errors.visitorName}</span>
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="gb-creature-type"
                    className="block text-xs font-semibold mb-1.5"
                  >
                    Creature Species *
                  </label>
                  <select
                    id="gb-creature-type"
                    value={creatureType}
                    onChange={(e) => setCreatureType(e.target.value)}
                    className={`w-full rounded-lg border px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#a34063] ${subSurfaceClass}`}
                  >
                    <option value="Sleepy Woodland Creature">Sleepy Woodland Creature</option>
                    <option value="Night-Shift Developer">Night-Shift Developer</option>
                    <option value="Attic Dormouse">Attic Dormouse</option>
                    <option value="Fledgling Barn Owlet">Fledgling Barn Owlet</option>
                    <option value="Friendly Cozy Ghost">Friendly Cozy Ghost</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="gb-favorite-project"
                    className="block text-xs font-semibold mb-1.5"
                  >
                    Favorite Invention
                  </label>
                  <select
                    id="gb-favorite-project"
                    value={favoriteProject}
                    onChange={(e) => setFavoriteProject(e.target.value)}
                    className={`w-full rounded-lg border px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#a34063] ${subSurfaceClass}`}
                  >
                    <option value="The Lullaby Lab">The Lullaby Lab</option>
                    <option value="Nightlight Collection">Nightlight Collection</option>
                    <option value="Dream Delivery Routes">Dream Delivery Routes</option>
                    <option value="Rattle & Block Toys">Rattle & Block Toys</option>
                    <option value="Bedtime Storybook">Bedtime Storybook</option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="gb-bedtime-wish"
                  className="block text-xs font-semibold mb-1.5"
                >
                  Bedtime Note or Dream Order *
                </label>
                <textarea
                  id="gb-bedtime-wish"
                  rows={3}
                  value={bedtimeWish}
                  onChange={(e) => setBedtimeWish(e.target.value)}
                  placeholder="Write a cozy note for Pip's nursery wall..."
                  className={`w-full rounded-lg border px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#a34063] ${subSurfaceClass}`}
                />
                {errors.bedtimeWish && (
                  <p className="mt-1 text-xs text-[#e11d48] flex items-center gap-1" role="alert">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    <span>{errors.bedtimeWish}</span>
                  </p>
                )}
              </div>

              {submitSuccess && (
                <p className="text-xs font-medium text-[#0d9488] flex items-center gap-1.5" role="status">
                  <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>Your note has been pinned to Pip’s Midnight Nursery wall!</span>
                </p>
              )}

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#a34063] text-white text-xs font-semibold hover:bg-[#8d3554] transition-colors cursor-pointer whitespace-nowrap"
              >
                <Send className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Pin Note to Nursery Guestbook</span>
              </button>
            </div>
          </form>

          {/* Guestbook Entries Wall */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between text-xs opacity-75">
              <span>Recent Nursery Wall Signatures ({entries.length})</span>
              <span className="font-mono-tabular">Verified Cozy · Zero Spooks</span>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {entries.map((entry) => (
                <article
                  key={entry.id}
                  className={`rounded-2xl border p-5 transition-colors ${surfaceClass}`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs opacity-75 mb-2">
                    <div className="flex items-center gap-1.5">
                      <strong className="font-semibold text-sm opacity-100 text-[#a34063]">
                        {entry.visitorName}
                      </strong>
                      <span aria-hidden="true">·</span>
                      <span>{entry.creatureType}</span>
                    </div>
                    <span className="font-mono-tabular">{entry.timestamp}</span>
                  </div>
                  <p className="text-sm leading-relaxed mb-3">“{entry.bedtimeWish}”</p>
                  <div className="text-xs opacity-70 font-mono-tabular">
                    Favorite Craft: {entry.favoriteProject}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
