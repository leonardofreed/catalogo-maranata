const sqlite3 = require('sqlite3').verbose();
const path = require('path');

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const dbPath = path.resolve(process.cwd(), 'database', 'produtos.db');
    
    const db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
            console.error('Erro ao conectar ao banco:', err.message);
            return res.status(500).json({ error: 'Erro de conexão com banco de dados' });
        }
    });

    try {
        const queries = [
            'SELECT COUNT(*) as total FROM produtos',
            'SELECT COUNT(DISTINCT categoria) as categorias FROM produtos',
            'SELECT AVG(preco) as preco_medio FROM produtos',
            'SELECT SUM(estoque) as total_estoque FROM produtos'
        ];

        const results = await Promise.all(queries.map(query => 
            new Promise((resolve, reject) => {
                db.get(query, (err, row) => {
                    if (err) reject(err);
                    else resolve(row);
                });
            })
        ));

        db.close();

        res.json({
            total_produtos: results[0].total,
            total_categorias: results[1].categorias,
            preco_medio: Math.round(results[2].preco_medio * 100) / 100,
            total_estoque: results[3].total_estoque
        });

    } catch (error) {
        db.close();
        console.error('Erro ao buscar estatísticas:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
}
