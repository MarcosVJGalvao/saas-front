# 31 — Responsiveness Skill

## Objetivo

Garantir que todo componente renderize corretamente em qualquer tamanho de viewport, sem itens sobrepostos, conteúdo cortado ou scroll horizontal indesejado.

## Breakpoints do projeto

| Breakpoint | Valor  | Dispositivo alvo                     |
| ---------- | ------ | ------------------------------------ |
| `xs`       | 0px    | Phones pequenos (320–479px)          |
| `sm`       | 480px  | Phones maiores (480–767px)           |
| `md`       | 768px  | Tablets portrait / iPad              |
| `lg`       | 1024px | Tablets landscape / laptops pequenos |
| `xl`       | 1280px | Laptops padrão                       |
| `xxl`      | 1536px | Telas grandes / monitores            |

Helper: `responsive({ xs, sm?, md?, lg?, xl?, xxl? })` em `@theme/utils/responsive`.

## Checklist obrigatório por tipo de componente

### Tabelas e listas de dados

- [ ] O container principal tem `overflowX: 'auto'`
- [ ] Nenhum wrapper pai tem `overflowX: 'hidden'` bloqueando o scroll
- [ ] Colunas com `width` fixo usam unidades relativas ou `minmax()`

```tsx
// ✅ correto
<Box sx={{ overflowX: 'auto' }}>
  <Table>...</Table>
</Box>

// ❌ proibido
<Box sx={{ overflowX: 'hidden' }}>
```

### Headers e toolbars com título + ações

- [ ] O flex container tem `flexDirection: responsive({ xs: 'column', sm: 'row' })`
- [ ] O bloco de título tem `minWidth: 0` para não vazar
- [ ] Texto longo usa `wordBreak: 'break-word'` ou `textOverflow: 'ellipsis'`
- [ ] Botões de ação têm `flexShrink: 0` para não encolher

```tsx
// ✅ correto
<Box
  sx={{
    display: 'flex',
    flexDirection: responsive({ xs: 'column', sm: 'row' }),
    alignItems: responsive({ xs: 'flex-start', sm: 'center' }),
    gap: responsive({ xs: 1.5, sm: 2 }),
  }}
>
  <Box sx={{ minWidth: 0 }}>
    <Typography sx={{ wordBreak: 'break-word' }}>...</Typography>
  </Box>
  <Stack direction="row" sx={{ flexShrink: 0 }}>
    {/* botões */}
  </Stack>
</Box>
```

### Menus, drawers e modais

- [ ] `width` não é valor fixo — usar `responsive()` com fallback `xs`
- [ ] `maxWidth` limita ao viewport em telas pequenas
- [ ] Conteúdo interno tem `overflowY: 'auto'` quando pode crescer

```tsx
// ✅ correto
sx={{ width: responsive({ xs: 'calc(100vw - 32px)', sm: 300 }) }}

// ❌ proibido
sx={{ width: 300, maxWidth: '94vw' }}  // maxWidth não funciona bem sem width flexível
```

### Inputs e campos com dimensão fixa

- [ ] `width` e `height` fixos têm variante xs menor
- [ ] Em telas muito pequenas os inputs cabem lado a lado sem overflow

```tsx
// ✅ correto
sx={{ width: responsive({ xs: 40, sm: 44, md: 50 }), height: responsive({ xs: 44, sm: 50, md: 54 }) }}
```

### Grids e layouts de coluna

- [ ] Usa `minmax(0, 1fr)` para evitar overflow em células
- [ ] Tem pelo menos breakpoint xs (1 coluna) e md/lg para multi-coluna
- [ ] `gap` também é responsivo quando colunas mudam

```tsx
// ✅ correto
sx={{
  display: 'grid',
  gridTemplateColumns: responsive({
    xs: '1fr',
    md: 'repeat(2, minmax(0, 1fr))',
    lg: 'repeat(3, minmax(0, 1fr))',
  }),
  gap: responsive({ xs: 2, md: 3 }),
}}
```

### Posicionamento absoluto / fixo

- [ ] Testado em xs (320px) e sm (480px)
- [ ] Não ultrapassa os limites do viewport em nenhuma direção
- [ ] `z-index` está declarado no token `zIndex.ts`, não hardcoded

## Regras proibidas

| Proibido                                         | Alternativa                                         |
| ------------------------------------------------ | --------------------------------------------------- |
| `@media (max-width: Xpx)` em TSX                 | `theme.breakpoints.down('sm')` em function sx       |
| `overflowX: 'hidden'` em container de dados      | `overflowX: 'auto'`                                 |
| `width: 300` sem fallback xs                     | `responsive({ xs: 'calc(100vw - 32px)', sm: 300 })` |
| `{ xs: 2, md: 4 }` direto no sx                  | `responsive({ xs: 2, md: 4 })`                      |
| Breakpoint `mobile/tablet/desktop` na assinatura | `xs/sm/md/lg/xl/xxl`                                |

## Viewports de teste obrigatórios

Antes de considerar o componente finalizado, testar visualmente em:

| Largura | Dispositivo simulado |
| ------- | -------------------- |
| 320px   | iPhone SE            |
| 480px   | Phone grande         |
| 768px   | iPad portrait        |
| 1024px  | iPad landscape       |
| 1280px  | Laptop padrão        |
| 1536px  | Monitor              |

## Gate de conclusão

Este skill é executado junto ao Quality Gate (skill 21). Um componente só está finalizado quando:

1. Passou nos 3 viewports críticos: 320px, 768px, 1280px
2. Tabelas com dados rolam horizontalmente em < md
3. Nenhum elemento ultrapassa a largura do viewport
4. `npm run typecheck` e `npm run lint` passam sem erros
