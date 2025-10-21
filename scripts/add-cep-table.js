const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Caminho do banco de dados
const dbPath = 'C:\\maranata\\database\\produtos.db';
console.log('Caminho do banco de dados:', dbPath);

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err.message);
        return;
    }
    console.log('Conectado ao banco de dados SQLite.');
});

// Criar tabela de faixas de CEP
db.serialize(() => {
    // Criar tabela faixas_cep
    db.run(`
        CREATE TABLE IF NOT EXISTS faixas_cep (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            cep_inicio TEXT NOT NULL,
            cep_fim TEXT NOT NULL,
            valor_frete DECIMAL(10,2) NOT NULL,
            prazo_dias INTEGER NOT NULL,
            ativo BOOLEAN DEFAULT 1,
            data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
            data_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
        if (err) {
            console.error('Erro ao criar tabela faixas_cep:', err.message);
        } else {
            console.log('Tabela faixas_cep criada com sucesso.');
        }
    });

    // Inserir dados de exemplo
    const faixasExemplo = [
        {
            nome: 'São Paulo Capital',
            cep_inicio: '01000',
            cep_fim: '05999',
            valor_frete: 15.00,
            prazo_dias: 1
        },
        {
            nome: 'Grande São Paulo',
            cep_inicio: '06000',
            cep_fim: '09999',
            valor_frete: 25.00,
            prazo_dias: 2
        },
        {
            nome: 'Interior SP',
            cep_inicio: '10000',
            cep_fim: '19999',
            valor_frete: 35.00,
            prazo_dias: 3
        },
        {
            nome: 'Rio de Janeiro',
            cep_inicio: '20000',
            cep_fim: '28999',
            valor_frete: 30.00,
            prazo_dias: 2
        },
        {
            nome: 'Minas Gerais',
            cep_inicio: '30000',
            cep_fim: '39999',
            valor_frete: 40.00,
            prazo_dias: 4
        },
        {
            nome: 'Brasília',
            cep_inicio: '70000',
            cep_fim: '72999',
            valor_frete: 45.00,
            prazo_dias: 5
        },
        {
            nome: 'Nordeste',
            cep_inicio: '40000',
            cep_fim: '69999',
            valor_frete: 60.00,
            prazo_dias: 7
        },
        {
            nome: 'Sul',
            cep_inicio: '80000',
            cep_fim: '99999',
            valor_frete: 50.00,
            prazo_dias: 6
        }
    ];

    // Limpar dados existentes
    db.run('DELETE FROM faixas_cep', (err) => {
        if (err) {
            console.error('Erro ao limpar dados existentes:', err.message);
        } else {
            console.log('Dados existentes removidos.');
        }
    });

    // Inserir dados de exemplo
    const stmt = db.prepare(`
        INSERT INTO faixas_cep (nome, cep_inicio, cep_fim, valor_frete, prazo_dias)
        VALUES (?, ?, ?, ?, ?)
    `);

    faixasExemplo.forEach((faixa, index) => {
        stmt.run(faixa.nome, faixa.cep_inicio, faixa.cep_fim, faixa.valor_frete, faixa.prazo_dias, function(err) {
            if (err) {
                console.error('Erro ao inserir faixa:', err.message);
            } else {
                console.log(`Faixa inserida com ID: ${this.lastID} - ${faixa.nome}`);
            }
        });
    });

    stmt.finalize();
});

// Fechar banco de dados
db.close((err) => {
    if (err) {
        console.error('Erro ao fechar banco de dados:', err.message);
    } else {
        console.log('Banco de dados fechado com sucesso.');
    }
});
