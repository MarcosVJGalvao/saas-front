import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

interface ListDialogRow {
  id: string;
  primary: string;
}

interface ListDialogProps {
  open: boolean;
  title: string;
  rows: ListDialogRow[];
  onClose: () => void;
}

export const ListDialog = ({ open, title, rows, onClose }: ListDialogProps) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>{title}</DialogTitle>
    <DialogContent>
      <Stack spacing={1}>
        {rows.map((row) => (
          <Typography key={row.id}>{row.primary}</Typography>
        ))}
      </Stack>
    </DialogContent>
  </Dialog>
);
