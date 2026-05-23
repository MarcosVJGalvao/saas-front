import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined';
import StarIcon from '@mui/icons-material/Star';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SubdirectoryArrowLeftIcon from '@mui/icons-material/SubdirectoryArrowLeft';
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';
import { memo, useCallback, useRef, useState, type ReactNode } from 'react';
import { responsive } from '@theme/utils/responsive';
import { useCommandPaletteView } from '@shared/hooks/useCommandPaletteView';
import type { NavigationItem } from '@shared/types/navigation';

const DEBOUNCE_MS = 300;

interface CommandPaletteProps {
  isOpen: boolean;
  favorites: string[];
  items: NavigationItem[];
  onClose: () => void;
  onToggleFavorite: (itemId: string) => void;
}

const KbdHint = ({ label }: { label: ReactNode }) => (
  <Box
    component="span"
    sx={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: 1,
      borderColor: 'divider',
      borderRadius: 0.75,
      px: 0.5,
      height: 22,
      minWidth: 22,
      fontSize: 11,
      lineHeight: 1,
      color: 'text.secondary',
    }}
  >
    {label}
  </Box>
);

const SectionLabel = ({ children }: { children: ReactNode }) => (
  <Box sx={{ px: 2.5, pt: 2, pb: 0.75 }}>
    <Typography
      variant="caption"
      color="text.disabled"
      sx={{ fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: 10 }}
    >
      {children}
    </Typography>
  </Box>
);

const CommandPaletteEmpty = () => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 1.5,
      py: 8,
    }}
  >
    <SearchOutlinedIcon sx={{ fontSize: 36, color: 'text.disabled', opacity: 0.5 }} />
    <Typography variant="body1" color="text.secondary">
      Comece a digitar para buscar...
    </Typography>
  </Box>
);

const CommandPaletteNoResults = ({ query }: { query: string }) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 1,
      py: 8,
    }}
  >
    <Typography variant="body1" color="text.secondary">
      Nenhum resultado para{' '}
      <Box component="span" sx={{ fontWeight: 600, color: 'text.primary' }}>
        &ldquo;{query}&rdquo;
      </Box>
    </Typography>
  </Box>
);

// Only re-renders when debouncedQuery / favorites / items change — never on raw keystrokes
interface ResultsProps {
  debouncedQuery: string;
  favorites: string[];
  items: NavigationItem[];
  onClose: () => void;
  onToggleFavorite: (itemId: string) => void;
}

const CommandPaletteResults = memo(
  ({ debouncedQuery, favorites, items, onClose, onToggleFavorite }: ResultsProps) => {
    const {
      activeTab,
      setActiveTab,
      tabItems,
      favoritesItems,
      matchedItems,
      allFavoritesItems,
      searchScopes,
      getSectionLabel,
      selectItem,
      selectScope,
    } = useCommandPaletteView(debouncedQuery, debouncedQuery, favorites, items, onClose);

    const handleToggleFavorite = useCallback(
      (event: React.MouseEvent<HTMLElement>, itemId: string) => {
        event.stopPropagation();
        onToggleFavorite(itemId);
      },
      [onToggleFavorite],
    );

    const hasQuery = debouncedQuery.trim().length > 0;

    return (
      <>
        <Box sx={{ px: 1.5, borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={activeTab}
            onChange={(_, value: string) => setActiveTab(value)}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{ minHeight: 40 }}
          >
            {tabItems.map((tabItem) => (
              <Tab
                key={tabItem.key}
                value={tabItem.key}
                label={tabItem.label}
                sx={{
                  minHeight: 40,
                  py: 0,
                  px: 1.5,
                  fontSize: '0.8125rem',
                  textTransform: 'none',
                  fontWeight: 500,
                }}
              />
            ))}
          </Tabs>
        </Box>

        <Box sx={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
          {!hasQuery ? (
            <>
              {allFavoritesItems.length > 0 ? (
                <List disablePadding sx={{ py: 1 }}>
                  <SectionLabel>Favoritos</SectionLabel>
                  {allFavoritesItems.map((item) => (
                    <ListItemButton
                      key={`fav-idle-${item.id}`}
                      onClick={() => selectItem(item)}
                      sx={{ px: 2.5, py: 1.25, gap: 2 }}
                    >
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                          variant="body1"
                          sx={{ fontWeight: 500, lineHeight: 1.4 }}
                          noWrap
                        >
                          {item.label}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" noWrap>
                          {getSectionLabel(item.id)}
                        </Typography>
                      </Box>
                      <IconButton
                        size="small"
                        edge="end"
                        onClick={(event) => handleToggleFavorite(event, item.id)}
                      >
                        <StarIcon fontSize="small" color="warning" />
                      </IconButton>
                    </ListItemButton>
                  ))}
                </List>
              ) : (
                <CommandPaletteEmpty />
              )}
            </>
          ) : (
            <List disablePadding sx={{ py: 1 }}>
              {favoritesItems.length > 0 ? (
                <>
                  <SectionLabel>Favoritos</SectionLabel>
                  {favoritesItems.map((item) => (
                    <ListItemButton
                      key={`fav-${item.id}`}
                      onClick={() => selectItem(item)}
                      sx={{ px: 2.5, py: 1.25, gap: 2 }}
                    >
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                          variant="body1"
                          sx={{ fontWeight: 500, lineHeight: 1.4 }}
                          noWrap
                        >
                          {item.label}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" noWrap>
                          {getSectionLabel(item.id)}
                        </Typography>
                      </Box>
                      <Chip
                        label="Favorito"
                        size="small"
                        color="warning"
                        variant="outlined"
                        sx={{ height: 22, fontSize: '0.75rem' }}
                      />
                      <IconButton
                        size="small"
                        edge="end"
                        onClick={(event) => handleToggleFavorite(event, item.id)}
                      >
                        <StarIcon fontSize="small" color="warning" />
                      </IconButton>
                    </ListItemButton>
                  ))}
                  <Divider sx={{ my: 0.5 }} />
                </>
              ) : null}

              {matchedItems.length > 0 ? (
                <>
                  <SectionLabel>Páginas</SectionLabel>
                  {matchedItems.map((item) => (
                    <ListItemButton
                      key={`match-${item.id}`}
                      onClick={() => selectItem(item)}
                      sx={{ px: 2.5, py: 1.25, gap: 2 }}
                    >
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                          variant="body1"
                          sx={{ fontWeight: 500, lineHeight: 1.4 }}
                          noWrap
                        >
                          {item.label}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" noWrap>
                          {getSectionLabel(item.id)}
                        </Typography>
                      </Box>
                      <IconButton
                        size="small"
                        edge="end"
                        onClick={(event) => handleToggleFavorite(event, item.id)}
                      >
                        <StarBorderOutlinedIcon fontSize="small" />
                      </IconButton>
                    </ListItemButton>
                  ))}
                </>
              ) : null}

              {searchScopes.length > 0 ? (
                <>
                  <SectionLabel>Pesquisar em</SectionLabel>
                  {searchScopes.map((scope) => (
                    <ListItemButton
                      key={`${scope.id}-${scope.route}`}
                      onClick={() => selectScope(scope)}
                      sx={{ px: 2.5, py: 1.25, gap: 2 }}
                    >
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="body1" noWrap>
                          <Box component="span" sx={{ color: 'text.secondary' }}>
                            Pesquisar{' '}
                          </Box>
                          <Box component="span" sx={{ fontWeight: 600 }}>
                            &ldquo;{debouncedQuery}&rdquo;
                          </Box>
                          <Box component="span" sx={{ color: 'text.secondary' }}>
                            {' '}
                            em{' '}
                          </Box>
                          {scope.label}
                        </Typography>
                      </Box>
                      <ChevronRightOutlinedIcon fontSize="small" sx={{ color: 'text.disabled' }} />
                    </ListItemButton>
                  ))}
                </>
              ) : null}

              {matchedItems.length === 0 &&
              searchScopes.length === 0 &&
              favoritesItems.length === 0 ? (
                <CommandPaletteNoResults query={debouncedQuery} />
              ) : null}
            </List>
          )}
        </Box>
      </>
    );
  },
);

// Shell: TextField is UNCONTROLLED — zero re-renders while typing
export const CommandPalette = ({
  isOpen,
  favorites,
  items,
  onClose,
  onToggleFavorite,
}: CommandPaletteProps) => {
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleChange = useCallback((value: string) => {
    if (timerRef.current !== null) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setDebouncedQuery(value);
    }, DEBOUNCE_MS);
  }, []);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    },
    [onClose],
  );

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      fullWidth
      maxWidth={false}
      onKeyDown={handleKeyDown}
      slotProps={{
        paper: {
          sx: {
            width: responsive({ xs: '96vw', sm: '90vw', md: '82vw', lg: '72vw', xl: '64vw' }),
            maxWidth: 1000,
            height: responsive({ xs: '88vh', md: '80vh', lg: '74vh' }),
            borderRadius: 2.5,
            bgcolor: 'background.paper',
            border: (theme) =>
              `1px solid ${alpha(
                theme.palette.common.white,
                theme.palette.mode === 'dark' ? 0.08 : 0,
              )}`,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: (theme) =>
              theme.palette.mode === 'dark'
                ? `0 32px 72px ${alpha('#000000', 0.52)}`
                : theme.shadows[24],
          },
        },
      }}
    >
      <Box
        sx={{
          px: 2.5,
          pt: 2,
          pb: 1.5,
          bgcolor: (theme) =>
            theme.palette.mode === 'dark' ? alpha(theme.palette.common.white, 0.02) : 'transparent',
          '& .MuiOutlinedInput-root': {
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: 'primary.main',
              borderWidth: 2,
            },
          },
        }}
      >
        <TextField
          autoFocus
          size="small"
          placeholder="Buscar páginas e funcionalidades..."
          onChange={(event) => handleChange(event.target.value)}
          slotProps={{
            htmlInput: { spellCheck: false },
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchOutlinedIcon sx={{ color: 'text.secondary', fontSize: 22 }} />
                </InputAdornment>
              ),
            },
          }}
          sx={{
            width: '100%',
            '& .MuiOutlinedInput-root': {
              height: 48,
              fontSize: '1rem',
              borderRadius: 1.5,
              bgcolor: (theme) =>
                theme.palette.mode === 'dark'
                  ? alpha(theme.palette.common.white, 0.03)
                  : theme.palette.background.paper,
            },
          }}
        />
      </Box>

      <CommandPaletteResults
        debouncedQuery={debouncedQuery}
        favorites={favorites}
        items={items}
        onClose={onClose}
        onToggleFavorite={onToggleFavorite}
      />

      <Divider />
      <Stack
        direction="row"
        spacing={2}
        sx={{ px: 2.5, py: 1.25, alignItems: 'center', justifyContent: 'flex-end' }}
      >
        <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
          <KbdHint label={<KeyboardArrowUpIcon sx={{ fontSize: 14 }} />} />
          <KbdHint label={<KeyboardArrowDownIcon sx={{ fontSize: 14 }} />} />
          <Typography variant="caption" color="text.secondary">
            navegar
          </Typography>
        </Stack>
        <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
          <KbdHint label={<SubdirectoryArrowLeftIcon sx={{ fontSize: 14 }} />} />
          <Typography variant="caption" color="text.secondary">
            selecionar
          </Typography>
        </Stack>
        <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
          <KbdHint label="Esc" />
          <Typography variant="caption" color="text.secondary">
            fechar
          </Typography>
        </Stack>
      </Stack>
    </Dialog>
  );
};
