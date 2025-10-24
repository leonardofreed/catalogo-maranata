# 🛍️ Catálogo Online com Carrinho

Um catálogo de produtos moderno com funcionalidade de carrinho de compras, desenvolvido em React e TypeScript.

## 🚀 Funcionalidades

- **Catálogo de Produtos**: Visualização de produtos com busca e filtros por categoria
- **Carrinho de Compras**: Adicionar, remover e gerenciar quantidades de produtos
- **Interface Responsiva**: Design moderno e adaptável para diferentes dispositivos
- **API Integration**: Conectado à API `api.quase24horas.top/api/catalog`

## 🛠️ Tecnologias Utilizadas

- React 19.2.0
- TypeScript
- Axios para requisições HTTP
- React Router DOM
- CSS3 com Flexbox e Grid
- Context API para gerenciamento de estado

## 📦 Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd catalogo-carrinho
```

2. Instale as dependências:
```bash
npm install
```

3. Execute o projeto:
```bash
npm start
```

O projeto será executado na porta 3001: [http://localhost:3001](http://localhost:3001)

## 🚀 Deploy no Vercel

### Opção 1: Deploy via Vercel CLI

1. Instale o Vercel CLI:
```bash
npm i -g vercel
```

2. Faça login no Vercel:
```bash
vercel login
```

3. Execute o deploy:
```bash
vercel --prod
```

### Opção 2: Deploy via GitHub

1. Faça push do código para um repositório GitHub
2. Acesse [vercel.com](https://vercel.com)
3. Conecte sua conta GitHub
4. Importe o repositório
5. Configure as variáveis de ambiente se necessário
6. Deploy automático será realizado

## 🔧 Configuração

O projeto está configurado para rodar na porta 3001 conforme solicitado. A configuração está no `package.json`:

```json
"start": "set PORT=3001 && react-scripts start"
```

## 📱 Estrutura do Projeto

```
src/
├── components/
│   ├── Header.tsx          # Cabeçalho com navegação
│   ├── ProductCatalog.tsx  # Catálogo de produtos
│   ├── Cart.tsx           # Carrinho de compras
│   └── *.css              # Estilos dos componentes
├── contexts/
│   └── CartContext.tsx    # Contexto do carrinho
├── services/
│   └── api.ts             # Serviço de API
└── App.tsx                # Componente principal
```

## 🎨 Características do Design

- **Interface Moderna**: Design limpo e profissional
- **Responsivo**: Adaptável para mobile, tablet e desktop
- **Animações**: Transições suaves e feedback visual
- **Acessibilidade**: Componentes acessíveis e intuitivos

## 🔌 API

O projeto consome a API `https://api.quase24horas.top/api/catalog` para buscar os produtos.

### Endpoints utilizados:
- `GET /` - Lista todos os produtos
- `GET /:id` - Busca produto por ID

## 📝 Scripts Disponíveis

- `npm start` - Executa o projeto na porta 3001
- `npm run build` - Gera build de produção
- `npm test` - Executa os testes
- `npm run eject` - Ejecta as configurações (não recomendado)

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.
