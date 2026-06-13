exports.handler = async function (event) {
    const https = require('https');
    const MC_API_KEY = '5d60e5a2ee118dbe110e5f6f9ee4a5c2-us8';
    const MC_DC = 'us8';
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
            body: JSON.stringify({ error: e.message })
        }));
    });
};