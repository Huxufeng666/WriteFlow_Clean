document.addEventListener('DOMContentLoaded', () => {
    // --- 历史记录功能 ---
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
});