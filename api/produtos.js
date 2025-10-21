const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

export default async function handler(req, res) {
    console.log('API Produtos chamada:', req.method, req.query);
    
    // Garantir que o diretório database existe
    const dbDir = path.resolve(process.cwd(), 'database');
    if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
    }
    
    const dbPath = path.resolve(dbDir, 'produtos.db');
    console.log('Caminho do banco:', dbPath);
    
    const db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
            console.error('Erro ao conectar ao banco:', err.message);
        } else {
            console.log('Conectado ao banco SQLite');
        }
    });

    try {
        // Garantir que as tabelas existam
        await new Promise((resolve, reject) => {
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
                if (err) reject(err);
                else resolve();
            });
        });

        // Inserir dados de exemplo se a tabela estiver vazia
        const count = await new Promise((resolve, reject) => {
            db.get('SELECT COUNT(*) as count FROM produtos', (err, row) => {
                if (err) reject(err);
                else resolve(row.count);
            });
        });

        if (count === 0) {
            console.log('Inserindo dados de exemplo...');
            const produtosExemplo = [
                ['Smartphone Samsung Galaxy', 'Smartphone com tela de 6.1 polegadas, 128GB de armazenamento', 1299.99, 'Eletrônicos', 10, 'https://via.placeholder.com/300x200?text=Smartphone'],
                ['Notebook Dell Inspiron', 'Notebook com processador Intel i5, 8GB RAM, 256GB SSD', 2499.99, 'Eletrônicos', 5, 'https://via.placeholder.com/300x200?text=Notebook'],
                ['Camiseta Básica', 'Camiseta 100% algodão, disponível em várias cores', 29.99, 'Roupas', 50, 'https://via.placeholder.com/300x200?text=Camiseta'],
                ['Tênis Esportivo', 'Tênis para corrida com tecnologia de amortecimento', 199.99, 'Calçados', 25, 'https://via.placeholder.com/300x200?text=Tênis'],
                ['Livro JavaScript', 'Livro completo sobre programação JavaScript', 89.99, 'Livros', 15, 'https://via.placeholder.com/300x200?text=Livro'],
                ['Fone de Ouvido Bluetooth', 'Fone sem fio com cancelamento de ruído', 299.99, 'Eletrônicos', 20, 'https://via.placeholder.com/300x200?text=Fone']
            ];
            
            const stmt = db.prepare(`
                INSERT INTO produtos (nome, descricao, preco, categoria, estoque, imagem_url)
                VALUES (?, ?, ?, ?, ?, ?)
            `);
            
            for (const produto of produtosExemplo) {
                await new Promise((resolve, reject) => {
                    stmt.run(produto, (err) => {
                        if (err) reject(err);
                        else resolve();
                    });
                });
            }
            
            stmt.finalize();
            console.log('Dados de exemplo inseridos!');
        }

        if (req.method === 'GET') {
            const { categoria, busca, ordenar } = req.query;
            let query = 'SELECT * FROM produtos WHERE 1=1';
            const params = [];

            if (categoria && categoria !== 'Todas as categorias') {
                query += ' AND categoria = ?';
                params.push(categoria);
            }

            if (busca) {
                query += ' AND (nome LIKE ? OR descricao LIKE ?)';
                params.push(`%${busca}%`, `%${busca}%`);
            }

            if (ordenar) {
                switch (ordenar) {
                    case 'nome':
                        query += ' ORDER BY nome ASC';
                        break;
                    case 'preco_asc':
                        query += ' ORDER BY preco ASC';
                        break;
                    case 'preco_desc':
                        query += ' ORDER BY preco DESC';
                        break;
                    case 'categoria':
                        query += ' ORDER BY categoria ASC';
                        break;
                    default:
                        query += ' ORDER BY data_criacao DESC';
                }
            } else {
                query += ' ORDER BY data_criacao DESC';
            }

            console.log('Executando query:', query, 'com params:', params);
            
            const rows = await new Promise((resolve, reject) => {
                db.all(query, params, (err, rows) => {
                    if (err) {
                        console.error('Erro na query:', err);
                        reject(err);
                    } else {
                        console.log('Resultado da query:', rows);
                        resolve(Array.isArray(rows) ? rows : []);
                    }
                });
            });

            db.close();
            console.log('Retornando produtos:', rows.length);
            res.json(rows);

        } else if (req.method === 'POST') {
            const { nome, descricao, preco, categoria, estoque, imagem_url } = req.body;

            if (!nome || !preco || !categoria) {
                db.close();
                return res.status(400).json({ error: 'Nome, preço e categoria são obrigatórios' });
            }

            const query = `
                INSERT INTO produtos (nome, descricao, preco, categoria, estoque, imagem_url)
                VALUES (?, ?, ?, ?, ?, ?)
            `;

            const result = await new Promise((resolve, reject) => {
                db.run(query, [nome, descricao, preco, categoria, estoque || 0, imagem_url], function(err) {
                    if (err) reject(err);
                    else resolve({ id: this.lastID });
                });
            });

            db.close();
            res.status(201).json({ 
                id: result.id,
                message: 'Produto criado com sucesso'
            });

        } else {
            db.close();
            res.status(405).json({ error: 'Method not allowed' });
        }

    } catch (error) {
        db.close();
        console.error('Erro na API de produtos:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
}


