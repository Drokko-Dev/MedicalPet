import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Plus, X, Syringe, Stethoscope, FileText, FileSignature, FileIcon, Calendar } from 'lucide-react';
import { petsApi } from '../../api/pets';
import type { Pet } from '../../api/pets';
import { recordsApi } from '../../api/records';
import type { MedicalRecord } from '../../api/records';
import { QRShareModal } from '../../components/pets/QRShareModal';

const recordSchema = z.object({
  type: z.enum(['vaccine', 'consult', 'exam', 'manual']),
  title: z.string().min(1, 'El título es requerido'),
  date: z.string().min(1, 'La fecha es requerida'),
  notes: z.string().optional(),
});

type RecordForm = z.infer<typeof recordSchema>;

export function PetDetailPage() {
  const { id } = useParams<{ id: string }>();
  const petId = parseInt(id || '0');

  const [pet, setPet] = useState<Pet | null>(null);
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<RecordForm>({
    resolver: zodResolver(recordSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      type: 'manual',
    }
  });

  useEffect(() => {
    if (petId) {
      loadData();
    }
  }, [petId]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Find pet from the list
      const pets = await petsApi.getPets();
      const currentPet = pets.find(p => p.id === petId);
      if (currentPet) setPet(currentPet);

      // Load records
      const petRecords = await recordsApi.getPetRecords(petId);
      // Sort by date descending
      petRecords.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setRecords(petRecords);
    } catch (error) {
      console.error('Error loading pet details:', error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: RecordForm) => {
    try {
      // For now we don't upload files to backend in this mock, but we would attach it here
      await recordsApi.addManualRecord(petId, data);
      setIsModalOpen(false);
      reset();
      loadData();
    } catch (error) {
      console.error('Error adding record:', error);
    }
  };

  const getRecordIcon = (type: string) => {
    switch (type) {
      case 'vaccine': return <Syringe className="h-5 w-5 text-purple-500" />;
      case 'consult': return <Stethoscope className="h-5 w-5 text-[var(--color-brand-blue)]" />;
      case 'exam': return <FileText className="h-5 w-5 text-orange-500" />;
      default: return <FileSignature className="h-5 w-5 text-[var(--color-brand-green)]" />;
    }
  };

  const getRecordTypeName = (type: string) => {
    switch (type) {
      case 'vaccine': return 'Vacuna';
      case 'consult': return 'Consulta';
      case 'exam': return 'Examen';
      default: return 'Registro Manual';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--color-brand-green)]"></div>
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-[var(--color-foreground)]">Mascota no encontrada</h2>
        <Link to="/pets" className="text-[var(--color-brand-blue)] hover:underline mt-4 inline-block">Volver a mis mascotas</Link>
      </div>
    );
  }

  const defaultPhoto = 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=2574&auto=format&fit=crop';

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Navigation */}
      <Link to="/pets" className="inline-flex items-center text-[var(--color-text-muted)] hover:text-[var(--color-brand-green)] transition-colors">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Volver a Mis Mascotas
      </Link>

      {/* Header Profile */}
      <div className="bg-[var(--color-surface)] rounded-2xl shadow-sm border border-[var(--color-border)] p-6 md:p-8 flex flex-col md:flex-row gap-8 items-center md:items-start">
        <img
          src={pet.photo_url || defaultPhoto}
          alt={pet.name}
          className="w-40 h-40 rounded-full object-cover border-4 border-[var(--color-background)] shadow-sm"
        />
        <div className="flex-1 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
            <div>
              <h1 className="text-3xl font-bold text-[var(--color-foreground)]">{pet.name}</h1>
              <p className="text-lg text-[var(--color-brand-green)] font-medium mt-1">{pet.species} {pet.breed ? `• ${pet.breed}` : ''}</p>
            </div>
            <button
              onClick={() => setIsQRModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[var(--color-brand-blue)]/10 text-[var(--color-brand-blue)] hover:bg-[var(--color-brand-blue)]/20 font-medium rounded-xl transition-colors"
            >
              Compartir Ficha
            </button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-[var(--color-background)] p-3 rounded-xl border border-[var(--color-border)]">
              <p className="text-xs text-[var(--color-text-muted)] uppercase font-semibold">Sexo</p>
              <p className="font-medium mt-1">{pet.sex || 'N/A'}</p>
            </div>
            <div className="bg-[var(--color-background)] p-3 rounded-xl border border-[var(--color-border)]">
              <p className="text-xs text-[var(--color-text-muted)] uppercase font-semibold">Nacimiento</p>
              <p className="font-medium mt-1">{pet.birth_date ? new Date(pet.birth_date).toLocaleDateString() : 'N/A'}</p>
            </div>
            <div className="bg-[var(--color-background)] p-3 rounded-xl border border-[var(--color-border)]">
              <p className="text-xs text-[var(--color-text-muted)] uppercase font-semibold">Peso</p>
              <p className="font-medium mt-1">{pet.weight ? `${pet.weight} kg` : 'N/A'}</p>
            </div>
            <div className="bg-[var(--color-background)] p-3 rounded-xl border border-[var(--color-border)]">
              <p className="text-xs text-[var(--color-text-muted)] uppercase font-semibold">Microchip</p>
              <p className="font-medium mt-1">{pet.microchip || 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[var(--color-foreground)]">Historial Médico</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[var(--color-brand-green)] hover:bg-[var(--color-brand-green-hover)] text-white text-sm font-medium rounded-xl shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-brand-green)]"
          >
            <Plus className="h-4 w-4" />
            Agregar Registro
          </button>
        </div>

        {records.length === 0 ? (
          <div className="text-center py-12 bg-[var(--color-surface)] rounded-2xl border border-dashed border-[var(--color-border)]">
            <Calendar className="h-12 w-12 text-[var(--color-text-muted)] mx-auto mb-4" />
            <h3 className="text-lg font-bold text-[var(--color-foreground)]">Sin historial</h3>
            <p className="text-[var(--color-text-muted)] mt-2">No hay registros médicos para esta mascota.</p>
          </div>
        ) : (
          <div className="relative border-l-2 border-[var(--color-border)] ml-6 md:ml-8 space-y-8 pb-8">
            {records.map((record) => (
              <div key={record.id} className="relative pl-8 md:pl-10">
                {/* Timeline dot */}
                <div className="absolute -left-[17px] top-1 h-8 w-8 rounded-full bg-[var(--color-surface)] border-2 border-[var(--color-border)] flex items-center justify-center shadow-sm">
                  {getRecordIcon(record.type)}
                </div>
                
                {/* Card */}
                <div className="bg-[var(--color-surface)] rounded-2xl shadow-sm border border-[var(--color-border)] p-5 hover:border-[var(--color-brand-green)]/30 transition-colors">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2 mb-3">
                    <div>
                      <h4 className="text-lg font-bold text-[var(--color-foreground)]">{record.title}</h4>
                      <p className="text-sm font-medium text-[var(--color-text-muted)] flex items-center gap-2">
                        {getRecordTypeName(record.type)} 
                        {record.is_manual && <span className="bg-orange-100 text-orange-700 text-xs px-2 py-0.5 rounded-full font-semibold">Manual</span>}
                      </p>
                    </div>
                    <span className="text-sm text-[var(--color-text-muted)] font-medium bg-[var(--color-background)] px-3 py-1 rounded-lg border border-[var(--color-border)] inline-block">
                      {new Date(record.date).toLocaleDateString()}
                    </span>
                  </div>
                  
                  {record.notes && (
                    <p className="text-[var(--color-text-muted)] mt-3 text-sm leading-relaxed">{record.notes}</p>
                  )}
                  {record.diagnosis && (
                    <div className="mt-3 bg-red-50 p-3 rounded-lg border border-red-100 text-sm">
                      <strong className="text-red-700 block mb-1">Diagnóstico:</strong>
                      <span className="text-red-600">{record.diagnosis}</span>
                    </div>
                  )}
                  {record.treatment && (
                    <div className="mt-3 bg-blue-50 p-3 rounded-lg border border-blue-100 text-sm">
                      <strong className="text-[var(--color-brand-blue)] block mb-1">Tratamiento:</strong>
                      <span className="text-blue-800">{record.treatment}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Manual Record Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-md bg-[var(--color-surface)] rounded-2xl shadow-xl border border-[var(--color-border)] p-6 relative my-8">
            <button
              onClick={() => { setIsModalOpen(false); reset(); }}
              className="absolute right-4 top-4 text-[var(--color-text-muted)] hover:text-[var(--color-foreground)] transition-colors focus:outline-none"
            >
              <X className="h-6 w-6" />
            </button>
            
            <h2 className="text-2xl font-bold text-[var(--color-foreground)] mb-6">Agregar Registro Manual</h2>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-1">Tipo de Registro *</label>
                <select
                  {...register('type')}
                  className="w-full px-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-green)] text-[var(--color-foreground)]"
                >
                  <option value="manual">Otro (Registro Manual)</option>
                  <option value="vaccine">Vacuna</option>
                  <option value="exam">Examen</option>
                  <option value="consult">Consulta</option>
                </select>
                {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-1">Título *</label>
                <input
                  {...register('title')}
                  className="w-full px-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-green)] text-[var(--color-foreground)]"
                  placeholder="Ej: Desparasitación interna"
                />
                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-1">Fecha *</label>
                <input
                  type="date"
                  {...register('date')}
                  className="w-full px-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-green)] text-[var(--color-foreground)]"
                />
                {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date.message}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-1">Notas / Detalles</label>
                <textarea
                  {...register('notes')}
                  rows={3}
                  className="w-full px-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-green)] text-[var(--color-foreground)] resize-none"
                  placeholder="Detalles sobre el registro..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-1">Documento adjunto</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-[var(--color-border)] border-dashed rounded-lg bg-[var(--color-background)] hover:border-[var(--color-brand-green)] transition-colors cursor-pointer">
                  <div className="space-y-1 text-center">
                    <FileIcon className="mx-auto h-12 w-12 text-[var(--color-text-muted)]" />
                    <div className="flex text-sm text-[var(--color-text-muted)]">
                      <label htmlFor="file-upload" className="relative cursor-pointer bg-transparent rounded-md font-medium text-[var(--color-brand-green)] hover:underline focus-within:outline-none">
                        <span>Sube un archivo</span>
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" accept=".pdf,image/*" />
                      </label>
                      <p className="pl-1">o arrástralo aquí</p>
                    </div>
                    <p className="text-xs text-[var(--color-text-muted)]">PNG, JPG, PDF hasta 10MB</p>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 mt-6 bg-[var(--color-brand-green)] hover:bg-[var(--color-brand-green-hover)] text-white font-medium rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-brand-green)] transition-colors disabled:opacity-70"
              >
                {isSubmitting ? 'Guardando...' : 'Guardar Registro'}
              </button>
            </form>
          </div>
        </div>
      )}

      <QRShareModal
        petId={petId}
        petName={pet.name}
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
      />
    </div>
  );
}
