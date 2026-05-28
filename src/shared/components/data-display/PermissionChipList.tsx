import { useState } from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';

const VISIBLE_LIMIT = 8;

interface PermissionChipListProps {
  permissions: string[];
}

export const PermissionChipList = ({ permissions }: PermissionChipListProps) => {
  const [expanded, setExpanded] = useState(false);

  if (permissions.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        Nenhuma permissão associada.
      </Typography>
    );
  }

  const visible = expanded ? permissions : permissions.slice(0, VISIBLE_LIMIT);
  const hiddenCount = permissions.length - VISIBLE_LIMIT;

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mt: 0.5 }}>
      {visible.map((permission) => (
        <Chip
          key={permission}
          label={permission}
          size="small"
          variant="outlined"
          sx={{ fontFamily: 'monospace', fontSize: '0.7rem' }}
        />
      ))}
      {!expanded && hiddenCount > 0 && (
        <Chip
          label={`+${hiddenCount}`}
          size="small"
          color="primary"
          variant="outlined"
          onClick={() => setExpanded(true)}
          sx={{ cursor: 'pointer', fontWeight: 600 }}
        />
      )}
      {expanded && permissions.length > VISIBLE_LIMIT && (
        <Chip
          label="Recolher"
          size="small"
          variant="outlined"
          onClick={() => setExpanded(false)}
          sx={{ cursor: 'pointer' }}
        />
      )}
    </Box>
  );
};
