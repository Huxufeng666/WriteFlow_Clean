import { useState } from 'react'
import Header from './components/Header'
import WritingCorrector from './components/WritingCorrector'
import Footer from './components/Footer'
import './App.css'

function App() {
  const [language, setLanguage] = useState<'ko' | 'zh'>('ko')

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header language={language} setLanguage={setLanguage} />
      <main className="container mx-auto px-4 py-8">
        <WritingCorrector language={language} />
      </main>
      <Footer />
    </div>
  )
}

export default App