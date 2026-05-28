import { useSearchParams } from 'react-router-dom';
import { AppTabs } from '@shared/components/navigation/AppTabs';
import { AppStack } from '@shared/components/layout/AppStack';
import UsersListTab from '@features/client/admin/components/UsersListTab';
import RolesListTab from '@features/client/admin/components/RolesListTab';

const TABS = [
  { label: 'Usuários', value: 'users' },
  { label: 'Perfis', value: 'roles' },
];

const AccessPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get('tab') ?? 'users';

  const handleTabChange = (nextTab: string) => {
    setSearchParams({ tab: nextTab }, { replace: true });
  };

  return (
    <AppStack spacing={2}>
      <AppTabs tabs={TABS} value={tab} onChange={handleTabChange} />
      {tab === 'users' ? <UsersListTab /> : <RolesListTab />}
    </AppStack>
  );
};

export default AccessPage;
