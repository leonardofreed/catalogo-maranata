const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/admin', express.static('admin'));

// Configuração do banco de dados
const dbPath = path.resolve(__dirname, 'database', 'produtos.db');
console.log('Caminho do banco de dados:', dbPath);

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err.message);
        console.error('Caminho tentado:', dbPath);
    } else {
        console.log('Conectado ao banco de dados SQLite.');
        // Garantir que as tabelas existam
        initializeDatabase();
    }
});

// Função para inicializar o banco de dados
function initializeDatabase() {
    db.serialize(() => {
        // Criar tabela de produtos
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
                console.log('Tabela produtos verificada/criada.');
            }
        });

        // Criar tabela de faixas de CEP
        db.run(`
            CREATE TABLE IF NOT EXISTS faixas_cep (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nome TEXT NOT NULL,
                cep_inicio TEXT NOT NULL,
                cep_fim TEXT NOT NULL,
                valor_frete DECIMAL(10,2) NOT NULL,
                ativo BOOLEAN DEFAULT 1,
                data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
                data_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `, (err) => {
            if (err) {
                console.error('Erro ao criar tabela faixas_cep:', err.message);
            } else {
                console.log('Tabela faixas_cep verificada/criada.');
                insertExampleData();
                insertFreteExampleData();
            }
        });

        // Criar tabela de configurações
        db.run(`
            CREATE TABLE IF NOT EXISTS settings (
                id INTEGER PRIMARY KEY DEFAULT 1,
                whatsapp_number TEXT,
                whatsapp_message TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `, (err) => {
            if (err) {
                console.error('Erro ao criar tabela settings:', err.message);
            } else {
                console.log('Tabela settings verificada/criada.');
            }
        });
    });
}

// Função para inserir dados de exemplo
function insertExampleData() {
    db.get('SELECT COUNT(*) as count FROM produtos', (err, row) => {
        if (err) {
            console.error('Erro ao verificar dados:', err.message);
            return;
        }
        
        if (row.count === 0) {
            console.log('Inserindo dados de exemplo...');
            
            const produtosExemplo = [
                ['Smartphone Samsung Galaxy', 'Smartphone com tela de 6.1 polegadas, 128GB de armazenamento', 1299.99, 'Eletrônicos', 10, 'https://via.placeholder.com/300x200?text=Smartphone'],
                ['Notebook Dell Inspiron', 'Notebook com processador Intel i5, 8GB RAM, 256GB SSD', 2499.99, 'Eletrônicos', 5, 'https://via.placeholder.com/300x200?text=Notebook'],
                ['Camiseta Básica', 'Camiseta 100% algodão, disponível em várias cores', 29.99, 'Roupas', 50, 'https://via.placeholder.com/300x200?text=Camiseta'],
                ['Tênis Esportivo', 'Tênis para corrida com tecnologia de amortecimento', 199.99, 'Calçados', 25, 'https://via.placeholder.com/300x200?text=Tênis'],
                ['Livro JavaScript', 'Livro completo sobre programação JavaScript', 89.99, 'Livros', 15, 'https://via.placeholder.com/300x200?text=Livro']
            ];
            
            const stmt = db.prepare(`
                INSERT INTO produtos (nome, descricao, preco, categoria, estoque, imagem_url)
                VALUES (?, ?, ?, ?, ?, ?)
            `);
            
            produtosExemplo.forEach(produto => {
                stmt.run(produto, (err) => {
                    if (err) {
                        console.error('Erro ao inserir produto:', err.message);
                    }
                });
            });
            
            stmt.finalize();
            console.log('Dados de exemplo inseridos com sucesso!');
        }
    });
}

// Rotas da API

// GET /api/produtos - Listar todos os produtos
app.get('/api/produtos', (req, res) => {
    const { categoria, busca, ordenar } = req.query;
    let query = 'SELECT * FROM produtos WHERE 1=1';
    const params = [];

    // Filtro por categoria
    if (categoria) {
        query += ' AND categoria = ?';
        params.push(categoria);
    }

    // Busca por nome ou descrição
    if (busca) {
        query += ' AND (nome LIKE ? OR descricao LIKE ?)';
        params.push(`%${busca}%`, `%${busca}%`);
    }

    // Ordenação
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

    db.all(query, params, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// GET /api/produtos/:id - Buscar produto por ID
app.get('/api/produtos/:id', (req, res) => {
    const { id } = req.params;
    
    db.get('SELECT * FROM produtos WHERE id = ?', [id], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (!row) {
            res.status(404).json({ error: 'Produto não encontrado' });
            return;
        }
        res.json(row);
    });
});

// POST /api/produtos - Criar novo produto
app.post('/api/produtos', (req, res) => {
    const { nome, descricao, preco, categoria, estoque, imagem_url } = req.body;

    // Validação básica
    if (!nome || !preco || !categoria) {
        res.status(400).json({ error: 'Nome, preço e categoria são obrigatórios' });
        return;
    }

    const query = `
        INSERT INTO produtos (nome, descricao, preco, categoria, estoque, imagem_url)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.run(query, [nome, descricao, preco, categoria, estoque || 0, imagem_url], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(201).json({ 
            id: this.lastID,
            message: 'Produto criado com sucesso'
        });
    });
});

// PUT /api/produtos/:id - Atualizar produto
app.put('/api/produtos/:id', (req, res) => {
    const { id } = req.params;
    const { nome, descricao, preco, categoria, estoque, imagem_url } = req.body;

    // Validação básica
    if (!nome || !preco || !categoria) {
        res.status(400).json({ error: 'Nome, preço e categoria são obrigatórios' });
        return;
    }

    const query = `
        UPDATE produtos 
        SET nome = ?, descricao = ?, preco = ?, categoria = ?, estoque = ?, 
            imagem_url = ?, data_atualizacao = CURRENT_TIMESTAMP
        WHERE id = ?
    `;

    db.run(query, [nome, descricao, preco, categoria, estoque || 0, imagem_url, id], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (this.changes === 0) {
            res.status(404).json({ error: 'Produto não encontrado' });
            return;
        }
        res.json({ message: 'Produto atualizado com sucesso' });
    });
});

// DELETE /api/produtos/:id - Deletar produto
app.delete('/api/produtos/:id', (req, res) => {
    const { id } = req.params;

    db.run('DELETE FROM produtos WHERE id = ?', [id], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (this.changes === 0) {
            res.status(404).json({ error: 'Produto não encontrado' });
            return;
        }
        res.json({ message: 'Produto deletado com sucesso' });
    });
});

// GET /api/categorias - Listar todas as categorias
app.get('/api/categorias', (req, res) => {
    db.all('SELECT DISTINCT categoria FROM produtos ORDER BY categoria', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows.map(row => row.categoria));
    });
});

// GET /api/stats - Estatísticas do catálogo
app.get('/api/stats', (req, res) => {
    const queries = [
        'SELECT COUNT(*) as total FROM produtos',
        'SELECT COUNT(DISTINCT categoria) as categorias FROM produtos',
        'SELECT AVG(preco) as preco_medio FROM produtos',
        'SELECT SUM(estoque) as total_estoque FROM produtos'
    ];

    Promise.all(queries.map(query => 
        new Promise((resolve, reject) => {
            db.get(query, (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        })
    )).then(results => {
        res.json({
            total_produtos: results[0].total,
            total_categorias: results[1].categorias,
            preco_medio: Math.round(results[2].preco_medio * 100) / 100,
            total_estoque: results[3].total_estoque
        });
    }).catch(err => {
        res.status(500).json({ error: err.message });
    });
});

// Inserir dados de exemplo de faixas de CEP
function insertFreteExampleData() {
    db.get('SELECT COUNT(*) as count FROM faixas_cep', (err, row) => {
        if (err) {
            console.error('Erro ao verificar dados de frete:', err.message);
            return;
        }
        
        if (row.count === 0) {
            console.log('Inserindo dados de exemplo de faixas de CEP...');
            
            const faixasExemplo = [
                ['São Paulo Capital', '01000-000', '05999-999', 15.00, 1],
                ['Grande São Paulo', '06000-000', '09999-999', 25.00, 1],
                ['Interior SP', '10000-000', '19999-999', 35.00, 1],
                ['Rio de Janeiro', '20000-000', '28999-999', 30.00, 1],
                ['Minas Gerais', '30000-000', '39999-999', 40.00, 1],
                ['Brasília', '70000-000', '72999-999', 45.00, 1],
                ['Nordeste', '40000-000', '69999-999', 60.00, 1],
                ['Sul', '80000-000', '99999-999', 50.00, 1]
            ];
            
            const stmt = db.prepare(`
                INSERT INTO faixas_cep (nome, cep_inicio, cep_fim, valor_frete, ativo)
                VALUES (?, ?, ?, ?, ?)
            `);
            
            faixasExemplo.forEach(faixa => {
                stmt.run(faixa, (err) => {
                    if (err) {
                        console.error('Erro ao inserir faixa:', err.message);
                    }
                });
            });
            
            stmt.finalize();
            console.log('Dados de exemplo de frete inseridos.');
        }
    });
}

// API para calcular frete por CEP
app.get('/api/frete/:cep', (req, res) => {
    const { cep } = req.params;
    
    // Limpar CEP (remover hífens e espaços)
    const cepLimpo = cep.replace(/[^0-9]/g, '');
    
    if (cepLimpo.length !== 8) {
        res.status(400).json({ error: 'CEP deve ter 8 dígitos' });
        return;
    }
    
    // Buscar faixa de CEP correspondente
    // Primeiro, tentar buscar com CEP completo (8 dígitos)
    let query = `
        SELECT * FROM faixas_cep 
        WHERE ativo = 1 
        AND ? BETWEEN REPLACE(cep_inicio, '-', '') AND REPLACE(cep_fim, '-', '')
        ORDER BY valor_frete ASC 
        LIMIT 1
    `;
    
    db.get(query, [cepLimpo], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        
        // Se não encontrou com CEP completo, tentar com os primeiros 5 dígitos
        if (!row) {
            query = `
                SELECT * FROM faixas_cep 
                WHERE ativo = 1 
                AND ? BETWEEN REPLACE(cep_inicio, '-', '') AND REPLACE(cep_fim, '-', '')
                ORDER BY valor_frete ASC 
                LIMIT 1
            `;
            
            db.get(query, [cepLimpo.substring(0, 5)], (err, row) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                    return;
                }
                
                if (!row) {
                    res.json({
                        cep: cepLimpo,
                        faixa: null,
                        valor_frete: 0,
                        disponivel: false,
                        mensagem: 'Frete não disponível para este CEP'
                    });
                    return;
                }
                
                res.json({
                    cep: cepLimpo,
                    faixa: row.nome,
                    valor_frete: row.valor_frete,
                    disponivel: true,
                    mensagem: `Frete para ${row.nome}`
                });
            });
        } else {
            // Encontrou com CEP completo
            res.json({
                cep: cepLimpo,
                faixa: row.nome,
                valor_frete: row.valor_frete,
                disponivel: true,
                mensagem: `Frete para ${row.nome}`
            });
        }
    });
});

// API para listar todas as faixas de CEP (admin)
app.get('/api/faixas-cep', (req, res) => {
    db.all('SELECT * FROM faixas_cep ORDER BY cep_inicio', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// API para criar nova faixa de CEP (admin)
app.post('/api/faixas-cep', (req, res) => {
    const { nome, cep_inicio, cep_fim, valor_frete, ativo } = req.body;
    
    if (!nome || !cep_inicio || !cep_fim || !valor_frete) {
        res.status(400).json({ error: 'Todos os campos são obrigatórios' });
        return;
    }
    
    const query = `
        INSERT INTO faixas_cep (nome, cep_inicio, cep_fim, valor_frete, ativo)
        VALUES (?, ?, ?, ?, ?)
    `;
    
    db.run(query, [nome, cep_inicio, cep_fim, valor_frete, ativo || 1], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(201).json({ 
            id: this.lastID,
            message: 'Faixa de CEP criada com sucesso'
        });
    });
});

// API para atualizar faixa de CEP (admin)
app.put('/api/faixas-cep/:id', (req, res) => {
    const { id } = req.params;
    const { nome, cep_inicio, cep_fim, valor_frete, ativo } = req.body;
    
    const query = `
        UPDATE faixas_cep 
        SET nome = ?, cep_inicio = ?, cep_fim = ?, valor_frete = ?, 
            ativo = ?, data_atualizacao = CURRENT_TIMESTAMP
        WHERE id = ?
    `;
    
    db.run(query, [nome, cep_inicio, cep_fim, valor_frete, ativo, id], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (this.changes === 0) {
            res.status(404).json({ error: 'Faixa de CEP não encontrada' });
            return;
        }
        res.json({ message: 'Faixa de CEP atualizada com sucesso' });
    });
});

// API para deletar faixa de CEP (admin)
app.delete('/api/faixas-cep/:id', (req, res) => {
    const { id } = req.params;
    
    db.run('DELETE FROM faixas_cep WHERE id = ?', [id], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (this.changes === 0) {
            res.status(404).json({ error: 'Faixa de CEP não encontrada' });
            return;
        }
        res.json({ message: 'Faixa de CEP deletada com sucesso' });
    });
});

// ===== CONFIGURAÇÕES =====

// API para obter configurações
app.get('/api/settings', (req, res) => {
    db.get('SELECT * FROM settings WHERE id = 1', (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        
        if (row) {
            res.json(row);
        } else {
            res.json({
                whatsapp_number: null,
                whatsapp_message: null,
                updated_at: null
            });
        }
    });
});

// API para salvar configurações
app.post('/api/settings', (req, res) => {
    const { whatsapp_number, whatsapp_message } = req.body;
    
    if (!whatsapp_number) {
        res.status(400).json({ error: 'Número do WhatsApp é obrigatório' });
        return;
    }
    
    // Verificar se já existe configuração
    db.get('SELECT id FROM settings WHERE id = 1', (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        
        if (row) {
            // Atualizar configuração existente
            const query = `
                UPDATE settings 
                SET whatsapp_number = ?, whatsapp_message = ?, updated_at = CURRENT_TIMESTAMP
                WHERE id = 1
            `;
            
            db.run(query, [whatsapp_number, whatsapp_message], function(err) {
                if (err) {
                    res.status(500).json({ error: err.message });
                    return;
                }
                res.json({ message: 'Configurações atualizadas com sucesso' });
            });
        } else {
            // Criar nova configuração
            const query = `
                INSERT INTO settings (id, whatsapp_number, whatsapp_message, created_at, updated_at)
                VALUES (1, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            `;
            
            db.run(query, [whatsapp_number, whatsapp_message], function(err) {
                if (err) {
                    res.status(500).json({ error: err.message });
                    return;
                }
                res.json({ message: 'Configurações salvas com sucesso' });
            });
        }
    });
});

// Rota para servir a página principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Acesse: http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\nFechando servidor...');
    db.close((err) => {
        if (err) {
            console.error('Erro ao fechar banco de dados:', err.message);
        } else {
            console.log('Banco de dados fechado.');
        }
        process.exit(0);
    });
});
