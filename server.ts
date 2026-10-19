import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import {
  GuestbookEntry,
  validateGuestbookInput,
  generatePipDialogueReply,
} from './src/utils/dreamEngine.ts';
import { INITIAL_GUESTBOOK_ENTRIES } from './src/data/pipData.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '.data');
const GUESTBOOK_FILE = path.join(DATA_DIR, 'guestbook.json');

interface PersistedGuestbookStore {
  visitorCount: number;
  entries: GuestbookEntry[];
}

function loadGuestbookStore(): PersistedGuestbookStore {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(GUESTBOOK_FILE)) {
      const raw = fs.readFileSync(GUESTBOOK_FILE, 'utf-8');
      const parsed = JSON.parse(raw) as PersistedGuestbookStore;
      if (parsed && Array.isArray(parsed.entries)) {
        return parsed;
      }
    }
  } catch {
    // Fallback to initial store on read error
  }
  const initialStore: PersistedGuestbookStore = {
    visitorCount: 10428,
    entries: INITIAL_GUESTBOOK_ENTRIES.map((e) => ({ ...e, source: 'server' })),
  };
  saveGuestbookStore(initialStore);
  return initialStore;
}

function saveGuestbookStore(store: PersistedGuestbookStore): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(GUESTBOOK_FILE, JSON.stringify(store, null, 2), 'utf-8');
  } catch {
    // Ignore disk write errors in read-only environments
  }
}

let memoryStore: PersistedGuestbookStore = loadGuestbookStore();

async function startServer() {
  const app = express();
  app.use(express.json());

  // 1. Live Dream Guestbook Backend API (Tier 3 Legendary)
  app.get('/api/guestbook', (_req, res) => {
    res.json({
      visitorCount: memoryStore.visitorCount,
      entries: memoryStore.entries,
    });
  });

  app.post('/api/guestbook', (req, res) => {
    const {
      visitorName = '',
      creatureType = '',
      bedtimeWish = '',
      favoriteProject = 'The Lullaby Lab',
    } = req.body || {};

    const validation = validateGuestbookInput({
      visitorName: String(visitorName),
      creatureType: String(creatureType),
      bedtimeWish: String(bedtimeWish),
    });

    if (!validation.valid) {
      res.status(400).json({ error: 'Invalid guestbook entry', errors: validation.errors });
      return;
    }

    const newEntry: GuestbookEntry = {
      id: `gb-srv-${Date.now()}`,
      visitorName: String(visitorName).trim(),
      creatureType: String(creatureType).trim(),
      bedtimeWish: String(bedtimeWish).trim(),
      favoriteProject: String(favoriteProject).trim() || 'The Lullaby Lab',
      timestamp: 'Just Now · Server Nursery Wall',
      source: 'server',
    };

    memoryStore = {
      visitorCount: memoryStore.visitorCount + 1,
      entries: [newEntry, ...memoryStore.entries.slice(0, 49)],
    };
    saveGuestbookStore(memoryStore);

    res.status(201).json({
      entry: newEntry,
      visitorCount: memoryStore.visitorCount,
      entries: memoryStore.entries,
    });
  });

  // 2. Character Chats Back Backend API (Tier 3 Legendary: Gemini + Rule-Based Fallback)
  app.post('/api/pip-chat', async (req, res) => {
    const {
      message = '',
      visitorName = 'Sleepy Friend',
      creatureType = 'Woodland Creature',
      favoriteNote = 'C5',
      visitCount = 1,
    } = req.body || {};

    const cleanMessage = String(message).trim();
    if (!cleanMessage) {
      res.status(400).json({ error: 'Please type a message for Pip.' });
      return;
    }

    const ruleFallback = generatePipDialogueReply(
      cleanMessage,
      String(visitorName),
      String(favoriteNote)
    );

    const apiKey = process.env.GEMINI_API_KEY;
    const hasRealKey =
      Boolean(apiKey) &&
      apiKey !== 'MY_GEMINI_API_KEY' &&
      apiKey!.trim().length > 12;

    if (hasRealKey) {
      try {
        const ai = new GoogleGenAI({
          apiKey,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            },
          },
        });

        const systemInstruction = [
          'You are Pip, The Skull Baby, the Junior Dream Engineer at Midnight Nursery.',
          'Appearance: smooth porcelain-round skull face, oversized soft eye sockets with warm 2,200K amber pinpricks, a tiny crooked toothless smile, and a starry nightcap with a pink bow.',
          'Tone: Always cute, gentle, sleepy, earnest, and cozy—never spooky, scary, or gory.',
          `You are speaking to ${visitorName} (${creatureType}) on their Visit #${visitCount}. Their favorite music-box note is ${favoriteNote}.`,
          'Keep your response concise (2 to 3 short sentences, under 60 words), include a brief cozy action in asterisks like *winds brass music box*, and reference your inventions (Lullaby Lab, frosted Nightlight Lanterns, or Cloud Glider).',
        ].join(' ');

        const response = await Promise.race([
          ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: cleanMessage,
            config: {
              systemInstruction,
              temperature: 0.7,
            },
          }),
          new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('timeout')), 1800)
          ),
        ]);

        const aiText = response.text?.trim();
        if (aiText) {
          res.json({
            reply: aiText,
            moodTag: 'Live AI · Midnight Nursery Voice',
            suggestedNote: ruleFallback.suggestedNote,
            engine: 'gemini',
          });
          return;
        }
      } catch {
        // Gracefully fall back to deterministic in-character dialogue engine
      }
    }

    res.json({
      reply: ruleFallback.reply,
      moodTag: ruleFallback.moodTag,
      suggestedNote: ruleFallback.suggestedNote,
      engine: 'rule-based',
    });
  });

  if (process.env.NODE_ENV === 'production') {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  const port = Number(process.env.PORT) || 3000;
  app.listen(port, '0.0.0.0', () => {
    console.log(`Pip's Midnight Nursery server listening on http://localhost:${port}`);
  });
}

startServer();
