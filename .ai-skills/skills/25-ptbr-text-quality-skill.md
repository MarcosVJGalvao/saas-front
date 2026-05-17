# 25 — PT-BR Text Quality Skill

## Objetivo

Garantir que todo texto exibido ao usuário esteja em português brasileiro correto, sem caracteres corrompidos e sem problemas de encoding.

## Regras obrigatórias

- Todo texto de UI deve estar em português brasileiro.
- Não aceitar caractere de substituição em arquivos de código, i18n, specs e documentação do projeto.
- Não aceitar texto corrompido por encoding.
- Preferir textos centralizados em `shared/i18n/pt-BR` quando compartilhados.

## Varredura obrigatória antes de concluir

Rodar verificação textual e corrigir ocorrências:

```txt
rg -n "[caractere_substituicao]|[assinatura_mojibake]" src tests .ai-skills AGENTS.md
```

Se houver ocorrência:

1. Corrigir o texto para PT-BR válido.
2. Salvar o arquivo em UTF-8.
3. Rodar `lint`, `typecheck` e `test`.

## Checklist de revisão textual

- Acentuação correta (`ação`, `não`, `permissão`, `você`).
- Termos naturais em PT-BR.
- Sem termos técnicos crus para usuário final.
- Mensagens de erro amigáveis e consistentes.

## Proibido

- Entregar código com caractere de substituição.
- Entregar texto de UI com encoding quebrado.
- Aceitar mistura de português e inglês em mensagens para usuário sem justificativa.
