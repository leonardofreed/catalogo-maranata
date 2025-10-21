# 🚀 Guia de Deploy - Vercel

## ⚡ Deploy Rápido (5 minutos)

### 1. Preparar Projeto
```bash
# No terminal, na pasta do projeto:
git init
git add .
git commit -m "Deploy inicial - Catálogo Maranata"
```

### 2. Criar Repositório GitHub
1. Acesse: https://github.com/new
2. Nome: `catalogo-maranata`
3. Deixe **público**
4. **NÃO** marque "Add a README file"
5. Clique "Create repository"

### 3. Conectar GitHub
```bash
# Substitua SEU_USUARIO pelo seu username do GitHub
git remote add origin https://github.com/SEU_USUARIO/catalogo-maranata.git
git branch -M main
git push -u origin main
```

### 4. Deploy Vercel
1. Acesse: https://vercel.com/new
2. Clique "Continue with GitHub"
3. Autorize o Vercel
4. Selecione `catalogo-maranata`
5. Clique "Import"

### 5. Configurações (IMPORTANTE!)
- **Framework**: Other
- **Root Directory**: `./`
- **Build Command**: `npm run build`
- **Output Directory**: `./`
- **Install Command**: `npm install`

### 6. Deploy!
Clique "Deploy" e aguarde! 🎉

---

## 🔧 Comandos Completos

```bash
# 1. Inicializar Git
git init

# 2. Adicionar arquivos
git add .

# 3. Commit inicial
git commit -m "Deploy inicial - Catálogo Maranata"

# 4. Conectar GitHub (substitua SEU_USUARIO)
git remote add origin https://github.com/SEU_USUARIO/catalogo-maranata.git

# 5. Push para GitHub
git branch -M main
git push -u origin main
```

## 📱 Após o Deploy

1. **Acesse sua aplicação**: `https://seu-projeto.vercel.app`
2. **Painel Admin**: `https://seu-projeto.vercel.app/admin`
3. **Adicione produtos** pelo painel admin
4. **Configure WhatsApp** nas configurações

## 🛠️ Troubleshooting

### Erro de Build
- Verifique se todos os arquivos estão no GitHub
- Confirme se o `vercel.json` está na raiz

### Banco de Dados
- O SQLite será criado automaticamente
- Dados de exemplo serão inseridos no primeiro acesso

### Domínio Personalizado
- No painel Vercel: Settings > Domains
- Adicione seu domínio personalizado

---

**🎉 Pronto! Seu catálogo está no ar!**
