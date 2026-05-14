import CardContent from '@mui/material/CardContent';
import { AppCard } from '@shared/components/data-display/AppCard';
import { AppText } from '@shared/components/data-display/AppText';
import { InfoList } from '@shared/components/data-display/InfoList';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';

interface DetailsInfoItem {
  label: string;
  value: string;
}

interface DetailsInfoSection {
  key: string;
  title: string;
  items: ReadonlyArray<DetailsInfoItem>;
}

interface DetailsInfoCardsProps {
  pageTitle: string;
  sections: ReadonlyArray<DetailsInfoSection>;
}

export const DetailsInfoCards = ({ pageTitle, sections }: DetailsInfoCardsProps) => (
  <AppStack spacing={2}>
    <PageHeader title={pageTitle} />
    {sections.map((section) => (
      <AppCard key={section.key}>
        <CardContent>
          <AppText variant="h6" sx={{ mb: 1.5 }}>
            {section.title}
          </AppText>
          <InfoList items={[...section.items]} />
        </CardContent>
      </AppCard>
    ))}
  </AppStack>
);
