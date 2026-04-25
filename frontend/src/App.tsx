import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';

function DashboardPlaceholder() {
  return (
    <div className="bg-[var(--color-surface)] rounded-xl shadow-sm border border-[var(--color-border)] p-8">
      <h1 className="text-2xl font-bold text-[var(--color-foreground)] mb-4">Dashboard</h1>
      <p className="text-[var(--color-text-muted)]">
        Bienvenido a PetTrack. Esta vista se ajustará según el tema seleccionado.
      </p>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[var(--color-background)] p-6 rounded-lg border border-[var(--color-border)]">
          <h3 className="font-semibold text-lg text-[var(--color-brand-green)]">Mascotas</h3>
          <p className="text-3xl font-bold mt-2">2</p>
        </div>
        <div className="bg-[var(--color-background)] p-6 rounded-lg border border-[var(--color-border)]">
          <h3 className="font-semibold text-lg text-[var(--color-brand-blue)]">Consultas</h3>
          <p className="text-3xl font-bold mt-2">5</p>
        </div>
        <div className="bg-[var(--color-background)] p-6 rounded-lg border border-[var(--color-border)]">
          <h3 className="font-semibold text-lg text-[var(--color-text-muted)]">Próxima Vacuna</h3>
          <p className="text-xl font-medium mt-2">En 15 días</p>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<DashboardPlaceholder />} />
          <Route path="/dashboard" element={<DashboardPlaceholder />} />
          <Route path="*" element={<DashboardPlaceholder />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;
