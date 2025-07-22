export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = 10;

        // Reddit allows anonymous access to public subreddits
        // No API key needed for basic read access!
        const subreddit = 'popular'; // You can change this to any subreddit like 'technology', 'worldnews', etc.
        
        const after = page > 1 ? `&after=t3_${Date.now()}` : '';
        const res = await fetch(
            `https://www.reddit.com/r/${subreddit}/hot.json?limit=${limit}${after}`,
            {
                headers: {
                    'User-Agent': 'PersonalDashboard/1.0'
                }
            }
        );

        if (!res.ok) {
            throw new Error(`Reddit API failed: ${res.status}`);
        }

        const data = await res.json();

        const simplified = data.data.children
            .filter((post: any) => !post.data.stickied && post.data.title) // Filter out stickied posts
            .map((post: any) => ({
                id: `reddit-${post.data.id}`,
                title: post.data.title,
                image: post.data.thumbnail && post.data.thumbnail.startsWith('http') ? post.data.thumbnail : null,
                link: `https://reddit.com${post.data.permalink}`,
                source: "Reddit",
                date: new Date(post.data.created_utc * 1000).toISOString(),
                description: post.data.selftext ? post.data.selftext.substring(0, 200) + '...' : null,
                author: `r/${post.data.subreddit} • u/${post.data.author}`,
                contentType: "social"
            }));

        return new Response(JSON.stringify(simplified), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    } catch (error) {
        console.error('Reddit API error:', error);
        return new Response(JSON.stringify({ error: 'Failed to fetch Reddit posts' }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}