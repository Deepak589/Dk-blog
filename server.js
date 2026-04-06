// server.js
require('dotenv').config();
const express = require('express');
const fetch   = require('node-fetch');
const cors    = require('cors');

const app  = express();
const PORT = process.env.PORT || 3000;

// Allow requests from your GitHub Pages site + localhost
app.use(cors({
  origin: [
    'http://localhost:5500',
    'http://127.0.0.1:5500',
    'http://localhost:3000',
    'https://deepak589.github.io'
  ]
}));

// ── VALID TOPICS WHITELIST (prevents API abuse) ───────────────────────────
const ALLOWED_TOPICS = [
  'artificial intelligence',
  'machine learning',
  'large language models',
  'tech startups',
  'open source AI',
  'data science',
  'AI technology',
  'deep learning',
  'neural networks',
  'generative AI'
];

// ── /news endpoint ────────────────────────────────────────────────────────
app.get('/news', async (req, res) => {
  try {
    const topic = req.query.topic || 'AI technology';

    // Validate topic against whitelist
    if (!ALLOWED_TOPICS.includes(topic.toLowerCase())) {
      return res.status(400).json({ error: 'Invalid topic' });
    }

    const url = new URL('https://newsapi.org/v2/everything');
    url.searchParams.set('q',          topic);
    url.searchParams.set('language',   'en');
    url.searchParams.set('sortBy',     'publishedAt');
    url.searchParams.set('pageSize',   '7');
    url.searchParams.set('apiKey',     process.env.NEWS_API_KEY);  // key stays server-side

    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error(`NewsAPI responded with ${response.status}`);
    }

    const data = await response.json();
    res.json(data);

  } catch (err) {
    console.error('Error fetching news:', err.message);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});

// ── Health check ──────────────────────────────────────────────────────────
app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
