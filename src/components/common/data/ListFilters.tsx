import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import type { SxProps, Theme } from '@mui/material/styles';
import { useMemo, useState } from 'react';
import { ActionButtons } from '../actions/ActionButtons';
import { AppDatePicker } from '../date/AppDatePicker';
import { DateRangePicker } from '../form/DateRangePicker';
import { commonDataMessages } from '../messages';
import type { FilterField, ListFiltersProps } from './listFilters.types';
import { buildMobileOrderMap, toDateValue, toStringValue } from './listFilters.utils';
import { layoutSpacing, spacingScale } from '../../../theme/spacing';

interface RenderFieldParams {
  field: FilterField;
  isDisabled: boolean;
  mobileOrder: number;
  onChange: (name: string, value: unknown) => void;
  values: Record<string, unknown>;
}
type SelectFilterField = Extract<FilterField, { type: 'select' }>;
type TextFilterField = Extract<FilterField, { type: 'text' }>;

const createBaseFieldSx = (mobileOrder: number): SxProps<Theme> => ({
  order: { xs: mobileOrder, sm: 'unset' },
});

const renderTextField = ({
  field,
  isDisabled,
  mobileOrder,
  onChange,
  values,
}: Omit<RenderFieldParams, 'field'> & { field: TextFilterField }) => (
  <Stack
    key={field.name}
    spacing={spacingScale.xxs}
    sx={{
      ...createBaseFieldSx(mobileOrder),
      gridColumn: { xs: 'auto', md: 'span 2', lg: 'span 2' },
    }}
  >
    <Typography variant="body2">{field.label}</Typography>
    <TextField
      size="small"
      fullWidth
      value={toStringValue(values[field.name])}
      onChange={(event) => onChange(field.name, event.target.value)}
      placeholder={field.placeholder ?? commonDataMessages.searchPlaceholder}
      disabled={isDisabled}
      error={field.error}
      helperText={field.helperText}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" color="action" />
            </InputAdornment>
          ),
        },
      }}
    />
  </Stack>
);

const renderSelectField = ({
  field,
  isDisabled,
  mobileOrder,
  onChange,
  values,
}: Omit<RenderFieldParams, 'field'> & { field: SelectFilterField }) => (
  <Stack key={field.name} spacing={spacingScale.xxs} sx={createBaseFieldSx(mobileOrder)}>
    <Typography variant="body2">{field.label}</Typography>
    <TextField
      select
      size="small"
      fullWidth
      value={toStringValue(values[field.name])}
      onChange={(event) => onChange(field.name, event.target.value)}
      disabled={isDisabled}
      error={field.error}
      helperText={field.helperText}
      slotProps={{ select: { displayEmpty: true } }}
    >
      <MenuItem value="">{field.placeholder ?? 'Selecione'}</MenuItem>
      {field.options
        .filter((option) => option.value.length > 0)
        .map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
    </TextField>
  </Stack>
);

const renderFilterField = ({
  field,
  isDisabled,
  mobileOrder,
  onChange,
  values,
}: RenderFieldParams) => {
  if (field.type === 'text') {
    return renderTextField({ field, isDisabled, mobileOrder, onChange, values });
  }

  if (field.type === 'select') {
    return renderSelectField({ field, isDisabled, mobileOrder, onChange, values });
  }

  if (field.type === 'date') {
    return (
      <Stack key={field.name} spacing={spacingScale.xxs} sx={createBaseFieldSx(mobileOrder)}>
        <Typography variant="body2">{field.label}</Typography>
        <AppDatePicker
          label=""
          value={toDateValue(values[field.name])}
          onChange={(nextValue) => onChange(field.name, nextValue)}
          disabled={isDisabled}
          error={field.error}
          helperText={field.helperText}
          textFieldSlotProps={{ size: 'small' }}
        />
      </Stack>
    );
  }

  return (
    <Stack key={field.name} spacing={spacingScale.xxs} sx={createBaseFieldSx(mobileOrder)}>
      <Typography variant="body2">{field.label}</Typography>
      <DateRangePicker
        compact
        startLabel="Data inicial"
        endLabel="Data final"
        startValue={toDateValue(values[field.startName])}
        endValue={toDateValue(values[field.endName])}
        onStartChange={(nextValue) => onChange(field.startName, nextValue)}
        onEndChange={(nextValue) => onChange(field.endName, nextValue)}
        disabled={isDisabled}
        startTextFieldSx={{ minWidth: { xs: '100%', sm: 150 } }}
        endTextFieldSx={{ minWidth: { xs: '100%', sm: 150 } }}
      />
    </Stack>
  );
};

const renderFieldsGrid = (
  fields: FilterField[],
  loading: boolean,
  mobileOrderMap: Map<string, number>,
  onChange: (name: string, value: unknown) => void,
  values: Record<string, unknown>,
) => (
  <Box
    sx={{
      display: 'grid',
      gridTemplateColumns: {
        xs: '1fr',
        sm: 'repeat(2, minmax(0, 1fr))',
        md: 'repeat(3, minmax(0, 1fr))',
        lg: 'repeat(5, minmax(0, 1fr))',
      },
      gap: layoutSpacing.gridGap,
    }}
  >
    {fields.map((field) =>
      renderFilterField({
        field,
        isDisabled: loading || Boolean(field.disabled),
        mobileOrder: mobileOrderMap.get(field.name) ?? 99,
        onChange,
        values,
      }),
    )}
  </Box>
);

interface FiltersHeaderProps {
  collapsible: boolean;
  expanded: boolean;
  title: string;
  subtitle: string;
  onToggleExpanded: () => void;
}

const FiltersHeader = ({
  collapsible,
  expanded,
  title,
  subtitle,
  onToggleExpanded,
}: FiltersHeaderProps) => {
  const collapseLabel = expanded ? 'Recolher filtros' : 'Expandir filtros';
  const collapseIcon = expanded ? (
    <KeyboardArrowUpIcon sx={{ fontSize: 18 }} />
  ) : (
    <KeyboardArrowDownIcon sx={{ fontSize: 18 }} />
  );

  return (
    <Stack
      direction="row"
      sx={{
        paddingBottom: spacingScale.sm,
        gap: spacingScale.sm,
        alignItems: 'flex-start',
        justifyContent: 'space-between',
      }}
    >
      <Stack
        direction="row"
        spacing={spacingScale.sm}
        sx={{ flex: 1, minWidth: 0, alignItems: 'center' }}
      >
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: 1.5,
            bgcolor: (theme) =>
              theme.palette.mode === 'dark' ? theme.palette.action.hover : '#EEF3FF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <FilterAltOutlinedIcon
            sx={{ fontSize: 20, color: (theme) => theme.palette.primary.main }}
          />
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="h5" color="text.primary">
            {title}
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              display: { xs: 'none', sm: 'block' },
              whiteSpace: 'normal',
              overflowWrap: 'anywhere',
            }}
          >
            {subtitle}
          </Typography>
        </Box>
      </Stack>
      {collapsible ? (
        <Stack direction="row" sx={{ flexShrink: 0, alignItems: 'center' }}>
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            <ActionButtons
              fullWidthOnMobile={false}
              actions={[
                {
                  type: 'custom',
                  label: collapseLabel,
                  onClick: onToggleExpanded,
                  variant: 'outlined',
                  size: 'medium',
                  endIcon: collapseIcon,
                },
              ]}
            />
          </Box>
          <IconButton
            aria-label={collapseLabel}
            onClick={onToggleExpanded}
            sx={{
              display: { xs: 'inline-flex', sm: 'none' },
              border: (theme) => `1px solid ${theme.palette.divider}`,
              borderRadius: 1.5,
            }}
          >
            {expanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </Stack>
      ) : null}
    </Stack>
  );
};

export const ListFilters = ({
  title = 'Filtros',
  subtitle = 'Refine sua busca e encontre exatamente o que precisa',
  fields,
  values,
  onChange,
  onApply,
  onClear,
  loading = false,
  collapsible = true,
  defaultExpanded = true,
  applyLabel = 'Aplicar filtros',
  clearLabel = 'Limpar filtros',
}: ListFiltersProps) => {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [applyRequested, setApplyRequested] = useState(false);
  const mobileOrderMap = useMemo(() => buildMobileOrderMap(fields), [fields]);
  const isApplying = applyRequested && loading;

  const handleApply = () => {
    setApplyRequested(true);
    onApply();
  };

  const handleClear = () => {
    if (applyRequested) setApplyRequested(false);
    onClear();
  };
  const toggleExpanded = () => setExpanded((prev) => !prev);
  const applyButtonLabel = isApplying ? 'Aplicando...' : applyLabel;

  return (
    <Box
      sx={{
        bgcolor: (theme) =>
          theme.palette.mode === 'dark' ? theme.palette.background.default : '#F9FAFB',
        borderRadius: 2,
        marginBottom: layoutSpacing.sectionGap,
      }}
    >
      <Paper elevation={2} sx={{ borderRadius: 2, padding: layoutSpacing.cardPadding }}>
        <FiltersHeader
          collapsible={collapsible}
          expanded={expanded}
          title={title}
          subtitle={subtitle}
          onToggleExpanded={toggleExpanded}
        />

        <Box
          sx={{
            borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
            marginBottom: spacingScale.md,
          }}
        />

        <Collapse in={!collapsible || expanded}>
          {renderFieldsGrid(fields, loading, mobileOrderMap, onChange, values)}

          <Box
            sx={{
              marginTop: spacingScale.md,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              gap: spacingScale.xs,
              flexWrap: { xs: 'wrap', sm: 'nowrap' },
            }}
          >
            <ActionButtons
              fullWidthOnMobile={false}
              align="flex-start"
              actions={[
                {
                  type: 'custom',
                  label: clearLabel,
                  onClick: handleClear,
                  disabled: loading,
                  variant: 'outlined',
                  size: 'medium',
                  startIcon: <RefreshIcon fontSize="small" />,
                  sx: { minWidth: { xs: 'calc(50% - 4px)', sm: 160 } },
                },
              ]}
            />
            <ActionButtons
              fullWidthOnMobile={false}
              align="flex-end"
              actions={[
                {
                  type: 'custom',
                  label: applyButtonLabel,
                  onClick: handleApply,
                  disabled: loading || isApplying,
                  variant: 'contained',
                  size: 'medium',
                  startIcon: <FilterAltOutlinedIcon fontSize="small" />,
                  sx: { minWidth: { xs: 'calc(50% - 4px)', sm: 148 } },
                },
              ]}
            />
          </Box>
        </Collapse>
      </Paper>
    </Box>
  );
};
