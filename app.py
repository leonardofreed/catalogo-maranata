from flask import Flask, render_template_string
import datetime
import platform
import sys

app = Flask(__name__)

# Template HTML com a mesma estrutura da página PHP
HTML_TEMPLATE = """
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Olá Mundo - Python Flask</title>
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
        .python-info {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 10px;
            margin-top: 20px;
            border-left: 4px solid #3776ab;
        }
        .timestamp {
            color: #666;
            font-size: 0.9em;
            margin-top: 15px;
        }
        .emoji {
            font-size: 1.2em;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🐍 Olá Mundo!</h1>
        <p>Esta é uma página Python Flask funcionando perfeitamente!</p>
        
        <div class="python-info">
            <h3>Informações do Python:</h3>
            <p><strong>Versão do Python:</strong> {{ python_version }}</p>
            <p><strong>Data/Hora atual:</strong> {{ current_time }}</p>
            <p><strong>Sistema Operacional:</strong> {{ os_info }}</p>
            <p><strong>Framework:</strong> Flask {{ flask_version }}</p>
        </div>
        
        <div class="timestamp">
            Página carregada em: {{ load_time }}
        </div>
    </div>
</body>
</html>
"""

@app.route('/')
def hello_world():
    # Obter informações do sistema
    current_time = datetime.datetime.now().strftime('%d/%m/%Y %H:%M:%S')
    python_version = sys.version.split()[0]
    os_info = platform.system() + " " + platform.release()
    
    return render_template_string(HTML_TEMPLATE, 
                                python_version=python_version,
                                current_time=current_time,
                                os_info=os_info,
                                flask_version="2.3.3",
                                load_time=current_time)

# Para compatibilidade com Vercel
def handler(request):
    return app(request.environ, lambda *args: None)

if __name__ == '__main__':
    app.run(debug=True)
