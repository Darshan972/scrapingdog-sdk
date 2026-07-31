'use strict';

const { ScrapingDogError } = require('./errors');
const { ENDPOINTS } = require('./endpoints');

const DEFAULT_BASE_URL = 'https://api.scrapingdog.com';
const DEFAULT_TIMEOUT = 60000; // Scrapingdog requests time out server-side at 60s.

/**
 * Client for the Scrapingdog API (https://www.scrapingdog.com).
 *
 * Every one of Scrapingdog's scrapers is exposed as a method (see the endpoint
 * registry in `endpoints.js`), plus a generic `get(path, params)` for anything
 * not yet covered. All methods return a Promise; JSON responses are parsed
 * automatically, and pass `{ raw: true }` to get the response body as a string.
 *
 * @example
 * const { ScrapingDog } = require('scrapingdog-sdk');
 * const client = new ScrapingDog('YOUR_API_KEY');
 * const html = await client.scrape('https://example.com', { dynamic: true });
 * const serp = await client.google({ query: 'coffee', country: 'us' });
 * const item = await client.amazonProduct({ asin: 'B0CX23V2ZK', domain: 'com' });
 */
class ScrapingDog {
  /**
   * @param {string} apiKey  Your Scrapingdog API key (from the dashboard).
   * @param {object} [options]
   * @param {number} [options.timeout=60000]  Per-request timeout in ms. 0 disables it.
   * @param {string} [options.baseUrl]        Override the API base URL.
   * @param {function} [options.fetch]        A custom fetch implementation (defaults to global fetch).
   */
  constructor(apiKey, options = {}) {
    if (!apiKey || typeof apiKey !== 'string') {
      throw new TypeError(
        'A Scrapingdog API key is required: new ScrapingDog("YOUR_API_KEY")'
      );
    }

    this.apiKey = apiKey;
    this.baseUrl = (options.baseUrl || DEFAULT_BASE_URL).replace(/\/+$/, '');
    this.timeout = options.timeout ?? DEFAULT_TIMEOUT;
    this.fetch = options.fetch || globalThis.fetch;

    if (typeof this.fetch !== 'function') {
      throw new Error(
        'Global fetch is not available. Use Node.js >= 18, or pass options.fetch.'
      );
    }

    this._installEndpoints();
  }

  /**
   * Low-level request against any Scrapingdog endpoint. Every generated method
   * is a thin wrapper around this, so any of the 60+ Scrapingdog APIs can be
   * reached even if it has no dedicated helper yet.
   *
   * @param {string} path            Endpoint path, e.g. "/google" or "google".
   * @param {object} [params={}]     Query parameters (api_key is added for you).
   * @param {object} [options={}]
   * @param {boolean} [options.raw=false]   Return the raw body string instead of parsed JSON.
   * @param {number}  [options.timeout]     Override the client timeout for this call.
   * @param {object}  [options.headers]     Extra request headers (for the custom_headers feature).
   * @param {AbortSignal} [options.signal]  Caller-provided abort signal.
   * @returns {Promise<any>}
   */
  async request(path, params = {}, options = {}) {
    const url = this._buildUrl(path, params);
    const timeout = options.timeout ?? this.timeout;

    const controller = new AbortController();
    const onExternalAbort = () => controller.abort(options.signal?.reason);
    if (options.signal) {
      if (options.signal.aborted) controller.abort(options.signal.reason);
      else options.signal.addEventListener('abort', onExternalAbort, { once: true });
    }
    const timer = timeout ? setTimeout(() => controller.abort(), timeout) : null;

    let res;
    try {
      res = await this.fetch(url, {
        method: 'GET',
        headers: { Accept: 'application/json, text/html;q=0.9, */*;q=0.8', ...options.headers },
        signal: controller.signal,
      });
    } catch (err) {
      if (controller.signal.aborted && !options.signal?.aborted) {
        throw new ScrapingDogError(`Request timed out after ${timeout}ms`, {
          code: 'ETIMEDOUT',
          url: this._redact(url),
          cause: err,
        });
      }
      throw new ScrapingDogError(`Network request failed: ${err.message}`, {
        code: err.code,
        url: this._redact(url),
        cause: err,
      });
    } finally {
      if (timer) clearTimeout(timer);
      if (options.signal) options.signal.removeEventListener('abort', onExternalAbort);
    }

    const text = await res.text();

    if (!res.ok) {
      throw new ScrapingDogError(
        `Scrapingdog request failed with status ${res.status} ${res.statusText}`.trim(),
        { status: res.status, body: text, url: this._redact(url) }
      );
    }

    if (options.raw) return text;

    // Most endpoints return JSON. The web scraping API returns HTML/text; hand
    // that back as-is if it does not parse as JSON.
    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  }

  /** Alias for {@link ScrapingDog#request}. Reaches any endpoint by path. */
  get(path, params, options) {
    return this.request(path, params, options);
  }

  /**
   * General Web Scraping API — fetch any public URL. Returns raw HTML by default.
   * @param {string} url             Target URL to scrape.
   * @param {object} [params]        e.g. { dynamic, premium, wait, country, session_number, custom_headers }.
   * @param {object} [options]       Per-call options (see {@link ScrapingDog#request}).
   */
  scrape(url, params = {}, options = {}) {
    if (!url || typeof url !== 'string') {
      throw new TypeError('scrape(url) requires a target URL string');
    }
    return this.request('/scrape', { url, ...params }, { raw: true, ...options });
  }

  /** The endpoint registry backing the generated methods. */
  static get endpoints() {
    return ENDPOINTS;
  }

  _installEndpoints() {
    for (const [name, spec] of Object.entries(ENDPOINTS)) {
      // Don't clobber explicitly defined methods (e.g. scrape).
      if (typeof this[name] === 'function') continue;
      this[name] = this._makeMethod(name, spec);
    }
  }

  _makeMethod(name, spec) {
    const required = spec.required || [];
    return (params = {}, options = {}) => {
      // Allow a bare string when there is a single required parameter:
      //   client.chatgpt('hello')  ===  client.chatgpt({ prompt: 'hello' })
      if ((typeof params === 'string' || typeof params === 'number') && required.length === 1) {
        params = { [required[0]]: params };
      }
      if (params == null || typeof params !== 'object') {
        throw new TypeError(`${name}(params) expects an object of parameters`);
      }

      const merged = { ...(spec.defaults || {}), ...params };
      for (const key of required) {
        const value = merged[key];
        if (value === undefined || value === null || value === '') {
          throw new TypeError(`${name}() requires "${key}"`);
        }
      }
      return this.request(spec.path, merged, { raw: !!spec.raw, ...options });
    };
  }

  _buildUrl(path, params) {
    const cleanPath = String(path).startsWith('/') ? path : `/${path}`;
    const url = new URL(this.baseUrl + cleanPath);
    url.searchParams.set('api_key', this.apiKey);

    for (const [key, value] of Object.entries(params || {})) {
      if (value === undefined || value === null) continue;
      url.searchParams.set(key, typeof value === 'boolean' ? String(value) : String(value));
    }
    return url.toString();
  }

  _redact(url) {
    try {
      const u = new URL(url);
      if (u.searchParams.has('api_key')) u.searchParams.set('api_key', 'REDACTED');
      return u.toString();
    } catch {
      return url;
    }
  }
}

module.exports = { ScrapingDog };
