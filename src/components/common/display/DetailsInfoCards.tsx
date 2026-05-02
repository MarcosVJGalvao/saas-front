import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { InfoList } from './InfoList';

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
  <Stack spacing={2}>
    <Typography variant="h5">{pageTitle}</Typography>
    {sections.map((section) => (
      <Card key={section.key}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 1.5 }}>
            {section.title}
          </Typography>
          <InfoList items={[...section.items]} />
        </CardContent>
      </Card>
    ))}
  </Stack>
);
