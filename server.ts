import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    app: 'Daily Earn Pro',
    version: '1.0.0',
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
  });
});

// AI Caption Generator Endpoint using Gemini 3.8 Flash
app.post('/api/generate-caption', async (req, res) => {
  const { topic, language = 'en', tone = 'Engaging & Professional', platform = 'All Social Media' } = req.body;

  if (!process.env.GEMINI_API_KEY) {
    return res.status(503).json({
      error: 'API_KEY_NOT_CONFIGURED',
      message: 'Server Gemini API key is not configured. Built-in templates will be used.',
      source: 'offline',
    });
  }

  try {
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const langPrompt = language === 'hi' 
      ? 'Language: Pure Hindi (Devanagari script) or natural Hinglish. Make it relatable to Indian audience.'
      : 'Language: English. Professional and punchy.';

    const systemPrompt = `You are an expert social media strategist and copywriting coach for creators, freelance designers, and digital earners.
Generate 4 highly compelling, ready-to-copy social media captions for the topic: "${topic || 'Freelance Design'}".
${langPrompt}
Tone: ${tone}.
Target Platform: ${platform}.

Each item must have:
- title: A short descriptive tag (e.g., "Motivational Hook", "Engagement Question", "Story Style", "Direct Pitch")
- caption: Complete ready-to-use post text with suitable emojis, strong hook, clear body, and call-to-action
- hashtags: Array of 5 to 7 high-performing trending hashtags`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: systemPrompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const rawText = response.text || '[]';
    let data;
    try {
      data = JSON.parse(rawText);
    } catch {
      const cleaned = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
      data = JSON.parse(cleaned);
    }

    return res.json({
      success: true,
      captions: Array.isArray(data) ? data : [data],
      source: 'ai',
      model: 'gemini-3.8-flash'
    });
  } catch (error: any) {
    console.error('Gemini Caption API Error:', error);
    return res.status(500).json({
      error: 'GENERATION_FAILED',
      message: error?.message || 'Failed to generate captions via AI',
      source: 'fallback'
    });
  }
});

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Daily Earn Pro server active at http://0.0.0.0:${PORT}`);
  });
}

startServer();
