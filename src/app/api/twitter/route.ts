export async function GET(request: Request) {
    try {
        const bearerToken = process.env.TWITTER_BEARER_TOKEN;
        
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = 10;
 
        if (!bearerToken) {
            return new Response(JSON.stringify({ error: 'Twitter API token not configured' }), {
                status: 500,
                headers: { "Content-Type": "application/json" }
            });
        }
        
        // Get trending topics or recent tweets (you'll need to adjust based on your Twitter API access level)
        const res = await fetch(
            `https://api.twitter.com/2/tweets/search/recent?query=%23tech%20-is%3Aretweet&max_results=${limit}&tweet.fields=created_at,author_id,public_metrics&expansions=author_id`,
            {
                headers: {
                    'Authorization': `Bearer ${bearerToken}`,
                    'User-Agent': 'PersonalDashboard/2.0'
                }
            }
        );

        if (!res.ok) {
            throw new Error(`Twitter API failed: ${res.status}`);
        }

        const data = await res.json();

        if (!data.data) {
            return new Response(JSON.stringify([]), {
                status: 200,
                headers: { "Content-Type": "application/json" }
            });
        }

        const users = data.includes?.users || [];
        const userMap = users.reduce((acc: any, user: any) => {
            acc[user.id] = user;
            return acc;
        }, {});

        const simplified = data.data.map((tweet: any) => {
            const author = userMap[tweet.author_id];
            return {
                id: `twitter-${tweet.id}`,
                title: tweet.text.length > 100 ? `${tweet.text.substring(0, 100)}...` : tweet.text,
                image: null, // Twitter images require additional API calls
                link: `https://twitter.com/i/status/${tweet.id}`,
                source: "Twitter",
                date: tweet.created_at,
                description: tweet.text,
                author: author ? `@${author.username}` : 'Twitter User',
                contentType: "social"
            };
        });

        return new Response(JSON.stringify(simplified), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    } catch (error) {
        console.error('Twitter API error:', error);
        return new Response(JSON.stringify({ error: 'Failed to fetch tweets' }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}