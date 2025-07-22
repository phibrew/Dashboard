export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = 10;
        const offset = (page-1)*limit;

        const tokenRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/spotify/token`);
        const tokenData = await tokenRes.json();
        const accessToken = tokenData.access_token;

        let spotifyUrl = '';
        if (page === 1) {
            spotifyUrl = `https://api.spotify.com/v1/browse/new-releases?limit=${limit}&offset=${offset}`;
        } else if (page === 2) {
            spotifyUrl = `https://api.spotify.com/v1/browse/featured-playlists?limit=${limit}&offset=0`;
        } else {
            // For page 3+, get albums from different categories or search results
            spotifyUrl = `https://api.spotify.com/v1/browse/categories/pop/playlists?limit=${limit}&offset=0`;
        }

        const res = await fetch(spotifyUrl, {
            headers: {
            Authorization: `Bearer ${accessToken}`,
            },
        });
        if(!res.ok){
            throw new Error('Failed to fetch Spotify new releases');
        }
    
        const data = await res.json();
        let simplified = [];
        if (page === 1 && data.albums) {
            // New releases
            simplified = data.albums.items.map((item: any) => ({
                id: `spotify-album-${item.id}-${page}`,
                title: item.name,
                image: item.images[0]?.url,
                link: item.external_urls.spotify,
                source: "Spotify",
                date: item.release_date,
                description: `New Album • ${item.artists.map((a: any) => a.name).join(', ')}`,
                author: item.artists.map((a: any) => a.name).join(', '),
                contentType: "music"
            }));
        } else if (page === 2 && data.playlists) {
            // Featured playlists
            simplified = data.playlists.items.map((item: any) => ({
                id: `spotify-playlist-${item.id}-${page}`,
                title: item.name,
                image: item.images[0]?.url,
                link: item.external_urls.spotify,
                source: "Spotify",
                date: new Date().toISOString().split('T')[0],
                description: item.description || 'Featured Playlist',
                author: 'Spotify',
                contentType: "music"
            }));
        } else if (data.playlists) {
            // Category playlists
            simplified = data.playlists.items.map((item: any) => ({
                id: `spotify-category-${item.id}-${page}`,
                title: item.name,
                image: item.images[0]?.url,
                link: item.external_urls.spotify,
                source: "Spotify",
                date: new Date().toISOString().split('T')[0],
                description: item.description || 'Popular Playlist',
                author: 'Spotify',
                contentType: "music"
            }));
        }
    
        return new Response(JSON.stringify(simplified), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error('Spotify API error:', error);
        return new Response(JSON.stringify({ error: 'Failed to fetch Spotify new releases' }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
        
    }
}