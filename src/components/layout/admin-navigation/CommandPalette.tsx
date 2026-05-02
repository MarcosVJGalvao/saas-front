import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined';
import StarIcon from '@mui/icons-material/Star';
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useCallback } from 'react';
import { useCommandPaletteView } from '../../../hooks/useCommandPaletteView';
import type { NavigationItem } from '../../../models/navigation';

interface CommandPaletteProps {
  isOpen: boolean;
  query: string;
  favorites: string[];
  items: NavigationItem[];
  onClose: () => void;
  onQueryChange: (query: string) => void;
  onToggleFavorite: (itemId: string) => void;
}

export const CommandPalette = ({
  isOpen,
  query,
  favorites,
  items,
  onClose,
  onQueryChange,
  onToggleFavorite,
}: CommandPaletteProps) => {
  const {
    activeTab,
    setActiveTab,
    tabItems,
    filteredItems,
    favoritesItems,
    suggestionItems,
    selectItem,
    onKeyDown,
  } = useCommandPaletteView(query, favorites, items, onClose);

  const handleToggleFavorite = useCallback(
    (event: React.MouseEvent<HTMLElement>, itemId: string) => {
      event.stopPropagation();
      onToggleFavorite(itemId);
    },
    [onToggleFavorite],
  );

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      fullWidth
      maxWidth={false}
      onKeyDown={onKeyDown}
      slotProps={{
        paper: {
          sx: {
            width: { xs: '88vw', md: '62vw', lg: '54vw' },
            maxWidth: 760,
            height: { xs: '74vh', md: '68vh', lg: '64vh' },
            maxHeight: '72vh',
            borderRadius: 2,
            border: 1,
            borderColor: 'divider',
            bgcolor: 'background.paper',
            overflow: 'hidden',
          },
        },
      }}
    >
      <Box sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ position: 'relative' }}>
          <TextField
            autoFocus
            size="small"
            placeholder="Buscar no sistema..."
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            sx={{
              width: '100%',
              '& .MuiOutlinedInput-root': {
                height: 42,
                bgcolor: 'transparent',
              },
            }}
            slotProps={{
              input: {
                startAdornment: <SearchOutlinedIcon sx={{ mr: 1, opacity: 0.75 }} />,
              },
            }}
          />
        </Box>

        <Tabs
          value={activeTab}
          onChange={(_, value: string) => setActiveTab(value)}
          sx={{ mt: 1.25, minHeight: 32 }}
          variant="scrollable"
        >
          {tabItems.map((tabItem) => (
            <Tab
              key={tabItem.key}
              value={tabItem.key}
              label={tabItem.label}
              sx={{ minHeight: 32, py: 0.5, textTransform: 'none' }}
            />
          ))}
        </Tabs>

        <List
          sx={{
            mt: 1,
            flex: 1,
            minHeight: 0,
            overflowY: 'auto',
            borderTop: 1,
            borderColor: 'divider',
          }}
        >
          <Box sx={{ px: 1.5, py: 1, display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              Favoritos
            </Typography>
            <Typography variant="caption" color="primary">
              Gerenciar favoritos
            </Typography>
          </Box>
          {favoritesItems.map((item) => (
            <ListItemButton key={`fav-${item.id}`} onClick={() => selectItem(item)}>
              <ListItemText primary={item.label} secondary={item.href} />
              <IconButton onClick={(event) => handleToggleFavorite(event, item.id)}>
                <StarIcon color="warning" />
              </IconButton>
            </ListItemButton>
          ))}

          <Box
            sx={{ px: 1.5, pt: 1.25, pb: 0.75, display: 'flex', justifyContent: 'space-between' }}
          >
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              Sugestões
            </Typography>
            <Typography variant="caption" color="primary">
              Ver mais
            </Typography>
          </Box>
          {suggestionItems.map((item) => (
            <ListItemButton key={`sug-${item.id}`} onClick={() => selectItem(item)}>
              <ListItemText primary={item.label} secondary={item.href} />
              <IconButton onClick={(event) => handleToggleFavorite(event, item.id)}>
                <StarBorderOutlinedIcon />
              </IconButton>
            </ListItemButton>
          ))}

          {query.trim().length > 0 ? (
            <>
              <Box sx={{ px: 1.5, pt: 1.25, pb: 0.75 }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Buscar por "{query}"
                </Typography>
              </Box>
              {items.slice(0, 4).map((item) => (
                <ListItemButton key={`scope-${item.id}`} onClick={() => selectItem(item)}>
                  <ListItemText
                    primary={item.label}
                    secondary={`Buscar por "${query}" em ${item.label.toLowerCase()}`}
                  />
                  <ChevronRightOutlinedIcon fontSize="small" />
                </ListItemButton>
              ))}
            </>
          ) : null}

          {filteredItems.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ px: 2, py: 3 }}>
              Nenhum resultado encontrado
            </Typography>
          ) : null}
        </List>

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: 'block', mt: 1, pt: 0.5, textAlign: 'center' }}
        >
          Use ? ? para navegar, Enter para selecionar, Esc para fechar
        </Typography>
      </Box>
    </Dialog>
  );
};
