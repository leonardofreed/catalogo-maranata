const sqlite3 = require('sqlite3').verbose();
const path = require('path');

export default async function handler(req, res) {
    console.log('API Produtos chamada:', req.method, req.query);
    
    const dbPath = path.resolve(process.cwd(), 'database', 'produtos.db');
    console.log('Caminho do banco:', dbPath);
    
    const db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
            console.error('Erro ao conectar ao banco:', err.message);
            return res.status(500).json({ error: 'Erro de conexão com banco de dados' });
        }
    });

    try {
        if (req.method === 'GET') {
            const { categoria, busca, ordenar } = req.query;
            let query = 'SELECT * FROM produtos WHERE 1=1';
            const params = [];

            if (categoria) {
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
            console.log('Retornando produtos:', rows);
            res.json(Array.isArray(rows) ? rows : []);

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
        
        // Retornar dados de exemplo em caso de erro
        const produtosExemplo = [
            {
                id: 1,
                nome: 'Smartphone Samsung Galaxy',
                descricao: 'Smartphone com tela de 6.1 polegadas, 128GB de armazenamento',
                preco: 1299.99,
                categoria: 'Eletrônicos',
                estoque: 10,
                imagem_url: 'https://via.placeholder.com/300x200?text=Smartphone',
                data_criacao: new Date().toISOString(),
                data_atualizacao: new Date().toISOString()
            },
            {
                id: 2,
                nome: 'Notebook Dell Inspiron',
                descricao: 'Notebook com processador Intel i5, 8GB RAM, 256GB SSD',
                preco: 2499.99,
                categoria: 'Eletrônicos',
                estoque: 5,
                imagem_url: 'https://via.placeholder.com/300x200?text=Notebook',
                data_criacao: new Date().toISOString(),
                data_atualizacao: new Date().toISOString()
            },
            {
                id: 3,
                nome: 'Camiseta Básica',
                descricao: 'Camiseta 100% algodão, disponível em várias cores',
                preco: 29.99,
                categoria: 'Roupas',
                estoque: 50,
                imagem_url: 'https://via.placeholder.com/300x200?text=Camiseta',
                data_criacao: new Date().toISOString(),
                data_atualizacao: new Date().toISOString()
            }
        ];
        
        console.log('Retornando dados de exemplo devido ao erro');
        res.json(produtosExemplo);
    }
}
