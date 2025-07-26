'use client';
import { useCallback, useEffect, useState } from 'react';
import FeedCard, { FeedItem } from '../components/feedCard';

export default function Dashboard() {
    const [allFeed, setAllFeed] = useState<FeedItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [userPreferences, setUserPreferences] = useState<any>(null);
    
    useEffect(() => {
        const initializePreferences = () => {
            const savedPrefs = localStorage.getItem('userPreferences');
            const prefs = savedPrefs ? JSON.parse(savedPrefs) : {
                spotify: {enabled: true},
                news: {enabled: true},
                tmdb: {enabled: false},
                twitter: {enabled: false},
                reddit: {enabled: true},
            };
            setUserPreferences(prefs);
            return prefs;
        };

        const prefs = initializePreferences();
        fetchAllFeeds(prefs, 1, true);
    }, []);

    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    
    useEffect(() => {
        const handleScroll = () => {
            if(!hasMore || loadingMore || !userPreferences) return;
            
            const scrollPosition = window.scrollY + window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;

            if(scrollPosition >= documentHeight - 200){
                loadMoreContent();
            }
        }
        window.addEventListener('scroll', handleScroll);  
        return () => window.removeEventListener('scroll', handleScroll);  
    }, [loadingMore, hasMore, page, userPreferences]);

    const fetchAllFeeds = async (
        prefs: any, 
        currentPage: number = 1,
        isInitial: boolean = false
    ) => {
        // Prevent multiple simultaneous requests
        if (loadingMore && !isInitial) return;
        
        if(isInitial) {
            setLoading(true);
        } else {
            setLoadingMore(true);
        }

        const feedPromises = [];
        const enabledSources = [];

        // Add some debugging
        console.log('Fetching feeds with preferences:', prefs);

        try {
            if(prefs.spotify?.enabled){
                enabledSources.push('spotify');
                feedPromises.push(
                    fetch(`/api/spotify/music?page=${currentPage}`)
                    .then(res => {
                        if (!res.ok) {
                            console.warn(`Spotify API failed with status: ${res.status}`);
                            return [];
                        }
                        return res.json();
                    })
                    .catch(err => {
                        console.error('Error fetching Spotify feed:', err);
                        return [];
                    })
                );
            }
            if(prefs.news?.enabled){
                enabledSources.push('news');
                feedPromises.push(
                    fetch(`/api/news?page=${currentPage}`)
                    .then(res => {
                        if (!res.ok) {
                            console.warn(`News API failed with status: ${res.status}`);
                            return [];
                        }
                        return res.json();
                    })
                    .catch(err => {
                        console.error('Error fetching News feed:', err);
                        return [];
                    })
                );
            }
            if(prefs.tmdb?.enabled){
                enabledSources.push('tmdb');
                feedPromises.push(
                    fetch(`/api/movies?page=${currentPage}`)
                    .then(res => {
                        if (!res.ok) {
                            console.warn(`TMDB API failed with status: ${res.status}`);
                            return [];
                        }
                        return res.json();
                    })
                    .catch(err => {
                        console.error('Error fetching TMDB feed:', err);
                        return [];
                    })
                );
            }
            if(prefs.twitter?.enabled){
                enabledSources.push('twitter');
                feedPromises.push(
                    fetch(`/api/twitter?page=${currentPage}`)
                    .then(res => {
                        if (!res.ok) {
                            console.warn(`Twitter API failed with status: ${res.status}`);
                            return [];
                        }
                        return res.json();
                    })
                    .catch(err => {
                        console.error('Error fetching Twitter feed:', err);
                        return [];
                    })
                );
            }
            if(prefs.reddit?.enabled){
                enabledSources.push('reddit');
                feedPromises.push(
                    fetch(`/api/reddit?page=${currentPage}`)
                    .then(res => {
                        if (!res.ok) {
                            console.warn(`Reddit API failed with status: ${res.status}`);
                            return [];
                        }
                        return res.json();
                    })
                    .catch(err => {
                        console.error('Error fetching Reddit feed:', err);
                        return [];
                    })
                );
            }   

            // If no sources are enabled, handle this case
            if (feedPromises.length === 0) {
                console.log('No sources enabled');
                setAllFeed([]);
                setHasMore(false);
                return;
            }

            const allResults = await Promise.all(feedPromises);
            console.log('API Results:', allResults);

            // Filter out any undefined/null results and flatten
            const combinedFeed = allResults
                .filter(result => Array.isArray(result))
                .flat()
                .filter(item => item && item.id) // Ensure items have required properties
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

            console.log('Combined feed length:', combinedFeed.length);
            console.log('Enabled sources:', enabledSources);

            if(isInitial) {
                setAllFeed(combinedFeed);
            } else {
                setAllFeed(prevFeed => {
                    const existingIds = new Set(prevFeed.map(item => item.id));
                    const uniqueContent = combinedFeed.filter(item => !existingIds.has(item.id));
                    return [...prevFeed, ...uniqueContent];
                });
            }
            
            // Better logic for hasMore - if we got very little content, stop trying
            // This prevents infinite loading when APIs are failing
            if (combinedFeed.length < 3 && currentPage > 1) {
                console.log('Very few items returned, stopping pagination');
                setHasMore(false);
            } else if (combinedFeed.length === 0) {
                console.log('No new items, stopping pagination');
                setHasMore(false);
            } else {
                setHasMore(true);
            }

        } catch (err) {
            console.error('Error fetching feeds:', err);
            setHasMore(false);
        } finally {
            if(isInitial) {
                setLoading(false);
            } else {
                setLoadingMore(false);
            }
        }
    };  

    const loadMoreContent = useCallback(() => {
        if(!loadingMore && hasMore && userPreferences) {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchAllFeeds(userPreferences, nextPage, false);
        }
    }, [loadingMore, hasMore, page, userPreferences]);

    const refreshFeed = () => {
        setPage(1);
        setHasMore(true);
        setAllFeed([]);
        if (userPreferences) {
            fetchAllFeeds(userPreferences, 1, true);
            if (!userPreferences) return 0;
        }
    };

    const getEnabledSourceCount = () => {
        return Object.values(userPreferences).filter((pref: any) => pref?.enabled).length;
    };

    // Show loading state while preferences are being initialized
    if (!userPreferences) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600">Initializing...</span>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto py-6 px-4">
                {/* Header with Settings Link */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Personal Dashboard
                        </h1>
                        <p className="text-gray-600 mt-1">
                            {getEnabledSourceCount()} sources enabled • {allFeed.length} items loaded
                        </p>
                    </div>
                    <a
                        href="/settings"
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        ⚙️ Settings
                    </a>
                </div>

                {/* Dashboard Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Feed Section */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold">Personalized Feed</h2>
                                <button 
                                    onClick={refreshFeed}
                                    disabled={loading}
                                    className="text-blue-600 hover:text-blue-800 text-sm disabled:opacity-50"
                                >
                                    🔄 {loading ? 'Loading...' : 'Refresh'}
                                </button>
                            </div>

                            {loading ? (
                                <div className="flex justify-center items-center py-12">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                    <span className="ml-2 text-gray-600">Loading your feed...</span>
                                </div>
                            ) : getEnabledSourceCount() === 0 ? (
                                <div className="text-center py-12">
                                    <p className="text-gray-600">No content sources enabled</p>
                                    <div className="text-sm text-blue-600 mt-2">
                                        → Go to Settings to enable content sources
                                    </div>
                                </div>
                            ) : allFeed.length > 0 ? (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                                        {allFeed.map((item, index) => (
                                            <FeedCard key={`${item.source}-${item.id}-${index}`} item={item} />
                                        ))}
                                    </div>
                                    {/* loading more content here */}
                                    {loadingMore && (
                                        <div className="flex justify-center items-center py-8">
                                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                                            <span className="ml-2 text-gray-600 text-sm">Loading more content...</span>
                                        </div>
                                    )}

                                    {/* end of the indicator here */}
                                    {!hasMore && allFeed.length > 0 && (
                                        <div className="text-center py-8 text-gray-500 text-sm">
                                            🎉 You've reached the end! 
                                            <button 
                                                onClick={refreshFeed}
                                                className="ml-2 text-blue-600 hover:text-blue-800"
                                            >
                                                Refresh for new content
                                            </button>
                                        </div>
                                    )} 
                                </>
                            ) : (
                                <div className="text-center py-12">
                                    <p className="text-gray-600">No content available from enabled sources</p>
                                    <div className="text-sm text-gray-500 mt-2">
                                        Check browser console for API errors
                                    </div>
                                    <button 
                                        onClick={refreshFeed}
                                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Try Again
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="font-semibold mb-3">API Status</h3>
                            <div className="space-y-2">
                                {Object.entries(userPreferences).map(([source, config]: [string, any]) => (
                                    <div key={source} className="flex items-center justify-between">
                                        <span className="text-sm capitalize">{source}</span>
                                        <div className="flex items-center gap-2">
                                            <span className={`text-xs px-2 py-1 rounded ${
                                                config?.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                                            }`}>
                                                {config?.enabled ? 'ENABLED' : 'DISABLED'}
                                            </span>
                                            {config?.enabled && (
                                                <span className="text-xs text-gray-500">
                                                    {source === 'news' ? '✅' : source === 'spotify' || source === 'reddit' ? '❌' : '❓'}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-3 p-2 bg-yellow-50 rounded text-xs text-yellow-700">
                                ℹ️ Some APIs may be temporarily unavailable. Only working sources will load content.
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="font-semibold mb-2">Feed Stats</h3>
                            <div className="space-y-2 text-sm text-gray-600">
                                <p>Total items: {allFeed.length}</p>
                                <p>Page: {page}</p>
                                <p suppressHydrationWarning={true}>Last updated: {new Date().toLocaleTimeString()}</p>
                                <div className="pt-2">
                                    <div className='text-xs text-gray-500'>
                                        {hasMore ? 'Scroll down for more content' : '✅ All Content Loaded'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}