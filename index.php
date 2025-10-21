<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Olá Mundo - PHP</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            margin: 0;
            padding: 0;
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .container {
            background: white;
            padding: 40px;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            text-align: center;
            max-width: 500px;
        }
        h1 {
            color: #333;
            margin-bottom: 20px;
            font-size: 2.5em;
        }
        .php-info {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 10px;
            margin-top: 20px;
            border-left: 4px solid #007bff;
        }
        .timestamp {
            color: #666;
            font-size: 0.9em;
            margin-top: 15px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1><?php echo "Olá Mundo!"; ?></h1>
        <p>Esta é uma página PHP funcionando perfeitamente!</p>
        
        <div class="php-info">
            <h3>Informações do PHP:</h3>
            <p><strong>Versão do PHP:</strong> <?php echo phpversion(); ?></p>
            <p><strong>Data/Hora atual:</strong> <?php echo date('d/m/Y H:i:s'); ?></p>
            <p><strong>Servidor:</strong> <?php echo $_SERVER['SERVER_SOFTWARE'] ?? 'Desconhecido'; ?></p>
        </div>
        
        <div class="timestamp">
            Página carregada em: <?php echo date('d/m/Y às H:i:s'); ?>
        </div>
    </div>
</body>
</html>
