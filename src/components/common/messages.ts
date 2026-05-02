export interface CommonDataMessages {
  searchPlaceholder: string;
  filterButton: string;
  filterClear: string;
  filterApply: string;
  loadingData: string;
  emptyTitle: string;
  emptyDescription: string;
}

export interface CommonOverlayMessages {
  openMenuAriaLabel: string;
}

export const commonDataMessages: CommonDataMessages = {
  searchPlaceholder: 'Buscar...',
  filterButton: 'Filtros',
  filterClear: 'Limpar',
  filterApply: 'Aplicar',
  loadingData: 'Carregando dados',
  emptyTitle: 'Nenhum registro encontrado',
  emptyDescription: 'Ajuste os filtros e tente novamente.',
};

export const commonOverlayMessages: CommonOverlayMessages = {
  openMenuAriaLabel: 'Abrir menu',
};
