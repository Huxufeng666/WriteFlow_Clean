import { createContext, useContext, useState, ReactNode } from 'react'

type Language = 'ko' | 'zh' | 'ja' | 'en'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const translations = {
  ko: {
    'app.title': 'WriteFlow - AI 영어 작문 코치',
    'nav.home': '홈',
    'nav.writing': '작문 연습',
    'nav.progress': '진도 추적',
    'nav.showcase': '우수 작문',
    'nav.login': '로그인',
    'nav.logout': '로그아웃',
    'nav.register': '회원가입',
    'writing.title': '영어 작문 연습',
    'writing.prompt': '작문 주제',
    'writing.input': '여기에 영어로 작문해보세요...',
    'writing.correct': 'AI 교정',
    'writing.feedback': '피드백',
    'writing.score': '점수',
    'progress.title': '학습 진도',
    'showcase.title': '우수 작문 갤러리',
    'login.title': '로그인',
    'login.email': '이메일',
    'login.password': '비밀번호',
    'login.submit': '로그인',
    'register.title': '회원가입',
    'register.name': '이름',
    'register.native_lang': '모국어',
    'register.target_exam': '목표 시험 (선택사항)',
  },
  zh: {
    'app.title': 'WriteFlow - AI英语写作教练',
    'nav.home': '首页',
    'nav.writing': '写作练习',
    'nav.progress': '进度追踪',
    'nav.showcase': '优秀作文',
    'nav.login': '登录',
    'nav.logout': '登出',
    'nav.register': '注册',
    'writing.title': '英语写作练习',
    'writing.prompt': '写作主题',
    'writing.input': '请在这里用英语写作...',
    'writing.correct': 'AI批改',
    'writing.feedback': '反馈',
    'writing.score': '分数',
    'progress.title': '学习进度',
    'showcase.title': '优秀作文画廊',
    'login.title': '登录',
    'login.email': '邮箱',
    'login.password': '密码',
    'login.submit': '登录',
    'register.title': '注册',
    'register.name': '姓名',
    'register.native_lang': '母语',
    'register.target_exam': '目标考试（可选）',
  },
  ja: {
    'app.title': 'WriteFlow - AI英語ライティングコーチ',
    'nav.home': 'ホーム',
    'nav.writing': 'ライティング練習',
    'nav.progress': '進捗追跡',
    'nav.showcase': '優秀作品',
    'nav.login': 'ログイン',
    'nav.logout': 'ログアウト',
    'nav.register': '新規登録',
    'writing.title': '英語ライティング練習',
    'writing.prompt': 'ライティングテーマ',
    'writing.input': 'ここに英語で書いてみてください...',
    'writing.correct': 'AI添削',
    'writing.feedback': 'フィードバック',
    'writing.score': 'スコア',
    'progress.title': '学習進捗',
    'showcase.title': '優秀作品ギャラリー',
    'login.title': 'ログイン',
    'login.email': 'メールアドレス',
    'login.password': 'パスワード',
    'login.submit': 'ログイン',
    'register.title': '新規登録',
    'register.name': '名前',
    'register.native_lang': '母語',
    'register.target_exam': '目標試験（任意）',
  },
  en: {
    'app.title': 'WriteFlow - AI English Writing Coach',
    'nav.home': 'Home',
    'nav.writing': 'Writing Practice',
    'nav.progress': 'Progress',
    'nav.showcase': 'Showcase',
    'nav.login': 'Login',
    'nav.logout': 'Logout',
    'nav.register': 'Register',
    'writing.title': 'English Writing Practice',
    'writing.prompt': 'Writing Prompt',
    'writing.input': 'Write your essay in English here...',
    'writing.correct': 'AI Correction',
    'writing.feedback': 'Feedback',
    'writing.score': 'Score',
    'progress.title': 'Learning Progress',
    'showcase.title': 'Excellent Essays Gallery',
    'login.title': 'Login',
    'login.email': 'Email',
    'login.password': 'Password',
    'login.submit': 'Login',
    'register.title': 'Register',
    'register.name': 'Name',
    'register.native_lang': 'Native Language',
    'register.target_exam': 'Target Exam (Optional)',
  }
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('ko')

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

