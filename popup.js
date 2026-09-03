// Tab switching
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

        this.classList.add('active');
        const tabName = this.getAttribute('data-tab');
        document.getElementById(`${tabName}-tab`).classList.add('active');
    });
});

// Execute code
document.getElementById('executeBtn').addEventListener('click', executeCode);

function executeCode() {
    const htmlCode = document.getElementById('htmlCode').value;
    const cssCode = document.getElementById('cssCode').value;
    const jsCode = document.getElementById('jsCode').value;

    const iframe = document.getElementById('previewFrame');
    const preview = document.getElementById('preview');

    const fullHTML = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <style>
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
    preview.classList.add('active');
}

// Clear all
document.getElementById('clearBtn').addEventListener('click', function() {
    if (confirm('Tem certeza que deseja limpar tudo?')) {
        document.getElementById('htmlCode').value = '';
        document.getElementById('cssCode').value = '';
        document.getElementById('jsCode').value = '';
    }
});

// Open in new window
document.getElementById('newWindowBtn').addEventListener('click', function() {
    const htmlCode = document.getElementById('htmlCode').value;
    const cssCode = document.getElementById('cssCode').value;
    const jsCode = document.getElementById('jsCode').value;

    const fullHTML = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Code Executor - Output</title>
            <style>
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

// Close preview
document.getElementById('closePreview').addEventListener('click', function() {
    document.getElementById('preview').classList.remove('active');
});

// Save code to local storage
const textareas = document.querySelectorAll('textarea');
textareas.forEach(ta => {
    ta.addEventListener('input', function() {
        localStorage.setItem(this.id, this.value);
    });
});

// Load saved code
window.addEventListener('load', function() {
    textareas.forEach(ta => {
        const saved = localStorage.getItem(ta.id);
        if (saved) {
            ta.value = saved;
        }
    });
});
