import { useState, useEffect } from 'react';
import { Bell, AlertTriangle, Calendar as CalendarIcon, CheckCircle2 } from 'lucide-react';
import { recordsApi } from '../../api/records';

export function AlertsPage() {
  const [upcomingVaccines, setUpcomingVaccines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    try {
      // Mock data for upcoming vaccines
      const data = await recordsApi.getUpcomingVaccines();
      setUpcomingVaccines(data);
    } catch (error) {
      console.error('Error loading alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--color-brand-green)]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-foreground)] flex items-center gap-3">
            <Bell className="h-8 w-8 text-[var(--color-brand-green)]" />
            Alertas y Recordatorios
          </h1>
          <p className="text-[var(--color-text-muted)] mt-1">Mantente al día con las vacunas y chequeos de tus mascotas.</p>
        </div>
      </div>

      <div className="bg-[var(--color-surface)] rounded-2xl shadow-sm border border-[var(--color-border)] overflow-hidden">
        <div className="p-6 border-b border-[var(--color-border)] bg-[var(--color-background)]/50 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-orange-500" />
          <h2 className="text-lg font-bold text-[var(--color-foreground)]">Próximas Vacunas</h2>
        </div>

        {upcomingVaccines.length === 0 ? (
          <div className="p-12 text-center">
            <CheckCircle2 className="h-12 w-12 text-[var(--color-brand-green)] mx-auto mb-3" />
            <h3 className="text-lg font-bold text-[var(--color-foreground)]">¡Todo al día!</h3>
            <p className="text-[var(--color-text-muted)] mt-1">No hay vacunas pendientes para los próximos 30 días.</p>
          </div>
        ) : (
          <div className="divide-y divide-[var(--color-border)]">
            {upcomingVaccines.map((item) => (
              <div key={item.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[var(--color-background)]/50 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="mt-1">
                    <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                      <CalendarIcon className="h-5 w-5" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-[var(--color-foreground)]">Vacuna {item.vaccine}</h4>
                    <p className="text-[var(--color-text-muted)]">Mascota: <span className="font-semibold text-[var(--color-foreground)]">{item.petName}</span></p>
                  </div>
                </div>
                <div className="bg-orange-50 border border-orange-100 text-orange-800 px-4 py-2 rounded-xl text-sm font-medium text-center sm:text-right">
                  Vence el {new Date(item.dueDate).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
