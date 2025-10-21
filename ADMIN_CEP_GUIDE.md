# 🚚 Guia do Painel Administrativo - Faixas de CEP

## Visão Geral

O painel administrativo agora inclui uma seção completa para gerenciar as faixas de CEP e valores de frete. Esta funcionalidade permite configurar diferentes regiões de entrega com seus respectivos valores e prazos.

## Como Acessar

1. Acesse: `http://localhost:3000/admin`
2. Digite o token: `admin123`
3. Clique em "🚚 Faixas CEP" no menu de navegação

## Funcionalidades Disponíveis

### ➕ Adicionar Nova Faixa de CEP

1. **Nome da Região**: Nome descritivo da região (ex: "São Paulo Capital")
2. **Status**: Ativo ou Inativo
3. **CEP Início**: Primeiro CEP da faixa (formato: 00000-000)
4. **CEP Fim**: Último CEP da faixa (formato: 00000-000)
5. **Valor do Frete**: Preço em reais (ex: 15.00)

### ✏️ Editar Faixa Existente

1. Clique no botão "✏️ Editar" na linha da faixa desejada
2. O formulário será preenchido automaticamente
3. Faça as alterações necessárias
4. Clique em "💾 Salvar Faixa"
5. Use "❌ Cancelar Edição" para descartar as mudanças

### 🗑️ Deletar Faixa

1. Clique no botão "🗑️ Deletar" na linha da faixa
2. Confirme a exclusão no popup

## Validações Implementadas

- **CEP Início ≤ CEP Fim**: O CEP de início deve ser menor ou igual ao CEP fim
- **Formato Brasileiro**: CEPs devem estar no formato 00000-000 (8 dígitos)
- **Campos Obrigatórios**: Todos os campos marcados com * são obrigatórios
- **Valores Positivos**: Valor do frete deve ser positivo

## Exemplos de Faixas de CEP

### Região Metropolitana
- **Nome**: São Paulo Capital
- **CEP Início**: 01000-000
- **CEP Fim**: 05999-999
- **Valor**: R$ 15,00

### Interior do Estado
- **Nome**: Interior SP
- **CEP Início**: 10000-000
- **CEP Fim**: 19999-999
- **Valor**: R$ 35,00

### Outras Regiões
- **Nome**: Nordeste
- **CEP Início**: 40000-000
- **CEP Fim**: 69999-999
- **Valor**: R$ 60,00

## Interface Responsiva

O painel é totalmente responsivo e funciona em:
- 💻 Desktop
- 📱 Tablet
- 📱 Smartphone

### Recursos Mobile
- Menu hambúrguer para navegação
- Formulários otimizados para touch
- Tabelas adaptáveis para telas pequenas
- Botões com tamanho adequado para dedos

## Integração com o Sistema

As faixas de CEP configuradas no painel administrativo são automaticamente utilizadas pelo sistema de cálculo de frete no catálogo de produtos:

1. **Frontend**: `http://localhost:3000`
2. **API de Frete**: `/api/frete/{cep}`
3. **Carrinho**: Calcula frete automaticamente

## APIs Disponíveis

### GET /api/faixas-cep
Lista todas as faixas de CEP

### POST /api/faixas-cep
Cria nova faixa de CEP

### PUT /api/faixas-cep/:id
Atualiza faixa existente

### DELETE /api/faixas-cep/:id
Remove faixa de CEP

## Dicas de Uso

1. **Organize por Região**: Use nomes descritivos para facilitar identificação
2. **Evite Sobreposições**: Certifique-se de que as faixas de CEP não se sobreponham
3. **Teste os Valores**: Verifique se os valores de frete estão competitivos
4. **Mantenha Atualizado**: Revise periodicamente os prazos e valores
5. **Use Status Inativo**: Desative faixas temporariamente em vez de deletar

## Solução de Problemas

### Erro ao Salvar
- Verifique se todos os campos obrigatórios estão preenchidos
- Confirme se o CEP início é menor ou igual ao CEP fim
- Verifique se os valores são números válidos

### Frete Não Calculado
- Verifique se a faixa está ativa
- Confirme se o CEP do cliente está dentro da faixa
- Verifique se há faixas cadastradas para a região

### Interface Não Responsiva
- Atualize a página (F5)
- Verifique se está usando um navegador moderno
- Teste em diferentes tamanhos de tela

## Suporte

Para dúvidas ou problemas:
1. Verifique este guia
2. Teste em diferentes navegadores
3. Verifique o console do navegador para erros
4. Confirme se o servidor está rodando

---

**Desenvolvido para quase24horas.top** 🚀
