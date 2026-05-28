import { useSearchParams } from 'react-router-dom';
import { AppTabs } from '@shared/components/navigation/AppTabs';
import { AppStack } from '@shared/components/layout/AppStack';
import EducationLevelsListTab from '@features/client/academic/components/EducationLevelsListTab';
import GradesListTab from '@features/client/academic/components/GradesListTab';

const TABS = [
  { label: 'Níveis de ensino', value: 'education-levels' },
  { label: 'Séries', value: 'grades' },
];

const AcademicStructurePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get('tab') ?? 'education-levels';

  const handleTabChange = (nextTab: string) => {
    setSearchParams({ tab: nextTab }, { replace: true });
  };

  return (
    <AppStack spacing={2}>
      <AppTabs tabs={TABS} value={tab} onChange={handleTabChange} />
      {tab === 'education-levels' ? <EducationLevelsListTab /> : <GradesListTab />}
    </AppStack>
  );
};

export default AcademicStructurePage;
