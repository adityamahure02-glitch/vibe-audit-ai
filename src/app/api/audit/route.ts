import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    const targetUrl = url.startsWith('http') ? url : `https://${url}`;

    // 1. Fetch website HTML
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Could not access site: ${response.statusText}` },
        { status: 400 }
      );
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    const title = $('title').text().trim() || 'No Title Found';
    const metaDescription =
      $('meta[name="description"]').attr('content') ||
      $('meta[property="og:description"]').attr('content') ||
      'No Description Found';

    const h1s: string[] = [];
    $('h1').each((_, el) => {
      const text = $(el).text().trim();
      if (text) h1s.push(text);
    });

    const paragraphs: string[] = [];
    $('p').slice(0, 5).each((_, el) => {
      const text = $(el).text().trim();
      if (text) paragraphs.push(text);
    });

    // 2. Run Gemini Vibe Audit
    const prompt = `You are an expert landing page conversion rate optimization (CRO) and brand design critic.
Analyze the following website data and return a JSON object strictly without extra text or markdown formatting outside JSON.

Website Data:
- URL: ${targetUrl}
- Title: ${title}
- Meta Description: ${metaDescription}
- Main Headings (H1): ${h1s.join(' | ')}
- Body Snippets: ${paragraphs.join(' ')}

Format:
{
  "vibeScore": 84,
  "vibeTagline": "High credibility, but dense technical messaging",
  "firstImpression": "Clear and authoritative developer platform positioning.",
  "strengths": ["Clear developer-focused messaging", "Strong social proof"],
  "conversionKillers": ["Dense headline text", "Could improve above-the-fold CTA urgency"],
  "actionableFixes": ["Shorten the main hero headline", "Highlight primary CTA with higher contrast", "Add instant interactive demo"]
}`;

    const aiResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    // Strip any markdown code fences if Gemini wraps in ```json
    const rawText = aiResponse.text || '{}';
    const cleanJson = rawText
      .replace(/```json/gi, '')
      .replace(/```/g, '')
      .trim();

    const auditData = JSON.parse(cleanJson);

    return NextResponse.json({
      success: true,
      audit: auditData,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Audit pipeline failed' },
      { status: 500 }
    );
  }
}
