import Chip from '@mui/material/Chip';
import type { ClientStatus } from '../../models/clients';

const statusLabel: Record<ClientStatus, string> = { active: 'Ativa', inactive: 'Cancelada' };
const statusSx: Record<ClientStatus, object> = {
  active: { bgcolor: 'rgba(34,197,94,0.14)', color: '#15803D', fontWeight: 600 },
  inactive: { bgcolor: 'rgba(239,68,68,0.14)', color: '#B91C1C', fontWeight: 600 },
};

export const ClientStatusBadge = ({ status }: { status: ClientStatus }) => (
  <Chip size="small" label={statusLabel[status]} sx={statusSx[status]} />
);
