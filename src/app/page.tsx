// src/app/dashboard/page.tsx
export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Personal Dashboard
          </h1>
          <a
            href="/settings"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            ⚙️ Settings
          </a>
        </div>
        
        {/* We'll add components here */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            {/* Feed will go here */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Feed</h2>
              <p>Feed content coming soon...</p>
            </div>
          </div>
          
          <div>
            {/* Sidebar content */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Quick Stats</h2>
              <p>Stats coming soon...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}