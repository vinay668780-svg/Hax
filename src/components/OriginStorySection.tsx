import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Moon, Sparkles } from 'lucide-react';
import { ORIGIN_STORY_SCENES } from '../data/pipData';
import { countSceneWords } from '../utils/dreamEngine';
import { playUiClick, playMusicBoxNote } from '../utils/soundEngine';

interface OriginStorySectionProps {
  isNightMode: boolean;
  isMuted: boolean;
}

const SCENE_CHIMES = [523.25, 587.33, 659.25, 783.99];

export const OriginStorySection: React.FC<OriginStorySectionProps> = ({
  isNightMode,
  isMuted,
}) => {
  const [activeSceneIndex, setActiveSceneIndex] = useState<number>(0);
  const currentScene = ORIGIN_STORY_SCENES[activeSceneIndex];
  const wordCount = countSceneWords(currentScene.narrative);

  const handleSelectScene = (index: number) => {
    setActiveSceneIndex(index);
    playMusicBoxNote(SCENE_CHIMES[index % SCENE_CHIMES.length], isMuted, 0.85);
  };

  const surfaceClass = isNightMode
    ? 'bg-[#1c1729] border-[#33294a] text-[#f9f1e6]'
    : 'bg-[#f8efe4] border-[#e6d5c3] text-[#3a251c]';

  const subSurfaceClass = isNightMode
    ? 'bg-[#13101c] border-[#33294a] text-[#e6d5c3]'
    : 'bg-[#fff8f1] border-[#e6d5c3] text-[#5c4033]';

  return (
    <section id="origin-story" className="py-16 sm:py-20 border-t border-current/10">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="max-w-2xl">
            <p className="text-xs font-medium text-[#a34063] mb-2">
              03 · What Pip’s Story Is · Interactive Bedtime Journey
            </p>
            <h2 className="font-serif-editorial text-3xl sm:text-4xl font-semibold tracking-tight text-balance">
              From Fallen Dandelion Star to Junior Dream Engineer
            </h2>
            <p className="mt-3 text-sm sm:text-base opacity-80 leading-relaxed">
              Follow Pip’s bedtime shift across four miniature scenes. Step through the interactive storybook theater below or scan the full timeline at a glance.
            </p>
          </div>

          {/* Scene Selector Tabs */}
          <div
            className={`inline-flex flex-wrap items-center gap-1 p-1 rounded-xl border self-start ${subSurfaceClass}`}
            role="tablist"
            aria-label="Bedtime origin story chapters"
          >
            {ORIGIN_STORY_SCENES.map((scene, idx) => {
              const isSelected = idx === activeSceneIndex;
              return (
                <button
                  key={scene.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => handleSelectScene(idx)}
                  className={`px-3 py-1.5 text-xs font-mono-tabular font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    isSelected
                      ? 'bg-[#a34063] text-white shadow-xs'
                      : 'opacity-75 hover:opacity-100'
                  }`}
                >
                  Scene 0{idx + 1}
                </button>
              );
            })}
          </div>
        </div>

        {/* Interactive Theater Stage for Active Scene */}
        <div className={`rounded-2xl border p-6 sm:p-8 mb-8 ${surfaceClass}`}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Narrative & Quote */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2 text-xs opacity-75 mb-3">
                  <Moon className="w-3.5 h-3.5 text-[#a34063]" aria-hidden="true" />
                  <span className="font-mono-tabular font-semibold text-[#a34063]">
                    {currentScene.chapter}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{currentScene.location}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono-tabular">{wordCount} words (Limit: 150)</span>
                </div>

                <h3 className="font-serif-editorial text-2xl sm:text-3xl font-semibold tracking-tight mb-4 text-balance">
                  {currentScene.title}
                </h3>

                <p className="text-base sm:text-lg leading-relaxed opacity-90 mb-6">
                  {currentScene.narrative}
                </p>

                <blockquote className={`rounded-xl border p-4 text-sm italic ${subSurfaceClass}`}>
                  {currentScene.pipQuote}
                </blockquote>
              </div>

              {/* Prev / Next Scene Controls */}
              <div className="mt-6 pt-4 border-t border-current/10 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      playUiClick(isMuted, 0.95);
                      handleSelectScene(
                        (activeSceneIndex - 1 + ORIGIN_STORY_SCENES.length) %
                          ORIGIN_STORY_SCENES.length
                      );
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-current/20 text-xs font-medium hover:border-[#a34063] transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                    <span>Previous Scene</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      playUiClick(isMuted, 1.1);
                      handleSelectScene((activeSceneIndex + 1) % ORIGIN_STORY_SCENES.length);
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#a34063] text-white text-xs font-semibold hover:bg-[#8d3554] transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <span>Next Bedtime Scene</span>
                    <ChevronRight className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>

                <span className="text-xs font-mono-tabular opacity-75">
                  Chapter {activeSceneIndex + 1} of {ORIGIN_STORY_SCENES.length} · {currentScene.timeOfNight}
                </span>
              </div>
            </div>

            {/* Right Column: Scene Illustration Container */}
            <div className="lg:col-span-5">
              <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-[#faf6f0] border border-[#a34063]/25 flex items-center justify-center">
                <img
                  src={currentScene.image}
                  alt={currentScene.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover select-none transition-transform duration-200"
                />
                <div className="absolute bottom-3 left-3 right-3 rounded-lg bg-[#13101c]/90 backdrop-blur-xs px-3 py-2 border border-white/10 flex items-center justify-between text-xs text-[#fff8f1]">
                  <span className="font-medium truncate">{currentScene.timeOfNight}</span>
                  <span className="font-mono-tabular text-[#fbbf24] shrink-0 ml-2">
                    {currentScene.chapter.split(' · ')[1]}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* All 4 Story Scenes Quick-Scan Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ORIGIN_STORY_SCENES.map((scene, idx) => {
            const isCurrent = idx === activeSceneIndex;
            return (
              <button
                key={scene.id}
                type="button"
                onClick={() => handleSelectScene(idx)}
                className={`text-left rounded-xl border p-4 transition-colors cursor-pointer flex flex-col justify-between ${
                  isCurrent
                    ? 'border-[#a34063] bg-[#a34063]/10'
                    : `${surfaceClass} hover:border-[#a34063]/50`
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-mono-tabular text-[#a34063] mb-1.5">
                    <span>{scene.chapter}</span>
                    {isCurrent && <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />}
                  </div>
                  <h4 className="font-serif-editorial text-base font-semibold mb-1">
                    {scene.title}
                  </h4>
                  <p className="text-xs opacity-80 line-clamp-3 leading-relaxed">
                    {scene.narrative}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-current/10 text-[11px] font-mono-tabular opacity-70">
                  {scene.location} · {countSceneWords(scene.narrative)} words
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
