exports.handler = async (event) => {
    const url = event.queryStringParameters.url;
    if (!url) return { statusCode: 400, body: 'Keine URL' };

    try {
        const response = await fetch(url, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
            redirect: 'follow'
        });
        const body = await response.text();
        return {
            statusCode: 200,
            headers: { 'content-type': 'text/html; charset=utf-8' },
            body: body
        };
    } catch (e) {
        return {
            statusCode: 200,
            body: '<h1 style="color:red;text-align:center;padding:50px;">💥 Seite nicht erreichbar</h1>'
        };
    }
};
