import { ActionButtons } from '@shared/components/actions/ActionButtons';
import { AppPaper } from '@shared/components/data-display/AppPaper';
import { AppText } from '@shared/components/data-display/AppText';
import { AppAlert } from '@shared/components/feedback/AppAlert';
import { ConfirmDialog } from '@shared/components/feedback/ConfirmDialog';
import { ListFilters } from '@shared/components/data-display/data/ListFilters';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { layoutSpacing } from '@theme/spacing';
import { useReportCardEntriesPageViewModel } from '@features/client/report-cards/hooks/useReportCardEntriesPageViewModel';

const ReportCardEntriesPage = () => {
  const model = useReportCardEntriesPageViewModel();

  return (
    <AppStack spacing={2}>
      <PageHeader title="Lançamentos de boletim" subtitle="Gerencie lançamentos de notas." />
      {model.errorMessage ? <AppAlert severity="error">{model.errorMessage}</AppAlert> : null}
      {model.successMessage ? <AppAlert severity="success">{model.successMessage}</AppAlert> : null}
      <AppPaper sx={{ p: layoutSpacing.cardPadding, borderRadius: 2 }}>
        <AppStack spacing={2}>
          <AppText variant="h6">Remoção de lançamento</AppText>
          <AppText color="text.secondary">
            Informe o lançamento para remover registros incorretos antes de um novo envio.
          </AppText>
          <ListFilters
            fields={[
              {
                type: 'text',
                name: 'entryId',
                label: 'Lançamento',
                placeholder: 'ID do lançamento',
                mobileOrder: 1,
              },
            ]}
            values={model.values}
            onChange={model.onChange}
            onApply={model.requestRemove}
            onClear={model.clear}
            loading={model.loading}
            applyLabel="Remover"
          />
          <ActionButtons
            fullWidthOnMobile={false}
            align="flex-start"
            actions={[
              {
                type: 'custom',
                label: 'Envio individual e em lote serão conectados ao formulário de notas.',
                onClick: () => undefined,
                disabled: true,
                variant: 'outlined',
              },
            ]}
          />
        </AppStack>
      </AppPaper>
      <ConfirmDialog
        open={model.confirmOpen}
        title="Remover lançamento"
        description="Confirma a remoção deste lançamento de boletim?"
        confirmLabel={model.loading ? 'Removendo...' : 'Remover'}
        onCancel={model.closeConfirm}
        onConfirm={() => {
          void model.confirmRemove();
        }}
      />
    </AppStack>
  );
};

export default ReportCardEntriesPage;
