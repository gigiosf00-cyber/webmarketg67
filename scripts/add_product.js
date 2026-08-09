const fs = require('fs');
const path = require('path');

const rawCode = process.env.PRODUCT_CODE || '';
const title = process.env.PRODUCT_TITLE || 'Novo Produto';
const targetUrl = process.env.TARGET_URL || '#';
let videoUrl = process.env.VIDEO_URL || '#';

if (!videoUrl.trim()) {
    videoUrl = '#';
}

if (!rawCode || !targetUrl) {
    console.error('Erro: Código do produto e Link de destino são obrigatórios.');
    process.exit(1);
}

const codeLower = rawCode.trim().toLowerCase();
const codeUpper = rawCode.trim().toUpperCase();

// 1. ATUALIZAR INDEX.HTML
const indexPath = path.join(process.cwd(), 'index.html');
if (fs.existsSync(indexPath)) {
    let indexContent = fs.readFileSync(indexPath, 'utf8');
    
    if (indexContent.includes(`"${codeLower}":`)) {
        const regex = new RegExp(`"${codeLower}":\\s*"[^"]*"`, 'g');
        indexContent = indexContent.replace(regex, `"${codeLower}": "${targetUrl}"`);
    } else {
        indexContent = indexContent.replace(
            /(\s*"s\d+":\s*"[^"]*"\s*)(\n\s*};)/,
            `$1,\n        "${codeLower}": "${targetUrl}"$2`
        );
    }
    fs.writeFileSync(indexPath, indexContent, 'utf8');
}

// 2. ATUALIZAR SHOPEE.HTML
const shopeePath = path.join(process.cwd(), 'shopee.html');
if (fs.existsSync(shopeePath)) {
    let shopeeContent = fs.readFileSync(shopeePath, 'utf8');
    
    const cardHtml = `<div class="card" data-code="${codeLower}"><img src="img/shopee/${codeUpper}.jpg" onerror="this.src='https://placehold.co/400?text=${codeUpper}'"><div class="card-content"><div class="card-ref">#${codeUpper}</div><h3 class="title">${title}</h3><div class="actions"><a href="${targetUrl}" class="btn-card btn-buy">COMPRAR</a><a href="${videoUrl}" class="btn-card btn-video">VIDEO</a></div></div></div>`;

    if (shopeeContent.includes(`data-code="${codeLower}"`)) {
        const regexCard = new RegExp(`<div class="card" data-code="${codeLower}">[\\s\\S]*?<\\/div><\\/div><\\/div>`, 'g');
        shopeeContent = shopeeContent.replace(regexCard, cardHtml);
    } else {
        shopeeContent = shopeeContent.replace(
            /(<\/div>\s*<script>)/,
            `${cardHtml}\n\n$1`
        );
    }
    fs.writeFileSync(shopeePath, shopeeContent, 'utf8');
}

console.log(`Sucesso! Produto ${codeUpper} automatizado com sucesso.`);

