'use strict';

/**
 * Declarative registry of every Scrapingdog API.
 *
 * Each entry maps a client method name to:
 *   path     - the endpoint path on api.scrapingdog.com
 *   required - parameters that must be provided (throws if missing)
 *   defaults - values merged in before the caller's params (e.g. a fixed type)
 *   raw      - when true, return the raw response body instead of parsed JSON
 *
 * The paths and required identifiers were taken from the official docs at
 * https://www.scrapingdog.com/documentation/ . Optional parameters (country,
 * page, language, sort, ...) are not listed here — pass them freely in params;
 * they are forwarded as-is.
 */
const ENDPOINTS = {
  // ---- General ----------------------------------------------------------
  screenshot: { path: '/screenshot', required: ['url'], raw: true },

  // ---- Google Search family --------------------------------------------
  google: { path: '/google', required: ['query'] },
  googleImages: { path: '/google_images', required: ['query'] },
  googleVideos: { path: '/google_videos', required: ['query'] },
  googleShorts: { path: '/google_shorts', required: ['query'] },
  googleNews: { path: '/google_news', required: ['query'] },
  googleNewsV2: { path: '/google_news/v2', required: ['query'] },
  googleShopping: { path: '/google_shopping', required: ['query'] },
  googleLocal: { path: '/google_local', required: ['query'] },
  googleJobs: { path: '/google_jobs', required: ['query'] },
  googleFinance: { path: '/google_finance', required: ['query'] },
  googleAutocomplete: { path: '/google_autocomplete', required: ['query'] },
  googleAiMode: { path: '/google/ai_mode', required: ['query'] },
  googleAiOverview: { path: '/google/ai_overview', required: ['url'] },
  googleAdsTransparency: { path: '/google/ads_transparency', required: ['text'] },
  googleLens: { path: '/google_lens', required: ['url'] },
  googleImmersiveProduct: { path: '/google_immersive_product', required: ['page_token'] },
  googleFlights: { path: '/google_flights', required: ['departure_id', 'arrival_id', 'outbound_date'] },
  googleHotels: { path: '/google_hotels', required: ['query', 'check_in_date', 'check_out_date'] },
  googleTrends: { path: '/google_trends', required: ['query'] },
  googleTrendsAutocomplete: { path: '/google_trends/autocomplete', required: ['query'] },
  googleTrendsTrendingNow: { path: '/google_trends/trending_now', required: ['geo'] },
  googlePatents: { path: '/google_patents', required: ['query'] },
  googlePatentDetails: { path: '/google_patents/details', required: ['patent_id'] },
  googleScholar: { path: '/google_scholar', required: ['query'] },
  googleScholarAuthor: { path: '/google_scholar/author', required: ['author_id'] },
  googleScholarCite: { path: '/google_scholar/cite', required: ['query'] },
  googleScholarProfiles: { path: '/google_scholar/profiles', required: ['mauthors'] },

  // ---- Google Maps family ----------------------------------------------
  googleMaps: { path: '/google_maps', required: ['query'] },
  googleMapsPlaces: { path: '/google_maps/places', required: ['data_id'] },
  googleMapsPhotos: { path: '/google_maps/photos', required: ['data_id'] },
  googleMapsPosts: { path: '/google_maps/posts', required: ['data_id'] },
  googleMapsReviews: { path: '/google_maps/reviews', required: ['data_id'] },

  // ---- Other search engines --------------------------------------------
  bing: { path: '/bing/search', required: ['query'] },
  bingShopping: { path: '/bing/shopping', required: ['query'] },
  duckduckgo: { path: '/duckduckgo/search', required: ['query'] },
  baidu: { path: '/baidu/search', required: ['query'] },
  universalSearch: { path: '/search', required: ['query'] },

  // ---- Amazon -----------------------------------------------------------
  amazonProduct: { path: '/amazon/product', required: ['asin'] },
  amazonSearch: { path: '/amazon/search', required: ['query'] },
  amazonReviews: { path: '/amazon/reviews', required: ['asin'] },
  amazonOffers: { path: '/amazon/offers', required: ['asin'] },
  amazonAutocomplete: { path: '/amazon/autocomplete', required: ['prefix'] },

  // ---- Apple ------------------------------------------------------------
  appleProduct: { path: '/apple/product', required: ['product_id'] },
  appleReviews: { path: '/apple/reviews', required: ['product_id'] },
  appleAppStore: { path: '/apple/app_store', required: ['term'] },

  // ---- Walmart ----------------------------------------------------------
  walmartProduct: { path: '/walmart/product', required: ['url'] },
  walmartSearch: { path: '/walmart/search', required: ['url'] },
  walmartReviews: { path: '/walmart/reviews', required: ['url'] },
  walmartAutocomplete: { path: '/walmart/autocomplete', required: ['query'] },

  // ---- eBay / Flipkart / Myntra ----------------------------------------
  ebayProduct: { path: '/ebay/product', required: ['url'] },
  ebaySearch: { path: '/ebay/search', required: ['url'] },
  flipkartProduct: { path: '/flipkart/product', required: ['url'] },
  flipkartSearch: { path: '/flipkart/search', required: ['url'] },
  myntraProduct: { path: '/myntra/product', required: ['url'] },
  myntraSearch: { path: '/myntra/search', required: ['url'] },

  // ---- Other marketplaces / listings -----------------------------------
  indeed: { path: '/indeed', required: ['url'] },
  zillow: { path: '/zillow', required: ['url'] },
  yelp: { path: '/yelp/search', required: ['find_desc'] },

  // ---- Social: Profiles / X / TikTok -----------------------------------
  // Profile Scraper API (person & company profiles).
  personProfile: { path: '/profile', required: ['id'], defaults: { type: 'profile' } },
  companyProfile: { path: '/profile', required: ['id'], defaults: { type: 'company' } },
  profile: { path: '/profile', required: ['type', 'id'] },
  profilePost: { path: '/profile/post', required: ['id'] },

  xPost: { path: '/x/post', required: ['tweetId'] },
  xProfile: { path: '/x/profile', required: ['profileId'] },
  tiktokProfile: { path: '/tiktok/profile', required: ['username'] },
  tiktokPost: { path: '/tiktok/post', required: ['username', 'post_id'] },
  tiktokAds: { path: '/tiktok/ads', required: ['query'] },

  // ---- YouTube (all share the /youtube endpoint) -----------------------
  youtube: { path: '/youtube', required: [] },
  youtubeSearch: { path: '/youtube', required: ['search_query'] },
  youtubeVideo: { path: '/youtube', required: ['video_id'] },
  youtubeChannel: { path: '/youtube', required: ['channel_id'] },
  youtubeComments: { path: '/youtube', required: ['v'] },
  youtubeTranscripts: { path: '/youtube', required: ['v'] },

  // ---- AI / account -----------------------------------------------------
  chatgpt: { path: '/chatgpt', required: ['prompt'] },
  account: { path: '/account', required: [] },
};

module.exports = { ENDPOINTS };
