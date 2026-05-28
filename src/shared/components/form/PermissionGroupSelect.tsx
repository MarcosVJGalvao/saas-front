import { useState, useMemo } from 'react';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import Collapse from '@mui/material/Collapse';
import FormControlLabel from '@mui/material/FormControlLabel';
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

const useActionColors = (colorKey: ActionColorKey) => {
  const theme = useTheme();
  const palette = theme.palette;
  const map: Record<ActionColorKey, { main: string; light: string }> = {
    create: { main: palette.success.main, light: alpha(palette.success.main, 0.08) },
    read: { main: palette.info.main, light: alpha(palette.info.main, 0.08) },
    update: { main: palette.warning.main, light: alpha(palette.warning.main, 0.08) },
    delete: { main: palette.error.main, light: alpha(palette.error.main, 0.08) },
    write: { main: palette.secondary.main, light: alpha(palette.secondary.main, 0.08) },
    default: { main: palette.text.secondary, light: alpha(palette.text.secondary, 0.06) },
  };
  return map[colorKey];
};

interface ActionBadgeProps {
  permission: PermissionOption;
  checked: boolean;
  disabled: boolean;
  onToggle: () => void;
}

const ActionBadge = ({ permission, checked, disabled, onToggle }: ActionBadgeProps) => {
  const { action } = parsePermissionName(permission.name);
  const colorKey = getActionColorKey(action);
  const colors = useActionColors(colorKey);

  return (
    <Box
      onClick={disabled ? undefined : onToggle}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 0.5,
        px: 1.25,
        py: 0.6,
        borderRadius: 1.5,
        border: '1.5px solid',
        borderColor: checked ? colors.main : 'divider',
        bgcolor: checked ? colors.light : 'transparent',
        cursor: disabled ? 'default' : 'pointer',
        transition: 'all 0.15s ease',
        userSelect: 'none',
        '&:hover': disabled
          ? {}
          : {
              borderColor: colors.main,
              bgcolor: colors.light,
            },
      }}
    >
      <Checkbox
        checked={checked}
        disabled={disabled}
        size="small"
        tabIndex={-1}
        disableRipple
        sx={{
          p: 0,
          color: checked ? colors.main : 'text.disabled',
          '&.Mui-checked': { color: colors.main },
          '& .MuiSvgIcon-root': { fontSize: 16 },
          pointerEvents: 'none',
        }}
      />
      <Typography
        variant="caption"
        sx={{
          fontWeight: checked ? 600 : 400,
          color: checked ? colors.main : 'text.secondary',
          lineHeight: 1,
          whiteSpace: 'nowrap',
        }}
      >
        {getActionLabel(action) || action}
      </Typography>
    </Box>
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
  const [expanded, setExpanded] = useState(true);
  const theme = useTheme();

  const groupIds = group.permissions.map((permission) => permission.id);
  const selectedCount = groupIds.filter((id) => value.includes(id)).length;
  const allSelected = selectedCount === groupIds.length;
  const someSelected = selectedCount > 0 && !allSelected;

  return (
    <Box
      sx={{
        border: '1px solid',
        borderColor:
          someSelected || allSelected ? alpha(theme.palette.primary.main, 0.2) : 'divider',
        borderRadius: 2,
        overflow: 'hidden',
        transition: 'border-color 0.15s ease',
      }}
    >
      <Box
        onClick={() => setExpanded((prev) => !prev)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          px: 2,
          py: 1.25,
          bgcolor:
            someSelected || allSelected
              ? alpha(theme.palette.primary.main, 0.04)
              : 'background.default',
          cursor: 'pointer',
          userSelect: 'none',
          '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.04) },
        }}
      >
        <FormControlLabel
          onClick={(event) => event.stopPropagation()}
          control={
            <Checkbox
              size="small"
              checked={allSelected}
              indeterminate={someSelected}
              disabled={disabled}
              onChange={(_, checked) => onToggleAll(groupIds, checked)}
              sx={{ p: 0.5 }}
            />
          }
          label=""
          sx={{ m: 0 }}
        />
        <Typography variant="body2" sx={{ fontWeight: 600, flex: 1 }}>
          {group.resourceLabel}
        </Typography>
        {selectedCount > 0 && (
          <Typography variant="caption" color="primary" sx={{ fontWeight: 600 }}>
            {selectedCount}/{groupIds.length}
          </Typography>
        )}
        {expanded ? (
          <ExpandLessIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
        ) : (
          <ExpandMoreIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
        )}
      </Box>

      <Collapse in={expanded}>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 0.75,
            px: 2,
            py: 1.5,
            borderTop: '1px solid',
            borderColor: 'divider',
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
        </Box>
      </Collapse>
    </Box>
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
          (permission) =>
            permission.name.toLowerCase().includes(query) ||
            (permission.description?.toLowerCase().includes(query) ?? false),
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
      const newIds = [...new Set([...value, ...ids])];
      onChange(newIds);
    } else {
      onChange(value.filter((existing) => !ids.includes(existing)));
    }
  };

  const totalSelected = value.length;
  const totalAvailable = options.length;

  return (
    <Box sx={sx}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
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
            {loading ? 'Carregando...' : `${totalSelected}/${totalAvailable} selecionadas`}
          </Typography>
        </Box>

        {error ? (
          <Typography variant="caption" color="error">
            {error}
          </Typography>
        ) : null}

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            maxHeight: 420,
            overflowY: 'auto',
            pr: 0.5,
          }}
        >
          {loading ? (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
              Carregando permissões...
            </Typography>
          ) : filteredGroups.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
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
    </Box>
  );
};
