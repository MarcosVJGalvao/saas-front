import { lazy, Suspense } from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';

const LoginPage = lazy(() => import('./pages/LoginPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));

const App = () => (
  <Suspense
    fallback={
      <Box sx={{ p: 4 }}>
        <CircularProgress aria-label="Carregando" />
      </Box>
    }
  >
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<DashboardPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </Suspense>
);

export default App;
