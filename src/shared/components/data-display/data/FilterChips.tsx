import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';

export type FilterChipItem = {
  label: string;
  onRemove: () => void;
};

interface FilterChipsProps {
  chips: FilterChipItem[];
}

export const FilterChips = ({ chips }: FilterChipsProps) => {
  if (chips.length === 0) return null;

  return (
    <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
      {chips.map((chip) => (
        <Chip
          key={chip.label}
          label={chip.label}
          size="small"
          onDelete={chip.onRemove}
          variant="outlined"
        />
      ))}
    </Stack>
  );
};
