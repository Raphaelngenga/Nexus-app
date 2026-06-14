exports.handler = async function(event) {
  const https = require('https');

  // API key is read securely from Netlify environment variables (not stored in code)
  const MC_API_KEY = process.env.MAILCHIMP_API_KEY;
  const MC_DC = process.env.MAILCHIMP_DC || 'us8';

  if (!MC_API_KEY) {
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'MAILCHIMP_API_KEY environment variable not set in Netlify' })
    };
  }

  const endpoint = event.queryStringParameters.endpoint || '';
  const url = `https://${MC_DC}.api.mailchimp.com/3.0${endpoint}`;
  const auth = Buffer.from('nexus:' + MC_API_KEY).toString('base64');

  return new Promise((resolve) => {
    https.get(url, { headers: { 'Authorization': 'Basic ' + auth } }, (res) => {
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
