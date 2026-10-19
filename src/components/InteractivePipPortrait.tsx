import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, Music, Eye, Award } from 'lucide-react';
import { calculateEyeOffset, EyeOffset } from '../utils/dreamEngine';

interface InteractivePipPortraitProps {
  isNightMode: boolean;
  isMuted: boolean;
  bowClicks: number;
  easterEggUnlocked: boolean;
  onBowClick: () => void;
  onQuickChime: () => void;
}

export const InteractivePipPortrait: React.FC<InteractivePipPortraitProps> = ({
  isNightMode,
  bowClicks,
  easterEggUnlocked,
  onBowClick,
  onQuickChime,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [eyeOffset, setEyeOffset] = useState<EyeOffset>({ x: 0, y: 0 });
  const [activePose, setActivePose] = useState<'cloud' | 'portrait'>('cloud');
  const [imageError, setImageError] = useState(false);
  const [speechBubble, setSpeechBubble] = useState<string>(
    'Psst… move your cursor to see my amber eye-pinpricks follow you, or tap my pink nightcap bow 3 times!'
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height * 0.42;
      const offset = calculateEyeOffset(e.clientX, e.clientY, centerX, centerY, 7);
      setEyeOffset(offset);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleBowTrigger = () => {
    onBowClick();
    if (bowClicks + 1 === 1) {
      setSpeechBubble('Hehe, that tickles my nightcap ribbon! (1/3 taps)');
    } else if (bowClicks + 1 === 2) {
      setSpeechBubble('Ooh, one more tap on the bow unlocks my secret Golden Lullaby! (2/3 taps)');
    } else {
      setSpeechBubble('★ Secret Unlocked: Golden Dream Weaver Badge & Starlight Chord! ★');
    }
  };

  const handleRattleChime = () => {
    onQuickChime();
    setSpeechBubble('♪ Ting-a-ling! Pip shook the Starlight Music Rattle — sleepiness level +15%! ♪');
  };

  const activeImageSrc =
    activePose === 'cloud'
      ? '/baby/assets/pip_avatar_cloud.png'
      : '/baby/assets/pip_portrait.png';

  return (
    <div
      ref={containerRef}
      className={`relative h-full flex flex-col justify-between rounded-2xl p-6 transition-colors duration-200 border ${
        isNightMode
          ? 'bg-[#1c1729] border-[#33294a] text-[#f9f1e6]'
          : 'bg-[#f8efe4] border-[#e6d5c3] text-[#3a251c]'
      }`}
    >
      {/* Top interactive status bar inside portrait card */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="text-xs font-medium opacity-80 flex items-center gap-1.5">
          <Eye className="w-3.5 h-3.5 text-[#a34063]" aria-hidden="true" />
          <span>Eye-Tracking Pinpricks Active</span>
          <span aria-hidden="true">·</span>
          <span className="font-mono-tabular">
            Δ({eyeOffset.x.toFixed(1)}, {eyeOffset.y.toFixed(1)})
          </span>
        </div>

        {/* Pose switcher */}
        <div
          className={`inline-flex rounded-lg p-0.5 border ${
            isNightMode ? 'bg-[#13101c] border-[#33294a]' : 'bg-[#fff8f1] border-[#e6d5c3]'
          }`}
          role="group"
          aria-label="Pip portrait pose selector"
        >
          <button
            type="button"
            onClick={() => setActivePose('cloud')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
              activePose === 'cloud'
                ? 'bg-[#a34063] text-white'
                : 'opacity-75 hover:opacity-100'
            }`}
          >
            Cloud Glider
          </button>
          <button
            type="button"
            onClick={() => setActivePose('portrait')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
              activePose === 'portrait'
                ? 'bg-[#a34063] text-white'
                : 'opacity-75 hover:opacity-100'
            }`}
          >
            Studio Portrait
          </button>
        </div>
      </div>

      {/* Main Character Stage with Official Render + Eye-Tracking Overlay */}
      <div className="relative flex-1 flex flex-col items-center justify-center py-1">
        <div className="relative w-full max-w-[360px] aspect-square rounded-2xl overflow-hidden border border-[#a34063]/20 bg-[#faf6f0] shadow-xs flex items-center justify-center">
          {!imageError ? (
            <img
              src={activeImageSrc}
              alt="Pip the Skull Baby wearing a starry nightcap with a pink bow"
              referrerPolicy="no-referrer"
              onError={() => setImageError(true)}
              className="w-full h-full object-cover select-none transition-transform duration-200"
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-6 text-center text-[#3a251c]">
              <Sparkles className="w-10 h-10 text-[#a34063] mb-2" />
              <p className="font-serif-editorial text-lg font-semibold">Pip, The Skull Baby</p>
              <p className="text-xs opacity-75">Junior Dream Engineer · Midnight Nursery</p>
            </div>
          )}

          {/* Interactive Cursor-Following Eye-Socket Pinprick Tracker */}
          <div
            className="pointer-events-none absolute top-3 left-3 flex items-center gap-2 rounded-xl bg-[#13101c]/90 backdrop-blur-xs px-3 py-1.5 border border-[#f59e0b]/40 text-[#fff8f1] shadow-sm"
            data-testid="pip-eye-tracker-widget"
          >
            <div className="flex items-center gap-1.5">
              {/* Left Velvet Eye Socket */}
              <div className="w-5 h-5 rounded-full bg-[#09070e] border border-[#f59e0b]/40 flex items-center justify-center overflow-hidden">
                <div
                  style={{
                    transform: `translate3d(${eyeOffset.x}px, ${eyeOffset.y}px, 0)`,
                  }}
                  className="w-2.5 h-2.5 rounded-full bg-[#fbbf24] shadow-[0_0_8px_#f59e0b] transition-transform duration-75"
                />
              </div>
              {/* Right Velvet Eye Socket */}
              <div className="w-5 h-5 rounded-full bg-[#09070e] border border-[#f59e0b]/40 flex items-center justify-center overflow-hidden">
                <div
                  style={{
                    transform: `translate3d(${eyeOffset.x}px, ${eyeOffset.y}px, 0)`,
                  }}
                  className="w-2.5 h-2.5 rounded-full bg-[#fbbf24] shadow-[0_0_8px_#f59e0b] transition-transform duration-75"
                />
              </div>
            </div>
            <span className="text-[11px] font-medium text-[#fde68a]">2,200K Gaze</span>
          </div>

          {/* Interactive Hidden Easter Egg Trigger: Pip's Pink Nightcap Bow */}
          <button
            type="button"
            onClick={handleBowTrigger}
            aria-label="Tap Pink Nightcap Bow Easter Egg"
            className={`absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-transform duration-150 active:scale-95 cursor-pointer whitespace-nowrap shrink-0 shadow-sm ${
              easterEggUnlocked
                ? 'bg-[#f59e0b] text-[#13101c] font-semibold'
                : 'bg-[#a34063] text-white hover:bg-[#8e3555]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
            <span>
              {easterEggUnlocked
                ? 'Golden Bow Unlocked!'
                : `Tap Pink Bow (${Math.min(bowClicks, 3)}/3)`}
            </span>
          </button>
        </div>

        {/* Pip's Live Voice Bubble */}
        <div
          className={`mt-4 w-full rounded-xl p-3.5 text-xs leading-relaxed border ${
            isNightMode
              ? 'bg-[#13101c] border-[#33294a] text-[#e6d5c3]'
              : 'bg-[#fff8f1] border-[#e6d5c3] text-[#5c4033]'
          }`}
          aria-live="polite"
        >
          <p className="font-medium">{speechBubble}</p>
        </div>
      </div>

      {/* Bottom Interactive Nursery Actions */}
      <div className="mt-4 pt-3 border-t border-current/10 flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={handleRattleChime}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold bg-[#a34063] text-white hover:bg-[#8d3554] transition-colors cursor-pointer whitespace-nowrap shrink-0"
        >
          <Music className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Chime Star Rattle</span>
        </button>

        {easterEggUnlocked ? (
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#d97706]">
            <Award className="w-4 h-4" aria-hidden="true" />
            <span>Golden Dream Weaver Secret Found</span>
          </div>
        ) : (
          <span className="text-xs opacity-75">
            Secret Hint: Curious visitors tap the pink bow 3 times
          </span>
        )}
      </div>
    </div>
  );
};
