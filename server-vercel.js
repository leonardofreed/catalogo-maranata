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

// Função para conectar ao banco
function getDatabase() {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database(dbPath, (err) => {
            if (err) {
                console.error('Erro ao conectar ao banco de dados:', err.message);
                reject(err);
            } else {
                resolve(db);
            }
        });
    });
}

// Rota para servir a página principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rota para admin
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin', 'index.html'));
});

// API para categorias
app.get('/api/categorias', async (req, res) => {
    try {
        const db = await getDatabase();
        const rows = await new Promise((resolve, reject) => {
            db.all('SELECT DISTINCT categoria FROM produtos ORDER BY categoria', (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
        db.close();
        res.json(rows.map(row => row.categoria));
    } catch (error) {
        console.error('Erro ao buscar categorias:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// API para frete
app.get('/api/frete/:cep', async (req, res) => {
    try {
        const { cep } = req.params;
        const cepLimpo = cep.replace(/[^0-9]/g, '');
        
        if (cepLimpo.length !== 8) {
            return res.status(400).json({ error: 'CEP deve ter 8 dígitos' });
        }

        const db = await getDatabase();
        const row = await new Promise((resolve, reject) => {
            db.get(`
                SELECT * FROM faixas_cep 
                WHERE ativo = 1 
                AND ? BETWEEN REPLACE(cep_inicio, '-', '') AND REPLACE(cep_fim, '-', '')
                ORDER BY valor_frete ASC 
                LIMIT 1
            `, [cepLimpo], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
        
        db.close();

        if (!row) {
            res.json({
                cep: cepLimpo,
                faixa: null,
                valor_frete: 0,
                disponivel: false,
                mensagem: 'Frete não disponível para este CEP'
            });
        } else {
            res.json({
                cep: cepLimpo,
                faixa: row.nome,
                valor_frete: row.valor_frete,
                disponivel: true,
                mensagem: `Frete para ${row.nome}`
            });
        }
    } catch (error) {
        console.error('Erro ao calcular frete:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Acesse: http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\nFechando servidor...');
    process.exit(0);
});
