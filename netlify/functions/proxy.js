const axios = require('axios');

exports.handler = async (event) => {
    const url = event.queryStringParameters.url;
    if (!url) return { statusCode: 400, body: 'Keine URL' };

    try {
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            responseType: 'text',
            maxRedirects: 5,
            timeout: 15000
        });

        return {
            statusCode: 200,
            headers: {
                'content-type': 'text/html; charset=utf-8'
            },
            body: response.data
        };
    } catch (e) {
        return {
            statusCode: 200,
            body: '<h1 style="color:red;text-align:center;padding:50px;">💥 Seite nicht erreichbar</h1>'
        };
    }
};
