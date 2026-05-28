import { useSearchParams } from 'react-router-dom';
import { AppTabs } from '@shared/components/navigation/AppTabs';
import { AppStack } from '@shared/components/layout/AppStack';
import FinancialCategoriesListTab from '@features/client/financial/components/FinancialCategoriesListTab';
import FinancialCostCentersListTab from '@features/client/financial/components/FinancialCostCentersListTab';

const TABS = [
  { label: 'Categorias', value: 'categories' },
  { label: 'Centros de custo', value: 'cost-centers' },
];

const FinancialRegistersPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get('tab') ?? 'categories';

  const handleTabChange = (nextTab: string) => {
    setSearchParams({ tab: nextTab }, { replace: true });
  };

  return (
    <AppStack spacing={2}>
      <AppTabs tabs={TABS} value={tab} onChange={handleTabChange} />
      {tab === 'categories' ? <FinancialCategoriesListTab /> : <FinancialCostCentersListTab />}
    </AppStack>
  );
};

export default FinancialRegistersPage;
