import api from './axios'
import type { Cartao } from '../types/card'

export async function createCard(data: { contaId: number; nomeImpresso: string }): Promise<Cartao> {
  const response = await api.post('/api/cards', data)
  return response.data
}

export async function getCards(contaId: number): Promise<Cartao[]> {
  const response = await api.get(`/api/cards/account/${contaId}`)
  return response.data
}

export async function updateCardStatus(id: number): Promise<Cartao> {
  const response = await api.put(`/api/cards/${id}/toggle-status`)
  return response.data
}

export async function deleteCard(id: number): Promise<void> {
  await api.delete(`/api/cards/${id}`)
}
