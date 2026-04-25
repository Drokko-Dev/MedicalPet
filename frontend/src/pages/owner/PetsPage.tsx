import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, X } from 'lucide-react';
import { petsApi } from '../../api/pets';
import type { Pet } from '../../api/pets';
import { PetCard } from '../../components/pets/PetCard';
import { QRShareModal } from '../../components/pets/QRShareModal';

const petSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  species: z.string().min(1, 'La especie es requerida'),
  breed: z.string().optional(),
  sex: z.string().optional(),
  birth_date: z.string().optional(),
  color: z.string().optional(),
});

type PetForm = z.infer<typeof petSchema>;

export function PetsPage() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<PetForm>({
    resolver: zodResolver(petSchema),
  });

  useEffect(() => {
    loadPets();
  }, []);

  const loadPets = async () => {
    setLoading(true);
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

  const onSubmit = async (data: PetForm) => {
    try {
      // transform empty strings to undefined to match optional schema
      const cleanedData = Object.fromEntries(
        Object.entries(data).map(([k, v]) => [k, v === '' ? undefined : v])
      );
      await petsApi.createPet(cleanedData);
      setIsAddModalOpen(false);
      reset();
      loadPets();
    } catch (error) {
      console.error('Error creando mascota:', error);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-foreground)]">Mis Mascotas</h1>
          <p className="text-[var(--color-text-muted)] mt-1">Gestiona los perfiles y fichas médicas de tus mascotas.</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[var(--color-brand-green)] hover:bg-[var(--color-brand-green-hover)] text-white font-medium rounded-xl shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-brand-green)]"
        >
          <Plus className="h-5 w-5" />
          Agregar Mascota
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--color-brand-green)]"></div>
        </div>
      ) : pets.length === 0 ? (
        <div className="text-center py-20 bg-[var(--color-surface)] rounded-2xl border border-dashed border-[var(--color-border)]">
          <div className="mx-auto w-16 h-16 bg-[var(--color-background)] rounded-full flex items-center justify-center mb-4">
            <Plus className="h-8 w-8 text-[var(--color-text-muted)]" />
          </div>
          <h3 className="text-xl font-bold text-[var(--color-foreground)] mb-2">Aún no tienes mascotas</h3>
          <p className="text-[var(--color-text-muted)] max-w-sm mx-auto mb-6">
            Agrega tu primera mascota para comenzar a registrar su historial médico.
          </p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[var(--color-brand-green)] hover:bg-[var(--color-brand-green-hover)] text-white font-medium rounded-xl shadow-sm transition-colors"
          >
            Agregar Mascota
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {pets.map((pet) => (
            <PetCard key={pet.id} pet={pet} onOpenQR={handleOpenQR} />
          ))}
        </div>
      )}

      {/* QR Share Modal */}
      <QRShareModal
        petId={selectedPet?.id || 0}
        petName={selectedPet?.name || ''}
        isOpen={!!selectedPet}
        onClose={() => setSelectedPet(null)}
      />

      {/* Add Pet Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-md bg-[var(--color-surface)] rounded-2xl shadow-xl border border-[var(--color-border)] p-6 relative my-8">
            <button
              onClick={() => { setIsAddModalOpen(false); reset(); }}
              className="absolute right-4 top-4 text-[var(--color-text-muted)] hover:text-[var(--color-foreground)] transition-colors focus:outline-none"
            >
              <X className="h-6 w-6" />
            </button>
            
            <h2 className="text-2xl font-bold text-[var(--color-foreground)] mb-6">Nueva Mascota</h2>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-1">Nombre *</label>
                <input
                  {...register('name')}
                  className="w-full px-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-green)] text-[var(--color-foreground)]"
                  placeholder="Ej: Max"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-1">Especie *</label>
                  <select
                    {...register('species')}
                    className="w-full px-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-green)] text-[var(--color-foreground)]"
                  >
                    <option value="">Selecciona...</option>
                    <option value="Perro">Perro</option>
                    <option value="Gato">Gato</option>
                    <option value="Exótico">Exótico</option>
                    <option value="Otro">Otro</option>
                  </select>
                  {errors.species && <p className="text-red-500 text-xs mt-1">{errors.species.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-1">Raza</label>
                  <input
                    {...register('breed')}
                    className="w-full px-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-green)] text-[var(--color-foreground)]"
                    placeholder="Ej: Pastor Alemán"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-1">Sexo</label>
                  <select
                    {...register('sex')}
                    className="w-full px-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-green)] text-[var(--color-foreground)]"
                  >
                    <option value="">Selecciona...</option>
                    <option value="Macho">Macho</option>
                    <option value="Hembra">Hembra</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-1">Fecha de Nacimiento</label>
                  <input
                    type="date"
                    {...register('birth_date')}
                    className="w-full px-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-green)] text-[var(--color-foreground)]"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-1">Color / Marcas</label>
                <input
                  {...register('color')}
                  className="w-full px-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-green)] text-[var(--color-foreground)]"
                  placeholder="Ej: Blanco con manchas negras"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 mt-4 bg-[var(--color-brand-green)] hover:bg-[var(--color-brand-green-hover)] text-white font-medium rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-brand-green)] transition-colors disabled:opacity-70"
              >
                {isSubmitting ? 'Guardando...' : 'Guardar Mascota'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
