# Scrapingdog Node.js SDK

[![npm version](https://img.shields.io/npm/v/scrapingdog-sdk.svg)](https://www.npmjs.com/package/scrapingdog-sdk)
[![license](https://img.shields.io/npm/l/scrapingdog-sdk.svg)](./LICENSE)

Node.js SDK for the [Scrapingdog](https://www.scrapingdog.com) API. Scrape any
website and get structured results from Google, Amazon, LinkedIn, YouTube,
TikTok, and dozens more scrapers. Scrapingdog handles proxy rotation, headless
browsers, and CAPTCHAs for you.

- **Complete coverage** — a dedicated method for **every** Scrapingdog API
  (78 in all; see the [full list](#supported-apis)), plus a generic `get()`
  for anything added in the future.
- Zero dependencies — uses the built-in `fetch` (Node.js 18+).
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
await client.personProfile({ id: 'williamhgates' });   // LinkedIn person
await client.companyProfile({ id: 'microsoft' });        // LinkedIn company
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

Endpoint paths and required parameters are taken from the
[official documentation](https://www.scrapingdog.com/documentation/). Pass any
additional optional parameters (`country`, `page`, `language`, `domain`, …)
straight through in the params object.

#### Web scraping

| Method | Endpoint | Required |
|---|---|---|
| `scrape(...)` | `/scrape` | `url` |
| `screenshot(...)` | `/screenshot` | `url` |

#### Google Search

| Method | Endpoint | Required |
|---|---|---|
| `google(...)` | `/google` | `query` |
| `googleImages(...)` | `/google_images` | `query` |
| `googleVideos(...)` | `/google_videos` | `query` |
| `googleShorts(...)` | `/google_shorts` | `query` |
| `googleNews(...)` | `/google_news` | `query` |
| `googleNewsV2(...)` | `/google_news/v2` | `query` |
| `googleShopping(...)` | `/google_shopping` | `query` |
| `googleLocal(...)` | `/google_local` | `query` |
| `googleJobs(...)` | `/google_jobs` | `query` |
| `googleFinance(...)` | `/google_finance` | `query` |
| `googleAutocomplete(...)` | `/google_autocomplete` | `query` |
| `googleAiMode(...)` | `/google/ai_mode` | `query` |
| `googleAiOverview(...)` | `/google/ai_overview` | `url` |
| `googleAdsTransparency(...)` | `/google/ads_transparency` | `text` |
| `googleLens(...)` | `/google_lens` | `url` |
| `googleImmersiveProduct(...)` | `/google_immersive_product` | `page_token` |
| `googleFlights(...)` | `/google_flights` | `departure_id`, `arrival_id`, `outbound_date` |
| `googleHotels(...)` | `/google_hotels` | `query`, `check_in_date`, `check_out_date` |
| `googleTrends(...)` | `/google_trends` | `query` |
| `googleTrendsAutocomplete(...)` | `/google_trends/autocomplete` | `query` |
| `googleTrendsTrendingNow(...)` | `/google_trends/trending_now` | `geo` |
| `googlePatents(...)` | `/google_patents` | `query` |
| `googlePatentDetails(...)` | `/google_patents/details` | `patent_id` |
| `googleScholar(...)` | `/google_scholar` | `query` |
| `googleScholarAuthor(...)` | `/google_scholar/author` | `author_id` |
| `googleScholarCite(...)` | `/google_scholar/cite` | `query` |
| `googleScholarProfiles(...)` | `/google_scholar/profiles` | `mauthors` |

#### Google Maps

| Method | Endpoint | Required |
|---|---|---|
| `googleMaps(...)` | `/google_maps` | `query` |
| `googleMapsPlaces(...)` | `/google_maps/places` | `data_id` |
| `googleMapsPhotos(...)` | `/google_maps/photos` | `data_id` |
| `googleMapsPosts(...)` | `/google_maps/posts` | `data_id` |
| `googleMapsReviews(...)` | `/google_maps/reviews` | `data_id` |

#### Other search engines

| Method | Endpoint | Required |
|---|---|---|
| `bing(...)` | `/bing/search` | `query` |
| `bingShopping(...)` | `/bing/shopping` | `query` |
| `duckduckgo(...)` | `/duckduckgo/search` | `query` |
| `baidu(...)` | `/baidu/search` | `query` |
| `universalSearch(...)` | `/search` | `query` |

#### Amazon

| Method | Endpoint | Required |
|---|---|---|
| `amazonProduct(...)` | `/amazon/product` | `asin` |
| `amazonSearch(...)` | `/amazon/search` | `query` |
| `amazonReviews(...)` | `/amazon/reviews` | `asin` |
| `amazonOffers(...)` | `/amazon/offers` | `asin` |
| `amazonAutocomplete(...)` | `/amazon/autocomplete` | `prefix` |

#### Apple

| Method | Endpoint | Required |
|---|---|---|
| `appleProduct(...)` | `/apple/product` | `product_id` |
| `appleReviews(...)` | `/apple/reviews` | `product_id` |
| `appleAppStore(...)` | `/apple/app_store` | `term` |

#### Walmart

| Method | Endpoint | Required |
|---|---|---|
| `walmartProduct(...)` | `/walmart/product` | `url` |
| `walmartSearch(...)` | `/walmart/search` | `url` |
| `walmartReviews(...)` | `/walmart/reviews` | `url` |
| `walmartAutocomplete(...)` | `/walmart/autocomplete` | `query` |

#### eBay / Flipkart / Myntra

| Method | Endpoint | Required |
|---|---|---|
| `ebayProduct(...)` | `/ebay/product` | `url` |
| `ebaySearch(...)` | `/ebay/search` | `url` |
| `flipkartProduct(...)` | `/flipkart/product` | `url` |
| `flipkartSearch(...)` | `/flipkart/search` | `url` |
| `myntraProduct(...)` | `/myntra/product` | `url` |
| `myntraSearch(...)` | `/myntra/search` | `url` |

#### Jobs / real estate / local

| Method | Endpoint | Required |
|---|---|---|
| `indeed(...)` | `/indeed` | `url` |
| `zillow(...)` | `/zillow` | `url` |
| `yelp(...)` | `/yelp/search` | `find_desc` |

#### LinkedIn / X / TikTok

| Method | Endpoint | Required |
|---|---|---|
| `personProfile(...)` | `/profile` | `id` |
| `companyProfile(...)` | `/profile` | `id` |
| `profile(...)` | `/profile` | `type`, `id` |
| `profilePost(...)` | `/profile/post` | `id` |
| `linkedin(...)` | `/linkedin` | `type`, `linkId` |
| `xPost(...)` | `/x/post` | `tweetId` |
| `xProfile(...)` | `/x/profile` | `profileId` |
| `tiktokProfile(...)` | `/tiktok/profile` | `username` |
| `tiktokPost(...)` | `/tiktok/post` | `username`, `post_id` |
| `tiktokAds(...)` | `/tiktok/ads` | `query` |

#### YouTube

| Method | Endpoint | Required |
|---|---|---|
| `youtube(...)` | `/youtube` | — |
| `youtubeSearch(...)` | `/youtube` | `search_query` |
| `youtubeVideo(...)` | `/youtube` | `video_id` |
| `youtubeChannel(...)` | `/youtube` | `channel_id` |
| `youtubeComments(...)` | `/youtube` | `v` |
| `youtubeTranscripts(...)` | `/youtube` | `v` |

#### AI / account

| Method | Endpoint | Required |
|---|---|---|
| `chatgpt(...)` | `/chatgpt` | `prompt` |
| `account(...)` | `/account` | — |

> `personProfile`, `companyProfile`, and `profile` all use the LinkedIn Profile
> Scraper endpoint. `linkedin` is the older LinkedIn endpoint, kept for
> convenience. `youtube*` methods share the `/youtube` endpoint, differing only
> by which parameter you pass.

## Requirements

- Node.js **18 or newer** (for the global `fetch`). On older versions, pass a
  `fetch` implementation via the `fetch` option.

## Links

- [Scrapingdog website](https://www.scrapingdog.com)
- [API documentation](https://www.scrapingdog.com/documentation/)
- [Dashboard](https://www.scrapingdog.com/dashboard)

## License

[MIT](./LICENSE)
