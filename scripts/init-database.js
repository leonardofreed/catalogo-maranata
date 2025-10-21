const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Caminho para o arquivo do banco de dados (usando caminho absoluto)
const dbPath = path.resolve(__dirname, '..', 'database', 'produtos.db');

// Criar diretório database se não existir
const dbDir = path.dirname(dbPath);
console.log('Caminho do banco de dados:', dbPath);
console.log('Diretório do banco:', dbDir);

if (!fs.existsSync(dbDir)) {
    console.log('Criando diretório:', dbDir);
    fs.mkdirSync(dbDir, { recursive: true });
} else {
    console.log('Diretório já existe:', dbDir);
}

// Conectar ao banco de dados
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err.message);
    } else {
        console.log('Conectado ao banco de dados SQLite.');
    }
});

// Criar tabela de produtos
db.serialize(() => {
    // Criar tabela produtos
    db.run(`
        CREATE TABLE IF NOT EXISTS produtos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            descricao TEXT,
            preco DECIMAL(10,2) NOT NULL,
            categoria TEXT NOT NULL,
            estoque INTEGER DEFAULT 0,
            imagem_url TEXT,
            data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
            data_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
        if (err) {
            console.error('Erro ao criar tabela produtos:', err.message);
        } else {
            console.log('Tabela produtos criada com sucesso.');
        }
    });

    // Inserir dados de exemplo
    const produtosExemplo = [
        {
            nome: 'Smartphone Samsung Galaxy S23',
            descricao: 'Smartphone Android com tela de 6.1 polegadas, 128GB de armazenamento e câmera de 50MP',
            preco: 2499.99,
            categoria: 'Eletrônicos',
            estoque: 15,
            imagem_url: 'https://images.samsung.com/br/smartphones/galaxy-s23/images/galaxy-s23-highlights-mo.jpg'
        },
        {
            nome: 'Notebook Dell Inspiron 15',
            descricao: 'Notebook com processador Intel i5, 8GB RAM, 256GB SSD e tela Full HD de 15.6 polegadas',
            preco: 3299.99,
            categoria: 'Informática',
            estoque: 8,
            imagem_url: 'https://i.dell.com/sites/csdocuments/merchandizing/Content/Images/ProductImages/notebooks/inspiron-15-3520/3520-campaign-hero-504x350.jpg'
        },
        {
            nome: 'Tênis Nike Air Max 270',
            descricao: 'Tênis esportivo masculino com tecnologia Air Max, ideal para corrida e caminhada',
            preco: 599.99,
            categoria: 'Calçados',
            estoque: 25,
            imagem_url: 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/b7d9211c-26e7-431a-ac24-b0540fb3c00f/air-max-270-mens-shoes-KkLcGR.png'
        },
        {
            nome: 'Camiseta Polo Lacoste',
            descricao: 'Camiseta polo masculina em algodão penteado, modelo clássico com gola polo',
            preco: 199.99,
            categoria: 'Roupas',
            estoque: 30,
            imagem_url: 'https://static.lacoste.com/static/medias/sys_master/images/hb5/hb5/8839784005662/PH1237-0M9-001-1.jpg'
        },
        {
            nome: 'Livro "O Hobbit" - J.R.R. Tolkien',
            descricao: 'Edição especial do clássico da literatura fantástica, capa dura com ilustrações',
            preco: 49.99,
            categoria: 'Livros',
            estoque: 12,
            imagem_url: 'https://m.media-amazon.com/images/I/712cDO7d73L._AC_UF1000,1000_QL80_.jpg'
        },
        {
            nome: 'Cafeteira Elétrica Nespresso',
            descricao: 'Máquina de café expresso automática com sistema de cápsulas, capacidade para 1L',
            preco: 899.99,
            categoria: 'Eletrodomésticos',
            estoque: 6,
            imagem_url: 'https://www.nespresso.com/ecom/medias/sys_master/public/1234567890123/nespresso-vertuo-next.jpg'
        },
        {
            nome: 'Relógio Casio G-Shock',
            descricao: 'Relógio digital resistente a choques e água, com cronômetro e alarme',
            preco: 299.99,
            categoria: 'Acessórios',
            estoque: 20,
            imagem_url: 'https://www.casio.com/content/dam/casio/product-info/locales/us/en/timepiece/product/watch/G/SHOCK/GA2100/images/GA2100-1A1_main.png'
        },
        {
            nome: 'Mochila Adidas Originals',
            descricao: 'Mochila escolar/esportiva com compartimentos múltiplos e alças ajustáveis',
            preco: 159.99,
            categoria: 'Acessórios',
            estoque: 18,
            imagem_url: 'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/fbaf991a78bc4896a3abac380012d95f_9366/Mochila_Adicolor_Classic_Backpack_Preto_GN2354_01_laydown.jpg'
        }
    ];

    // Inserir produtos de exemplo
    const stmt = db.prepare(`
        INSERT INTO produtos (nome, descricao, preco, categoria, estoque, imagem_url)
        VALUES (?, ?, ?, ?, ?, ?)
    `);

    produtosExemplo.forEach(produto => {
        stmt.run([
            produto.nome,
            produto.descricao,
            produto.preco,
            produto.categoria,
            produto.estoque,
            produto.imagem_url
        ], function(err) {
            if (err) {
                console.error('Erro ao inserir produto:', err.message);
            } else {
                console.log(`Produto inserido com ID: ${this.lastID}`);
            }
        });
    });

    stmt.finalize();
});

// Fechar conexão
db.close((err) => {
    if (err) {
        console.error('Erro ao fechar banco de dados:', err.message);
    } else {
        console.log('Banco de dados fechado com sucesso.');
    }
});
