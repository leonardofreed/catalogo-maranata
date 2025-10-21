const sqlite3 = require('sqlite3').verbose();
const path = require('path');

export default async function handler(req, res) {
    const dbPath = path.resolve(process.cwd(), 'database', 'produtos.db');
    
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

            const rows = await new Promise((resolve, reject) => {
                db.all(query, params, (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                });
            });

            db.close();
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
