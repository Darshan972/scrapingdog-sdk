'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');

const ScrapingDog = require('../src/index');
const { ScrapingDogError } = require('../src/index');
const { ENDPOINTS } = require('../src/endpoints');

// A fake fetch that records the URL/init it was called with and returns a
// canned response, so we can test URL building and parsing with no network.
function fakeFetch(response = {}) {
  const calls = [];
  const fn = async (url, init) => {
    calls.push({ url, init });
    return {
      ok: response.ok ?? true,
      status: response.status ?? 200,
      statusText: response.statusText ?? 'OK',
      headers: new Map(Object.entries(response.headers || {})),
      text: async () => response.body ?? '{}',
    };
  };
  fn.calls = calls;
  return fn;
}

test('constructor requires an api key', () => {
  assert.throws(() => new ScrapingDog(), TypeError);
  assert.throws(() => new ScrapingDog(''), TypeError);
});

test('builds url with api_key and params, coercing booleans', async () => {
  const fetch = fakeFetch({ body: '{"ok":true}' });
  const client = new ScrapingDog('KEY123', { fetch });

  await client.google({ query: 'coffee shops', country: 'us', advance_search: true });

  const url = new URL(fetch.calls[0].url);
  assert.equal(url.origin + url.pathname, 'https://api.scrapingdog.com/google');
  assert.equal(url.searchParams.get('api_key'), 'KEY123');
  assert.equal(url.searchParams.get('query'), 'coffee shops');
  assert.equal(url.searchParams.get('country'), 'us');
  assert.equal(url.searchParams.get('advance_search'), 'true');
});

test('parses JSON responses automatically', async () => {
  const fetch = fakeFetch({ body: '{"organic_results":[{"title":"hi"}]}' });
  const client = new ScrapingDog('KEY', { fetch });
  const res = await client.google({ query: 'x' });
  assert.deepEqual(res, { organic_results: [{ title: 'hi' }] });
});

test('scrape() returns raw HTML and hits /scrape', async () => {
  const fetch = fakeFetch({ body: '<html><body>hello</body></html>' });
  const client = new ScrapingDog('KEY', { fetch });
  const html = await client.scrape('https://example.com', { dynamic: true });
  assert.equal(html, '<html><body>hello</body></html>');
  const url = new URL(fetch.calls[0].url);
  assert.equal(url.pathname, '/scrape');
  assert.equal(url.searchParams.get('url'), 'https://example.com');
  assert.equal(url.searchParams.get('dynamic'), 'true');
});

test('every registry method exists and targets its documented path', async () => {
  const fetch = fakeFetch();
  const client = new ScrapingDog('KEY', { fetch });

  for (const [name, spec] of Object.entries(ENDPOINTS)) {
    assert.equal(typeof client[name], 'function', `missing method ${name}`);
    // Provide a dummy value for each required param so the call goes through.
    const params = {};
    for (const key of spec.required) params[key] = 'x';
    await client[name](params);
    const url = new URL(fetch.calls.at(-1).url);
    assert.equal(url.pathname, spec.path, `${name} should hit ${spec.path}`);
    // Defaults (e.g. type=profile) must be applied.
    for (const [k, v] of Object.entries(spec.defaults || {})) {
      assert.equal(url.searchParams.get(k), String(v), `${name} default ${k}`);
    }
  }
});

test('single-required-param methods accept a bare string', async () => {
  const fetch = fakeFetch();
  const client = new ScrapingDog('KEY', { fetch });
  await client.chatgpt('write a haiku');
  const url = new URL(fetch.calls[0].url);
  assert.equal(url.pathname, '/chatgpt');
  assert.equal(url.searchParams.get('prompt'), 'write a haiku');
});

test('personProfile applies its default type', async () => {
  const fetch = fakeFetch();
  const client = new ScrapingDog('KEY', { fetch });
  await client.personProfile({ id: 'williamhgates' });
  const url = new URL(fetch.calls[0].url);
  assert.equal(url.pathname, '/profile');
  assert.equal(url.searchParams.get('type'), 'profile');
  assert.equal(url.searchParams.get('id'), 'williamhgates');
});

test('throws ScrapingDogError on non-2xx with status and redacted url', async () => {
  const fetch = fakeFetch({ ok: false, status: 401, statusText: 'Unauthorized', body: 'bad key' });
  const client = new ScrapingDog('SECRET', { fetch });

  await assert.rejects(
    () => client.google({ query: 'x' }),
    (err) => {
      assert.ok(err instanceof ScrapingDogError);
      assert.equal(err.status, 401);
      assert.equal(err.body, 'bad key');
      assert.match(err.url, /api_key=REDACTED/);
      assert.doesNotMatch(err.url, /SECRET/);
      return true;
    }
  );
});

test('omits null and undefined params', async () => {
  const fetch = fakeFetch();
  const client = new ScrapingDog('KEY', { fetch });
  await client.get('/google', { query: 'x', page: undefined, location: null });
  const url = new URL(fetch.calls[0].url);
  assert.equal(url.searchParams.has('page'), false);
  assert.equal(url.searchParams.has('location'), false);
});

test('methods validate required params', () => {
  const client = new ScrapingDog('KEY', { fetch: fakeFetch() });
  assert.throws(() => client.google({}), /requires "query"/);
  assert.throws(() => client.amazonProduct({}), /requires "asin"/);
  assert.throws(() => client.tiktokPost({ username: 'x' }), /requires "post_id"/);
  assert.throws(() => client.scrape(), TypeError);
});
