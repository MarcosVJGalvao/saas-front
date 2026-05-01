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
import { useMemo, useState, type KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
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

const flattenItems = (items: NavigationItem[]): NavigationItem[] =>
  items.flatMap((item) => [item, ...(item.children ?? [])]);

export const CommandPalette = ({
  isOpen,
  query,
  favorites,
  items,
  onClose,
  onQueryChange,
  onToggleFavorite,
}: CommandPaletteProps) => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('all');

  const flatItems = useMemo(() => flattenItems(items), [items]);
  const tabItems = useMemo(
    () => [
      { key: 'all', label: 'Tudo' },
      ...items.map((item) => ({ key: item.id, label: item.label })),
    ],
    [items],
  );

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.toLowerCase();
    return flatItems.filter((item) => {
      const tabMatch = activeTab === 'all' || item.id.includes(activeTab);
      const queryMatch = item.label.toLowerCase().includes(normalizedQuery);
      return tabMatch && queryMatch;
    });
  }, [activeTab, flatItems, query]);

  const favoritesItems = useMemo(
    () => filteredItems.filter((item) => favorites.includes(item.id)).slice(0, 4),
    [favorites, filteredItems],
  );

  const suggestionItems = useMemo(
    () => filteredItems.filter((item) => !favorites.includes(item.id)).slice(0, 5),
    [favorites, filteredItems],
  );

  const selectItem = (item: NavigationItem) => {
    if (item.href !== undefined) {
      void navigate(item.href);
      onClose();
    }
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      onClose();
      return;
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((currentIndex) =>
        Math.min(currentIndex + 1, Math.max(filteredItems.length - 1, 0)),
      );
      return;
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((currentIndex) => Math.max(currentIndex - 1, 0));
      return;
    }
    if (event.key === 'Enter') {
      event.preventDefault();
      const selectedItem = filteredItems[activeIndex];
      if (selectedItem !== undefined) selectItem(selectedItem);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      fullWidth
      maxWidth={false}
      onKeyDown={onKeyDown}
      slotProps={{
        backdrop: {
          sx: {
            backgroundColor: (theme) =>
              theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.52)' : 'rgba(15,23,42,0.26)',
            backdropFilter: (theme) => (theme.palette.mode === 'dark' ? 'blur(12px)' : 'blur(9px)'),
          },
        },
        paper: {
          sx: {
            width: { xs: 'calc(100% - 32px)', md: 760 },
            maxWidth: 'calc(100% - 32px)',
            borderRadius: 3.5,
            backdropFilter: 'blur(24px)',
            backgroundColor: (theme) =>
              theme.palette.mode === 'dark' ? 'rgba(11,18,32,0.78)' : 'rgba(255,255,255,0.86)',
            border: 1,
            borderColor: (theme) =>
              theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(15,23,42,0.10)',
            boxShadow: (theme) =>
              theme.palette.mode === 'dark'
                ? '0 24px 90px rgba(0,0,0,0.55)'
                : '0 24px 80px rgba(15,23,42,0.20)',
          },
        },
      }}
    >
      <Box sx={{ p: 2.25 }}>
        <Box sx={{ position: 'relative' }}>
          <TextField
            autoFocus
            fullWidth
            placeholder="Buscar no sistema..."
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            slotProps={{
              input: {
                startAdornment: <SearchOutlinedIcon sx={{ mr: 1, opacity: 0.75 }} />,
              },
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              right: 10,
              top: '50%',
              transform: 'translateY(-50%)',
              px: 1,
              py: 0.25,
              borderRadius: 1,
              border: 1,
              borderColor: 'divider',
              fontSize: 12,
              color: 'text.secondary',
            }}
          >
            Ctrl + K
          </Box>
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
          sx={{ mt: 1, maxHeight: '56vh', overflowY: 'auto', borderTop: 1, borderColor: 'divider' }}
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
              <IconButton
                onClick={(event) => {
                  event.stopPropagation();
                  onToggleFavorite(item.id);
                }}
              >
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
              <IconButton
                onClick={(event) => {
                  event.stopPropagation();
                  onToggleFavorite(item.id);
                }}
              >
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
          sx={{ display: 'block', mt: 1, textAlign: 'center' }}
        >
          Use ? ? para navegar, Enter para selecionar, Esc para fechar
        </Typography>
      </Box>
    </Dialog>
  );
};
