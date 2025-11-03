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
            'card-title-assistant': '写作助手',
            'card-desc-assistant': 'AI 助你轻松写作 — 造句，写邮件',
            'card-title-correction': '写作批改',
            'card-desc-correction': '上传作文，获取专业批改建议',
            'card-title-daily-quote': '每日金句',
            'card-desc-daily-quote': '每天一句，积累写作素材',
            'card-title-polish': '作文润色',
            'card-desc-polish': 'AI让你的文章更加流畅',
            'page-title-polish': '作文润色 - 英语作文通',
            // --- email-mentor.html (new template) ---
            'page-title-mentor': '邮件写作导师 - 英语作文通',
            'mentor-header-title': '邮件写作导师 📧',
            'mentor-header-subtitle': '一站式解决职场和学术邮件难题',
            'mentor-panel-title': '写作参数',
            'mentor-label-function': '选择功能',
            'mentor-option-generate': '生成新草稿 (Generate)',
            'mentor-option-analyze': '分析和建议 (Analyze)',
            'mentor-option-refine': '润色和重写 (Refine)',
            'mentor-label-recipient': '收件人/情境',
            'mentor-recipient-professor': '教授/导师 (Professor/Mentor)',
            'mentor-recipient-manager': '经理/老板 (Manager/Boss)',
            'mentor-recipient-client': '客户/外部合作方 (Client/Partner)',
            'mentor-recipient-colleague': '同事/同学 (Colleague/Classmate)',
            'mentor-recipient-job': '求职申请 (Job Application)',
            'mentor-recipient-request': '投诉/正式请求 (Complaint/Request)',
            'mentor-label-tone': '期望语气',
            'mentor-tone-formal': '正式、专业 (Formal, Professional)',
            'mentor-tone-casual': '非正式、轻松 (Casual, Friendly)',
            'mentor-tone-persuasive': '说服性、有条理 (Persuasive, Organized)',
            'mentor-tone-concise': '简洁、直接 (Concise, Direct)',
            'mentor-tone-apologetic': '致歉、诚恳 (Apologetic, Sincere)',
            'mentor-label-intent': '邮件意图（说明你的目的）',
            'mentor-placeholder-intent': '例如：请求教授延长毕业论文提交期限，并说明原因。',
            'mentor-label-draft': '粘贴您的邮件草稿',
            'mentor-placeholder-draft': '粘贴完整的邮件内容，包括主题和正文...',
            'mentor-label-refine-prompt': '润色要求（可选）',
            'mentor-placeholder-refine-prompt': '例如：让语气更委婉；将邮件缩短到100字以内',
            'mentor-submit-btn': '开始处理',
            'mentor-output-title': '输出结果',
            'mentor-output-placeholder': '请在左侧选择模式并输入参数，然后点击 "开始处理" 按钮。',
            'mentor-loading-text': 'AI 正在努力撰写中...',
            'mentor-error-default': '发生错误，请稍后再试。',
            'mentor-error-no-intent': '请输入邮件意图。',
            'mentor-error-no-draft-analyze': '请粘贴要分析的邮件草稿。',
            'mentor-error-no-draft-refine': '请粘贴要润色的邮件草稿。',
            'mentor-error-api-empty': 'API 返回了空内容或结构异常。',
            'mentor-error-processing': '处理失败',
            'mentor-error-network': '网络连接或API服务异常。',
            'mentor-error-ui-failed': 'AI 处理请求时遇到问题，请检查输入或稍后再试。',
            // --- Common ---
            'settings-title': '设置',
            'setting-dark-mode': '护眼模式',
            'setting-clear-history': '清空历史记录',
            'clear-history-btn': '清空',
            'history-title': '历史记录',
            'history-empty': '暂无历史记录',
            'history-cleared-alert': '历史记录已清空',
            // --- essay-polish.js specific ---
            'polish-title': '作文润色',
            'polish-subtitle': 'AI让你的文章更加流畅',
            'polish-btn-full': '全文润色',
            'polish-btn-sentence': '逐句润色',
            'polish-features-title': '功能特点',
            'polish-feature-1': '全文润色：一键优化整篇文章，提升整体质量',
            'polish-feature-2': '逐句润色：精准对比每句修改，学习改进方法',
            'polish-feature-3': '历史记录：保存所有润色记录，随时查看回顾',
            'polish-placeholder': '输入或粘贴你的作文内容...\n\n提示：可以直接输入英文作文，系统会自动帮你润色优化',
            'polish-clear': '清空',
            'polish-camera': '拍照',
            'polish-polishing': '润色中...',
            'polish-start-full': '✨ 全文润色',
            'polish-start-sentence': '📝 逐句润色',
            'polish-result-title': '润色后',
            'polish-copy': '复制',
            'polish-copied': '已复制到剪贴板！',
            'polish-re-polish': '🔄 重新润色',
            'polish-original': '原文',
            'polish-no-change': '此句无需修改',
            'polish-export': '📤 导出对比',
            'polish-apply': '✅ 应用修改',
            'polish-history-title': '历史记录',
            'polish-today': '今天',
        },
        ko: {
            // --- index.html specific ---
            'target-high-school': '고등학생',
            'target-university': '대학생',
            'target-professional': '직장인',
            'app-title': '영어 작문 도우미',
            'card-title-assistant': '작문 도우미',
            'card-desc-assistant': 'AI가 문장 만들기, 이메일 작성을 도와줍니다',
            'card-title-correction': '작문 교정',
            'card-desc-correction': '작문을 업로드하여 전문적인 교정 받기',
            'card-title-daily-quote': '오늘의 명언',
            'card-desc-daily-quote': '매일 한 문장으로 작문 소재 쌓기',
            'card-title-polish': '에세이 교정',
            'card-desc-polish': 'AI로 당신의 글을 더 유창하게',
            'page-title-polish': '에세이 교정 - 영어 작문 도우미',
            // --- email-mentor.html (new template) ---
            'page-title-mentor': '이메일 작성 도우미 - 영어 작문 도우미',
            'mentor-header-title': '이메일 작성 도우미 📧',
            'mentor-header-subtitle': '직장 및 학업 이메일 문제 원스톱 해결',
            'mentor-panel-title': '작성 파라미터',
            'mentor-label-function': '기능 선택',
            'mentor-option-generate': '새 초안 생성 (Generate)',
            'mentor-option-analyze': '분석 및 제안 (Analyze)',
            'mentor-option-refine': '교정 및 재작성 (Refine)',
            'mentor-label-recipient': '수신자/상황',
            'mentor-recipient-professor': '교수/지도교수 (Professor/Mentor)',
            'mentor-recipient-manager': '관리자/상사 (Manager/Boss)',
            'mentor-recipient-client': '고객/외부 파트너 (Client/Partner)',
            'mentor-recipient-colleague': '동료/학우 (Colleague/Classmate)',
            'mentor-recipient-job': '구직 지원 (Job Application)',
            'mentor-recipient-request': '불만/공식 요청 (Complaint/Request)',
            'mentor-label-tone': '원하는 톤',
            'mentor-tone-formal': '격식, 전문적 (Formal, Professional)',
            'mentor-tone-casual': '비격식, 친근함 (Casual, Friendly)',
            'mentor-tone-persuasive': '설득력, 체계적 (Persuasive, Organized)',
            'mentor-tone-concise': '간결, 직접적 (Concise, Direct)',
            'mentor-tone-apologetic': '사과, 진심 어림 (Apologetic, Sincere)',
            'mentor-label-intent': '이메일 목적 (당신의 목적을 설명하세요)',
            'mentor-placeholder-intent': '예: 교수님께 졸업 논문 제출 기한 연장을 요청하고 싶습니다.',
            'mentor-label-draft': '이메일 초안 붙여넣기',
            'mentor-placeholder-draft': '제목과 본문을 포함한 전체 이메일 내용을 붙여넣으세요...',
            'mentor-label-refine-prompt': '교정 요구사항 (선택 사항)',
            'mentor-placeholder-refine-prompt': '예: 톤을 더 부드럽게 만들어주세요; 이메일을 100자 이내로 줄여주세요',
            'mentor-submit-btn': '처리 시작',
            'mentor-output-title': '출력 결과',
            'mentor-output-placeholder': '왼쪽에서 모드를 선택하고 파라미터를 입력한 후 "처리 시작" 버튼을 클릭하세요.',
            'mentor-loading-text': 'AI가 열심히 작성 중입니다...',
            'mentor-error-default': '오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
            'mentor-error-no-intent': '이메일 목적을 입력해주세요.',
            'mentor-error-no-draft-analyze': '분석할 이메일 초안을 붙여넣어 주세요.',
            'mentor-error-no-draft-refine': '교정할 이메일 초안을 붙여넣어 주세요.',
            'mentor-error-api-empty': 'API가 빈 콘텐츠 또는 비정상적인 구조를 반환했습니다.',
            'mentor-error-processing': '처리 실패',
            'mentor-error-network': '네트워크 연결 또는 API 서비스 이상.',
            'mentor-error-ui-failed': 'AI가 요청을 처리하는 중 문제가 발생했습니다. 입력을 확인하거나 나중에 다시 시도하십시오.',
            // --- Common ---
            'settings-title': '설정',
            'setting-dark-mode': '눈 보호 모드',
            'setting-clear-history': '기록 지우기',
            'clear-history-btn': '지우기',
            'history-title': '방문 기록',
            'history-empty': '기록이 없습니다',
            'history-cleared-alert': '기록이 모두 삭제되었습니다',
            // --- essay-polish.js specific ---
            'polish-title': '에세이 교정',
            'polish-subtitle': 'AI로 당신의 글을 더 유창하게',
            'polish-btn-full': '전체 교정',
            'polish-btn-sentence': '문장별 교정',
            'polish-features-title': '기능 특징',
            'polish-feature-1': '전체 교정: 한 번의 클릭으로 전체 글을 최적화하여 전반적인 품질 향상',
            'polish-feature-2': '문장별 교정: 각 문장의 수정 사항을 정확하게 비교하여 개선 방법 학습',
            'polish-feature-3': '기록: 모든 교정 기록을 저장하여 언제든지 검토 및 복습',
            'polish-placeholder': '에세이 내용을 입력하거나 붙여넣으세요...\n\n팁: 영어 에세이를 직접 입력하면 시스템이 자동으로 교정 및 최적화합니다',
            'polish-clear': '지우기',
            'polish-camera': '사진 찍기',
            'polish-polishing': '교정 중...',
            'polish-start-full': '✨ 전체 교정',
            'polish-start-sentence': '📝 문장별 교정',
            'polish-result-title': '교정 후',
            'polish-copy': '복사',
            'polish-copied': '클립보드에 복사되었습니다!',
            'polish-re-polish': '🔄 다시 교정하기',
            'polish-original': '원문',
            'polish-no-change': '이 문장은 수정할 필요가 없습니다',
            'polish-export': '📤 비교 내보내기',
            'polish-apply': '✅ 수정 적용',
            'polish-history-title': '기록',
            'polish-today': '오늘',
        }
    };

    // 暴露一个全局函数，供 React 组件使用
    window.getTranslations = () => {
        const lang = localStorage.getItem('writeflow_language') || 'zh';
        return translations[lang];
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
                // Also update placeholder if it exists
                if (element.placeholder) {
                    element.placeholder = translations[lang][key];
                }
            }
        });

        // 更新所有用 id 作为 key 的元素 (旧方法兼容)
        Object.keys(translations[lang]).forEach(key => {
            const element = document.getElementById(key);
            if (element) {
                element.textContent = translations[lang][key];
            }
        });

        // 如果 essay-polish.js 定义了更新函数，则调用它
        if (typeof window.updateEssayPolishComponent === 'function') {
            window.updateEssayPolishComponent(translations[lang]);
        }

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