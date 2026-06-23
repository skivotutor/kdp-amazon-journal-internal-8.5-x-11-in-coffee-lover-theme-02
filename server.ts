import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route FIRST for secure server-side Gemini generation
  app.post('/api/generate-slogans', async (req, res) => {
    try {
      const { category, vibes } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey) {
        console.error("Missing GEMINI_API_KEY env variable");
        return res.status(500).json({ 
          error: "Gemini API key is not configured. Please add it via the Secrets panel in AI Studio settings." 
        });
      }

      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const categoryPrompt = category ? `Category: ${category}` : 'Categories might include cozy, aesthetic, motivational, or lighthearted/cute';
      const vibePrompt = vibes ? `Themes/Vibes required: ${vibes}` : 'Theme tone: stylish female target audience, warm, Parisian coffee shop, slow mornings, journaling';

      const prompt = `You are an expert copywriting assistant for KDP Amazon publishing, specializing in journals for women who love coffee.
Generate 5 beautiful, inspiring, funny, or cozy raw coffee slogan/quotes for a female audience.
Guidelines:
- Aimed at women and girls ("she", slow mornings, self-care, thoughts blooming, caffeine & cozy blankets).
- Short and punchy (ideal for journal cover art, main graphic pages, or dividers).
- Must be friendly, light, and charming.

${categoryPrompt}
${vibePrompt}

Return ONLY a raw JSON array matching this exact schema:
[
  {
    "text": "Warm coffee, cozy thoughts, and a soul completely awake.",
    "author": "Cozy Musings",
    "category": "aesthetic"
  }
]

Do not warp inside \`\`\`json markdown blocks. Provide raw, valid JSON syntax only. No explanations.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
      });

      const text = response.text || '[]';
      // Safety clean-up if model returns markdown wrapping despite prompt rules
      const cleanJson = text
        .replace(/```json/gi, '')
        .replace(/```/gi, '')
        .trim();

      try {
        const parsedSlogans = JSON.parse(cleanJson);
        return res.json({ slogans: parsedSlogans });
      } catch (jsonErr) {
        console.error("JSON parsing failed, raw text from Gemini:", text);
        // Fallback default slogans in case JSON was malformed
        return res.status(422).json({ 
          error: "Malformed JSON response from AI. Please retry.",
          raw: text
        });
      }
    } catch (error: any) {
      console.error("Server-side Gemini generation error:", error);
      return res.status(500).json({ 
        error: error.message || "Failed to generate coffee slogans via Gemini" 
      });
    }
  });

  app.post('/api/generate-coffee-icon', async (req, res) => {
    try {
      const { description } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey) {
        console.error("Missing GEMINI_API_KEY env variable");
        return res.status(500).json({ 
          error: "Gemini API key is not configured. Please add it via the Secrets panel in AI Studio settings." 
        });
      }

      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const userDesc = description ? description : 'a steaming minimalist line art mug of coffee with delicate hearts';

      const prompt = `You are an expert SVG graphic designer specializing in minimalist line art icons for Kindle Direct Publishing (KDP) journal watermarks.
Your job is to generate a beautiful, clean, valid XML SVG string of a black-and-white coffee graphic.

Design requirements:
1. Must use a white or transparent background, black stroke lines only, no thick solid fills (light fills are allowed only as small accents).
2. The artwork should represent: "${userDesc}".
3. It must be structured with a balanced viewBox (e.g. viewBox="0 0 100 100").
4. Lines must be clean, neat, and highly detailed for book interior printing. It should look like an elegant hand-drawn sketch or high-quality vector line art illustration.
5. Use basic SVG elements like <path>, <circle>, <rect>, <ellipse>, <line>. Use stroke-linecap="round" and stroke-linejoin="round".
6. Avoid using external web links/attributes inside the SVG.
7. Return ONLY valid, raw, nested XML SVG code starting with <svg> and ending with </svg>.
8. Do NOT wrap inside \`\`\`xml or \`\`\`html or markdown blocks. Provide raw XML/SVG string context only. No explanation.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
      });

      let text = response.text || '';
      
      // Clean up markdown quotes if Gemini returned them
      text = text
        .replace(/```xml/gi, '')
        .replace(/```html/gi, '')
        .replace(/```svg/gi, '')
        .replace(/```/gi, '')
        .trim();

      if (!text.startsWith('<svg') && text.includes('<svg')) {
        const svgStart = text.indexOf('<svg');
        const svgEnd = text.lastIndexOf('</svg>');
        if (svgStart !== -1 && svgEnd !== -1) {
          text = text.substring(svgStart, svgEnd + 6);
        }
      }

      if (!text.startsWith('<svg')) {
        return res.status(500).json({
          error: "Failed to generate vector SVG data. Please try again with a simpler descriptor.",
          debug: text
        });
      }

      return res.json({ svg: text });
    } catch (error: any) {
      console.error("Server-side Gemini SVG generation error:", error);
      return res.status(500).json({ 
        error: error.message || "Failed to generate custom icon using Gemini" 
      });
    }
  });

  // Vite middleware setup for local development vs production static serve
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log("Middlewares integrated in Vite development mode.");
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log("Serving static build from /dist for production flow.");
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`KDP Coffee Journal Server listening at http://0.0.0.0:${PORT}`);
  });
}

startServer();
