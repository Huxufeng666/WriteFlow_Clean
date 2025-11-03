const { useState, useEffect } = React;

const WriteFlowSplash = () => {
    const [showContent, setShowContent] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setShowContent(true), 100);
        return () => clearTimeout(timer);
    }, []);

    const handleStart = () => {
        // 跳转到主页
        window.location.href = '/index.html';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-400 to-purple-500 flex items-center justify-center p-6 overflow-hidden relative">
            {/* 动画背景装饰 */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full animate-float" />
                <div className="absolute top-40 right-20 w-32 h-32 bg-white/10 rounded-full animate-float-delay-1" />
                <div className="absolute bottom-32 left-1/4 w-24 h-24 bg-white/10 rounded-full animate-float-delay-2" />
                <div className="absolute bottom-20 right-1/3 w-16 h-16 bg-white/10 rounded-full animate-float-delay-3" />
            </div>

            {/* 主卡片 */}
            <div className={`relative w-full max-w-md bg-white rounded-[32px] shadow-2xl p-10 transition-all duration-700 ${
                showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
                
                {/* Logo 图标 */}
                <div className="flex justify-center mb-8">
                    <div className="relative">
                        {/* 主圆形图标 */}
                        <div className="w-40 h-40 rounded-full bg-gradient-to-br from-pink-400 via-purple-400 to-purple-500 flex items-center justify-center shadow-2xl animate-float-icon">
                            {/* 铅笔图标 */}
                            <svg width="80" height="80" viewBox="0 0 80 80" fill="none" className="animate-wiggle-icon">
                                <path 
                                    d="M20 50 L20 25 L25 20 L35 20 L40 25 L40 50 L30 58 L20 50 Z" 
                                    fill="white" 
                                    opacity="0.9"
                                />
                                <path 
                                    d="M28 58 L30 62 L32 58 Z" 
                                    fill="white" 
                                    opacity="0.95"
                                />
                                <line 
                                    x1="40" 
                                    y1="35" 
                                    x2="55" 
                                    y2="35" 
                                    stroke="white" 
                                    strokeWidth="4" 
                                    strokeLinecap="round"
                                    opacity="0.9"
                                />
                            </svg>
                        </div>
                        
                        {/* 光晕效果 */}
                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 animate-pulse-slow opacity-20 blur-xl" />
                    </div>
                </div>

                {/* 应用名称 */}
                <h1 className="text-center text-5xl font-bold mb-4" style={{
                    background: 'linear-gradient(135deg, #EC4899 0%, #A855F7 50%, #8B5CF6 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                }}>
                    WriteFlow
                </h1>

                {/* 시작 文字和图标 */}
                <div className="text-center mb-3">
                    <div className="flex items-center justify-center gap-2">
                        <span className="text-2xl text-gray-700 font-medium">시작</span>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="animate-wiggle">
                            <path 
                                d="M15.5 5L18 9.5L23 10L19 14.5L20 20L15.5 17L11 20L12 14.5L8 10L13 9.5L15.5 5Z" 
                                fill="url(#paint0_linear)" 
                                stroke="#A855F7" 
                                strokeWidth="1.5"
                            />
                            <defs>
                                <linearGradient id="paint0_linear" x1="8" y1="5" x2="23" y2="20" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#EC4899"/>
                                    <stop offset="1" stopColor="#A855F7"/>
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>
                </div>

                {/* 副标题 */}
                <p className="text-center text-gray-600 text-base mb-8">
                    (AI 유창한 글쓰기를 완성하다)  
                </p>

                {/* 开始按钮 */}
                <button
                    onClick={handleStart}
                    className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-purple-600 text-white py-4 rounded-2xl font-bold text-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 mb-6 relative overflow-hidden group"
                >
                    <span className="relative z-10">시작하기</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>

                {/* 免费提示 */}
                <div className="flex items-center justify-center gap-2 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                    <span className="text-2xl animate-bounce-gentle">🎉</span>
                    <p className="text-sm text-gray-700 font-medium">
                        완전 무료! 로그인 없이 바로 시작하세요
                    </p>
                </div>

                {/* 特色功能 */}
                <div className="mt-6 space-y-3">
                    <div className="flex items-center gap-3 text-gray-600 text-sm">
                        <div className="w-10 h-10 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-lg">✍️</span>
                        </div>
                        <span>AI 기반 글쓰기 도우미</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600 text-sm">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-lg">🚀</span>
                        </div>
                        <span>즉시 사용 가능한 편리함</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600 text-sm">
                        <div className="w-10 h-10 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-lg">💝</span>
                        </div>
                        <span>영원히 무료</span>
                    </div>
                </div>

                {/* 底部装饰 */}
                <div className="absolute -top-6 -right-6 w-32 h-32 bg-gradient-to-br from-pink-300 to-purple-400 rounded-full opacity-15 blur-3xl" />
                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-300 rounded-full opacity-15 blur-3xl" />
            </div>
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<WriteFlowSplash />);