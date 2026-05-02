import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import MoneyOutlinedIcon from '@mui/icons-material/MoneyOutlined';
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined';
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import RemoveIcon from '@mui/icons-material/Remove';
import Box from '@mui/material/Box';
import { alpha } from '@mui/material/styles';

interface MetricsCardsProps {
  loading: boolean;
  active: number;
  trialing: number;
  canceled: number;
  mrr: number;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

export const MetricsCards = ({ loading, active, trialing, canceled, mrr }: MetricsCardsProps) => {
  const theme = useTheme();
  const cards = [
    {
      title: 'Assinaturas Ativas',
      value: String(active),
      icon: <GroupOutlinedIcon color="primary" />,
      iconBackground: theme.palette.primary.main,
      iconTint: theme.palette.primary.main,
      variation: '100% vs mês anterior',
      variationType: 'positive' as const,
    },
    {
      title: 'Em Trial',
      value: String(trialing),
      icon: <ScheduleOutlinedIcon color="warning" />,
      iconBackground: theme.palette.warning.main,
      iconTint: theme.palette.warning.main,
      variation: '50% vs mês anterior',
      variationType: 'positive' as const,
    },
    {
      title: 'Canceladas (mês)',
      value: String(canceled),
      icon: <HighlightOffOutlinedIcon color="error" />,
      iconBackground: theme.palette.error.main,
      iconTint: theme.palette.error.main,
      variation: '0% vs mês anterior',
      variationType: 'neutral' as const,
    },
    {
      title: 'MRR',
      value: formatCurrency(mrr),
      icon: <MoneyOutlinedIcon color="success" />,
      iconBackground: theme.palette.success.main,
      iconTint: theme.palette.success.main,
      variation: '100% vs mês anterior',
      variationType: 'positive' as const,
    },
  ];

  return (
    <Grid container spacing={2}>
      {cards.map((card) => (
        <Grid key={card.title} size={{ xs: 12, sm: 6, lg: 3 }}>
          <Paper
            elevation={1}
            sx={{
              maxWidth: theme.spacing(35),
              p: theme.spacing(2),
              borderRadius: theme.spacing(1.5),
              bgcolor: theme.palette.background.paper,
              boxShadow: `0 ${theme.spacing(0.5)} ${theme.spacing(2)} ${theme.palette.divider}`,
              minHeight: theme.spacing(16),
            }}
          >
            <Stack spacing={theme.spacing(1)}>
              <Stack direction="row" spacing={theme.spacing(1)} sx={{ alignItems: 'center' }}>
                {loading ? (
                  <Skeleton variant="rounded" width={44} height={44} />
                ) : (
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: theme.spacing(1.5),
                      bgcolor: alpha(card.iconBackground, 0.12),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Box sx={{ color: card.iconTint, display: 'flex' }}>{card.icon}</Box>
                  </Box>
                )}
                <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 600 }}>
                  {card.title}
                </Typography>
              </Stack>
              {loading ? (
                <Skeleton width="45%" height={34} />
              ) : (
                <Typography variant="h4">{card.value}</Typography>
              )}
              {loading ? (
                <Skeleton width="60%" />
              ) : (
                <Stack direction="row" spacing={theme.spacing(1)} sx={{ alignItems: 'center' }}>
                  {card.variationType === 'positive' ? (
                    <ArrowUpwardIcon fontSize="small" color="success" />
                  ) : (
                    <RemoveIcon fontSize="small" color="action" />
                  )}
                  <Typography
                    variant="caption"
                    color={
                      card.variationType === 'positive'
                        ? theme.palette.success.main
                        : theme.palette.text.secondary
                    }
                  >
                    {card.variation}
                  </Typography>
                </Stack>
              )}
            </Stack>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};
