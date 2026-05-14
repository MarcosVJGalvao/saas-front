import type { ReactNode } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

export interface EntitySummaryCardItem {
  key: string;
  title: string;
  value: number | string;
  delta: string;
  icon: ReactNode;
  color: string;
}

interface EntitySummaryCardsProps {
  cards: ReadonlyArray<EntitySummaryCardItem>;
}

export const EntitySummaryCards = ({ cards }: EntitySummaryCardsProps) => (
  <Grid container spacing={1.5}>
    {cards.map((card) => (
      <Grid key={card.key} size={{ xs: 12, sm: 6, lg: 3 }}>
        <Card sx={{ borderRadius: 2 }}>
          <CardContent>
            <Typography variant="body2" color="text.secondary">
              {card.title}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, mt: 0.5 }}>
              {card.value}
            </Typography>
            <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center', mt: 0.5 }}>
              {card.icon}
              <Typography variant="caption" color={card.color}>
                {card.delta}
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </Grid>
    ))}
  </Grid>
);
