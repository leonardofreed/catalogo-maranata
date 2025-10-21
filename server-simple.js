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
    }
});

// GET /api/produtos - Listar todos os produtos
app.get('/api/produtos', (req, res) => {
    console.log('Recebida requisição para /api/produtos');
    
    db.all('SELECT * FROM produtos ORDER BY data_criacao DESC', (err, rows) => {
        if (err) {
            console.error('Erro ao buscar produtos:', err.message);
            res.status(500).json({ error: err.message });
            return;
        }
        console.log('Produtos encontrados:', rows.length);
        res.json(rows);
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

