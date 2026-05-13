# 06 - Design System Skill

## Objetivo

Centralizar estilos, cores, tipografia, espaçamentos, sombras, bordas, temas e componentes visuais.

## Estrutura obrigatória

```txt
app/theme/
  tokens/
    colors.ts
    typography.ts
    spacing.ts
    shadows.ts
    radius.ts
    zIndex.ts
    breakpoints.ts

  mui/
    createAppTheme.ts
    palette.ts
    typography.ts
    components.ts

  utils/
    responsive.ts

  ThemeProvider.tsx
  useThemeMode.ts
```

## Regras

- Não usar cores hardcoded.
- Não usar tamanho de fonte hardcoded.
- Não usar espaçamento aleatório.
- Toda cor deve existir no theme ou tokens.
- Todo dark/light mode deve vir do theme.
- Typography deve ser centralizada.
- Componentes compartilhados devem consumir o theme.
- O Design System deve contemplar light mode e dark mode.
- Tokens devem ser nomeados por intenção, não por cor literal.

## Responsividade obrigatória

Toda responsividade deve usar apenas 3 tiers globais:

```txt
mobile
tablet
desktop
```

Arquivo obrigatório de tokens:

```txt
app/theme/tokens/breakpoints.ts
```

Helper obrigatório para fallback:

```txt
app/theme/utils/responsive.ts
```

Regras:

- Não usar `xs`, `sm`, `md`, `lg`, `xl` em componentes novos ou alterados.
- Não criar breakpoints locais por componente.
- Sempre usar `responsive({ mobile, tablet?, desktop? })` para evitar gaps.
- Se `tablet` não for informado, herda de `mobile`.
- Se `desktop` não for informado, herda de `tablet` (ou `mobile`).

Exemplo correto:

```tsx
sx={{
  px: responsive({ mobile: 2, desktop: 4 }),
}}
```
