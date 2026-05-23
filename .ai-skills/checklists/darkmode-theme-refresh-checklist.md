# Checklist de rebase do dark mode

## Descoberta e inventario

- [x] Mapear `src/app/theme/tokens/colors.ts`
- [x] Mapear `src/app/theme/uiColors.ts`
- [x] Mapear `src/app/theme/mui/components.ts`
- [x] Mapear layout administrativo (`AppLayout`, `TopBar`, `SidebarContent`, `ProfileMenu`, `NotificationsMenu`, `CommandPalette`)
- [x] Mapear componentes compartilhados mais sensiveis a cor e superficie
- [x] Mapear telas especiais com styling customizado (`HomePage`, `PlatformAuthPageLayout`, `PwaFeedbackBridge`)

## Definicao da paleta escura

- [x] Definir fundo macro quase preto com leve temperatura azulada
- [x] Definir superficies primarias escuras separadas do fundo
- [x] Definir borda discreta para cards, drawers, menus e tabelas
- [x] Definir texto primario, secundario e disabled para contraste progressivo
- [x] Definir azul principal para CTAs e destaques
- [x] Definir cores semanticas harmonizadas com a nova base azul
- [x] Validar contraste minimo entre fundo, superficie, texto e CTA

## Tokens globais

- [x] Atualizar `background.default` do dark mode
- [x] Atualizar `background.paper` do dark mode
- [x] Atualizar `divider` do dark mode
- [x] Atualizar `primary.main/light/dark/contrastText` do dark mode
- [x] Atualizar `secondary`, `info`, `success`, `warning` e `error` do dark mode
- [x] Preservar o `light mode` sem regressao intencional

## Tokens complementares

- [x] Ajustar `heroGradient`
- [x] Ajustar `heroAccent`
- [x] Ajustar `heroLine`
- [x] Ajustar `heroCardBackground`
- [x] Ajustar `topBarAvatarGradient`
- [x] Ajustar `menuBackdrop`
- [x] Ajustar `menuBorder`
- [x] Ajustar `menuShadow`
- [x] Ajustar `menuDivider`
- [x] Ajustar tokens de notificacao
- [x] Ajustar tokens de status/badges

## Overrides globais do MUI

- [x] Revisar `MuiCssBaseline`
- [x] Revisar scrollbar do dark mode
- [x] Revisar `MuiCard`
- [x] Revisar `MuiPaper`
- [x] Revisar `MuiDialog`
- [x] Revisar `MuiMenu`
- [x] Revisar `MuiPopover`
- [x] Revisar `MuiDrawer`
- [x] Revisar `MuiTooltip`
- [x] Revisar `MuiChip`
- [x] Revisar `MuiTableCell`
- [x] Revisar `MuiDivider`
- [x] Revisar `MuiButton`

## Layout principal

- [x] Ajustar superfice do `AppLayout`
- [x] Ajustar `TopBar`
- [x] Ajustar `SidebarContent`
- [x] Ajustar `ProfileMenu`
- [x] Ajustar `NotificationsMenu`
- [x] Ajustar `CommandPalette`
- [x] Validar drawers e overlays no dark mode

## Componentes compartilhados

- [x] Ajustar `LocalizedStatusBadge`
- [x] Ajustar `StatusDot`
- [x] Ajustar `StatusChip`
- [x] Ajustar `MetricCard`
- [x] Ajustar `SparklineMetricCard`
- [x] Ajustar `EntityDetailsPage`
- [x] Ajustar `DetailsSection`

## Graficos

- [x] Validar `AppBarChart`
- [x] Validar `AppLineChart`
- [x] Validar `AppPieChart`
- [x] Ajustar tooltip, grid e eixos se necessario

## Tabelas, listas e filtros

- [x] Validar `DataTable`
- [x] Validar `DataList`
- [x] Validar `ListFilters`
- [x] Validar `EntitySearchFilter`
- [x] Ajustar hover, selected, divisores e vazios se necessario

## Auth e formularios

- [x] Ajustar `PlatformAuthPageLayout`
- [x] Ajustar `LoginFormCard`
- [x] Ajustar fluxos MFA
- [x] Validar feedbacks de foco, disabled e hover nos formularios

## Badges, status e chips

- [x] Definir regra visual para badge ativo
- [x] Definir regra visual para badge neutro
- [x] Definir regra visual para chips de favoritos/interacoes
- [x] Validar badges de listas
- [x] Validar badges de detalhes
- [x] Validar badges de cards

## Telas especiais

- [x] Ajustar `src/pages/HomePage.tsx`
- [x] Ajustar `src/app/pwa/components/PwaFeedbackBridge.tsx`
- [x] Ajustar componentes de onboarding/resumo com superficies destacadas

## Auditoria visual por breakpoint

- [x] Validar mobile
- [x] Validar tablet
- [x] Validar desktop
- [x] Validar sidebar, topbar, cards, tabelas, graficos e modais no dark mode

## Contraste e acessibilidade

- [x] Validar contraste de texto primario
- [x] Validar contraste de texto secundario
- [x] Validar contraste de botoes primarios
- [x] Validar contraste de chips e badges
- [x] Validar foco visivel

## Compliance estatico

- [x] Procurar `any`, `as`, `as const`, `@ts-ignore`, `eslint-disable`
- [x] Procurar imports relativos profundos
- [x] Procurar dependencia `shared -> features`
- [x] Procurar caracteres corrompidos e mojibake

## Quality gate

- [x] Rodar auditoria de compliance
- [x] `npm run lint`
- [x] `npm run typecheck`
- [x] `npm test`
- [x] Confirmar que os quatro passos ficaram verdes

## Fechamento final

- [x] Confirmar que o `light mode` nao regrediu nesta fase
- [x] Confirmar que o dark mode ficou alinhado visualmente a referencia
- [x] Atualizar este checklist com todos os itens finais implementados
