let panelOpen = false;
let model = null;

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

closeBtn.addEventListener('click', () => {
    panelOpen = false;
    editorPanel.classList.remove('active');
    overlay.classList.remove('active');
});

overlay.addEventListener('click', () => {
    panelOpen = false;
    editorPanel.classList.remove('active');
    overlay.classList.remove('active');
});

editorPanel.addEventListener('click', (e) => {
    e.stopPropagation();
});

// Abas principais
const mainTabBtns = document.querySelectorAll('.main-tab-btn');
const mainTabContents = document.querySelectorAll('.main-tab-content');

mainTabBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        mainTabBtns.forEach(b => b.classList.remove('active'));
        mainTabContents.forEach(c => c.classList.remove('active'));
        this.classList.add('active');
        const tabName = this.getAttribute('data-main-tab');
        document.getElementById(`${tabName}-tab`).classList.add('active');
    });
});

// Abas de código
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
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
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { padding: 20px; font-family: sans-serif; }
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

closePreviewBtn.addEventListener('click', () => {
    previewPanel.classList.remove('active');
});

// Limpar código
document.getElementById('clearBtn').addEventListener('click', function() {
    if (confirm('Limpar tudo?')) {
        document.getElementById('htmlCode').value = '';
        document.getElementById('cssCode').value = '';
        document.getElementById('jsCode').value = '';
        localStorage.clear();
    }
});

// Auto-save
const textareas = document.querySelectorAll('textarea');
textareas.forEach(ta => {
    ta.addEventListener('input', debounce(function() {
        localStorage.setItem(this.id, this.value);
    }, 500));
    const saved = localStorage.getItem(ta.id);
    if (saved) ta.value = saved;
});

function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

// IMAGE LENS
const imageInput = document.getElementById('imageInput');
const previewImage = document.getElementById('previewImage');
const analyzeBtn = document.getElementById('analyzeBtn');
const lensResults = document.getElementById('lensResults');

imageInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(event) {
        previewImage.src = event.target.result;
        previewImage.style.display = 'block';
        analyzeBtn.style.display = 'flex';
    };
    reader.readAsDataURL(file);
});

analyzeBtn.addEventListener('click', analyzeImage);

async function loadModel() {
    if (!model) {
        try {
            model = await mobilenet.load();
        } catch(e) {
            lensResults.innerHTML = '<div class="lens-result-item">Erro ao carregar modelo</div>';
        }
    }
}

async function analyzeImage() {
    if (!previewImage.src) return;
    await loadModel();
    
    try {
        const predictions = await model.classify(previewImage);
        let html = '';
        predictions.forEach((p, i) => {
            html += `<div class="lens-result-item"><span class="result-label">${i+1}. ${p.className}</span><br><span class="result-confidence">${(p.probability * 100).toFixed(1)}%</span></div>`;
        });
        lensResults.innerHTML = html;
    } catch(e) {
        lensResults.innerHTML = '<div class="lens-result-item">Erro na análise</div>';
    }
}

// Shortcuts
document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        executeCode();
    }
    if (e.key === 'Escape' && panelOpen) {
        e.preventDefault();
        panelOpen = false;
        editorPanel.classList.remove('active');
        overlay.classList.remove('active');
    }
});
