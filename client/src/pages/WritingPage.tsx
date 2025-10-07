import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'
import { WritingPrompt, WritingFeedback } from '../types'
import { Send, Clock, BookOpen, Target, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'

export default function WritingPage() {
  const { user } = useAuth()
  const { t } = useLanguage()
  const [currentPrompt, setCurrentPrompt] = useState<WritingPrompt | null>(null)
  const [writingContent, setWritingContent] = useState('')
  const [isCorrecting, setIsCorrecting] = useState(false)
  const [feedback, setFeedback] = useState<WritingFeedback | null>(null)
  const [timeLeft, setTimeLeft] = useState<number | null>(null)
  const [isTimerActive, setIsTimerActive] = useState(false)

  // Load a new writing prompt
  const loadNewPrompt = async () => {
    try {
      const response = await fetch('/api/writing/prompts/random', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      
      if (response.ok) {
        const prompt = await response.json()
        setCurrentPrompt(prompt)
        setWritingContent('')
        setFeedback(null)
        setTimeLeft(prompt.timeLimit ? prompt.timeLimit * 60 : null)
        setIsTimerActive(false)
      }
    } catch (error) {
      toast.error('프롬프트를 불러오는데 실패했습니다.')
    }
  }

  // Start timer when user starts writing
  const startTimer = () => {
    if (timeLeft && !isTimerActive) {
      setIsTimerActive(true)
    }
  }

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isTimerActive && timeLeft && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => (timeLeft || 0) - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      setIsTimerActive(false)
      toast.error('시간이 종료되었습니다!')
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isTimerActive, timeLeft])

  // Format time display
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  // Submit writing for AI correction
  const submitForCorrection = async () => {
    if (!writingContent.trim()) {
      toast.error('작문 내용을 입력해주세요.')
      return
    }

    setIsCorrecting(true)
    try {
      const response = await fetch('/api/writing/correct', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          content: writingContent,
          promptId: currentPrompt?._id,
          nativeLanguage: user?.nativeLanguage || 'ko'
        })
      })

      if (response.ok) {
        const feedbackData = await response.json()
        setFeedback(feedbackData)
        setIsTimerActive(false)
        toast.success('AI 교정이 완료되었습니다!')
      } else {
        throw new Error('교정 요청에 실패했습니다.')
      }
    } catch (error) {
      toast.error('AI 교정 중 오류가 발생했습니다.')
    } finally {
      setIsCorrecting(false)
    }
  }

  // Load initial prompt
  useEffect(() => {
    if (user) {
      loadNewPrompt()
    }
  }, [user])

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="card text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{t('writing.title')}</h1>
          <p className="text-gray-600 mb-6">작문 연습을 시작하려면 로그인해주세요.</p>
          <div className="flex justify-center space-x-4">
            <a href="/login" className="btn-primary">로그인</a>
            <a href="/register" className="btn-secondary">회원가입</a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Writing Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Prompt Card */}
          {currentPrompt && (
            <div className="card">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-5 h-5 text-primary-600" />
                  <h2 className="text-lg font-semibold text-gray-900">{t('writing.prompt')}</h2>
                </div>
                <button
                  onClick={loadNewPrompt}
                  className="flex items-center space-x-1 text-primary-600 hover:text-primary-700 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span className="text-sm">새 문제</span>
                </button>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-900">{currentPrompt.title}</h3>
                <p className="text-gray-700 leading-relaxed">{currentPrompt.description}</p>
                
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Target className="w-4 h-4" />
                    <span>{currentPrompt.category}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span>{currentPrompt.difficulty}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span>{currentPrompt.wordCount.min}-{currentPrompt.wordCount.max} words</span>
                  </div>
                  {currentPrompt.timeLimit && (
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{currentPrompt.timeLimit}분</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Writing Editor */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">작문 작성</h3>
              {timeLeft !== null && (
                <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${
                  timeLeft < 300 ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  <Clock className="w-4 h-4" />
                  <span>{formatTime(timeLeft)}</span>
                </div>
              )}
            </div>
            
            <textarea
              value={writingContent}
              onChange={(e) => {
                setWritingContent(e.target.value)
                if (!isTimerActive) startTimer()
              }}
              placeholder={t('writing.input')}
              className="textarea-field h-96"
              disabled={isCorrecting}
            />
            
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-600">
                단어 수: {writingContent.trim().split(/\s+/).filter(word => word.length > 0).length}
              </div>
              <button
                onClick={submitForCorrection}
                disabled={isCorrecting || !writingContent.trim()}
                className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
                <span>{isCorrecting ? '교정 중...' : t('writing.correct')}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Feedback Panel */}
        <div className="space-y-6">
          {feedback && (
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('writing.feedback')}</h3>
              
              {/* Overall Score */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">전체 점수</span>
                  <span className="text-2xl font-bold text-primary-600">{feedback.overallScore}/100</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${feedback.overallScore}%` }}
                  ></div>
                </div>
              </div>

              {/* Detailed Scores */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">문법</span>
                  <span className="text-sm font-medium">{feedback.grammarScore}/100</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">어휘</span>
                  <span className="text-sm font-medium">{feedback.vocabularyScore}/100</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">일관성</span>
                  <span className="text-sm font-medium">{feedback.coherenceScore}/100</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">과제 완성도</span>
                  <span className="text-sm font-medium">{feedback.taskCompletionScore}/100</span>
                </div>
              </div>

              {/* Explanation */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-900 mb-2">상세 피드백</h4>
                <p className="text-sm text-gray-700 leading-relaxed">{feedback.explanation}</p>
              </div>

              {/* Corrections */}
              {feedback.corrections.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">교정 사항</h4>
                  <div className="space-y-3">
                    {feedback.corrections.map((correction, index) => (
                      <div key={index} className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                        <div className="flex items-start space-x-2 mb-2">
                          <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                            {correction.originalText}
                          </span>
                          <span className="text-xs text-gray-500">→</span>
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                            {correction.correctedText}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600">{correction.explanation}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Suggestions */}
              {feedback.suggestions.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">개선 제안</h4>
                  <ul className="space-y-2">
                    {feedback.suggestions.map((suggestion, index) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start space-x-2">
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

