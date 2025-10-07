export interface User {
  _id: string
  name: string
  email: string
  nativeLanguage: string
  targetExam?: string
  level: 'beginner' | 'intermediate' | 'advanced'
  createdAt: string
}

export interface WritingPrompt {
  _id: string
  title: string
  description: string
  category: 'general' | 'academic' | 'business' | 'creative'
  difficulty: 'easy' | 'medium' | 'hard'
  targetExam?: string
  wordCount: {
    min: number
    max: number
  }
  timeLimit?: number // in minutes
}

export interface WritingSubmission {
  _id: string
  userId: string
  promptId: string
  content: string
  wordCount: number
  submittedAt: string
  feedback?: WritingFeedback
  score?: number
}

export interface WritingFeedback {
  overallScore: number // 0-100
  grammarScore: number
  vocabularyScore: number
  coherenceScore: number
  taskCompletionScore: number
  corrections: Correction[]
  suggestions: string[]
  strengths: string[]
  improvements: string[]
  explanation: string // in user's native language
}

export interface Correction {
  originalText: string
  correctedText: string
  explanation: string
  type: 'grammar' | 'vocabulary' | 'spelling' | 'punctuation' | 'style'
  position: {
    start: number
    end: number
  }
}

export interface ProgressData {
  totalSubmissions: number
  averageScore: number
  grammarTrend: number[]
  vocabularyTrend: number[]
  coherenceTrend: number[]
  wordCountTrend: number[]
  recentSubmissions: WritingSubmission[]
  strengths: string[]
  weaknesses: string[]
  levelProgress: number // percentage to next level
}

export interface ShowcaseEssay {
  _id: string
  title: string
  content: string
  score: number
  feedback: WritingFeedback
  category: string
  difficulty: string
  submittedAt: string
  isAnonymous: boolean
  authorLevel?: string
}

