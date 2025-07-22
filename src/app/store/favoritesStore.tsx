import {create} from 'zustand';
import {persist} from 'zustand/middleware';

export interface Category {
    id: string
    name: string
    icon: string
    popular?: boolean
}

export const allCategories: Category[] = [
    { id: 'news', name: 'News', icon: '📰', popular: true },
  { id: 'sports', name: 'Sports', icon: '⚽', popular: true },
  { id: 'technology', name: 'Technology', icon: '💻', popular: true },
  { id: 'gaming', name: 'Gaming', icon: '🎮', popular: true },
  { id: 'movies', name: 'Movies', icon: '🎬', popular: true },
  { id: 'music', name: 'Music', icon: '🎵', popular: true },
  
  // Creative & Visual
  { id: 'anime', name: 'Anime', icon: '🎌' },
  { id: 'manga', name: 'Manga', icon: '📚' },
  { id: 'paintings', name: 'Paintings', icon: '🎨' },
  { id: 'photographs', name: 'Photographs', icon: '📸' },
  { id: 'wallpapers', name: 'Wallpapers', icon: '🖼️' },
  { id: 'design', name: 'Design', icon: '🎨' },
  { id: 'art', name: 'Art', icon: '🖌️' },
  { id: 'fashion', name: 'Fashion', icon: '👗' },
  
  // Entertainment
  { id: 'tv-shows', name: 'TV Shows', icon: '📺' },
  { id: 'comedy', name: 'Comedy', icon: '😂' },
  { id: 'memes', name: 'Memes', icon: '😄' },
  { id: 'youtube', name: 'YouTube', icon: '📹' },
  { id: 'podcasts', name: 'Podcasts', icon: '🎙️' },
  
  // Lifestyle & Hobbies
  { id: 'books', name: 'Books', icon: '📖' },
  { id: 'cooking', name: 'Cooking', icon: '👨‍🍳' },
  { id: 'travel', name: 'Travel', icon: '✈️' },
  { id: 'fitness', name: 'Fitness', icon: '💪' },
  { id: 'health', name: 'Health', icon: '🏥' },
  { id: 'food', name: 'Food', icon: '🍕' },
  { id: 'pets', name: 'Pets', icon: '🐕' },
  { id: 'gardening', name: 'Gardening', icon: '🌱' },
  
  // Science & Learning
  { id: 'science', name: 'Science', icon: '🔬' },
  { id: 'space', name: 'Space', icon: '🚀' },
  { id: 'history', name: 'History', icon: '🏛️' },
  { id: 'education', name: 'Education', icon: '🎓' },
  { id: 'programming', name: 'Programming', icon: '💻' },
  { id: 'ai', name: 'AI & ML', icon: '🤖' },
  
  // Business & Finance
  { id: 'business', name: 'Business', icon: '💼' },
  { id: 'finance', name: 'Finance', icon: '💰' },
  { id: 'crypto', name: 'Cryptocurrency', icon: '₿' },
  { id: 'stocks', name: 'Stock Market', icon: '📈' }, 
]

interface FavoritesState{
    favorites: string[]
    showAllCategories: boolean
    addFavorite: (categoryId: string) => void
    removeFavorite: (categoryId: string) => void
    toggleFavorite: (categoryId: string) => void
    setFavorites: (categories: string[]) => void
    clearFavorites: () => void
    toggleShowAll: () => void
    getPopularCategories: () => Category[]
    getFavoriteCategories: () => Category[]
}

export const useFavoritesStore = create<FavoritesState>()(
    persist(
        (set, get) => ({
            favorites: [],
            showAllCategories: false,

            addFavorite: (categoryId) => set(state => ({
                favorites: state.favorites.includes(categoryId)
                ? state.favorites : [...state.favorites, categoryId]
            })),

            removeFavorite: (categoryId) => set(state => ({
                favorites: state.favorites.filter(id => id !== categoryId)
            })),

            toggleFavorite: (categoryId) =>  {
                const { favorites } = get();
                if(favorites.includes(categoryId)) {
                    get().removeFavorite(categoryId);
                }else {
                    get().addFavorite(categoryId);
                }
            },
            
            setFavorites: (categories) => set({ favorites: categories }),

            clearFavorites: () => set({ favorites: [] }),

            toggleShowAll: () => set(state => ({
                showAllCategories: !state.showAllCategories
            })),

            getPopularCategories: () => allCategories.filter(item=>item.popular),

            getFavoriteCategories: () => allCategories.filter(item => get().favorites.includes(item.id))    
        }),
        {
            name: 'favorites-storage',
            // skipHydration: true, //next js ssr
        }
    )
)