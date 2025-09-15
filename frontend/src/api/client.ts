import api from './axios'

export type Mode = 'FLIGHT' | 'TRAIN' | 'CAR'
export type Trip = {
  id: string; origin: string; destination: string; distanceKm: number;
  mode: Mode; emissionsKg: number; createdAt: string;
}

export async function login(email: string, password: string) {
  // Your Nest endpoint should return { accessToken: string }
  const { data } = await api.post<{ accessToken: string }>('/auth/login', { email, password })
  return data
}

export const listTrips = async () => (await api.get<Trip[]>('/trips')).data
export const createTrip = async (t: { origin: string; destination: string; distanceKm: number; mode: Mode }) =>
  (await api.post<Trip>('/trips', t)).data
export const getStats = async () =>
  (await api.get<{ totalKg: number; byMode: { mode: Mode; _sum: { emissionsKg: number } }[] }>('/trips/stats')).data
