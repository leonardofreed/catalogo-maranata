const mysql = require('mysql2/promise');

export default async function handler(req, res) {
    console.log('API Produtos chamada:', req.method, req.query);
    
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
        console.log('Conectado ao MySQL');

        // Criar tabela se não existir
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS produtos (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nome VARCHAR(255) NOT NULL,
                descricao TEXT,
                preco DECIMAL(10,2) NOT NULL,
                categoria VARCHAR(100) NOT NULL,
                estoque INT DEFAULT 0,
                imagem_url VARCHAR(500),
                data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);

        // Verificar se há produtos
        const [rows] = await connection.execute('SELECT COUNT(*) as count FROM produtos');
        const count = rows[0].count;

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
            
            for (const produto of produtosExemplo) {
                await connection.execute(
                    'INSERT INTO produtos (nome, descricao, preco, categoria, estoque, imagem_url) VALUES (?, ?, ?, ?, ?, ?)',
                    produto
                );
            }
            
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
            
            const [rows] = await connection.execute(query, params);
            await connection.end();
            
            console.log('Retornando produtos:', rows.length);
            res.json(rows);

        } else if (req.method === 'POST') {
            const { nome, descricao, preco, categoria, estoque, imagem_url } = req.body;

            if (!nome || !preco || !categoria) {
                await connection.end();
                return res.status(400).json({ error: 'Nome, preço e categoria são obrigatórios' });
            }

            const [result] = await connection.execute(
                'INSERT INTO produtos (nome, descricao, preco, categoria, estoque, imagem_url) VALUES (?, ?, ?, ?, ?, ?)',
                [nome, descricao, preco, categoria, estoque || 0, imagem_url]
            );

            await connection.end();
            res.status(201).json({ 
                id: result.insertId,
                message: 'Produto criado com sucesso'
            });

        } else {
            await connection.end();
            res.status(405).json({ error: 'Method not allowed' });
        }

    } catch (error) {
        if (connection) await connection.end();
        console.error('Erro na API de produtos:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
}


