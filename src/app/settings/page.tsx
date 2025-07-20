'use client';
import { useState } from "react";

const availableFavorites = [
    { id: 'news', name: 'News', icon: '📰' },
    { id: 'sports', name: 'Sports', icon: '⚽' },
    {id: 'anime', name: 'Anime', icon: '🎌' },
    { id: 'paintings', name: 'Paintings', icon: '🎨' },
    { id: 'photographs', name: 'Photographs', icon: '📸' },
    { id: 'manga', name: 'Manga', icon: '📚' },
    { id: 'wallpapers', name: 'Wallpapers', icon: '🖼️' },
    { id: 'technology', name: 'Technology', icon: '💻' },
    { id: 'gaming', name: 'Gaming', icon: '🎮' },
    { id: 'movies', name: 'Movies', icon: '🎬' },
    { id: 'music', name: 'Music', icon: '🎵' },
    { id: 'b{ooks', name: 'Books', icon: '📖' },
]

export default function Settings(){
    const [favorites, setFavorites] = useState<string[]>(['news', 'technology'])

    const toggleFavorite = (categoryId: string) => {
        setFavorites(prev => 
            prev.includes(categoryId) ?
            prev.filter(id=> id!==categoryId) : [...prev, categoryId]
        )
    }

    const saveSettings = () => {
        console.log('Saved favorites:', favorites);
        alert('Settings saved successfully!');
    }

    return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-6 px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">Customize your feed by selecting your favorite topics</p>
        </div>

        {/* Settings Panel */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Feed Preferences</h2>
          
          <p className="text-gray-600 mb-6">
            Select the topics you're interested in. Your dashboard feed will be personalized based on these choices.
          </p>

          {/* Categories Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
            {availableFavorites.map((category) => (
              <div
                key={category.id}
                onClick={() => toggleFavorite(category.id)}
                className={`
                  relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
                  ${favorites.includes(category.id)
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                  }
                `}
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">{category.icon}</div>
                  <div className="font-medium text-sm">{category.name}</div>
                  
                  {/* Selected indicator */}
                  {favorites.includes(category.id) && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Selected favorites preview */}
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Selected Favorites ({favorites.length})</h3>
            <div className="flex flex-wrap gap-2">
              {favorites.length > 0 ? (
                favorites.map(fav => {
                  const category = availableFavorites.find(cat => cat.id === fav)
                  return (
                    <span
                      key={fav}
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {category?.icon} {category?.name}
                    </span>
                  )
                })
              ) : (
                <p className="text-gray-500 text-sm">No favorites selected</p>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-4">
            <button
              onClick={saveSettings}
              disabled={favorites.length === 0}
              className={`
                px-6 py-2 rounded-lg font-medium transition-colors
                ${favorites.length > 0
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }
              `}
            >
              Save Settings
            </button>
            
            <button
              onClick={() => setFavorites([])}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Clear All
            </button>
          </div>
        </div>

        {/* Navigation back to dashboard */}
        <div className="mt-6">
          <a
            href="/dashboard"
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            ← Back to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}


