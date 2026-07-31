const express = require('express');
const router = express.Router();

router.get('/search', async (req, res) => {
  const query = req.query.q;
  if (!query) {
    return res.status(400).json({ success: false, error: 'Query parameter q is required' });
  }

  try {
    const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    });

    if (!response.ok) {
      return res.status(response.status).json({ success: false, error: `YouTube responded with status ${response.status}` });
    }

    const html = await response.text();
    const videos = [];
    
    // Regex to match videoId and title runs from ytInitialData
    const regex = /"videoRenderer":\s*\{"videoId":"([^"]+)"[\s\S]*?"title":\{"runs":\[\{"text":"([^"]+)"/g;
    let match;
    let count = 0;

    while ((match = regex.exec(html)) !== null && count < 12) {
      // Decode escaped unicode characters like \u0026 to &
      const cleanTitle = match[2]
        .replace(/\\u0026/g, '&')
        .replace(/\\u0027/g, "'")
        .replace(/\\u0022/g, '"');

      videos.push({
        id: match[1],
        title: cleanTitle,
        url: `https://www.youtube.com/watch?v=${match[1]}`
      });
      count++;
    }

    res.json({ success: true, data: videos });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
