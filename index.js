document.addEventListener('DOMContentLoaded', () => {
    // --- 设置弹窗和护眼模式 ---
    const settingsBtn = document.getElementById('settings-btn');
    const modal = document.getElementById('settings-modal');
    const closeBtn = document.querySelector('.modal .close-btn');
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const clearHistoryBtn = document.getElementById('clear-history-btn');

    // 打开设置弹窗
    if (settingsBtn) settingsBtn.addEventListener('click', () => modal.style.display = 'flex');

    // 关闭设置弹窗
    if (closeBtn) closeBtn.addEventListener('click', () => modal.style.display = 'none');

    // 点击弹窗外部关闭
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // 护眼模式切换
    if (darkModeToggle) darkModeToggle.addEventListener('change', () => document.body.classList.toggle('dark-mode'));

    // --- 历史记录功能 (保留原有功能) ---
    function getHistory() {
        return JSON.parse(localStorage.getItem('pageHistory') || '[]');
    }

    function saveHistory(history) {
        localStorage.setItem('pageHistory', JSON.stringify(history));
    }

    function addHistoryItem(title, url) {
        let history = getHistory();
        if (history.length > 0 && history[0].url === url) return;
        history.unshift({ title, url, timestamp: new Date().toISOString() });
        if (history.length > 20) history.pop();
        saveHistory(history);
    }

    document.querySelectorAll('.card-link').forEach(link => {
        link.addEventListener('click', () => addHistoryItem(link.querySelector('h2').textContent, link.getAttribute('href')));
    });

    // 清空历史记录按钮功能
    if (clearHistoryBtn) {
        clearHistoryBtn.addEventListener('click', () => {
            saveHistory([]);
            alert(localStorage.getItem('writeflow_language') === 'ko' ? '기록이 모두 삭제되었습니다' : '历史记录已清空');
        });
    }
});