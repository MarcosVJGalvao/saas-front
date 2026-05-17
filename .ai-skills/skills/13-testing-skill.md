# 13 — Testing Skill

## Objetivo

Garantir qualidade, segurança em mudanças e confiança no comportamento da aplicação.

## Ferramentas recomendadas

- Vitest.
- Testing Library.
- MSW para mocks de API.
- Playwright para E2E, se necessário.

## Regras

- Testar utils e helpers.
- Testar parsers, formatters e normalizers.
- Testar hooks importantes.
- Testar services com mock.
- Testar componentes reutilizáveis.
- Testar fluxos críticos.
- Não testar implementação interna desnecessária.
- Testes devem simular comportamento do usuário.
- Testes devem usar textos em português quando validam UI.
- Imports dos testes devem usar aliases de projeto.
- `vi.mock(...)` deve usar o mesmo specifier do import real.

## Obrigatório testar

- Login.
- Guards.
- Formulários críticos.
- Validação Zod.
- Normalização de payload.
- Tradução de enums.
- Tradução de erros.
- Componentes compartilhados complexos.
- Services importantes.

## Proibido

- Testar detalhes internos sem valor.
- Mockar tudo de forma que o teste não valide comportamento real.
- Ignorar cenários de erro.
- Fazer snapshots grandes e frágeis.
- Misturar `../../src/...` com aliases em testes.

## Exemplos de cenários

- Documento aparece com máscara e é enviado sem máscara.
- Data aparece como `dd/MM/yyyy` e é enviada como `yyyy-MM-dd`.
- Enum `ACTIVE` aparece como `Ativo`.
- Erro `INVALID_CREDENTIALS` aparece como `E-mail ou senha inválidos.`.
