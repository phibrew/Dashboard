export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');

        const apiKey = process.env.NEWS_API_KEY;
        if (!apiKey) {
            return new Response(JSON.stringify({ error: 'News API key not configured' }), {
                status: 500,
                headers: { "Content-Type": "application/json" }
            });
        }

        const res = await fetch(
            `https://newsapi.org/v2/top-headlines?country=us&pageSize=10&page=${page}&apiKey=${apiKey}`,
            {
                headers: {
                    'user-Agent': 'PersonalDashboard/1.0'
                }
            }
        );
        if(!res.ok){
            throw new Error(`News API request failed with status ${res.status}`);
        }

        const data = await res.json();
        const simplified = data.articles
        .filter((article: any) => article.title && article.title !== '[Removed]')
        .map((article: any) => ({
            id: article.url || `news-${Date.now()}-${Math.random()}`,
            tittle: article.title,
            description: article.description || '',
            image: article.urlToImage || '',
            date: article.publishedAt,
            source: article.source.name || 'News',
            link: article.url,
            contentType: 'news',
        }));
        return new Response(JSON.stringify(simplified), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    } catch (error) {
        console.error('Error fetching news:', error);
        return new Response(JSON.stringify({ error: 'Failed to fetch news' }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}