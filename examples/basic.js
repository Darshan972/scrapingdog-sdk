'use strict';

/**
 * Run with:  SCRAPINGDOG_API_KEY=your_key node examples/basic.js
 */

const { ScrapingDog, ScrapingDogError } = require('../src/index');

async function main() {
  const apiKey = process.env.SCRAPINGDOG_API_KEY;
  if (!apiKey) {
    console.error('Set SCRAPINGDOG_API_KEY in your environment first.');
    process.exit(1);
  }

  const client = new ScrapingDog(apiKey);

  try {
    // 1. General web scraping (returns HTML).
    const html = await client.scrape('https://example.com');
    console.log('Scraped example.com, %d bytes of HTML', html.length);

    // 2. Google search (returns JSON).
    const serp = await client.google({ query: 'coffee', country: 'us' });
    console.log('Top organic result:', serp.organic_results?.[0]?.title);
  } catch (err) {
    if (err instanceof ScrapingDogError) {
      console.error(`Scrapingdog error ${err.status ?? ''}: ${err.message}`);
      if (err.body) console.error(err.body);
    } else {
      throw err;
    }
  }
}

main();
