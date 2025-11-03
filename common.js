document.addEventListener('DOMContentLoaded', () => {
    // --- 全局通用组件 ---
    const settingsBtn = document.getElementById('settings-btn');
    const modal = document.getElementById('settings-modal');
    const closeBtn = document.querySelector('.modal .close-btn');
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const btnZh = document.getElementById('btn-zh');
    const btnKo = document.getElementById('btn-ko');
    const historyBtn = document.getElementById('history-btn');
    const historySidebar = document.getElementById('history-sidebar');
    const closeSidebarBtn = document.getElementById('close-sidebar-btn');
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    const historyList = document.getElementById('history-list');
    const clearHistoryBtn = document.getElementById('clear-history-btn');

    // --- 语言和翻译 ---
    let currentLanguage = 'zh';

    const translations = {
        zh: {
            // --- index.html specific ---
            'target-high-school': '高中生',
            'target-university': '大学生',
            'target-professional': '职场人士',
            'app-title': '英语作文通',
            'card-title-ai-writing': 'AI 写作',
            'card-desc-ai-writing': '输入主题，AI为你生成范文',
            'card-title-assistant': '写作助手',
            'card-desc-assistant': 'AI 助你轻松写作 — 造句，写邮件',
            'card-title-correction': '写作批改',
            'card-desc-correction': '上传作文，获取专业批改建议',
            'card-title-daily-quote': '每日金句',
            'card-desc-daily-quote': '每天一句，积累写作素材',
            // --- Common ---
            'settings-title': '设置',
            'setting-dark-mode': '护眼模式',
            'setting-clear-history': '清空历史记录',
            'clear-history-btn': '清空',
            'history-title': '历史记录',
            'history-empty': '暂无历史记录',
            'history-cleared-alert': '历史记录已清空',
        },
        ko: {
            // --- index.html specific ---
            'target-high-school': '고등학생',
            'target-university': '대학생',
            'target-professional': '직장인',
            'app-title': '영어 작문 도우미',
            'card-title-ai-writing': 'AI 작문',
            'card-desc-ai-writing': '주제를 입력하면 AI가 예문을 생성합니다',
            'card-title-assistant': '작문 도우미',
            'card-desc-assistant': 'AI가 문장 만들기, 이메일 작성을 도와줍니다',
            'card-title-correction': '작문 교정',
            'card-desc-correction': '작문을 업로드하여 전문적인 교정 받기',
            'card-title-daily-quote': '오늘의 명언',
            'card-desc-daily-quote': '매일 한 문장으로 작문 소재 쌓기',
            // --- Common ---
            'settings-title': '설정',
            'setting-dark-mode': '눈 보호 모드',
            'setting-clear-history': '기록 지우기',
            'clear-history-btn': '지우기',
            'history-title': '방문 기록',
            'history-empty': '기록이 없습니다',
            'history-cleared-alert': '기록이 모두 삭제되었습니다',
        }
    };

    function setLanguage(lang) {
        currentLanguage = lang;
        localStorage.setItem('writeflow_language', lang);

        // 更新通用语言切换按钮状态
        if (btnZh && btnKo) {
            btnZh.classList.toggle('active', lang === 'zh');
            btnKo.classList.toggle('active', lang === 'ko');
        }

        // 更新所有带 data-lang-key 的元素
        document.querySelectorAll('[data-lang-key]').forEach(element => {
            const key = element.getAttribute('data-lang-key');
            if (translations[lang][key]) {
                element.textContent = translations[lang][key];
            }
        });

        // 更新所有用 id 作为 key 的元素 (旧方法兼容)
        Object.keys(translations[lang]).forEach(key => {
            const element = document.getElementById(key);
            if (element) {
                element.textContent = translations[lang][key];
            }
        });
    }

    // --- 历史记录功能 ---
    function getHistory() {
        return JSON.parse(localStorage.getItem('pageHistory') || '[]');
    }

    function saveHistory(history) {
        localStorage.setItem('pageHistory', JSON.stringify(history));
    }

    function renderHistory() {
        if (!historyList) return;
        const history = getHistory();
        historyList.innerHTML = '';
        if (history.length === 0) {
            historyList.innerHTML = `<li style="padding: 20px; text-align: center; color: #888;">${translations[currentLanguage]['history-empty']}</li>`;
            return;
        }
        history.forEach(item => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = item.url;
            a.textContent = item.title;
            li.appendChild(a);
            historyList.appendChild(li);
        });
    }

    // --- 事件绑定 ---
    if (btnZh) btnZh.addEventListener('click', () => setLanguage('zh'));
    if (btnKo) btnKo.addEventListener('click', () => setLanguage('ko'));

    if (historyBtn) {
        historyBtn.addEventListener('click', () => {
            renderHistory();
            if (historySidebar) historySidebar.classList.add('active');
            if (sidebarOverlay) sidebarOverlay.style.display = 'block';
        });
    }
    // ... 其他通用事件绑定，如 modal, sidebar close 等

    // --- 初始化 ---
    const savedLanguage = localStorage.getItem('writeflow_language') || 'zh';
    setLanguage(savedLanguage);
});