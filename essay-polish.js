const { useState, useEffect, useMemo } = React;

// 由于 Lucide-React 在浏览器中不易直接使用，我们用 SVG 或文本替代
const ChevronLeft = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>;
const AlertTriangle = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>;
const Clock = ({ onClick, className }) => <svg onClick={onClick} className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>;
const Copy = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>;
const Camera = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>;

const EssayPolishApp = () => {
const [translations, setTranslations] = useState(window.getTranslations ? window.getTranslations() : {});
const [currentView, setCurrentView] = useState('home'); // home, polish, history
const [polishMode, setPolishMode] = useState('full'); // full or sentence
const [essayText, setEssayText] = useState('');
const [polishedText, setPolishedText] = useState('');
const [isPolishing, setIsPolishing] = useState(false);
const [selectedSentences, setSelectedSentences] = useState([]);
const [historyRecords, setHistoryRecords] = useState([]);

const t = useMemo(() => {
    // 如果 translations 为空，提供一个默认值以避免渲染错误
    return translations || {};
}, [translations]);

// 示例作文文本
const sampleEssay = ``;

// 模拟的润色历史数据
const sampleHistory = [
{
id: 1,
originalText: "When peoples give their opinions about our dreams, it can be hard to keep going. First of all, we need to…",
polishedText: "When people offer their opinions on our dreams, it can be challenging to persevere. Firstly, we must cultivate a strong belief in ourselves…",
date: t['polish-today'] || "今天",
type: "full"
},
{
id: 2,
originalText: "When peoples give their opinions about our dreams, it can be hard to keep going. First of all, we need to…",
polishedText: "When people offer their opinions on our dreams, it can be challenging to persevere. Firstly, we must cultivate a strong belief in ourselves…",
date: t['polish-today'] || "今天",
type: "full"
},
{
id: 3,
originalText: "When peoples give their opinions about our dreams, it can be hard to keep going. First of all, we need to…",
polishedText: "When people offer their opinions on our dreams, it can be challenging to persevere.",
date: t['polish-today'] || "今天",
type: "sentence"
},
{
id: 4,
originalText: "In the complex, interconnected landscape of modern society, a paradox is emerging - loneliness is…",
polishedText: "In the complex, interconnected landscape of modern society, a paradox is emerging - loneliness…",
date: "2024-12-12",
type: "full"
},
{
id: 5,
originalText: "In the realm of learning English, many individuals diligently memorize vocabulary and practice written…",
polishedText: "In the realm of learning English, many individuals diligently memorize vocabulary…",
date: "2024-12-12",
type: "full"
},
{
id: 6,
originalText: "In fast-paced today’s world, many people’s is so focused in tangible results that they overlooked the…",
polishedText: "In today’s fast-paced world, many people are so focused on tangible results…",
date: "2024-12-11",
type: "sentence"
}
];

useEffect(() => {
setHistoryRecords(sampleHistory);

    // 将更新函数暴露给全局，以便 common.js 调用
    window.updateEssayPolishComponent = (newTranslations) => {
      setTranslations(newTranslations);
    };

}, []);

// 模拟全文润色
const handleFullPolish = async () => {
if (!essayText.trim()) return;

setIsPolishing(true);

// 模拟AI处理时间
setTimeout(() => {
  const polished = `When people offer their opinions on our dreams, it can be challenging to persevere. Firstly, we must cultivate a strong belief in ourselves. Our confidence is what empowers us to confront the criticisms of others. People may not comprehend our dreams, but their lack of understanding does not diminish their importance.

Secondly, finding individuals who share our mindset is immensely beneficial. Building relationships with friends, mentors, or others who share the same aspirations can shield us from negative remarks. They provide us with hope and sound advice, which helps us stay on course. Additionally, we should disregard detrimental criticism and heed the feedback that can help us improve.

Lastly, we must be ready to face adversity. Remaining determined and adapting when challenges arise, we demonstrate the depth of our commitment. In doing so, we not only honor our dreams but also inspire others to see the value of perseverance, even when our resolve is not universally supported.`;

  setPolishedText(polished);
  setIsPolishing(false);
  
  // 添加到历史记录
  const newRecord = {
    id: Date.now(),
    originalText: essayText.substring(0, 100) + '...',
    polishedText: polished,
    date: t['polish-today'] || '今天',
    type: 'full'
  };
  setHistoryRecords([newRecord, ...historyRecords]);
}, 2000);

};

// 模拟逐句润色
const handleSentencePolish = () => {
if (!essayText.trim()) return;

setIsPolishing(true);

setTimeout(() => {
  // 分句处理
  const sentences = [
    {
      original: "When peoples give their opinions about our dreams, it can be hard to keep going.",
      polished: "When people offer their opinions on our dreams, it can be challenging to persevere.",
      hasChange: true
    },
    {
      original: "First of all, we need to have a strong believe in ourself.",
      polished: "Firstly, we must cultivate a strong belief in ourselves.",
      hasChange: true
    },
    {
      original: "Our confidence is what make us strong to face what others say.",
      polished: "Our confidence is what empowers us to confront the criticisms of others.",
      hasChange: true
    },
    {
      original: "Peoples might not understand our dreams, but that doesn't mean they are not important.",
      polished: "People may not comprehend our dreams, but their lack of understanding does not diminish their importance.",
      hasChange: true
    },
    {
      original: "Secondly, finding people who think like us is very helpful.",
      polished: "Secondly, finding individuals who share our mindset is immensely beneficial.",
      hasChange: true
    },
    {
      original: "To make friends, mentors, or other people who want the same thing can give us some protection from bad comments.",
      polished: "Building relationships with friends, mentors, or others who share the same aspirations can shield us from negative remarks.",
      hasChange: true
    }
  ];
  
  setSelectedSentences(sentences);
  setIsPolishing(false);
  
  // 添加到历史记录
  const newRecord = {
    id: Date.now(),
    originalText: essayText.substring(0, 100) + '...',
    polishedText: sentences[0].polished,
    date: t['polish-today'] || '今天',
    type: 'sentence'
  };
  setHistoryRecords([newRecord, ...historyRecords]);
}, 2000);

};

// 1️⃣ 功能首页
if (currentView === 'home') {
return (
<div className="min-h-screen bg-gray-50">
<div className="max-w-md mx-auto">
{/* 头部 */}
<div className="bg-white p-4 flex items-center justify-between border-b shadow-sm">
<div className="w-6"></div>
<h1 className="text-xl font-bold text-gray-800">{t['polish-title']}</h1>
<Clock
onClick={() => setCurrentView('history')}
className="w-6 h-6 cursor-pointer text-gray-600 hover:text-gray-800 transition-colors"
/>
</div>

      {/* 作文润色卡片 */}
      <div className="p-6">
        <div className="bg-gradient-to-br from-yellow-100 via-yellow-50 to-orange-50 rounded-3xl p-6 shadow-lg border-2 border-yellow-200">
          {/* 图标和标题 */}
          <div className="flex items-center gap-3 mb-3">
            <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-2xl flex items-center justify-center shadow-md">
              <span className="text-white text-2xl">✨</span>
            </div>
            <div>
              <h3 className="font-bold text-xl text-gray-800">{t['polish-title']}</h3>
              <p className="text-sm text-gray-600">{t['polish-subtitle']}</p>
            </div>
          </div>

          <p className="text-gray-700 mb-6 text-sm leading-relaxed" data-lang-key="polish-feature-1">
            一键润色，让作文更生动流畅，提升表达质量
          </p>
          
          {/* 功能按钮 */}
          <div className="space-y-3">
            <button
              onClick={() => {
                setPolishMode('full');
                setCurrentView('polish');
                setEssayText(sampleEssay);
              }}
              className="w-full bg-white py-4 px-5 rounded-2xl font-bold text-base text-gray-800 hover:bg-gray-50 transition-all shadow-md hover:shadow-lg flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">📄</span>
                <span>{t['polish-btn-full']}</span>
              </div>
              <span className="text-gray-400 group-hover:text-gray-600">→</span>
            </button>
            
            <button
              onClick={() => {
                setPolishMode('sentence');
                setCurrentView('polish');
                setEssayText(sampleEssay);
              }}
              className="w-full bg-white py-4 px-5 rounded-2xl font-bold text-base text-gray-800 hover:bg-gray-50 transition-all shadow-md hover:shadow-lg flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">📝</span>
                <span>{t['polish-btn-sentence']}</span>
              </div>
              <span className="text-gray-400 group-hover:text-gray-600">→</span>
            </button>
          </div>
        </div>

        {/* 功能说明 */}
        <div className="mt-6 bg-white rounded-2xl p-5 shadow-sm">
          <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
            <span>💡</span>
            <span>{t['polish-features-title']}</span>
          </h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-yellow-500 mt-0.5">•</span>
              <span>{t['polish-feature-1']}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-500 mt-0.5">•</span>
              <span>{t['polish-feature-2']}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-500 mt-0.5">•</span>
              <span>{t['polish-feature-3']}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

}

// 2️⃣ & 3️⃣ 润色页面
if (currentView === 'polish') {
return (
<div className="min-h-screen bg-yellow-50">
<div className="max-w-md mx-auto">
{/* 头部 */}
<div className="bg-white p-4 flex items-center justify-between border-b shadow-sm">
<ChevronLeft
onClick={() => setCurrentView('home')}
className="w-6 h-6 cursor-pointer hover:text-gray-600"
/>
<h1 className="text-xl font-bold">{t['polish-title']}</h1>
<AlertTriangle className="w-6 h-6 text-gray-400" />
</div>

      {/* 模式切换 */}
      {!polishedText && !selectedSentences.length && (
        <div className="bg-white border-b flex shadow-sm">
          <button
            onClick={() => setPolishMode('full')}
            className={`flex-1 py-4 text-center font-bold transition-all ${
              polishMode === 'full'
                ? 'text-yellow-600 border-b-3 border-yellow-600 bg-yellow-50'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            {t['polish-btn-full']}
          </button>
          <button
            onClick={() => setPolishMode('sentence')}
            className={`flex-1 py-4 text-center font-bold transition-all ${
              polishMode === 'sentence'
                ? 'text-yellow-600 border-b-3 border-yellow-600 bg-yellow-50'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            {t['polish-btn-sentence']}
          </button>
        </div>
      )}

      {/* 输入区域 */}
      {!polishedText && !selectedSentences.length && (
        <div className="p-4">
          <textarea
            value={essayText}
            onChange={(e) => setEssayText(e.target.value)}            placeholder={t['polish-placeholder']}
            className="w-full h-96 p-5 border-2 border-yellow-200 rounded-2xl focus:outline-none focus:border-yellow-400 resize-none text-base leading-relaxed bg-white shadow-sm"
          />
          
          <div className="flex gap-3 mt-4">
            <button 
              onClick={() => {
                if (essayText.trim()) {
                  if (window.confirm(t['polish-confirm-clear'] || '确定要清空所有内容吗？')) {
                    setEssayText('');
                  }
                } else {
                  setEssayText('');
                }
              }}
              className="flex items-center gap-2 px-5 py-3 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-colors shadow-sm hover:border-gray-400"
            >
              <span>🗑️</span>
              <span className="text-sm font-medium">{t['polish-clear']}</span>
            </button>
            <button 
              onClick={() => {
                // 模拟拍照功能
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.capture = 'environment';
                input.onchange = (e) => {
                  const file = e.target.files[0];
                  if (file) {
                    // 模拟OCR识别
                    alert(t['polish-ocr-ing'] || '正在识别图片中的文字...');
                    setTimeout(() => {
                      const sampleRecognizedText = `When peoples give their opinions about our dreams, it can be hard to keep going. First of all, we need to have a strong believe in ourself. Our confidence is what make us strong to face what others say.`;
                      setEssayText(sampleRecognizedText);
                      alert(t['polish-ocr-done'] || '✅ 识别完成！已将文字填入编辑框');
                    }, 1500);
                  }
                };
                input.click();
              }}
              className="flex items-center gap-2 px-5 py-3 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-colors shadow-sm hover:border-gray-400"
            >
              <Camera className="w-4 h-4" />
              <span className="text-sm font-medium">{t['polish-camera']}</span>
            </button>
          </div>

          <button
            onClick={polishMode === 'full' ? handleFullPolish : handleSentencePolish}
            disabled={!essayText.trim() || isPolishing}
            className={`w-full mt-6 py-5 rounded-2xl font-bold text-lg transition-all shadow-lg ${
              !essayText.trim() || isPolishing
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white hover:from-yellow-500 hover:to-orange-500 hover:shadow-xl transform hover:scale-[1.02]'
            }`}
          >
            {isPolishing ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin">⏳</span>
                {t['polish-polishing']}
              </span>
            ) : (
              polishMode === 'full' ? t['polish-start-full'] : t['polish-start-sentence']
            )}
          </button>
        </div>
      )}

      {/* 2️⃣ 全文润色结果 */}
      {polishedText && polishMode === 'full' && (
        <div className="p-4">
          <div className="bg-white rounded-2xl p-5 shadow-md mb-4">
            <div className="flex gap-2 mb-4 border-b pb-3">
              <button className="px-5 py-2 bg-yellow-100 text-yellow-700 rounded-xl font-bold text-sm shadow-sm">
                {t['polish-btn-full']}
              </button>
              <button className="px-5 py-2 text-gray-500 rounded-xl font-medium text-sm">
                {t['polish-btn-sentence']}
              </button>
            </div>
            
            <div className="mb-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                  <span>✨</span>
                  <span>{t['polish-result-title']}</span>
                </h3>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(polishedText);
                    alert(t['polish-copied'] || '已复制到剪贴板！');
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <Copy className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-600">复制</span>
                </button>
              </div>
              <div className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border-2 border-blue-200">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {polishedText}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              setPolishedText('');
              setEssayText('');
            }}
            className="w-full py-4 bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
          >
            {t['polish-re-polish']}
          </button>
        </div>
      )}

      {/* 3️⃣ 逐句润色结果 */}
      {selectedSentences.length > 0 && polishMode === 'sentence' && (
        <div className="p-4">
          <div className="bg-white rounded-2xl p-5 shadow-md mb-4">
            <div className="flex gap-2 mb-4 border-b pb-3">
              <button className="px-5 py-2 text-gray-500 rounded-xl font-medium text-sm">
                {t['polish-btn-full']}
              </button>
              <button className="px-5 py-2 bg-yellow-100 text-yellow-700 rounded-xl font-bold text-sm shadow-sm">
                {t['polish-btn-sentence']}
              </button>
            </div>
            
            <div className="space-y-5 mb-5">
              {selectedSentences.map((item, idx) => (
                <div key={idx} className="space-y-3">
                  {item.hasChange && (
                    <>
                      {/* 原文 - 橙色框 */}
                      <div className="bg-orange-50 p-4 rounded-xl border-l-4 border-orange-400 shadow-sm">
                        <p className="text-xs text-orange-600 font-bold mb-2 flex items-center gap-1">
                          <span>📄</span>
                          <span>{t['polish-original']}</span>
                        </p>
                        <p className="text-gray-800 leading-relaxed">{item.original}</p>
                      </div>
                      
                      {/* 润色后 - 蓝色框 */}
                      <div className="bg-blue-50 p-4 rounded-xl border-l-4 border-blue-400 shadow-sm">
                        <p className="text-xs text-blue-600 font-bold mb-2 flex items-center gap-1">
                          <span>✨</span>
                          <span>{t['polish-result-title']}</span>
                        </p>
                        <p className="text-gray-800 leading-relaxed">{item.polished}</p>
                      </div>
                    </>
                  )}
                  {!item.hasChange && (
                    <div className="p-4 rounded-xl bg-green-50 border-l-4 border-green-400 shadow-sm">
                      <p className="text-gray-700 leading-relaxed flex items-center gap-2">
                        <span className="text-green-500">✨</span>
                        <span>{item.original}</span>
                      </p>
                      <p className="text-xs text-green-600 mt-2">{t['polish-no-change']}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors shadow-sm">
                {t['polish-export']}
              </button>
              <button className="flex-1 py-3 bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all">
                {t['polish-apply']}
              </button>
            </div>
          </div>

          <button
            onClick={() => {
              setSelectedSentences([]);
              setEssayText('');
            }}
            className="w-full py-4 bg-white border-2 border-yellow-400 text-yellow-600 rounded-xl font-bold hover:bg-yellow-50 transition-colors shadow-sm"
          >
            {t['polish-re-polish']}
          </button>
        </div>
      )}
    </div>
  </div>
);

}

// 4️⃣ 历史记录页面
if (currentView === 'history') {
return (
<div className="min-h-screen bg-gray-50">
<div className="max-w-md mx-auto">
{/* 头部 */}
<div className="bg-white p-4 flex items-center justify-between border-b shadow-sm">
<ChevronLeft
onClick={() => setCurrentView('home')}
className="w-6 h-6 cursor-pointer hover:text-gray-600"
/>
<h1 className="text-xl font-bold">{t['polish-history-title']}</h1>
<div className="w-6" />
</div>

      {/* 历史记录列表 */}
      <div className="p-4 space-y-3">
        {historyRecords.map((record) => (
          <div
            key={record.id}
            className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer border border-gray-100"
          >
            {/* 标签和日期 */}
            <div className="flex items-center justify-between mb-3">
              <span className={`px-4 py-1.5 rounded-full text-xs font-bold shadow-sm ${
                record.type === 'full' 
                  ? 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                  : 'bg-blue-100 text-blue-700 border border-blue-200'
              }`}>
                {record.type === 'full' ? `📄 ${t['polish-btn-full']}` : `📝 ${t['polish-btn-sentence']}`}
              </span>
              <span className="text-xs text-gray-500 font-medium">{record.date}</span>
            </div>
            
            {/* 原文预览 */}
            <div className="mb-3">
              <p className="text-xs text-gray-500 mb-1 font-medium">{t['polish-original']}:</p>
              <p className="text-sm text-gray-700 line-clamp-2 leading-relaxed">
                {record.originalText}
              </p>
            </div>
            
            {/* 润色结果预览 */}
            {record.polishedText && (
              <div className="pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-500 mb-1 font-medium flex items-center gap-1">
                  <span>✨</span>
                  <span>{t['polish-result-title']}:</span>
                </p>
                <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed bg-gradient-to-r from-blue-50 to-purple-50 p-2 rounded-lg">
                  {record.polishedText.substring(0, 80)}...
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 空状态 */}
      {historyRecords.length === 0 && (
        <div className="flex flex-col items-center justify-center h-96">
          <div className="text-7xl mb-4">📝</div>
          <p className="text-gray-500 font-medium mb-2">{t['polish-no-history'] || '还没有历史记录'}</p>
          <p className="text-sm text-gray-400">{t['polish-no-history-prompt'] || '开始使用润色功能吧！'}</p>
          <button
            onClick={() => setCurrentView('home')}
            className="mt-6 px-6 py-3 bg-yellow-400 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
          >
            {t['polish-start-polishing'] || '开始润色'}
          </button>
        </div>
      )}
    </div>
  </div>
);

}

return null;
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<EssayPolishApp />);