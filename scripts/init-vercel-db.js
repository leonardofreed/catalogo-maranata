const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Caminho do banco de dados no Vercel
const dbPath = path.resolve(__dirname, '..', 'database', 'produtos.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err.message);
        process.exit(1);
    } else {
        console.log('Conectado ao banco de dados SQLite.');
    }
});

// Criar tabelas necessárias
db.serialize(() => {
    // Tabela de produtos
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
            console.log('Tabela produtos criada/verificada.');
        }
    });

    // Tabela de faixas de CEP
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
            console.log('Tabela faixas_cep criada/verificada.');
            
            // Inserir dados de exemplo se a tabela estiver vazia
            db.get('SELECT COUNT(*) as count FROM faixas_cep', (err, row) => {
                if (err) {
                    console.error('Erro ao verificar dados:', err.message);
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
                    console.log('Dados de exemplo inseridos.');
                }
            });
        }
    });

    // Tabela de configurações
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
            console.log('Tabela settings criada/verificada.');
        }
    });
});

// Fechar conexão
db.close((err) => {
    if (err) {
        console.error('Erro ao fechar banco de dados:', err.message);
    } else {
        console.log('Banco de dados inicializado com sucesso!');
    }
});
