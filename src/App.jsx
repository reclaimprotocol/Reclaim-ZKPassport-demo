import HotelVerification from './components/HotelVerification'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <rect width="32" height="32" rx="7" fill="#2563eb"/>
                <path d="M16 8L22 12V20L16 24L10 20V12L16 8Z" stroke="white" strokeWidth="1.8" fill="none"/>
                <circle cx="16" cy="16" r="3" fill="white"/>
              </svg>
              <span className="text-xl font-bold text-gray-900">InstantCheck</span>
            </div>
            <div className="text-sm text-gray-600">
              Powered by <span className="font-semibold text-blue-600">ZKPassport</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <HotelVerification />
      </main>
    </div>
  )
}

export default App
