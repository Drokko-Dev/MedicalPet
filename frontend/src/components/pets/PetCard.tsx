import { QrCode, FileText } from 'lucide-react';
import type { Pet } from '../../api/pets';
import { Link } from 'react-router-dom';

interface PetCardProps {
  pet: Pet;
  onOpenQR: (pet: Pet) => void;
}

export function PetCard({ pet, onOpenQR }: PetCardProps) {
  // Calcular la edad si hay fecha de nacimiento
  const calculateAge = (birthDate?: string) => {
    if (!birthDate) return 'Edad desconocida';
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age > 0 ? `${age} años` : 'Menos de 1 año';
  };

  const defaultPhoto = 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=2574&auto=format&fit=crop';

  return (
    <div className="bg-[var(--color-surface)] rounded-2xl shadow-sm border border-[var(--color-border)] overflow-hidden transition-all hover:shadow-md hover:border-[var(--color-brand-green)] group">
      <div className="relative h-48 overflow-hidden">
        <img
          src={pet.photo_url || defaultPhoto}
          alt={`Foto de ${pet.name}`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-[var(--color-brand-blue)] shadow-sm">
          {pet.species}
        </div>
      </div>
      
      <div className="p-5">
        <h3 className="text-xl font-bold text-[var(--color-foreground)] mb-1">
          {pet.name}
        </h3>
        <p className="text-sm text-[var(--color-text-muted)] mb-4">
          {pet.breed || 'Raza mixta'} • {calculateAge(pet.birth_date)}
        </p>
        
        <div className="flex items-center gap-3 mt-4">
          <Link
            to={`/pets/${pet.id}`}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[var(--color-brand-green)] hover:bg-[var(--color-brand-green-hover)] text-white text-sm font-medium rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-brand-green)]"
          >
            <FileText className="h-4 w-4" />
            Ver Ficha
          </Link>
          <button
            onClick={() => onOpenQR(pet)}
            className="p-2.5 text-[var(--color-brand-blue)] bg-[var(--color-brand-blue)]/10 hover:bg-[var(--color-brand-blue)]/20 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-brand-blue)]"
            title="Compartir Ficha"
          >
            <QrCode className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
