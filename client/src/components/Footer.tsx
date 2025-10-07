export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">W</span>
            </div>
            <span className="text-xl font-bold text-gray-800">WriteFlow</span>
          </div>
          <p className="text-gray-600 mb-4">
            AI-powered English writing correction platform for non-native speakers
          </p>
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
            <span>Powered by ChatGPT API</span>
            <span>•</span>
            <span>Made with ❤️ for English learners</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

