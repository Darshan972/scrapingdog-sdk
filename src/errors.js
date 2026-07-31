'use strict';

/**
 * Error thrown for any failed Scrapingdog request: non-2xx responses,
 * network failures, and timeouts.
 *
 * @property {number} [status]  HTTP status code, when the server responded.
 * @property {string} [body]    Raw response body returned by the API, if any.
 * @property {string} [url]     The request URL (with the api_key redacted).
 * @property {string} [code]    A short machine-readable code, e.g. "ETIMEDOUT".
 */
class ScrapingDogError extends Error {
  constructor(message, details = {}) {
    super(message);
    this.name = 'ScrapingDogError';
    if (details.status !== undefined) this.status = details.status;
    if (details.body !== undefined) this.body = details.body;
    if (details.url !== undefined) this.url = details.url;
    if (details.code !== undefined) this.code = details.code;
    if (details.cause !== undefined) this.cause = details.cause;
  }
}

module.exports = { ScrapingDogError };
