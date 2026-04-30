# Component Customization Guide

## Standard

- Every shared component should provide sensible defaults from theme.
- Every shared component should allow contextual overrides via `sx` and focused props.

## Common Components API (summary)

### Actions

- `ActionButtons`
  - Defaults: action presets by type (`back`, `cancel`, `next`, `confirm`)
  - Customization: `actions[]`, `direction`, `align`, `fullWidthOnMobile`

### Data

- `DataTable`
  - Defaults: desktop table + mobile card fallback
  - Customization: `columns`, `rows`, `meta`, `onPageChange`, `onRowsPerPageChange`
- `SearchBar`
  - Defaults: full width, search icon, responsive max width
  - Customization: `value`, `onChange`, `placeholder`, `sx`
- `FilterDrawer`
  - Defaults: right drawer, action buttons
  - Customization: `children`, `onApply`, `onClear`, `open`, `onClose`

### Date

- `AppDatePicker`
  - Defaults: display `dd/MM/yyyy`, output `yyyy-MM-dd`
  - Customization: standard date picker props + `label`, `value`, `onChange`, `error`, `helperText`
- `DateRangePicker`
  - Defaults: two date pickers with responsive layout
  - Customization: labels, values, handlers, bounds (`minDate`, `maxDate`)

### Feedback / Modal

- `AppSnackbar`
  - Defaults: bottom-right, filled alert
  - Customization: `severity`, `message`, `autoHideDuration`
- `ConfirmDialog`
  - Defaults: confirm/cancel texts
  - Customization: labels, handlers, content
- `BaseModal`
  - Defaults: generic dialog shell
  - Customization: title/content/actions/loading

### Form

- `AppAutocomplete`
  - Defaults: full width option selector
  - Customization: `options`, `value`, `onChange`, `error`, `helperText`
- `FormActions`
  - Defaults: responsive action arrangement
  - Customization: primary/secondary/tertiary action configs

### State

- `EmptyState`, `ErrorState`
  - Defaults: centered state blocks
  - Customization: labels/messages/actions + `sx`

### Display

- `StatusChip`, `InfoList`, `KeyValueGrid`
  - Defaults: semantic display patterns
  - Customization: data inputs + `sx`

### Overlay / Navigation / Access / Upload

- `AppTooltip`, `AppPopoverMenu`, `AppTabs`, `StepperWizard`, `ProtectedRoute`, `PermissionGate`, `FileUpload`, `AvatarUploader`
  - Defaults: standardized behavior
  - Customization: props per context

## Usage Rule

- Use defaults first.
- Override only what the page/module needs.
- Do not duplicate existing shared components for minor visual differences.
