const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database', 'produtos.db');
console.log('Testando conexão com:', dbPath);

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Erro ao conectar:', err.message);
        return;
    }
    console.log('Conectado com sucesso!');
    
    // Testar consulta de produtos
    db.all('SELECT * FROM produtos LIMIT 5', (err, rows) => {
        if (err) {
            console.error('Erro ao consultar produtos:', err.message);
        } else {
            console.log('Produtos encontrados:', rows.length);
            console.log(rows);
        }
        
        db.close();
    });
});

