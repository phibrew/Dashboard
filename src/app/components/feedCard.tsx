export interface FeedItem {
// src/app/components/feedCard.tsx
  id: string;
  title: string;
  image?: string;
  link: string;
  source: 'Spotify' | 'News' | 'TMDB' | 'Twitter' | 'Instagram';
  date: string;
  description?: string;
  author?: string;
  contentType?: 'music' | 'news' | 'movie' | 'social';
}

const getSourceIcon = (source: string) => {
  const icons = {
    'Spotify': '🎵',
    'News': '📰',
    'TMDB': '🎬',
    'Twitter': '🐦',
    'Reddit': '🔥'
  };
  return icons[source as keyof typeof icons] || '📄';
};

const getSourceColor = (source: string) => {
  const colors = {
    'Spotify': 'bg-green-100 text-green-800',
    'News': 'bg-blue-100 text-blue-800',
    'TMDB': 'bg-yellow-100 text-yellow-800',
    'Twitter': 'bg-sky-100 text-sky-800',
    'Reddit': 'bg-pink-100 text-pink-800'
  };
  return colors[source as keyof typeof colors] || 'bg-gray-100 text-gray-800';
};

export default function FeedCard({ item }: { item: FeedItem }) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition-all duration-200 hover:scale-[1.02] overflow-hidden">
      {/* Image */}
      {item.image && (
        <div className="relative h-48 overflow-hidden">
          <img 
            src={item.image} 
            alt={item.title} 
            className="w-full h-full object-cover"
          />
          {/* Source badge */}
          <div className="absolute top-3 left-3">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getSourceColor(item.source)}`}>
              {getSourceIcon(item.source)} {item.source}
            </span>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-4">
        {/* No image - show source badge here */}
        {!item.image && (
          <div className="mb-2">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getSourceColor(item.source)}`}>
              {getSourceIcon(item.source)} {item.source}
            </span>
          </div>
        )}

        {/* Title */}
        <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2">
          {item.title}
        </h3>

        {/* Description */}
        {item.description && (
          <p className="text-sm text-gray-600 line-clamp-3 mb-3">
            {item.description}
          </p>
        )}

        {/* Meta info */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <span>{formatDate(item.date)}</span>
          {item.author && <span>by {item.author}</span>}
        </div>

        {/* Action button */}
        <a
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
        >
          {item.source === 'Spotify' && '🎧 Listen'}
          {item.source === 'News' && '📖 Read Article'}
          {item.source === 'TMDB' && '🎬 View Details'}
          {(item.source === 'Twitter' || item.source === 'Instagram') && '👀 View Post'}
          <span className="ml-1">→</span>
        </a>
      </div>
    </div>
  );
}