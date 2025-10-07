import { Globe } from 'lucide-react'

interface HeaderProps {
  language: 'ko' | 'zh'
  setLanguage: (lang: 'ko' | 'zh') => void
}

export default function Header({ language, setLanguage }: HeaderProps) {
  return (
    <header className="bg-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">W</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold gradient-text">WriteFlow</h1>
              <p className="text-sm text-gray-600">
                {language === 'ko' ? 'AI 영어 작문 교정' : 'AI英语写作批改'}
              </p>
            </div>
          </div>

          {/* Language Selector */}
          <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
            <Globe className="w-4 h-4 text-gray-500" />
            <button
              onClick={() => setLanguage('ko')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                language === 'ko'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              한국어
            </button>
            <button
              onClick={() => setLanguage('zh')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                language === 'zh'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              中文
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}