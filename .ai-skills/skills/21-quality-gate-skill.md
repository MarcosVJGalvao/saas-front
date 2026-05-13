# 21 — Quality Gate Skill

## Objetivo

Garantir que nenhuma tarefa seja finalizada sem validação completa e verificável.

## Gate obrigatório antes de concluir

Rodar nesta ordem:

0. scan estático de compliance
1. `npm run lint`
2. `npm run typecheck`
3. `npm test`

Scan estático sugerido:

```txt
rg -n "\bas\b|as const|\bany\b|@ts-ignore|eslint-disable" src tests
rg -n "\.\./\.\./|\.\./\.\./\.\./" src tests
rg -n "@features/" src/shared
rg -n "from '@mui/material'" src/features/**/pages
rg -n "�|Ã|\uFFFD" src tests .ai-skills AGENTS.md
```

## Regra de conclusão

- Só considerar a tarefa concluída quando os 3 comandos estiverem verdes.
- Se qualquer comando falhar, corrigir e rodar novamente até passar.
- Nunca declarar conclusão apenas com lint ou apenas com testes.
- Não concluir com warnings críticos de complexidade quando afetarem manutenção.

## Regra de transparência

Na resposta final, informar explicitamente:

- Status do `lint`.
- Status do `typecheck`.
- Status do `test`.

## Proibido

- Encerrar tarefa sem `typecheck`.
- Encerrar tarefa com falha conhecida e não reportada.
- Dizer que está “completo” sem evidência de validação.
