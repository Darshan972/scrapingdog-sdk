# Scrapingdog Node.js SDK

[![npm version](https://img.shields.io/npm/v/scrapingdog-sdk.svg)](https://www.npmjs.com/package/scrapingdog-sdk)
[![license](https://img.shields.io/npm/l/scrapingdog-sdk.svg)](./LICENSE)

Node.js SDK for the [Scrapingdog](https://www.scrapingdog.com) API. Scrape any
website and get structured results from Google, Amazon, YouTube, TikTok, and
dozens more scrapers. Scrapingdog handles proxy rotation, headless browsers,
and CAPTCHAs for you.

- **Complete coverage** — a dedicated method for **every** Scrapingdog API
  (77 in all; see the [full list](#supported-apis)), plus a generic `get()`
  for anything added in the future.
- Zero dependencies — uses the built-in `fetch` (Node.js 20+).
- Promise-based and `async/await` friendly.
- Bundled TypeScript type definitions.
- Required-parameter validation and automatic JSON parsing.

## Installation

```bash
npm install scrapingdog-sdk
```

## Quick start

```js
const { ScrapingDog } = require('scrapingdog-sdk');

const client = new ScrapingDog('YOUR_API_KEY');

// General web scraping — returns the page HTML.
const html = await client.scrape('https://example.com', { dynamic: true });

// Google search — returns parsed JSON.
const serp = await client.google({ query: 'coffee', country: 'us' });
console.log(serp.organic_results);
```

ESM / TypeScript:

```ts
import ScrapingDog from 'scrapingdog-sdk';

const client = new ScrapingDog(process.env.SCRAPINGDOG_API_KEY!);
const results = await client.google({ query: 'pizza near me' });
```

Get your API key from the [Scrapingdog dashboard](https://www.scrapingdog.com/dashboard).

## Usage

Every method takes a plain params object and returns a Promise. Any extra
parameters you pass are forwarded to the API as-is.

```js
// General web scraping (returns raw HTML).
await client.scrape('https://example.com', {
  dynamic: true,        // render JavaScript
  premium: false,       // premium/residential proxies
  wait: 3000,           // wait N ms after load
  country: 'us',        // geo-target the proxy
  session_number: 1234, // reuse the same IP across calls
});

// Google & friends (return JSON).
await client.google({ query: 'coffee', country: 'us', page: 0 });
await client.googleMaps({ query: 'restaurants in Austin' });
await client.googleNews({ query: 'ai' });

// E-commerce.
await client.amazonProduct({ asin: 'B0CX23V2ZK', domain: 'com' });
await client.walmartSearch({ url: 'https://www.walmart.com/search?q=tv' });

// Social.
await client.personProfile({ id: 'williamhgates' });   // person profile
await client.companyProfile({ id: 'microsoft' });        // company profile
await client.tiktokProfile({ username: 'nike' });
await client.xProfile({ profileId: 'nasa' });

// YouTube.
await client.youtubeSearch({ search_query: 'lofi hip hop' });
await client.youtubeVideo({ video_id: '0e3GPea1Tyg' });
```

Methods with a single required parameter also accept a bare string:

```js
await client.chatgpt('Write a haiku about proxies');
await client.google('coffee');
```

### Any other endpoint

Not covered by a method, or newly released? Use `get(path, params)` — the
`api_key` is added for you:

```js
const data = await client.get('/some_new_endpoint', { query: 'x' });
```

## Configuration

```js
const client = new ScrapingDog('YOUR_API_KEY', {
  timeout: 60000, // per-request timeout in ms (default 60000; 0 disables)
  baseUrl: 'https://api.scrapingdog.com', // override if needed
  fetch: customFetch, // supply your own fetch (e.g. with a proxy agent)
});
```

### Per-call options

Every method accepts a final `options` argument:

```js
// Get the raw response body instead of parsed JSON.
const raw = await client.google({ query: 'x' }, { raw: true });

// Override the timeout for a single slow call.
await client.scrape('https://slow.example', { dynamic: true }, { timeout: 90000 });

// Cancel with an AbortSignal.
const ac = new AbortController();
setTimeout(() => ac.abort(), 5000);
await client.google({ query: 'x' }, { signal: ac.signal });
```

## Error handling

Failed requests (non-2xx responses, network errors, timeouts) throw a
`ScrapingDogError`. The API key is redacted from the `url` property.

```js
const { ScrapingDog, ScrapingDogError } = require('scrapingdog-sdk');

try {
  await client.google({ query: 'x' });
} catch (err) {
  if (err instanceof ScrapingDogError) {
    console.error(err.status); // HTTP status, if the server responded
    console.error(err.body);   // raw error body from the API
    console.error(err.code);   // e.g. "ETIMEDOUT"
  }
}
```

## Supported APIs

Every Scrapingdog API has its own method. They all return a Promise — resolving to parsed JSON, except `scrape` and `screenshot`, which return the raw response body. Every snippet below is copy-paste runnable: drop in your own values and add any optional parameters (`country`, `page`, `language`, `domain`, …) straight into the params object.

### Web scraping

```js
const html = await client.scrape('https://example.com', { dynamic: true });
const img  = await client.screenshot({ url: 'https://example.com' });
```

### Google Search

```js
await client.google({ query: 'coffee', country: 'us', page: 0 });
await client.googleImages({ query: 'golden retriever' });
await client.googleVideos({ query: 'nba highlights' });
await client.googleShorts({ query: 'cooking tips' });
await client.googleNews({ query: 'artificial intelligence' });
await client.googleNewsV2({ query: 'artificial intelligence', country: 'us' });
await client.googleShopping({ query: 'macbook pro' });
await client.googleLocal({ query: 'coffee shops' });
await client.googleJobs({ query: 'software engineer' });
await client.googleFinance({ query: 'GOOGL:NASDAQ' });
await client.googleAutocomplete({ query: 'how to' });
await client.googleAiMode({ query: 'best laptops 2026' });
await client.googleAiOverview({ url: 'https://www.google.com/search?q=what+is+web+scraping' });
await client.googleAdsTransparency({ text: 'nike' });
await client.googleLens({ url: 'https://i.imgur.com/HBrB8p0.png' });
await client.googleImmersiveProduct({ page_token: 'PAGE_TOKEN_FROM_SHOPPING' });
await client.googleFlights({ departure_id: 'JFK', arrival_id: 'LHR', outbound_date: '2026-03-05', type: 2 });
await client.googleHotels({ query: 'hotels in Paris', check_in_date: '2026-03-05', check_out_date: '2026-03-08' });
await client.googleTrends({ query: 'bitcoin' });
await client.googleTrendsAutocomplete({ query: 'coffee' });
await client.googleTrendsTrendingNow({ geo: 'US' });
await client.googlePatents({ query: 'coffee machine' });
await client.googlePatentDetails({ patent_id: 'patent/US11734097B1/en' });
await client.googleScholar({ query: 'machine learning' });
await client.googleScholarAuthor({ author_id: 'LSsXyncAAAAJ' });
await client.googleScholarCite({ query: 'aXSw0zsAAAAJ' });
await client.googleScholarProfiles({ mauthors: 'Geoffrey Hinton' });
```

### Google Maps

```js
await client.googleMaps({ query: 'restaurants in Austin' });
await client.googleMapsPlaces({ data_id: '0x89c259af336b3341:0xa4969e07ce3108de' });
await client.googleMapsPhotos({ data_id: '0x89c259af336b3341:0xa4969e07ce3108de' });
await client.googleMapsPosts({ data_id: '0x89c259af336b3341:0xa4969e07ce3108de' });
await client.googleMapsReviews({ data_id: '0x89c259af336b3341:0xa4969e07ce3108de' });
```

### Other search engines

```js
await client.bing({ query: 'coffee' });
await client.bingShopping({ query: 'headphones' });
await client.duckduckgo({ query: 'coffee' });
await client.baidu({ query: 'coffee' });
await client.universalSearch({ query: 'coffee', country: 'us' });
```

### Amazon

```js
await client.amazonProduct({ asin: 'B0CX23V2ZK', domain: 'com' });
await client.amazonSearch({ query: 'wireless earbuds', domain: 'com' });
await client.amazonReviews({ asin: 'B0CX23V2ZK', domain: 'com' });
await client.amazonOffers({ asin: 'B0CX23V2ZK', domain: 'com' });
await client.amazonAutocomplete({ prefix: 'lapt' });
```

### Apple

```js
await client.appleProduct({ product_id: '1494599097' });
await client.appleReviews({ product_id: '1494599097' });
await client.appleAppStore({ term: 'weather' });
```

### Walmart

```js
await client.walmartProduct({ url: 'https://www.walmart.com/ip/12345' });
await client.walmartSearch({ url: 'https://www.walmart.com/search?q=tv' });
await client.walmartReviews({ url: 'https://www.walmart.com/reviews/product/12345' });
await client.walmartAutocomplete({ query: 'tv' });
```

### eBay, Flipkart & Myntra

```js
await client.ebayProduct({ url: 'https://www.ebay.com/itm/123456' });
await client.ebaySearch({ url: 'https://www.ebay.com/sch/i.html?_nkw=laptop' });
await client.flipkartProduct({ url: 'https://www.flipkart.com/apple-iphone-15/p/itm123' });
await client.flipkartSearch({ url: 'https://www.flipkart.com/search?q=shoes' });
await client.myntraProduct({ url: 'https://www.myntra.com/tshirts/roadster/.../12345/buy' });
await client.myntraSearch({ url: 'https://www.myntra.com/shoes' });
```

### Jobs, real estate & local

```js
await client.indeed({ url: 'https://www.indeed.com/jobs?q=developer&l=remote' });
await client.zillow({ url: 'https://www.zillow.com/homes/for_sale/' });
await client.yelp({ find_desc: 'plumbers', find_loc: 'San Francisco, CA' });
```

### Profiles, X & TikTok

```js
await client.personProfile({ id: 'williamhgates' });   // person profile
await client.companyProfile({ id: 'microsoft' });       // company profile
await client.profile({ type: 'profile', id: 'williamhgates' });
await client.profilePost({ id: 'POST_ID' });
await client.xPost({ tweetId: '1519480761749016577' });
await client.xProfile({ profileId: 'nasa' });
await client.tiktokProfile({ username: 'nike' });
await client.tiktokPost({ username: 'nike', post_id: '7300000000000000000' });
await client.tiktokAds({ query: 'shoes' });
```

### YouTube

```js
await client.youtube({ v: '0e3GPea1Tyg' });            // generic /youtube passthrough
await client.youtubeSearch({ search_query: 'lofi hip hop' });
await client.youtubeVideo({ video_id: '0e3GPea1Tyg' });
await client.youtubeChannel({ channel_id: 'UCX6OQ3DkcsbYNE6H8uQQuVA' });
await client.youtubeComments({ v: '0e3GPea1Tyg' });
await client.youtubeTranscripts({ v: '0e3GPea1Tyg' });
```

### AI & account

```js
await client.chatgpt({ prompt: 'Explain web scraping in one sentence' });
await client.account();
```

> **Shared endpoints:** `personProfile`, `companyProfile`, and `profile` all hit `/profile`, differing only by the `type` they send; the `youtube*` methods likewise share `/youtube`. Anything without a dedicated method is still reachable via `client.get('/path', { ... })`. Endpoint paths and required parameters are also documented in the bundled TypeScript types and the [official docs](https://www.scrapingdog.com/documentation/).


## Requirements

- Node.js **20 or newer** (for the global `fetch`). On older versions, pass a
  `fetch` implementation via the `fetch` option.

## Links

- [Scrapingdog website](https://www.scrapingdog.com)
- [API documentation](https://www.scrapingdog.com/documentation/)
- [Dashboard](https://www.scrapingdog.com/dashboard)

## License

[MIT](./LICENSE)
