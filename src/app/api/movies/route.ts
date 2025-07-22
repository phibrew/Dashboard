export async function GET() {
    try {
        const apiKey = process.env.TMDB_API_KEY;
        if(!apiKey) {
            return new Response(JSON.stringify({ error: 'TMDB API key not configured' }), {
                status: 500,
                headers: { "Content-Type": "application/json" }
            });
        }

        const res = await fetch(
            `https://api.themoviedb.org/3/trending/movie/day?api_key=${apiKey}&page=1`
        );
        if(!res.ok){
            throw new Error(`TMDB API request failed with status ${res.status}`);
        }

        const data = await res.json();
        const simplified = data.results.slice(0, 8).map((movie: any) => ({
            id: `tmdb-${movie.id}`,
            title: movie.title,
            image: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '',
            link: `https://www.themoviedb.org/movie/${movie.id}`,
            source: 'TMDB',
            description: movie.overview || '',
            contentType: 'movie',
            date: movie.release_date || new Date().toISOString().split('T')[0],
        }));
        return new Response(JSON.stringify(simplified), {
            status: 200, 
            headers: { "Content-Type": "application/json" }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}