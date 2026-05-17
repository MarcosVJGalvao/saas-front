# 19 — Context Management Skill

## Objetivo

Evitar perda de contexto e reduzir consumo de tokens durante implementações longas.

## Regra principal

Não carregar o projeto inteiro nem todas as skills em toda tarefa. Usar contexto mínimo suficiente.

## Arquivos principais

```txt
docs/ai-context.md
docs/project-decisions.md
docs/architecture-summary.md
specs/
skills/
```

## O que deve ficar em `docs/ai-context.md`

- Stack do projeto.
- Estrutura de pastas.
- Regras proibidas.
- Padrões de arquitetura.
- Padrões de componentes.
- Padrões de formatação, máscaras e tradução.
- Fluxo de dados.
- Regras de IA.

## Como usar em uma tarefa

Para implementar uma feature, carregar apenas:

1. `docs/ai-context.md`.
2. `skills/00-global-rules.md`.
3. Skills diretamente relacionadas à tarefa.
4. Spec da feature atual.
5. Arquivos diretamente alterados.

## Context economy

- Não ler arquivos irrelevantes.
- Não carregar todas as skills por padrão.
- Não atualizar `ai-context.md` a cada alteração pequena.
- Atualizar contexto apenas quando houver decisão arquitetural nova.
- Preferir specs curtas e objetivas.
- Usar checklist em vez de explicações longas.

## Checkpoints

Para tarefas longas, criar checkpoints curtos:

```txt
docs/context-checkpoints/checkpoint-YYYY-MM-DD.md
```

Conteúdo sugerido:

```md
# Context Checkpoint

## O que já foi decidido

## O que já foi implementado

## O que falta

## Riscos

## Próximo passo
```

## Quando atualizar contexto

Atualizar `ai-context.md` apenas quando houver:

- Nova decisão arquitetural.
- Novo padrão global.
- Nova regra proibida.
- Nova convenção de UI.
- Mudança de stack.

## Quando não atualizar

Não atualizar por:

- Pequenas correções.
- Novos componentes específicos sem regra global.
- Refactors locais.
- Ajustes de texto.
