import { useState } from 'react'
import { Send, Loader2, CheckCircle, AlertCircle, Star, BookOpen, Lightbulb } from 'lucide-react'

interface WritingCorrectorProps {
  language: 'ko' | 'zh'
}

interface Correction {
  original: string
  corrected: string
  explanation: string
}

interface Feedback {
  overall_score: number
  grammar_score: number
  vocabulary_score: number
  coherence_score: number
  corrections: Correction[]
  suggestions: string[]
  explanation: string
}

export default function WritingCorrector({ language }: WritingCorrectorProps) {
  const [content, setContent] = useState('')
  const [correctedContent, setCorrectedContent] = useState('')
  const [feedback, setFeedback] = useState<Feedback | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleCorrection = async () => {
    if (!content.trim()) {
      setError(language === 'ko' ? '작문 내용을 입력해주세요.' : '请输入写作内容。')
      return
    }

    setIsLoading(true)
    setError('')
    setFeedback(null)
    setCorrectedContent('')

    try {
      const response = await fetch('/api/correct', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: content.trim(),
          nativeLanguage: language
        }),
      })

      if (!response.ok) {
        throw new Error('서버 오류가 발생했습니다.')
      }

      const data = await response.json()
      setCorrectedContent(data.corrected_content)
      setFeedback(data.feedback)

    } catch (err) {
      setError(language === 'ko' 
        ? 'AI 교정 중 오류가 발생했습니다. 다시 시도해주세요.' 
        : 'AI批改过程中出现错误，请重试。')
    } finally {
      setIsLoading(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 80) return 'text-blue-600'
    if (score >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBg = (score: number) => {
    if (score >= 90) return 'bg-green-100'
    if (score >= 80) return 'bg-blue-100'
    if (score >= 70) return 'bg-yellow-100'
    return 'bg-red-100'
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Main Title */}
      <div className="text-center mb-12 fade-in">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">
          {language === 'ko' ? '영어 작문 AI 교정' : '英语写作AI批改'}
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          {language === 'ko' 
            ? 'ChatGPT가 당신의 영어 작문을 교정하고 상세한 피드백을 제공합니다.'
            : 'ChatGPT将为您批改英语写作并提供详细反馈。'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-lg p-8 fade-in">
            <div className="flex items-center space-x-3 mb-6">
              <BookOpen className="w-6 h-6 text-blue-600" />
              <h3 className="text-xl font-semibold text-gray-800">
                {language === 'ko' ? '영어 작문 입력' : '英语写作输入'}
              </h3>
            </div>
            
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={language === 'ko' 
                ? '여기에 영어로 작문해보세요...\n\n예시:\nI think that technology has changed our lives in many ways. First of all, it makes communication easier and faster. We can talk to people all over the world instantly through the internet.'
                : '请在这里用英语写作...\n\n示例:\nI think that technology has changed our lives in many ways. First of all, it makes communication easier and faster. We can talk to people all over the world instantly through the internet.'}
              className="w-full h-80 p-4 border-2 border-gray-200 rounded-xl resize-none focus:border-blue-500 focus:outline-none transition-colors text-gray-800"
              disabled={isLoading}
            />
            
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-500">
                {language === 'ko' ? '단어 수' : '字数'}: {content.trim().split(/\s+/).filter(word => word.length > 0).length}
              </div>
              <button
                onClick={handleCorrection}
                disabled={isLoading || !content.trim()}
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
                <span>
                  {isLoading 
                    ? (language === 'ko' ? '교정 중...' : '批改中...')
                    : (language === 'ko' ? '교정하기' : '批改')
                  }
                </span>
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 fade-in">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          )}
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          {/* Corrected Content */}
          {correctedContent && (
            <div className="bg-white rounded-2xl shadow-lg p-8 fade-in">
              <div className="flex items-center space-x-3 mb-6">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <h3 className="text-xl font-semibold text-gray-800">
                  {language === 'ko' ? '교정된 내용' : '批改后的内容'}
                </h3>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 border-l-4 border-green-500">
                <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                  {correctedContent}
                </p>
              </div>
            </div>
          )}

          {/* Feedback */}
          {feedback && (
            <div className="bg-white rounded-2xl shadow-lg p-8 fade-in">
              <div className="flex items-center space-x-3 mb-6">
                <Star className="w-6 h-6 text-yellow-600" />
                <h3 className="text-xl font-semibold text-gray-800">
                  {language === 'ko' ? '상세 피드백' : '详细反馈'}
                </h3>
              </div>

              {/* Scores */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className={`${getScoreBg(feedback.overall_score)} rounded-xl p-4 text-center`}>
                  <div className="text-2xl font-bold mb-1">
                    <span className={getScoreColor(feedback.overall_score)}>
                      {feedback.overall_score}
                    </span>
                    <span className="text-gray-600 text-lg">/100</span>
                  </div>
                  <div className="text-sm font-medium text-gray-700">
                    {language === 'ko' ? '전체 점수' : '总分'}
                  </div>
                </div>
                <div className={`${getScoreBg(feedback.grammar_score)} rounded-xl p-4 text-center`}>
                  <div className="text-2xl font-bold mb-1">
                    <span className={getScoreColor(feedback.grammar_score)}>
                      {feedback.grammar_score}
                    </span>
                    <span className="text-gray-600 text-lg">/100</span>
                  </div>
                  <div className="text-sm font-medium text-gray-700">
                    {language === 'ko' ? '문법 점수' : '语法分数'}
                  </div>
                </div>
                <div className={`${getScoreBg(feedback.vocabulary_score)} rounded-xl p-4 text-center`}>
                  <div className="text-2xl font-bold mb-1">
                    <span className={getScoreColor(feedback.vocabulary_score)}>
                      {feedback.vocabulary_score}
                    </span>
                    <span className="text-gray-600 text-lg">/100</span>
                  </div>
                  <div className="text-sm font-medium text-gray-700">
                    {language === 'ko' ? '어휘 점수' : '词汇分数'}
                  </div>
                </div>
                <div className={`${getScoreBg(feedback.coherence_score)} rounded-xl p-4 text-center`}>
                  <div className="text-2xl font-bold mb-1">
                    <span className={getScoreColor(feedback.coherence_score)}>
                      {feedback.coherence_score}
                    </span>
                    <span className="text-gray-600 text-lg">/100</span>
                  </div>
                  <div className="text-sm font-medium text-gray-700">
                    {language === 'ko' ? '일관성 점수' : '连贯性分数'}
                  </div>
                </div>
              </div>

              {/* Overall Explanation */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center space-x-2">
                  <Lightbulb className="w-5 h-5 text-yellow-500" />
                  <span>{language === 'ko' ? '전체 평가' : '总体评价'}</span>
                </h4>
                <p className="text-gray-700 leading-relaxed bg-yellow-50 p-4 rounded-xl">
                  {feedback.explanation}
                </p>
              </div>

              {/* Corrections */}
              {feedback.corrections && feedback.corrections.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-800 mb-3">
                    {language === 'ko' ? '교정 사항' : '批改事项'}
                  </h4>
                  <div className="space-y-3">
                    {feedback.corrections.map((correction, index) => (
                      <div key={index} className="bg-red-50 border border-red-200 rounded-xl p-4">
                        <div className="flex items-start space-x-3 mb-2">
                          <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-sm font-medium">
                            {correction.original}
                          </span>
                          <span className="text-gray-400">→</span>
                          <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm font-medium">
                            {correction.corrected}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{correction.explanation}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Suggestions */}
              {feedback.suggestions && feedback.suggestions.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">
                    {language === 'ko' ? '개선 제안' : '改进建议'}
                  </h4>
                  <ul className="space-y-2">
                    {feedback.suggestions.map((suggestion, index) => (
                      <li key={index} className="flex items-start space-x-2 text-gray-700">
                        <span className="text-blue-500 mt-1">•</span>
                        <span>{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
