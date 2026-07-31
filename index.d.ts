/**
 * Type definitions for scrapingdog-sdk.
 *
 * NOTE: the per-endpoint methods below are generated at runtime from the
 * endpoint registry in src/endpoints.js. Keep this file in sync with it.
 */

export interface ScrapingDogOptions {
  /** Per-request timeout in milliseconds. Defaults to 60000. Set 0 to disable. */
  timeout?: number;
  /** Override the API base URL. Defaults to "https://api.scrapingdog.com". */
  baseUrl?: string;
  /** Custom fetch implementation. Defaults to the global fetch. */
  fetch?: typeof fetch;
}

export interface RequestOptions {
  /** Return the raw response body as a string instead of parsed JSON. */
  raw?: boolean;
  /** Override the client timeout for this call, in milliseconds. */
  timeout?: number;
  /** Extra request headers (used by the custom_headers feature). */
  headers?: Record<string, string>;
  /** Caller-provided abort signal. */
  signal?: AbortSignal;
}

/** Arbitrary query parameters passed through to the Scrapingdog API. */
export type Params = Record<string, string | number | boolean | undefined | null>;

export interface ScrapingDogErrorDetails {
  status?: number;
  body?: string;
  url?: string;
  code?: string;
  cause?: unknown;
}

export class ScrapingDogError extends Error {
  name: 'ScrapingDogError';
  status?: number;
  body?: string;
  url?: string;
  code?: string;
  cause?: unknown;
  constructor(message: string, details?: ScrapingDogErrorDetails);
}

export class ScrapingDog {
  apiKey: string;
  baseUrl: string;
  timeout: number;

  constructor(apiKey: string, options?: ScrapingDogOptions);

  /** The endpoint registry backing the generated methods. */
  static readonly endpoints: Record<string, { path: string; required: string[]; defaults?: Params; raw?: boolean }>;

  /** Low-level request against any Scrapingdog endpoint. */
  request(path: string, params?: Params, options?: RequestOptions): Promise<any>;
  /** Alias for request(). Reaches any endpoint by path. */
  get(path: string, params?: Params, options?: RequestOptions): Promise<any>;

  /** General Web Scraping API. Returns raw HTML by default. */
  scrape(url: string, params?: Params, options?: RequestOptions): Promise<any>;

  // ---- Generated endpoint methods -------------------------------------
  /** /screenshot — required: `url`. */
  screenshot(params?: Params | string, options?: RequestOptions): Promise<any>;
  /** /google — required: `query`. */
  google(params?: Params | string, options?: RequestOptions): Promise<any>;
  /** /google_images — required: `query`. */
  googleImages(params?: Params | string, options?: RequestOptions): Promise<any>;
  /** /google_videos — required: `query`. */
  googleVideos(params?: Params | string, options?: RequestOptions): Promise<any>;
  /** /google_shorts — required: `query`. */
  googleShorts(params?: Params | string, options?: RequestOptions): Promise<any>;
  /** /google_news — required: `query`. */
  googleNews(params?: Params | string, options?: RequestOptions): Promise<any>;
  /** /google_news/v2 — required: `query`. */
  googleNewsV2(params?: Params | string, options?: RequestOptions): Promise<any>;
  /** /google_shopping — required: `query`. */
  googleShopping(params?: Params | string, options?: RequestOptions): Promise<any>;
  /** /google_local — required: `query`. */
  googleLocal(params?: Params | string, options?: RequestOptions): Promise<any>;
  /** /google_jobs — required: `query`. */
  googleJobs(params?: Params | string, options?: RequestOptions): Promise<any>;
  /** /google_finance — required: `query`. */
  googleFinance(params?: Params | string, options?: RequestOptions): Promise<any>;
  /** /google_autocomplete — required: `query`. */
  googleAutocomplete(params?: Params | string, options?: RequestOptions): Promise<any>;
  /** /google/ai_mode — required: `query`. */
  googleAiMode(params?: Params | string, options?: RequestOptions): Promise<any>;
  /** /google/ai_overview — required: `url`. */
  googleAiOverview(params?: Params | string, options?: RequestOptions): Promise<any>;
  /** /google/ads_transparency — required: `text`. */
  googleAdsTransparency(params?: Params | string, options?: RequestOptions): Promise<any>;
  /** /google_lens — required: `url`. */
  googleLens(params?: Params | string, options?: RequestOptions): Promise<any>;
  /** /google_immersive_product — required: `page_token`. */
  googleImmersiveProduct(params?: Params | string, options?: RequestOptions): Promise<any>;
  /** /google_flights — required: `departure_id`, `arrival_id`, `outbound_date`. */
  googleFlights(params?: Params | string, options?: RequestOptions): Promise<any>;
  /** /google_hotels — required: `query`, `check_in_date`, `check_out_date`. */
  googleHotels(params?: Params | string, options?: RequestOptions): Promise<any>;
  /** /google_trends — required: `query`. */
  googleTrends(params?: Params | string, options?: RequestOptions): Promise<any>;
  /** /google_trends/autocomplete — required: `query`. */
  googleTrendsAutocomplete(params?: Params | string, options?: RequestOptions): Promise<any>;
  /** /google_trends/trending_now — required: `geo`. */
  googleTrendsTrendingNow(params?: Params | string, options?: RequestOptions): Promise<any>;
  /** /google_patents — required: `query`. */
  googlePatents(params?: Params | string, options?: RequestOptions): Promise<any>;
  /** /google_patents/details — required: `patent_id`. */
  googlePatentDetails(params?: Params | string, options?: RequestOptions): Promise<any>;
  /** /google_scholar — required: `query`. */
  googleScholar(params?: Params | string, options?: RequestOptions): Promise<any>;
  /** /google_scholar/author — required: `author_id`. */
  googleScholarAuthor(params?: Params | string, options?: RequestOptions): Promise<any>;
  /** /google_scholar/cite — required: `query`. */
  googleScholarCite(params?: Params | string, options?: RequestOptions): Promise<any>;
  /** /google_scholar/profiles — required: `mauthors`. */
  googleScholarProfiles(params?: Params | string, options?: RequestOptions): Promise<any>;
  /** /google_maps — required: `query`. */
  googleMaps(params?: Params | string, options?: RequestOptions): Promise<any>;
  /** /google_maps/places — required: `data_id`. */
  googleMapsPlaces(params?: Params | string, options?: RequestOptions): Promise<any>;
  /** /google_maps/photos — required: `data_id`. */
  googleMapsPhotos(params?: Params | string, options?: RequestOptions): Promise<any>;
  /** /google_maps/posts — required: `data_id`. */
  googleMapsPosts(params?: Params | string, options?: RequestOptions): Promise<any>;
  /** /google_maps/reviews — required: `data_id`. */
  googleMapsReviews(params?: Params | string, options?: RequestOptions): Promise<any>;
  /** /bing/search — required: `query`. */
  bing(params?: Params | string, options?: RequestOptions): Promise<any>;
  /** /bing/shopping — required: `query`. */
  bingShopping(params?: Params | string, options?: RequestOptions): Promise<any>;
  /** /duckduckgo/search — required: `query`. */
  duckduckgo(params?: Params | string, options?: RequestOptions): Promise<any>;
  /** /baidu/search — required: `query`. */
  baidu(params?: Params | string, options?: RequestOptions): Promise<any>;
  /** /search — required: `query`. */
  universalSearch(params?: Params | string, options?: RequestOptions): Promise<any>;
  /** /amazon/product — required: `asin`. */
  amazonProduct(params?: Params | string, options?: RequestOptions): Promise<any>;
  /** /amazon/search — required: `query`. */
  amazonSearch(params?: Params | string, options?: RequestOptions): Promise<any>;
  /** /amazon/reviews — required: `asin`. */
  amazonReviews(params?: Params | string, options?: RequestOptions): Promise<any>;
  /** /amazon/offers — required: `asin`. */
  amazonOffers(params?: Params | string, options?: RequestOptions): Promise<any>;
  /** /amazon/autocomplete — required: `prefix`. */
  amazonAutocomplete(params?: Params | string, options?: RequestOptions): Promise<any>;
  /** /apple/product — required: `product_id`. */
  appleProduct(params?: Params | string, options?: RequestOptions): Promise<any>;
  /** /apple/reviews — required: `product_id`. */
  appleReviews(params?: Params | string, options?: RequestOptions): Promise<any>;
  /** /apple/app_store — required: `term`. */
  appleAppStore(params?: Params | string, options?: RequestOptions): Promise<any>;
  /** /walmart/product — required: `url`. */
  walmartProduct(params?: Params | string, options?: RequestOptions): Promise<any>;
  /** /walmart/search — required: `url`. */
  walmartSearch(params?: Params | string, options?: RequestOptions): Promise<any>;
  /** /walmart/reviews — required: `url`. */
  walmartReviews(params?: Params | string, options?: RequestOptions): Promise<any>;
  /** /walmart/autocomplete — required: `query`. */
  walmartAutocomplete(params?: Params | string, options?: RequestOptions): Promise<any>;
  /** /ebay/product — required: `url`. */
  ebayProduct(params?: Params | string, options?: RequestOptions): Promise<any>;
  /** /ebay/search — required: `url`. */
  ebaySearch(params?: Params | string, options?: RequestOptions): Promise<any>;
  /** /flipkart/product — required: `url`. */
  flipkartProduct(params?: Params | string, options?: RequestOptions): Promise<any>;
  /** /flipkart/search — required: `url`. */
  flipkartSearch(params?: Params | string, options?: RequestOptions): Promise<any>;
  /** /myntra/product — required: `url`. */
  myntraProduct(params?: Params | string, options?: RequestOptions): Promise<any>;
  /** /myntra/search — required: `url`. */
  myntraSearch(params?: Params | string, options?: RequestOptions): Promise<any>;
  /** /indeed — required: `url`. */
  indeed(params?: Params | string, options?: RequestOptions): Promise<any>;
  /** /zillow — required: `url`. */
  zillow(params?: Params | string, options?: RequestOptions): Promise<any>;
  /** /yelp/search — required: `find_desc`. */
  yelp(params?: Params | string, options?: RequestOptions): Promise<any>;
  /** /profile — required: `id`. */
  personProfile(params?: Params | string, options?: RequestOptions): Promise<any>;
  /** /profile — required: `id`. */
  companyProfile(params?: Params | string, options?: RequestOptions): Promise<any>;
  /** /profile — required: `type`, `id`. */
  profile(params?: Params | string, options?: RequestOptions): Promise<any>;
  /** /profile/post — required: `id`. */
  profilePost(params?: Params | string, options?: RequestOptions): Promise<any>;
  /** /linkedin — required: `type`, `linkId`. */
  linkedin(params?: Params | string, options?: RequestOptions): Promise<any>;
  /** /x/post — required: `tweetId`. */
  xPost(params?: Params | string, options?: RequestOptions): Promise<any>;
  /** /x/profile — required: `profileId`. */
  xProfile(params?: Params | string, options?: RequestOptions): Promise<any>;
  /** /tiktok/profile — required: `username`. */
  tiktokProfile(params?: Params | string, options?: RequestOptions): Promise<any>;
  /** /tiktok/post — required: `username`, `post_id`. */
  tiktokPost(params?: Params | string, options?: RequestOptions): Promise<any>;
  /** /tiktok/ads — required: `query`. */
  tiktokAds(params?: Params | string, options?: RequestOptions): Promise<any>;
  /** /youtube — required: none. */
  youtube(params?: Params | string, options?: RequestOptions): Promise<any>;
  /** /youtube — required: `search_query`. */
  youtubeSearch(params?: Params | string, options?: RequestOptions): Promise<any>;
  /** /youtube — required: `video_id`. */
  youtubeVideo(params?: Params | string, options?: RequestOptions): Promise<any>;
  /** /youtube — required: `channel_id`. */
  youtubeChannel(params?: Params | string, options?: RequestOptions): Promise<any>;
  /** /youtube — required: `v`. */
  youtubeComments(params?: Params | string, options?: RequestOptions): Promise<any>;
  /** /youtube — required: `v`. */
  youtubeTranscripts(params?: Params | string, options?: RequestOptions): Promise<any>;
  /** /chatgpt — required: `prompt`. */
  chatgpt(params?: Params | string, options?: RequestOptions): Promise<any>;
  /** /account — required: none. */
  account(params?: Params | string, options?: RequestOptions): Promise<any>;
}

export default ScrapingDog;
