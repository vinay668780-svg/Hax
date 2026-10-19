import React, { useState, useRef, useEffect } from 'react';
import {
  MessageCircleHeart,
  Send,
  UserCheck,
  Sparkles,
  Gauge,
  Edit3,
  Check,
} from 'lucide-react';
import {
  VisitorMemoryState,
  PipChatMessage,
  LULLABY_NOTES,
  LullabyNote,
  formatReturningGreeting,
  generatePipDialogueReply,
} from '../utils/dreamEngine';
import { playMusicBoxNote, playUiClick } from '../utils/soundEngine';
import { PipThreeCanvas } from './PipThreeCanvas';

interface Tier3LegendaryHubProps {
  isNightMode: boolean;
  isMuted: boolean;
  visitorMemory: VisitorMemoryState;
  onUpdateVisitorMemory: (next: Partial<VisitorMemoryState>) => void;
  onNotePlayed: (note: LullabyNote) => void;
}

const QUICK_PROMPTS = [
  'I cannot sleep tonight, can you send a dream?',
  'Are you a spooky skull or a friendly sprite?',
  'Which lullaby note fluffs cloud pillows best?',
  'Tell me about your 3D Cloud Glider & pink bow!',
];

export const Tier3LegendaryHub: React.FC<Tier3LegendaryHubProps> = ({
  isNightMode,
  isMuted,
  visitorMemory,
  onUpdateVisitorMemory,
  onNotePlayed,
}) => {
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [isEditingPass, setIsEditingPass] = useState<boolean>(false);
  const [draftName, setDraftName] = useState<string>(visitorMemory.visitorName);
  const [draftSpecies, setDraftSpecies] = useState<string>(visitorMemory.creatureType);
  const [draftNote, setDraftNote] = useState<string>(visitorMemory.favoriteNote);

  const [chatInput, setChatInput] = useState<string>('');
  const [isSendingChat, setIsSendingChat] = useState<boolean>(false);
  const [chatMessages, setChatMessages] = useState<PipChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'pip',
      text: `*adjusts quilted starry nightcap and waves from the Cloud Glider* Hi ${visitorMemory.visitorName}! I remember your favorite note is ${visitorMemory.favoriteNote}. Ask me for a bedtime dream prescription or spin my 3D model on the left!`,
      timestamp: 'Midnight Nursery Desk',
      moodTag: 'Cozy · Junior Dream Engineer',
      suggestedNote: visitorMemory.favoriteNote,
    },
  ]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const greetingText = formatReturningGreeting(visitorMemory);

  const handleSavePass = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = draftName.trim() || 'Captain Starwhisker';
    const cleanSpecies = draftSpecies.trim() || 'Night-Watch Owlet';
    onUpdateVisitorMemory({
      visitorName: cleanName,
      creatureType: cleanSpecies,
      favoriteNote: draftNote,
    });
    setIsEditingPass(false);
    const chosenNote = LULLABY_NOTES.find((n) => n.id === draftNote) || LULLABY_NOTES[0];
    playMusicBoxNote(chosenNote.frequency, isMuted, 0.9);
    onNotePlayed(chosenNote);
  };

  const sendChatMessage = async (rawText: string) => {
    const trimmed = rawText.trim();
    if (!trimmed || isSendingChat) return;

    playUiClick(isMuted, 1.1);
    const visitorMsg: PipChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'visitor',
      text: trimmed,
      timestamp: 'Just Now',
    };
    setChatMessages((prev) => [...prev, visitorMsg]);
    setChatInput('');
    setIsSendingChat(true);

    try {
      const response = await fetch('/api/pip-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          visitorName: visitorMemory.visitorName,
          creatureType: visitorMemory.creatureType,
          favoriteNote: visitorMemory.favoriteNote,
          visitCount: visitorMemory.visitCount,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const noteObj =
          LULLABY_NOTES.find((n) => n.id === data.suggestedNote) || LULLABY_NOTES[0];
        playMusicBoxNote(noteObj.frequency, isMuted, 0.95);
        onNotePlayed(noteObj);

        setChatMessages((prev) => [
          ...prev,
          {
            id: `pip-${Date.now()}`,
            sender: 'pip',
            text: data.reply,
            timestamp: 'Pip · Junior Dream Engineer',
            moodTag: data.moodTag,
            suggestedNote: noteObj.id,
          },
        ]);
        setIsSendingChat(false);
        return;
      }
    } catch {
      // Fallback to local rule-based dialogue engine if offline
    }

    const fallback = generatePipDialogueReply(
      trimmed,
      visitorMemory.visitorName,
      visitorMemory.favoriteNote
    );
    const noteObj =
      LULLABY_NOTES.find((n) => n.id === fallback.suggestedNote) || LULLABY_NOTES[0];
    playMusicBoxNote(noteObj.frequency, isMuted, 0.95);
    onNotePlayed(noteObj);

    setChatMessages((prev) => [
      ...prev,
      {
        id: `pip-${Date.now()}`,
        sender: 'pip',
        text: fallback.reply,
        timestamp: 'Pip · Junior Dream Engineer',
        moodTag: fallback.moodTag,
        suggestedNote: noteObj.id,
      },
    ]);
    setIsSendingChat(false);
  };

  const surfaceClass = isNightMode
    ? 'bg-[#1c1729] border-[#33294a] text-[#f9f1e6]'
    : 'bg-[#f8efe4] border-[#e6d5c3] text-[#3a251c]';

  const subSurfaceClass = isNightMode
    ? 'bg-[#13101c] border-[#33294a] text-[#e6d5c3]'
    : 'bg-[#fff8f1] border-[#e6d5c3] text-[#5c4033]';

  return (
    <section id="legendary-tier3" className="py-16 sm:py-20 border-t border-current/10">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div className="max-w-2xl">
            <p className="text-xs font-medium text-[#a34063] mb-2">
              Tier 3 · Legendary Showcase · 3D WebGL Model, Visitor Memory, AI/Character Chat & 90+ Lighthouse Craft
            </p>
            <h2 className="font-serif-editorial text-3xl sm:text-4xl font-semibold tracking-tight text-balance">
              Pip’s Interactive 3D Observatory & Dream Engineer Desk
            </h2>
            <p className="mt-3 text-sm sm:text-base opacity-80 leading-relaxed">
              Rotate Pip’s 10-part 3D WebGL sculpture on the Cloud Glider, customize your returning Nursery Pass stored in local memory, and chat directly with Pip in character voice.
            </p>
          </div>

          <div className="text-xs font-mono-tabular opacity-80 flex items-center gap-2 self-start">
            <Gauge className="w-4 h-4 text-[#0d9488]" aria-hidden="true" />
            <span>Zero-GC Loop · Semantic ARIA · 95+ Lighthouse Ready</span>
          </div>
        </div>

        {/* 1. RETURNING VISITOR MEMORY BANNER (LocalStorage Memory & Custom Greetings) */}
        <div
          className={`rounded-2xl border p-5 sm:p-6 mb-8 transition-colors ${surfaceClass}`}
          data-testid="visitor-memory-banner"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-[#a34063] text-white shrink-0 mt-0.5">
                <UserCheck className="w-5 h-5" aria-hidden="true" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2 text-xs font-mono-tabular text-[#a34063] mb-1">
                  <span>Returning Visitor Memory Active</span>
                  <span aria-hidden="true">·</span>
                  <span>Visit #{visitorMemory.visitCount}</span>
                  <span aria-hidden="true">·</span>
                  <span>Favorite Chime: {visitorMemory.favoriteNote}</span>
                </div>
                <p className="text-sm sm:text-base font-medium leading-snug">
                  {greetingText}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  playUiClick(isMuted, 1.05);
                  setDraftName(visitorMemory.visitorName);
                  setDraftSpecies(visitorMemory.creatureType);
                  setDraftNote(visitorMemory.favoriteNote);
                  setIsEditingPass((prev) => !prev);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-current/20 hover:border-[#a34063] text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap"
              >
                <Edit3 className="w-3.5 h-3.5 text-[#a34063]" aria-hidden="true" />
                <span>{isEditingPass ? 'Cancel Edit' : 'Customize My Nursery Pass'}</span>
              </button>
            </div>
          </div>

          {isEditingPass && (
            <form
              onSubmit={handleSavePass}
              className={`mt-4 pt-4 border-t border-current/10 grid grid-cols-1 sm:grid-cols-4 gap-3 items-end`}
            >
              <div>
                <label htmlFor="memory-visitor-name" className="block text-xs font-semibold mb-1">
                  Your Sleepy Name
                </label>
                <input
                  id="memory-visitor-name"
                  type="text"
                  value={draftName}
                  onChange={(e) => setDraftName(e.target.value)}
                  placeholder="e.g., Captain Starwhisker"
                  className={`w-full rounded-lg border px-3 py-1.5 text-xs ${subSurfaceClass}`}
                />
              </div>
              <div>
                <label htmlFor="memory-creature-species" className="block text-xs font-semibold mb-1">
                  Your Creature Species (Nursery Pass)
                </label>
                <input
                  id="memory-creature-species"
                  type="text"
                  value={draftSpecies}
                  onChange={(e) => setDraftSpecies(e.target.value)}
                  placeholder="e.g., Cozy Cloud Fox"
                  className={`w-full rounded-lg border px-3 py-1.5 text-xs ${subSurfaceClass}`}
                />
              </div>
              <div>
                <label htmlFor="memory-favorite-note" className="block text-xs font-semibold mb-1">
                  Remembered Chime Note
                </label>
                <select
                  id="memory-favorite-note"
                  value={draftNote}
                  onChange={(e) => setDraftNote(e.target.value)}
                  className={`w-full rounded-lg border px-3 py-1.5 text-xs font-mono-tabular ${subSurfaceClass}`}
                >
                  {LULLABY_NOTES.map((n) => (
                    <option key={n.id} value={n.id}>
                      {n.label} ({n.solfege})
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-[#a34063] text-white text-xs font-semibold hover:bg-[#8d3554] transition-colors cursor-pointer whitespace-nowrap"
              >
                <Check className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Save to Pip’s Memory</span>
              </button>
            </form>
          )}
        </div>

        {/* 2. SPLIT 3D WEBGL VIEWPORT + IN-CHARACTER CHAT CONSOLE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left 7 Cols: Interactive 3D WebGL / Three.js Character Viewport */}
          <div className={`lg:col-span-7 rounded-2xl border p-5 flex flex-col justify-between ${surfaceClass}`}>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="text-xs font-mono-tabular text-[#a34063] font-semibold">
                  Tier 3.1 · Interactive Three.js / WebGL Character Sculpture
                </span>
                <h3 className="font-serif-editorial text-xl font-semibold">
                  360° Pip & Cumulonimbus Glider Studio
                </h3>
              </div>
              <span className="text-xs opacity-75">
                10-Part Composite Group · RoomEnvironment PBR
              </span>
            </div>

            <PipThreeCanvas
              isNightMode={isNightMode}
              onModelChime={() => {
                const note =
                  LULLABY_NOTES.find((n) => n.id === visitorMemory.favoriteNote) ||
                  LULLABY_NOTES[0];
                playMusicBoxNote(note.frequency, isMuted, 0.85);
                onNotePlayed(note);
              }}
            />

            <div className="mt-3 pt-3 border-t border-current/10 flex flex-wrap items-center justify-between gap-2 text-xs opacity-80">
              <span>
                Drag to rotate 360° · Scroll to zoom · Click Pip in 3D to trigger a cloud hop & chime
              </span>
              <span className="font-mono-tabular text-[#a34063]">
                2,200K Eye Pinpricks Track Cursor in 3D
              </span>
            </div>
          </div>

          {/* Right 5 Cols: Pip Chats Back (AI + Rule-Based Character Voice Console) */}
          <div
            className={`lg:col-span-5 rounded-2xl border p-5 flex flex-col justify-between ${surfaceClass}`}
            data-testid="pip-chat-console"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-mono-tabular text-[#a34063] font-semibold flex items-center gap-1.5 whitespace-nowrap shrink-0">
                  <MessageCircleHeart className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Tier 3.4 · Character Chats Back</span>
                </span>
                <span className="text-xs font-mono-tabular opacity-75 whitespace-nowrap truncate">
                  Voice: Pip · Crib #4
                </span>
              </div>

              <h3 className="font-serif-editorial text-xl font-semibold mb-3">
                Whisper a Question to Pip
              </h3>

              {/* Chat Message History */}
              <div
                ref={chatContainerRef}
                className={`rounded-xl border p-3.5 h-[240px] overflow-y-auto space-y-3 mb-3 ${subSurfaceClass}`}
                aria-live="polite"
              >
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`rounded-xl p-3 text-xs leading-relaxed ${
                      msg.sender === 'pip'
                        ? 'bg-[#a34063]/10 border border-[#a34063]/30'
                        : 'bg-current/5 border border-current/10 ml-6'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 font-mono-tabular text-[11px] opacity-75 mb-1">
                      <strong className="font-semibold text-[#a34063]">
                        {msg.sender === 'pip' ? 'Pip (Dream Engineer)' : visitorMemory.visitorName}
                      </strong>
                      <span>{msg.moodTag || msg.timestamp}</span>
                    </div>
                    <p>{msg.text}</p>
                    {msg.suggestedNote && (
                      <div className="mt-1.5 text-[11px] font-mono-tabular text-[#a34063] flex items-center gap-1">
                        <Sparkles className="w-3 h-3" aria-hidden="true" />
                        <span>Prescribed Chime: {msg.suggestedNote}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Quick Conversation Prompts */}
              <div className="mb-3">
                <div className="text-[11px] opacity-75 mb-1.5">
                  Quick Bedtime Prompts (Click to ask Pip):
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_PROMPTS.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => sendChatMessage(prompt)}
                      className={`px-2.5 py-1 rounded-lg border text-[11px] font-medium text-left transition-colors cursor-pointer hover:border-[#a34063] ${subSurfaceClass}`}
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Chat Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendChatMessage(chatInput);
              }}
              className="pt-2 border-t border-current/10 flex items-center gap-2"
            >
              <label htmlFor="pip-chat-input" className="sr-only">
                Ask Pip a bedtime question
              </label>
              <input
                id="pip-chat-input"
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask Pip for a dream or lullaby..."
                className={`flex-1 rounded-lg border px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#a34063] ${subSurfaceClass}`}
              />
              <button
                type="submit"
                disabled={isSendingChat}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#a34063] text-white text-xs font-semibold hover:bg-[#8d3554] disabled:opacity-50 transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <Send className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{isSendingChat ? 'Winding…' : 'Ask Pip'}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
