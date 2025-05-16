import express from 'express';
import cors from 'cors';
import Parser from 'rss-parser';

const parser = new Parser();
const app = express();
const port = 5175; // Using a different port than the frontend

// Enable CORS
app.use(cors());

// Define RSS feed URLs
const rssUrls = {
  incomeTax: 'https://www.incometaxindia.gov.in/Pages/press-releases.aspx',
  mca: 'https://www.mca.gov.in/MinistryV2/notice.html',
  gst: 'https://www.gst.gov.in/newsandupdates/rss'
};

// Endpoint to fetch a specific RSS feed
app.get('/api/rss/:source', async (req, res) => {
  try {
    const source = req.params.source;
    if (!rssUrls[source]) {
      return res.status(400).json({ error: 'Invalid source' });
    }

    const feed = await parser.parseURL(rssUrls[source]);
    res.json(feed.items.map((item, index) => ({
      id: item.guid || `${source}-${index}`,
      title: item.title || 'No title',
      link: item.link || '#',
      date: item.pubDate ? new Date(item.pubDate) : new Date(),
      content: item.content || item.contentSnippet,
      source: source
    })));
  } catch (error) {
    console.error('Error fetching RSS feed:', error);
    res.status(500).json({ error: 'Failed to fetch RSS feed' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
