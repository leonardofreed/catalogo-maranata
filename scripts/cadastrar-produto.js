const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const readline = require('readline');

// Caminho do banco de dados
const dbPath = path.resolve(__dirname, '..', 'database', 'produtos.db');

// Interface para entrada de dados
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function question(prompt) {
    return new Promise((resolve) => {
        rl.question(prompt, resolve);
    });
}

async function cadastrarProduto() {
    console.log('🛍️  CADASTRO DE PRODUTO - QUASE24HORAS.TOP\n');
    
    try {
        // Conectar ao banco
        const db = new sqlite3.Database(dbPath);
        
        // Coletar dados do produto
        const nome = await question('📝 Nome do produto: ');
        const descricao = await question('📄 Descrição (opcional): ');
        const preco = await question('💰 Preço (R$): ');
        const categoria = await question('📂 Categoria: ');
        const estoque = await question('📦 Estoque (padrão: 0): ');
        const imagem_url = await question('🖼️  URL da imagem (opcional): ');
        
        // Validação
        if (!nome || !preco || !categoria) {
            console.log('❌ Nome, preço e categoria são obrigatórios!');
            rl.close();
            db.close();
            return;
        }
        
        // Inserir produto
        const query = `
            INSERT INTO produtos (nome, descricao, preco, categoria, estoque, imagem_url)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        
        db.run(query, [
            nome,
            descricao || null,
            parseFloat(preco),
            categoria,
            parseInt(estoque) || 0,
            imagem_url || null
        ], function(err) {
            if (err) {
                console.error('❌ Erro ao cadastrar produto:', err.message);
            } else {
                console.log(`\n✅ Produto cadastrado com sucesso!`);
                console.log(`🆔 ID: ${this.lastID}`);
                console.log(`📝 Nome: ${nome}`);
                console.log(`💰 Preço: R$ ${parseFloat(preco).toFixed(2)}`);
                console.log(`📂 Categoria: ${categoria}`);
                console.log(`📦 Estoque: ${parseInt(estoque) || 0}`);
            }
            
            db.close();
            rl.close();
        });
        
    } catch (error) {
        console.error('❌ Erro:', error.message);
        rl.close();
    }
}

// Executar cadastro
cadastrarProduto();
