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

O projeto usa 6 breakpoints para cobrir a diversidade de dispositivos:

| Breakpoint | Valor  | Dispositivo alvo                     |
| ---------- | ------ | ------------------------------------ |
| `xs`       | 0px    | Phones pequenos (320–479px)          |
| `sm`       | 480px  | Phones maiores (480–767px)           |
| `md`       | 768px  | Tablets portrait / iPad              |
| `lg`       | 1024px | Tablets landscape / laptops pequenos |
| `xl`       | 1280px | Laptops padrão                       |
| `xxl`      | 1536px | Telas grandes / monitores            |

Arquivo obrigatório de tokens:

```txt
app/theme/tokens/breakpoints.ts
```

Helper obrigatório:

```txt
app/theme/utils/responsive.ts
```

### Assinatura do helper

```ts
responsive({ xs, sm?, md?, lg?, xl?, xxl? })
```

- `xs` é obrigatório (mobile-first baseline).
- Os demais são opcionais — apenas declare quando o valor muda.

### Regras

- Sempre usar `responsive()` em vez de objetos MUI diretos (`{ xs: ..., md: ... }`) para garantir type safety e cobertura de breakpoints.
- Não criar `@media` hardcoded em TSX/TS — usar `theme.breakpoints` quando necessário fora de sx.
- Não criar breakpoints locais por componente.
- Usar `theme.breakpoints.down('lg')` em `useMediaQuery` para separar mobile de desktop (lg = 1024px).

### Exemplos corretos

```tsx
// Padding que cresce em telas maiores
sx={{
  px: responsive({ xs: 2, md: 4, lg: 8 }),
}}

// Layout de 1 coluna → 2 → 3
sx={{
  gridTemplateColumns: responsive({
    xs: '1fr',
    md: 'repeat(2, minmax(0, 1fr))',
    lg: 'repeat(3, minmax(0, 1fr))',
  }),
}}

// Flex que empilha em mobile
sx={{
  flexDirection: responsive({ xs: 'column', sm: 'row' }),
}}
```

### Proibido

```tsx
// ❌ @media hardcoded
'@media (max-width:450px)': { display: 'none' }

// ❌ Objeto MUI direto sem responsive()
{ xs: 2, md: 4 }

// ❌ Breakpoint que não existe no sistema
responsive({ mobile: 2, tablet: 4 })
```
