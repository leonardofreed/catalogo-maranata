# 🚀 Instruções de Deploy no Vercel

## Pré-requisitos

1. Conta no Vercel (gratuita)
2. Projeto no GitHub (opcional, mas recomendado)
3. Node.js instalado localmente

## Opção 1: Deploy via Vercel CLI (Recomendado)

### 1. Instalar Vercel CLI
```bash
npm install -g vercel
```

### 2. Fazer login no Vercel
```bash
vercel login
```

### 3. Navegar para o diretório do projeto
```bash
cd catalogo-carrinho
```

### 4. Executar o deploy
```bash
vercel
```

### 5. Para deploy em produção
```bash
vercel --prod
```

## Opção 2: Deploy via Interface Web

### 1. Acessar Vercel
- Vá para [vercel.com](https://vercel.com)
- Faça login com sua conta

### 2. Importar Projeto
- Clique em "New Project"
- Conecte sua conta GitHub (se aplicável)
- Selecione o repositório `catalogo-carrinho`
- Ou faça upload dos arquivos diretamente

### 3. Configurar Build
- **Framework Preset**: Create React App
- **Build Command**: `npm run build`
- **Output Directory**: `build`
- **Install Command**: `npm install`

### 4. Configurar Variáveis de Ambiente
- Adicione `PORT=3001` se necessário
- Outras variáveis conforme necessário

### 5. Deploy
- Clique em "Deploy"
- Aguarde o processo de build
- Acesse sua aplicação na URL fornecida

## Configurações Específicas

### Porta 3001
O projeto está configurado para rodar na porta 3001. Esta configuração está no `package.json`:

```json
"start": "set PORT=3001 && react-scripts start"
```

### API Externa
O projeto consome a API `https://api.quase24horas.top/api/catalog`. Certifique-se de que:
- A API está acessível publicamente
- Não há restrições de CORS
- A API retorna dados no formato esperado

## Verificação Pós-Deploy

Após o deploy, verifique:

1. ✅ A aplicação carrega corretamente
2. ✅ Os produtos são carregados da API
3. ✅ O carrinho funciona (adicionar/remover produtos)
4. ✅ A interface é responsiva
5. ✅ A navegação entre catálogo e carrinho funciona

## Troubleshooting

### Erro de Build
- Verifique se todas as dependências estão instaladas
- Execute `npm run build` localmente para testar
- Verifique se não há erros de TypeScript

### Erro de API
- Verifique se a API está acessível
- Teste a API diretamente no navegador
- Verifique se há problemas de CORS

### Problemas de Porta
- O Vercel gerencia automaticamente a porta
- A configuração de PORT=3001 é apenas para desenvolvimento local

## URLs Importantes

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Documentação Vercel**: https://vercel.com/docs
- **API do Projeto**: https://api.quase24horas.top/api/catalog

## Suporte

Para problemas específicos:
1. Verifique os logs no dashboard do Vercel
2. Teste localmente com `npm start`
3. Consulte a documentação do Vercel
4. Verifique se a API externa está funcionando
