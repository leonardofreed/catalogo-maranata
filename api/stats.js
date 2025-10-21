const mysql = require('mysql2/promise');

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Configuração do MySQL
    const dbConfig = {
        host: 'quase24horas.top',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'catalogo_maranata',
        port: process.env.DB_PORT || 3306
    };
    
    let connection;
    
    try {
        connection = await mysql.createConnection(dbConfig);
        console.log('Conectado ao MySQL para stats');

        const queries = [
            'SELECT COUNT(*) as total FROM produtos',
            'SELECT COUNT(DISTINCT categoria) as categorias FROM produtos',
            'SELECT AVG(preco) as preco_medio FROM produtos',
            'SELECT SUM(estoque) as total_estoque FROM produtos'
        ];

        const results = await Promise.all(queries.map(async (query) => {
            const [rows] = await connection.execute(query);
            return rows[0];
        }));

        await connection.end();

        res.json({
            total_produtos: results[0].total,
            total_categorias: results[1].categorias,
            preco_medio: Math.round(results[2].preco_medio * 100) / 100,
            total_estoque: results[3].total_estoque
        });

    } catch (error) {
        if (connection) await connection.end();
        console.error('Erro ao buscar estatísticas:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
}
