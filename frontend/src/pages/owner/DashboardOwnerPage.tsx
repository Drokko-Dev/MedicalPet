import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Activity, Calendar, FileText } from 'lucide-react';
import { petsApi } from '../../api/pets';
import type { Pet } from '../../api/pets';
import { PetCard } from '../../components/pets/PetCard';
import { QRShareModal } from '../../components/pets/QRShareModal';

export function DashboardOwnerPage() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);

  useEffect(() => {
    loadPets();
  }, []);

  const loadPets = async () => {
    try {
      const data = await petsApi.getPets();
      setPets(data);
    } catch (error) {
      console.error('Error cargando mascotas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenQR = (pet: Pet) => {
    setSelectedPet(pet);
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-foreground)]">Resumen de tu cuenta</h1>
          <p className="text-[var(--color-text-muted)] mt-1">Aquí tienes un vistazo rápido al estado de tus mascotas.</p>
        </div>
        <Link
          to="/pets"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[var(--color-brand-green)] hover:bg-[var(--color-brand-green-hover)] text-white font-medium rounded-xl shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-brand-green)]"
        >
          <Plus className="h-5 w-5" />
          Nueva Mascota
        </Link>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[var(--color-surface)] p-6 rounded-2xl border border-[var(--color-border)] shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[var(--color-brand-green)]/10 text-[var(--color-brand-green)] rounded-xl">
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-[var(--color-text-muted)]">Tus Mascotas</p>
              <h3 className="text-2xl font-bold text-[var(--color-foreground)]">{loading ? '-' : pets.length}</h3>
            </div>
          </div>
        </div>
        
        <div className="bg-[var(--color-surface)] p-6 rounded-2xl border border-[var(--color-border)] shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[var(--color-brand-blue)]/10 text-[var(--color-brand-blue)] rounded-xl">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-[var(--color-text-muted)]">Consultas Totales</p>
              <h3 className="text-2xl font-bold text-[var(--color-foreground)]">5</h3>
            </div>
          </div>
        </div>

        <div className="bg-[var(--color-surface)] p-6 rounded-2xl border border-[var(--color-border)] shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-500/10 text-purple-500 rounded-xl">
              <Calendar className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-[var(--color-text-muted)]">Próxima Vacuna</p>
              <h3 className="text-xl font-bold text-[var(--color-foreground)]">En 15 días</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Pet List Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[var(--color-foreground)]">Tus Mascotas</h2>
          <Link to="/pets" className="text-sm font-medium text-[var(--color-brand-blue)] hover:text-[var(--color-brand-blue-hover)]">
            Ver todas →
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--color-brand-green)]"></div>
          </div>
        ) : pets.length === 0 ? (
          <div className="text-center py-16 bg-[var(--color-surface)] rounded-2xl border border-dashed border-[var(--color-border)]">
            <div className="mx-auto w-16 h-16 bg-[var(--color-background)] rounded-full flex items-center justify-center mb-4">
              <Plus className="h-8 w-8 text-[var(--color-text-muted)]" />
            </div>
            <h3 className="text-lg font-bold text-[var(--color-foreground)] mb-2">Aún no tienes mascotas</h3>
            <p className="text-[var(--color-text-muted)] max-w-sm mx-auto mb-6">
              Agrega tu primera mascota para comenzar a registrar su historial médico y vacunas.
            </p>
            <Link
              to="/pets"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[var(--color-brand-green)] hover:bg-[var(--color-brand-green-hover)] text-white font-medium rounded-xl shadow-sm transition-colors"
            >
              Agregar Mascota
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pets.map((pet) => (
              <PetCard key={pet.id} pet={pet} onOpenQR={handleOpenQR} />
            ))}
          </div>
        )}
      </div>

      <QRShareModal
        petId={selectedPet?.id || 0}
        petName={selectedPet?.name || ''}
        isOpen={!!selectedPet}
        onClose={() => setSelectedPet(null)}
      />
    </div>
  );
}
