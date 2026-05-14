import { AppCard } from '@shared/components/data-display/AppCard';
import { AppBox } from '@shared/components/layout/AppBox';
import { AppGrid } from '@shared/components/layout/AppGrid';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { layoutSpacing } from '@theme/spacing';

const DashboardPage = () => (
  <AppBox sx={{ width: '100%' }}>
    <PageHeader title="Dashboard" />
    <AppGrid container spacing={layoutSpacing.gridGap}>
      {[1, 2, 3, 4].map((item) => (
        <AppGrid key={item} size={{ xs: 12, sm: 6, lg: 3 }}>
          <AppCard sx={{ p: layoutSpacing.cardPadding }}>Card {item}</AppCard>
        </AppGrid>
      ))}
    </AppGrid>
  </AppBox>
);

export default DashboardPage;
