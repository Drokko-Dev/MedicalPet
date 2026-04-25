import api from './axios';

export interface Pet {
  id: number;
  owner_id: number;
  name: string;
  species: string;
  breed?: string;
  sex?: string;
  birth_date?: string;
  weight?: number;
  microchip?: string;
  color?: string;
  notes?: string;
  photo_url?: string;
}

export const petsApi = {
  getPets: async (): Promise<Pet[]> => {
    const response = await api.get('/pets/');
    return response.data;
  },
  
  createPet: async (petData: Partial<Pet>): Promise<Pet> => {
    const response = await api.post('/pets/', petData);
    return response.data;
  },
  
  getQrToken: async (petId: number): Promise<{ qr_token: string; expires_in: number }> => {
    const response = await api.get(`/pets/${petId}/qr-token`);
    return response.data;
  }
};
