// Estado da extensão
let panelOpen = false;

// Elementos do DOM
const floatingBtn = document.getElementById('floatingBtn');
const editorPanel = document.getElementById('editorPanel');
const overlay = document.getElementById('overlay');
const closeBtn = document.getElementById('closeBtn');
const previewPanel = document.getElementById('previewPanel');
const closePreviewBtn = document.getElementById('closePreviewBtn');

// Abrir/Fechar painel
floatingBtn.addEventListener('click', () => {
    panelOpen = !panelOpen;
    editorPanel.classList.toggle('active');
    overlay.classList.toggle('active');
});

// Fechar painel com X
closeBtn.addEventListener('click', () => {
    panelOpen = false;
    editorPanel.classList.remove('active');
    overlay.classList.remove('active');
});

// Fechar painel com overlay (apenas o overlay fica funcional, não o painel)
overlay.addEventListener('click', () => {
    panelOpen = false;
    editorPanel.classList.remove('active');
    overlay.classList.remove('active');
});

// Impedir que cliques dentro do painel fechem ele
editorPanel.addEventListener('click', (e) => {
    e.stopPropagation();
});

// Previnir que cliques no painel fechem a extensão
editorPanel.addEventListener('mousedown', (e) => {
    if (e.target.closest('.editor-content, .panel-header')) {
        e.stopPropagation();
    }
});

// Sistema de Abas
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        // Remove active de todos
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));

        // Adiciona active ao clicado
        this.classList.add('active');
        const tabName = this.getAttribute('data-tab');
        document.getElementById(`${tabName}-tab`).classList.add('active');
    });
});

// Executar código
document.getElementById('executeBtn').addEventListener('click', executeCode);

function executeCode() {
    const htmlCode = document.getElementById('htmlCode').value;
    const cssCode = document.getElementById('cssCode').value;
    const jsCode = document.getElementById('jsCode').value;

    const iframe = document.getElementById('previewFrame');

    const fullHTML = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                body {
                    padding: 20px;
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                }
                ${cssCode}
            </style>
        </head>
        <body>
            ${htmlCode}
            <script>
                ${jsCode}
            </script>
        </body>
        </html>
    `;

    iframe.srcdoc = fullHTML;
    previewPanel.classList.add('active');
}

// Preview em nova aba
document.getElementById('previewBtn').addEventListener('click', function() {
    const htmlCode = document.getElementById('htmlCode').value;
    const cssCode = document.getElementById('cssCode').value;
    const jsCode = document.getElementById('jsCode').value;

    const fullHTML = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Code Executor - Preview</title>
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                body {
                    padding: 20px;
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                }
                ${cssCode}
            </style>
        </head>
        <body>
            ${htmlCode}
            <script>
                ${jsCode}
            </script>
        </body>
        </html>
    `;

    const blob = new Blob([fullHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    chrome.tabs.create({ url: url });
});

// Fechar preview
closePreviewBtn.addEventListener('click', () => {
    previewPanel.classList.remove('active');
});

// Limpar código
document.getElementById('clearBtn').addEventListener('click', function() {
    if (confirm('Tem certeza que deseja limpar tudo? Essa ação não pode ser desfeita.')) {
        document.getElementById('htmlCode').value = '';
        document.getElementById('cssCode').value = '';
        document.getElementById('jsCode').value = '';
        localStorage.removeItem('htmlCode');
        localStorage.removeItem('cssCode');
        localStorage.removeItem('jsCode');
        previewPanel.classList.remove('active');
    }
});

// Auto-save em localStorage
const textareas = document.querySelectorAll('textarea');
textareas.forEach(ta => {
    ta.addEventListener('input', debounce(function() {
        localStorage.setItem(this.id, this.value);
    }, 500));
});

// Função de debounce
function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

// Carregar código salvo
window.addEventListener('load', function() {
    textareas.forEach(ta => {
        const saved = localStorage.getItem(ta.id);
        if (saved) {
            ta.value = saved;
        }
    });
});

// Fechar preview ao clicar fora
document.addEventListener('click', (e) => {
    if (!previewPanel.contains(e.target) && e.target.id !== 'previewBtn') {
        // Preview fica aberto até fechar manualmente
    }
});

// Impedir que cliques no preview fechem o painel
previewPanel.addEventListener('click', (e) => {
    e.stopPropagation();
});

// Shortcuts de teclado
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + Enter para executar
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        executeCode();
    }

    // Esc para fechar painel
    if (e.key === 'Escape' && panelOpen) {
        e.preventDefault();
        panelOpen = false;
        editorPanel.classList.remove('active');
        overlay.classList.remove('active');
    }
});
