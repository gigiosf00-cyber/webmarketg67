const fs = require('fs');
const path = require('path');

const platform = (process.env.PLATFORM || 'shopee').toLowerCase();
const rawCode = process.env.PRODUCT_CODE || '';
const title = process.env.PRODUCT_TITLE || 'Produto';
const targetUrl = process.env.TARGET_URL || '#';

if (!rawCode || !targetUrl) {
    process.exit(1);
}

const codeLower = rawCode.trim().toLowerCase();
const codeUpper = rawCode.trim().toUpperCase();

// Nome do arquivo baseado na plataforma (ex: shopee.html, amazon.html, etc)
const fileName = platform === 'mercadolivre' ? 'mercadolivre.html' : `${platform}.html`;
const filePath = path.join(process.cwd(), fileName);

if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // O card HTML dinâmico
    const cardHtml = `<div class="card" data-code="${codeLower}"><img src="img/${platform}/${codeUpper}.jpg" onerror="this.src='https://placehold.co/400?text=${codeUpper}'"><div class="card-content"><div class="card-ref">#${codeUpper}</div><h3 class="title">${title}</h3><div class="actions"><a href="${targetUrl}" class="btn-card btn-buy">COMPRAR</a></div></div></div>`;

    if (content.includes(`data-code="${codeLower}"`)) {
        const regexCard = new RegExp(`<div class="card" data-code="${codeLower}">[\\s\\S]*?<\\/div><\\/div><\\/div>`, 'g');
        content = content.replace(regexCard, cardHtml);
    } else {
        content = content.replace(/(<\/div>\s*<script>)/, `${cardHtml}\n\n$1`);
    }
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Sucesso! ${codeUpper} adicionado a ${platform}.`);
}
