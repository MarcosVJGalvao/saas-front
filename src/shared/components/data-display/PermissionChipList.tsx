import { useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';
import {
  getActionColorKey,
  getActionLabel,
  getResourceLabel,
  parsePermissionName,
  type ActionColorKey,
} from '@theme/utils/permissionLabels';

interface PermissionChipListProps {
  permissions: string[];
}

interface PermissionGroup {
  resource: string;
  resourceLabel: string;
  actions: string[];
}

const ACTION_ORDER = ['create', 'read', 'update', 'delete', 'write', 'list', 'export'];

const buildGroups = (permissions: string[]): PermissionGroup[] => {
  const map = new Map<string, string[]>();
  for (const permission of permissions) {
    const { resource, action } = parsePermissionName(permission);
    const actions = map.get(resource) ?? [];
    actions.push(action);
    map.set(resource, actions);
  }
  return Array.from(map.entries())
    .map(([resource, actions]) => ({
      resource,
      resourceLabel: getResourceLabel(resource),
      actions: [...actions].sort((actionA, actionB) => {
        const aIdx = ACTION_ORDER.indexOf(actionA);
        const bIdx = ACTION_ORDER.indexOf(actionB);
        return (aIdx === -1 ? 99 : aIdx) - (bIdx === -1 ? 99 : bIdx);
      }),
    }))
    .sort((groupA, groupB) => groupA.resourceLabel.localeCompare(groupB.resourceLabel, 'pt-BR'));
};

interface ActionChipProps {
  action: string;
}

const ActionChip = ({ action }: ActionChipProps) => {
  const theme = useTheme();
  const colorKey: ActionColorKey = getActionColorKey(action);

  const colorMap: Record<ActionColorKey, string> = {
    create: theme.palette.success.main,
    read: theme.palette.info.main,
    update: theme.palette.warning.main,
    delete: theme.palette.error.main,
    write: theme.palette.secondary.main,
    default: theme.palette.text.secondary,
  };

  const color = colorMap[colorKey];

  return (
    <Chip
      label={getActionLabel(action) || action}
      size="small"
      sx={{
        height: 22,
        fontSize: '0.7rem',
        fontWeight: 500,
        color,
        borderColor: alpha(color, 0.4),
        bgcolor: alpha(color, 0.07),
        border: '1px solid',
        '& .MuiChip-label': { px: 1 },
      }}
    />
  );
};

const VISIBLE_GROUPS = 6;

export const PermissionChipList = ({ permissions }: PermissionChipListProps) => {
  const [expanded, setExpanded] = useState(false);

  const groups = useMemo(() => buildGroups(permissions), [permissions]);

  if (permissions.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        Nenhuma permissão associada.
      </Typography>
    );
  }

  const visibleGroups = expanded ? groups : groups.slice(0, VISIBLE_GROUPS);
  const hiddenCount = groups.length - VISIBLE_GROUPS;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75, mt: 0.5 }}>
      {visibleGroups.map((group) => (
        <Box
          key={group.resource}
          sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexWrap: 'wrap' }}
        >
          <Typography
            variant="caption"
            sx={{
              fontWeight: 600,
              color: 'text.secondary',
              minWidth: 90,
              fontSize: '0.7rem',
            }}
          >
            {group.resourceLabel}
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
            {group.actions.map((action) => (
              <ActionChip key={action} action={action} />
            ))}
          </Box>
        </Box>
      ))}

      {!expanded && hiddenCount > 0 && (
        <Chip
          label={`+${hiddenCount} recursos`}
          size="small"
          color="primary"
          variant="outlined"
          onClick={() => setExpanded(true)}
          sx={{
            cursor: 'pointer',
            fontWeight: 600,
            alignSelf: 'flex-start',
            height: 22,
            fontSize: '0.7rem',
          }}
        />
      )}
      {expanded && groups.length > VISIBLE_GROUPS && (
        <Chip
          label="Recolher"
          size="small"
          variant="outlined"
          onClick={() => setExpanded(false)}
          sx={{ cursor: 'pointer', alignSelf: 'flex-start', height: 22, fontSize: '0.7rem' }}
        />
      )}
    </Box>
  );
};
