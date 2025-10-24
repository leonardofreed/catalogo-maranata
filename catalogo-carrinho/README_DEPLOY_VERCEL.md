Deploy para Vercel — instruções rápidas

O que este arquivo faz
- Descreve passos mínimos para publicar este projeto (create-react-app) no Vercel.
- Inclui comandos PowerShell que você pode copiar e executar localmente.

Pré-requisitos
- Node.js e npm instalados
- Conta no Vercel (https://vercel.com)

Opção A — Deploy interativo (recomendado se você prefere confirmar opções)
1. Instale a CLI do Vercel (se ainda não tiver):

```powershell
npm i -g vercel
```

2. Faça login (será aberta uma URL ou solicitará e-mail):

```powershell
vercel login
```

3. No diretório do projeto, execute o deploy interativo:

```powershell
cd "c:\maranata\catalogo-carrinho"
vercel
# ou para forçar deploy em produção sem prompts:
vercel --prod --confirm
```

Opção B — Deploy não interativo usando token (útil para scripts/CI)
1. Gere um token na sua conta Vercel: https://vercel.com/account/tokens
2. No seu PowerShell, exporte o token como variável de ambiente (somente na sessão atual):

```powershell
$env:VERCEL_TOKEN = "seu_token_aqui"
```

3. Rodar deploy (não interativo):

```powershell
cd "c:\maranata\catalogo-carrinho"
vercel --prod --token $env:VERCEL_TOKEN --confirm
```

Observações
- O projeto já contém `vercel.json` configurado para servir a pasta `build` (CRA) — as configurações padrão do Vercel funcionarão.
- Antes do deploy, você pode rodar `npm run build` localmente para validar que tudo compila.
- Se preferir conectar via Git (GitHub/GitLab/Bitbucket), faça push do código e use o dashboard do Vercel para criar um projeto ligado ao repositório.

Problemas comuns
- Porta em uso ao rodar `npm start`: não afeta o deploy — Vercel usa `npm run build`.
- Erros de build: rode `npm run build` localmente, corrija warnings/erros e tente novamente.

Se quiser, posso:
- Gerar um GitHub Action para CI/CD que rode `npm run build` e use o Vercel Action para publicar automaticamente.
- Ou, se você preferir, posso criar um script PowerShell para executar tudo automaticamente (login/token necessário).

