# 15 — Specification Driven Development Skill

## Objetivo

Criar código a partir de especificações claras, reduzindo ambiguidade e retrabalho.

## Regra principal

Antes de implementar qualquer feature relevante, criar ou atualizar uma spec.

## Local das specs

```txt
features/<feature>/specs/<feature>.spec.md
```

Ou, para specs globais:

```txt
specs/
```

## Template obrigatório

```md
# Feature

## Objetivo

## Rotas

## Componentes usados

## Estados da tela

- loading
- empty
- error
- success
- unauthorized
- forbidden

## Regras de negócio

## Contratos de dados

## Schemas Zod

## Services necessários

## Hooks necessários

## Normalização de UI e payload

## Mensagens de erro

## Enums exibidos ao usuário

## Critérios de aceite

## Testes esperados
```

## Regras

- Não implementar feature sem spec.
- A spec deve definir componentes reutilizáveis.
- A spec deve definir estados de tela.
- A spec deve definir validações.
- A spec deve definir permissões.
- A spec deve definir critérios de aceite.
- A spec deve definir normalização de campos mascarados.
- A spec deve definir mensagens de erro e enums quando aplicável.

## Uso com IA

Ao pedir implementação, fornecer:

- `docs/ai-context.md`.
- `skills/00-global-rules.md`.
- Skill específica da tarefa.
- Spec da feature.
- Arquivos diretamente envolvidos.
