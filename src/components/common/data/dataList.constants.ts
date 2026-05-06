import { spacingScale } from '../../../theme/spacing';

export const DATA_LIST_BREAKPOINT = {
  MOBILE_MAX: 'md',
  TABLET_MAX: 'lg',
};

export const DATA_LIST_DIMENSIONS = {
  borderRadius: 2,
  mobileCardRadius: 1.5,
  rowMinHeight: 7,
  footerMinHeight: 8,
  actionColumnWidth: '72px',
};

export const DATA_LIST_GRID = {
  desktop:
    'minmax(220px, 1.6fr) minmax(140px, 1fr) minmax(120px, 0.8fr) minmax(120px, 0.8fr) minmax(130px, 0.8fr) minmax(130px, 0.8fr) 72px',
  tablet: 'minmax(220px, 1.6fr) minmax(140px, 1fr) minmax(100px, 0.8fr) minmax(120px, 0.8fr) 64px',
};

export const DATA_LIST_PAGINATION_LABELS = {
  rowsPerPage: 'Itens por página:',
  previous: 'Página anterior',
  next: 'Próxima página',
};

export const DATA_LIST_DEFAULTS = {
  emptyTitle: 'Nenhum registro encontrado',
  emptyDescription: 'Tente ajustar os filtros ou criar um novo registro.',
  rowSkeletonCount: 8,
  mobileSkeletonCount: 4,
  mobileFallback: '-',
  rowPaddingY: spacingScale.xs,
};
