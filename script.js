document.addEventListener('DOMContentLoaded', () => {
    const settingsBtn = document.getElementById('settings-btn');
    const modal = document.getElementById('settings-modal');
    const closeBtn = document.querySelector('.close-btn');
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const btnZh = document.getElementById('btn-zh');
    const btnKo = document.getElementById('btn-ko');
    const historyBtn = document.getElementById('history-btn');
    const historySidebar = document.getElementById('history-sidebar');
    const closeSidebarBtn = document.getElementById('close-sidebar-btn');
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    const historyList = document.getElementById('history-list');
    const clearHistoryBtn = document.getElementById('clear-history-btn');

    let currentLanguage = 'zh';

    const translations = {
        zh: {
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
            'settings-title': '设置',
            'setting-dark-mode': '护眼模式',
            'setting-clear-history': '清空历史记录',
            'clear-history-btn': '清空',
            'history-title': '历史记录',
        },
        ko: {
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
            'settings-title': '설정',
            'setting-dark-mode': '눈 보호 모드',
            'setting-clear-history': '기록 지우기',
            'clear-history-btn': '지우기',
            'history-title': '방문 기록',
        }
    };

    function setLanguage(lang) {
        currentLanguage = lang;
        btnZh.classList.toggle('active', lang === 'zh');
        btnKo.classList.toggle('active', lang === 'ko');

        const t = translations[lang];
        Object.keys(t).forEach(key => {
            const element = document.getElementById(key);
            if (element) {
                element.textContent = t[key];
            }
        });
    }

    // 打开设置模态框
    settingsBtn.addEventListener('click', () => {
        modal.style.display = 'flex';
    });

    // 关闭设置模态框
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // 点击模态框外部关闭
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // 护眼模式切换
    darkModeToggle.addEventListener('change', () => {
        document.body.classList.toggle('dark-mode');
    });

    // 语言切换事件
    btnZh.addEventListener('click', () => setLanguage('zh'));
    btnKo.addEventListener('click', () => setLanguage('ko'));

    // --- 历史记录功能 ---

    function getHistory() {
        return JSON.parse(localStorage.getItem('pageHistory') || '[]');
    }

    function saveHistory(history) {
        localStorage.setItem('pageHistory', JSON.stringify(history));
    }

    function addHistoryItem(title, url) {
        let history = getHistory();
        // 避免连续添加重复项
        if (history.length > 0 && history[0].url === url) {
            return;
        }
        history.unshift({ title, url, timestamp: new Date().toISOString() });
        // 最多保存20条记录
        if (history.length > 20) {
            history.pop();
        }
        saveHistory(history);
    }

    function renderHistory() {
        const history = getHistory();
        historyList.innerHTML = ''; // 清空列表
        if (history.length === 0) {
            historyList.innerHTML = `<li style="padding: 20px; text-align: center; color: #888;">暂无历史记录</li>`;
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

    // 监听所有卡片链接的点击
    document.querySelectorAll('.card-link').forEach(link => {
        link.addEventListener('click', () => {
            const title = link.querySelector('h2').textContent;
            const url = link.getAttribute('href');
            addHistoryItem(title, url);
        });
    });

    historyBtn.addEventListener('click', () => {
        renderHistory();
        historySidebar.classList.add('active');
        sidebarOverlay.style.display = 'block';
    });

    const closeSidebar = () => {
        historySidebar.classList.remove('active');
        sidebarOverlay.style.display = 'none';
    };

    closeSidebarBtn.addEventListener('click', closeSidebar);
    sidebarOverlay.addEventListener('click', closeSidebar);

    clearHistoryBtn.addEventListener('click', () => {
        saveHistory([]);
        renderHistory(); // 在侧边栏打开时立即更新视图
        alert('历史记录已清空');
    });

    // 初始化页面语言
    setLanguage('zh');

});