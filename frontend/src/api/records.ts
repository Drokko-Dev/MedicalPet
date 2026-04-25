import api from './axios';

export interface RecordAttachment {
  id: number;
  record_id: number;
  file_url: string;
  file_type?: string;
  file_name?: string;
}

export interface MedicalRecord {
  id: number;
  pet_id: number;
  vet_id?: number;
  clinic_id?: number;
  title: string;
  type: 'vaccine' | 'consult' | 'exam' | 'manual';
  diagnosis?: string;
  treatment?: string;
  notes?: string;
  date: string;
  is_manual: boolean;
  created_at: string;
  attachments: RecordAttachment[];
}

export const recordsApi = {
  getPetRecords: async (petId: number): Promise<MedicalRecord[]> => {
    const response = await api.get(`/pets/${petId}/records`);
    return response.data;
  },

  addManualRecord: async (petId: number, data: any): Promise<MedicalRecord> => {
    const response = await api.post(`/pets/${petId}/records`, data);
    return response.data;
  },

  getUpcomingVaccines: async (): Promise<any[]> => {
    // TODO: Connect to real API when available
    // Mock data for now
    return [
      { id: 1, petName: 'Max', vaccine: 'Antirrábica', dueDate: '2026-05-10' },
      { id: 2, petName: 'Luna', vaccine: 'Séxtuple', dueDate: '2026-06-01' }
    ];
  }
};
