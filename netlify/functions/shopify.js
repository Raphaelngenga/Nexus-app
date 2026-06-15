exports.handler = async function(event) {
  const https = require('https');

  // Credentials read securely from Netlify environment variables (not stored in code)
  const SHOPIFY_STORE = process.env.SHOPIFY_STORE;
  const SHOPIFY_ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;

  if (!SHOPIFY_STORE || !SHOPIFY_ACCESS_TOKEN) {
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'SHOPIFY_STORE or SHOPIFY_ACCESS_TOKEN environment variable not set in Netlify' })
    };
  }

  const endpoint = event.queryStringParameters.endpoint || '/orders.json';
  const url = `https://${SHOPIFY_STORE}/admin/api/2024-01${endpoint}`;

  return new Promise((resolve) => {
    https.get(url, {
      headers: {
        'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN,
        'Content-Type': 'application/json'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({
        statusCode: 200,
        headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
        body: data
      }));
    }).on('error', (e) => resolve({
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: e.message })
    }));
  });
};
