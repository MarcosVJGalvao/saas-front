# Project Decisions

## Decisões arquiteturais

1. O projeto usa arquitetura por features.
2. Pages não podem conter regra de negócio complexa.
3. Componentes compartilhados ficam em `shared/components`.
4. Design System fica em `app/theme`.
5. Mensagens, enums e labels em português ficam em `shared/i18n/pt-BR`.
6. Máscaras, parsers e formatters ficam em `shared`.
7. Payloads específicos devem ser normalizados dentro da feature.
8. O backend pode enviar dados técnicos em inglês, mas a UI sempre exibe português.
9. Erros devem ser traduzidos por `errorCode`, depois por `message`, depois por fallback.
10. Type assertions são proibidas, incluindo `as const`.
11. Comentários para desativar ESLint são proibidos.
12. A IA deve usar contexto curto e carregar apenas skills necessárias por tarefa.
