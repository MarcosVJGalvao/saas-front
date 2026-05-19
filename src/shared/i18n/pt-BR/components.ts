export const sharedComponentsI18n = {
  entityDetails: {
    loadingLabel: 'Carregando...',
    emptyTitle: 'Registro não encontrado',
    emptyMessage: 'O registro solicitado não existe.',
    errorFallback: 'Não foi possível carregar os dados.',
    unauthorizedTitle: 'Acesso não autorizado',
    unauthorizedMessage: 'Faça login novamente.',
    forbiddenTitle: 'Acesso negado',
    forbiddenMessage: 'Sem permissão para este recurso.',
  },

  confirmDialog: {
    confirmLabel: 'Confirmar',
    cancelLabel: 'Cancelar',
  },

  errorState: {
    title: 'Erro ao carregar',
    retryLabel: 'Tentar novamente',
  },

  snackbarError: {
    correlationIdLabel: 'Código:',
    copyTooltip: 'Copiar código',
    copyAriaLabel: 'Copiar código do erro',
  },

  dataList: {
    emptyTitle: 'Nenhum registro encontrado',
    emptyDescription: 'Tente ajustar os filtros ou criar um novo registro.',
    mobileFallback: '-',
    mobileItemsFallback: 'Itens',
    mobileActionsFallback: 'Ações',
    pagination: {
      rowsPerPage: 'Itens por página:',
      previous: 'Página anterior',
      next: 'Próxima página',
      rangeZero: '0-0 de 0',
      rangeLabel: ({ from, to, count }: { from: number; to: number; count: number }) =>
        `${from}-${to} de ${count !== -1 ? count : `mais de ${to}`}`,
    },
  },

  filters: {
    title: 'Filtros',
    subtitle: 'Refine sua busca e encontre exatamente o que precisa',
    searchPlaceholder: 'Buscar...',
    filterButton: 'Filtros',
    applyLabel: 'Aplicar filtros',
    applyingLabel: 'Aplicando...',
    clearLabel: 'Limpar filtros',
    filterApply: 'Aplicar',
    filterClear: 'Limpar',
    selectPlaceholder: 'Selecione',
    dateStartLabel: 'Data inicial',
    dateEndLabel: 'Data final',
    collapseLabel: 'Recolher filtros',
    expandLabel: 'Expandir filtros',
  },

  sessionExpired: {
    title: 'Sessão expirada',
    message: 'Sua sessão expirou por segurança. Faça login novamente para continuar.',
    loginLabel: 'Fazer login',
  },

  overlays: {
    openMenuAriaLabel: 'Abrir menu',
  },
};
