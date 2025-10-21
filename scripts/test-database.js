const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

console.log('🔍 Verificando configuração do banco de dados...\n');

// Caminho do banco de dados
const dbPath = path.resolve(__dirname, '..', 'database', 'produtos.db');
const dbDir = path.dirname(dbPath);

console.log('📁 Diretório atual:', __dirname);
console.log('📁 Caminho do banco:', dbPath);
console.log('📁 Diretório do banco:', dbDir);

// Verificar se o diretório existe
if (fs.existsSync(dbDir)) {
    console.log('✅ Diretório do banco existe');
} else {
    console.log('❌ Diretório do banco não existe');
    console.log('🔧 Criando diretório...');
    try {
        fs.mkdirSync(dbDir, { recursive: true });
        console.log('✅ Diretório criado com sucesso');
    } catch (error) {
        console.error('❌ Erro ao criar diretório:', error.message);
        process.exit(1);
    }
}

// Verificar permissões de escrita
try {
    const testFile = path.join(dbDir, 'test-write.tmp');
    fs.writeFileSync(testFile, 'test');
    fs.unlinkSync(testFile);
    console.log('✅ Permissões de escrita OK');
} catch (error) {
    console.error('❌ Erro de permissão:', error.message);
    process.exit(1);
}

// Testar conexão com SQLite
console.log('\n🔌 Testando conexão com SQLite...');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('❌ Erro ao conectar:', err.message);
        console.error('❌ Código do erro:', err.code);
        process.exit(1);
    } else {
        console.log('✅ Conexão com SQLite bem-sucedida');
        
        // Testar criação de tabela
        db.run(`
            CREATE TABLE IF NOT EXISTS teste (
                id INTEGER PRIMARY KEY,
                nome TEXT
            )
        `, (err) => {
            if (err) {
                console.error('❌ Erro ao criar tabela de teste:', err.message);
            } else {
                console.log('✅ Tabela de teste criada com sucesso');
                
                // Limpar tabela de teste
                db.run('DROP TABLE teste', (err) => {
                    if (err) {
                        console.error('❌ Erro ao limpar tabela de teste:', err.message);
                    } else {
                        console.log('✅ Tabela de teste removida');
                    }
                    
                    db.close((err) => {
                        if (err) {
                            console.error('❌ Erro ao fechar banco:', err.message);
                        } else {
                            console.log('✅ Banco fechado com sucesso');
                            console.log('\n🎉 Todos os testes passaram! O banco está funcionando corretamente.');
                        }
                    });
                });
            }
        });
    }
});
