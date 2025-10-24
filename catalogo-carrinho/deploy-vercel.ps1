<#
  Script PowerShell para facilitar o deploy no Vercel.
  Uso:
    # Interativo (recomenda-se primeiro executar `vercel login` manualmente):
    .\deploy-vercel.ps1

    # Não interativo usando token:
    $env:VERCEL_TOKEN = "seu_token_aqui"
    .\deploy-vercel.ps1 -NonInteractive

  O script checa se a CLI do vercel está instalada e tenta instalar via npm global se não estiver.
  Ele executa `vercel --prod --confirm` por padrão.
#>

param(
  [switch]$NonInteractive
)

function Ensure-VercelCli {
  $vercelPath = (Get-Command vercel -ErrorAction SilentlyContinue)
  if (-not $vercelPath) {
    Write-Host "Vercel CLI não encontrado. Instalando globalmente..." -ForegroundColor Yellow
    npm i -g vercel
    if ($LASTEXITCODE -ne 0) {
      Write-Error "Falha ao instalar Vercel CLI. Instale manualmente: npm i -g vercel"
      exit 1
    }
  }
}

Write-Host "Executando deploy para Vercel a partir de: $(Get-Location)" -ForegroundColor Cyan

Ensure-VercelCli

if (-not (Test-Path "./build")) {
  Write-Host "Pasta build/ não encontrada. Rodando 'npm run build'..." -ForegroundColor Yellow
  npm run build
  if ($LASTEXITCODE -ne 0) {
    Write-Error "Build falhou. Corrija os erros e tente novamente.";
    exit 1
  }
}

if ($NonInteractive) {
  if (-not $env:VERCEL_TOKEN) {
    Write-Error "Modo não interativo requer a variável de ambiente VERCEL_TOKEN. Exemplo: $env:VERCEL_TOKEN = 'seu_token'"
    exit 1
  }
  Write-Host "Fazendo deploy não interativo com token..." -ForegroundColor Green
  vercel --prod --token $env:VERCEL_TOKEN --confirm
} else {
  Write-Host "Iniciando deploy interativo (pode pedir para você confirmar a conta/projeto)..." -ForegroundColor Green
  vercel --prod
}

if ($LASTEXITCODE -eq 0) {
  Write-Host "Deploy finalizado (verifique o output acima para a URL de produção)." -ForegroundColor Green
} else {
  Write-Error "Deploy falhou. Veja mensagens acima para detalhes.";
  exit $LASTEXITCODE
}
