function parseMarkdown(text) {
    // Convert code blocks
    text = text.replace(/```([\s\S]*?)```/g, (match, code) => {
        return `<pre><code>${code.trim()}</code></pre>`;
    });

    // Convert inline code
    text = text.replace(/`([^`]+)`/g, '<code>$1</code>');

    // Convert links
    text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');

    // Convert line breaks
    text = text.replace(/\n/g, '<br>');

    return text;
}

function renderMessage(content) {
    const container = document.createElement('div');
    container.className = 'markdown-content';
    container.innerHTML = parseMarkdown(content);
    return container;
} 