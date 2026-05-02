import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { SubscriptionPlanHistory } from '../../models/subscriptions';

export const SubscriptionHistoryDialog = ({
  open,
  onClose,
  rows,
}: {
  open: boolean;
  onClose: () => void;
  rows: SubscriptionPlanHistory[];
}) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>Histórico de plano</DialogTitle>
    <DialogContent>
      <Stack spacing={1}>
        {rows.map((item) => (
          <Typography key={item.id}>
            {item.fromPlanId ?? '-'} {'->'} {item.toPlanId} ({item.changedAt})
          </Typography>
        ))}
      </Stack>
    </DialogContent>
  </Dialog>
);
