import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { PrivateRoute } from './components/auth/PrivateRoute';
import { RoleRoute } from './components/auth/RoleRoute';
import { useAuthStore } from './store/useAuthStore';

function DashboardPlaceholder({ title }: { title: string }) {
  return (
    <div className="bg-[var(--color-surface)] rounded-xl shadow-sm border border-[var(--color-border)] p-8">
      <h1 className="text-2xl font-bold text-[var(--color-foreground)] mb-4">{title}</h1>
      <p className="text-[var(--color-text-muted)]">
        Bienvenido a PetTrack. Esta vista se ajustará según el tema seleccionado.
      </p>
    </div>
  );
}

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  return (
    <Router>
      <MainLayout>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={
            isAuthenticated ? (
              user?.role === 'vet' ? <Navigate to="/vet/dashboard" replace /> : <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          } />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Routes */}
          <Route element={<PrivateRoute />}>
            
            {/* Owner Routes */}
            <Route element={<RoleRoute allowedRole="owner" />}>
              <Route path="/dashboard" element={<DashboardPlaceholder title="Dashboard (Dueño)" />} />
              <Route path="/pets" element={<DashboardPlaceholder title="Mis Mascotas" />} />
            </Route>

            {/* Vet Routes */}
            <Route element={<RoleRoute allowedRole="vet" />}>
              <Route path="/vet/dashboard" element={<DashboardPlaceholder title="Panel Médico (Veterinario)" />} />
              <Route path="/vet/patients" element={<DashboardPlaceholder title="Mis Pacientes" />} />
            </Route>
            
            {/* Shared Routes */}
            <Route path="/agenda" element={<DashboardPlaceholder title="Agenda" />} />

          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;
