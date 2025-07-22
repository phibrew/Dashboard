'use client';
import { useEffect, useState } from "react";
import { useFavoritesStore,  allCategories, type Category } from "../store/favoritesStore";

export default function Settings(){ 
  const {
    favorites,
    toggleFavorite,
    clearFavorites,
    getPopularCategories
  } = useFavoritesStore();

  const [showMore, setShowMore] = useState(false);  
  
  const saveSettings = () => {
    alert('Settings saved!');
  }

   return (
    <div className="h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl h-[90vh] bg-white rounded-lg shadow-lg flex flex-col">
        {/* Fixed Header */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">Customize your feed by selecting your favorite topics</p>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <div className="p-6 flex-1 overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Feed Preferences</h2>
            
            <p className="text-gray-600 mb-6">
              Select the topics you're interested in. Your dashboard feed will be personalized based on these choices.
            </p>

            {/* Popular Categories */}
            <div className="mb-6">
              <h3 className="font-medium text-gray-900 mb-3">Popular Categories</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {getPopularCategories().map((category: Category) => (
                  <CategoryCard 
                    key={category.id}
                    category={category}
                    isSelected={favorites.includes(category.id)}
                    onToggle={() => toggleFavorite(category.id)}
                  />
                ))}
              </div>
            </div>

            {/* More Categories Toggle */}
            <div className="mb-4">
              <button
                onClick={() => setShowMore(!showMore)}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
              >
                {showMore ? '↑ Show Less' : '↓ More Categories'} 
                <span className="ml-1">({allCategories.length})</span>
              </button>
            </div>

            {/* Additional Categories (Collapsible) */}
            {showMore && (
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-3">More Categories</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-h-64 overflow-y-auto pr-2">
                  {allCategories.map((category: Category) => (
                    <CategoryCard 
                      key={category.id}
                      category={category}
                      isSelected={favorites.includes(category.id)}
                      onToggle={() => toggleFavorite(category.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Selected favorites preview */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3 text-gray-700">Selected Favorites ({favorites.length})</h3>
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                {favorites.length > 0 ? (
                  favorites.map((fav: string) => {
                    const category = [...getPopularCategories(), ...allCategories].find(cat => cat.id === fav)
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
          </div>

          {/* Fixed Footer with Actions */}
          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <div className="flex justify-between items-center">
              <a
                href="/dashboard"
                className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
              >
                ← Back to Dashboard
              </a>
              
              <div className="flex gap-3">
                <button
                  onClick={clearFavorites}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Clear All
                </button>
                
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Category Card Component
function CategoryCard({ 
  category, 
  isSelected, 
  onToggle 
}: { 
  category: Category
  isSelected: boolean
  onToggle: () => void 
}) {
  return (
    <div
      onClick={onToggle}
      className={`
        relative p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md
        ${isSelected
          ? 'border-blue-500 bg-blue-50 shadow-sm'
          : 'border-gray-200 bg-white hover:border-gray-300'
        }
      `}
    >
      <div className="text-center">
        <div className="text-xl mb-1">{category.icon}</div>
        <div className="font-medium text-xs text-gray-900">{category.name}</div>
        
        {/* Selected indicator */}
        {isSelected && (
          <div className="absolute top-1 right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs">✓</span>
          </div>
        )}
      </div>
    </div>
  )
}
