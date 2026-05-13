# 14 — Refactor Clean Code Skill

## Objetivo

Manter o código simples, legível, testável e sustentável.

## Regras

- Funções pequenas.
- Nomes claros.
- Evitar duplicação.
- Evitar componentes gigantes.
- Evitar boolean flags ambíguas.
- Extrair lógica para hooks quando crescer.
- Extrair chamadas externas para services.
- Extrair valores visuais para theme.
- Preferir composição em vez de condicionais complexas.
- Preferir early return quando melhora leitura.
- Separar transformação de dados da renderização.

## Sinais de alerta

- Page com mais de 150 linhas.
- Componente com muitas responsabilidades.
- Muitos `if` dentro do JSX.
- Props demais.
- Lógica repetida em várias telas.
- Arquivos difíceis de nomear.
- Funções com nomes genéricos.
- Variáveis chamadas `data`, `obj`, `item` sem contexto.
- Formulário fazendo parse manual no submit dentro da page.

## Estratégias de refactor

- Extrair hook.
- Extrair componente específico da feature.
- Promover componente para shared.
- Criar normalizer.
- Criar formatter/parser.
- Criar service.
- Criar schema Zod.
- Criar mapper.

## Proibido

- Refatorar escondendo problemas com casting.
- Silenciar ESLint.
- Reduzir tipagem para compilar.
- Criar abstração genérica demais sem uso real.
