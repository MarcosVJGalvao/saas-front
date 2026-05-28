import { useState, useMemo } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import Chip from '@mui/material/Chip';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { alpha, useTheme, type SxProps, type Theme } from '@mui/material/styles';
import {
  getActionColorKey,
  getActionLabel,
  getResourceLabel,
  parsePermissionName,
  type ActionColorKey,
} from '@theme/utils/permissionLabels';

export interface PermissionOption {
  id: string;
  name: string;
  description?: string;
}

interface PermissionGroupSelectProps {
  value: string[];
  onChange: (ids: string[]) => void;
  options: PermissionOption[];
  loading?: boolean;
  disabled?: boolean;
  error?: string | undefined;
  sx?: SxProps<Theme>;
}

interface PermissionGroup {
  resource: string;
  resourceLabel: string;
  permissions: PermissionOption[];
}

const ACTION_ORDER = ['create', 'read', 'update', 'delete', 'write', 'list', 'export'];

const buildGroups = (options: PermissionOption[]): PermissionGroup[] => {
  const map = new Map<string, PermissionOption[]>();
  for (const option of options) {
    const { resource } = parsePermissionName(option.name);
    const group = map.get(resource) ?? [];
    group.push(option);
    map.set(resource, group);
  }
  return Array.from(map.entries())
    .map(([resource, permissions]) => ({
      resource,
      resourceLabel: getResourceLabel(resource),
      permissions: [...permissions].sort((permA, permB) => {
        const aIdx = ACTION_ORDER.indexOf(parsePermissionName(permA.name).action);
        const bIdx = ACTION_ORDER.indexOf(parsePermissionName(permB.name).action);
        return (aIdx === -1 ? 99 : aIdx) - (bIdx === -1 ? 99 : bIdx);
      }),
    }))
    .sort((groupA, groupB) => groupA.resourceLabel.localeCompare(groupB.resourceLabel, 'pt-BR'));
};

const ACTION_COLOR_MAP: Record<ActionColorKey, string> = {
  create: 'success',
  read: 'info',
  update: 'warning',
  delete: 'error',
  write: 'secondary',
  default: 'default',
};

interface ActionBadgeProps {
  permission: PermissionOption;
  checked: boolean;
  disabled: boolean;
  onToggle: () => void;
}

const ActionBadge = ({ permission, checked, disabled, onToggle }: ActionBadgeProps) => {
  const theme = useTheme();
  const { action } = parsePermissionName(permission.name);
  const colorKey = getActionColorKey(action);
  const paletteKey = ACTION_COLOR_MAP[colorKey];

  const colorByPaletteKey: Record<string, string> = {
    default: theme.palette.text.secondary,
    secondary: theme.palette.secondary.main,
    success: theme.palette.success.main,
    info: theme.palette.info.main,
    warning: theme.palette.warning.main,
    error: theme.palette.error.main,
  };
  const color = colorByPaletteKey[paletteKey] ?? theme.palette.text.secondary;

  return (
    <Chip
      label={getActionLabel(action) || action}
      size="small"
      onClick={disabled ? undefined : onToggle}
      disabled={disabled}
      variant={checked ? 'filled' : 'outlined'}
      sx={{
        cursor: disabled ? 'default' : 'pointer',
        borderColor: checked ? color : theme.palette.divider,
        bgcolor: checked ? alpha(color, 0.1) : 'transparent',
        color: checked ? color : 'text.secondary',
        fontWeight: checked ? 600 : 400,
        '& .MuiChip-label': { px: 1.25 },
        '&:hover': disabled
          ? {}
          : {
              bgcolor: checked ? alpha(color, 0.16) : alpha(theme.palette.action.hover, 0.6),
              borderColor: color,
            },
      }}
    />
  );
};

interface ResourceGroupProps {
  group: PermissionGroup;
  value: string[];
  disabled: boolean;
  onTogglePermission: (id: string, checked: boolean) => void;
  onToggleAll: (ids: string[], checked: boolean) => void;
}

const ResourceGroup = ({
  group,
  value,
  disabled,
  onTogglePermission,
  onToggleAll,
}: ResourceGroupProps) => {
  const [expanded, setExpanded] = useState(false);
  const theme = useTheme();

  const groupIds = group.permissions.map((perm) => perm.id);
  const selectedCount = groupIds.filter((id) => value.includes(id)).length;
  const allSelected = selectedCount === groupIds.length;
  const someSelected = selectedCount > 0 && !allSelected;
  const hasAny = selectedCount > 0;

  return (
    <Accordion
      expanded={expanded}
      onChange={(_, isExpanded) => setExpanded(isExpanded)}
      disableGutters
      elevation={0}
      sx={{
        border: `1px solid ${hasAny ? alpha(theme.palette.primary.main, 0.3) : theme.palette.divider}`,
        borderRadius: '8px !important',
        '&:before': { display: 'none' },
        '&.Mui-expanded': {
          borderColor: alpha(theme.palette.primary.main, 0.4),
        },
        transition: 'border-color 0.2s',
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon sx={{ fontSize: 18, color: 'text.secondary' }} />}
        sx={{
          minHeight: 48,
          px: 1.5,
          bgcolor: hasAny ? alpha(theme.palette.primary.main, 0.04) : 'background.default',
          borderRadius: expanded ? '8px 8px 0 0' : '8px',
          '& .MuiAccordionSummary-content': {
            alignItems: 'center',
            gap: 1,
            my: 0.75,
          },
        }}
      >
        <Checkbox
          size="small"
          checked={allSelected}
          indeterminate={someSelected}
          disabled={disabled}
          onClick={(event) => {
            event.stopPropagation();
            onToggleAll(groupIds, !allSelected);
          }}
          onChange={() => undefined}
          sx={{ p: 0.5, mr: 0.5 }}
        />
        <Typography variant="body2" sx={{ fontWeight: 600, flex: 1, color: 'text.primary' }}>
          {group.resourceLabel}
        </Typography>
        {hasAny && (
          <Chip
            label={`${selectedCount}/${groupIds.length}`}
            size="small"
            color="primary"
            sx={{ height: 20, fontSize: '0.7rem', fontWeight: 700, mr: 0.5 }}
          />
        )}
      </AccordionSummary>
      <AccordionDetails
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 0.75,
          px: 2,
          py: 1.5,
          borderTop: `1px solid ${theme.palette.divider}`,
          bgcolor: 'background.paper',
        }}
      >
        {group.permissions.map((permission) => (
          <ActionBadge
            key={permission.id}
            permission={permission}
            checked={value.includes(permission.id)}
            disabled={disabled}
            onToggle={() => onTogglePermission(permission.id, !value.includes(permission.id))}
          />
        ))}
      </AccordionDetails>
    </Accordion>
  );
};

export const PermissionGroupSelect = ({
  value,
  onChange,
  options,
  loading = false,
  disabled = false,
  error,
  sx,
}: PermissionGroupSelectProps) => {
  const [search, setSearch] = useState('');

  const groups = useMemo(() => buildGroups(options), [options]);

  const filteredGroups = useMemo(() => {
    const query = search.toLowerCase().trim();
    if (!query) return groups;
    return groups.filter(
      (group) =>
        group.resourceLabel.toLowerCase().includes(query) ||
        group.resource.toLowerCase().includes(query) ||
        group.permissions.some(
          (perm) =>
            perm.name.toLowerCase().includes(query) ||
            (perm.description?.toLowerCase().includes(query) ?? false),
        ),
    );
  }, [groups, search]);

  const handleTogglePermission = (id: string, checked: boolean) => {
    if (checked) {
      onChange([...value, id]);
    } else {
      onChange(value.filter((existing) => existing !== id));
    }
  };

  const handleToggleAll = (ids: string[], checked: boolean) => {
    if (checked) {
      onChange([...new Set([...value, ...ids])]);
    } else {
      onChange(value.filter((existing) => !ids.includes(existing)));
    }
  };

  return (
    <Box sx={sx}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
        <TextField
          size="small"
          placeholder="Filtrar permissões..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          disabled={disabled || loading}
          sx={{ flex: 1 }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                </InputAdornment>
              ),
            },
          }}
        />
        <Typography
          variant="caption"
          color={error ? 'error' : 'text.secondary'}
          sx={{ whiteSpace: 'nowrap' }}
        >
          {loading ? 'Carregando...' : `${value.length}/${options.length} selecionadas`}
        </Typography>
      </Box>

      {error ? (
        <Typography variant="caption" color="error" sx={{ mb: 1.5, display: 'block' }}>
          {error}
        </Typography>
      ) : null}

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          maxHeight: 480,
          overflowY: 'auto',
          pr: 0.5,
        }}
      >
        {loading ? (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
            Carregando permissões...
          </Typography>
        ) : filteredGroups.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
            Nenhuma permissão encontrada.
          </Typography>
        ) : (
          filteredGroups.map((group) => (
            <ResourceGroup
              key={group.resource}
              group={group}
              value={value}
              disabled={disabled}
              onTogglePermission={handleTogglePermission}
              onToggleAll={handleToggleAll}
            />
          ))
        )}
      </Box>
    </Box>
  );
};
