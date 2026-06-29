import api from './axios'
import type { Usuario, Conta, Balance } from '../types/account'

export async function createUser(data: { nome: string; email: string; senha: string; cpf: string }): Promise<Usuario> {
  const response = await api.post('/api/accounts/users', data)
  return response.data
}

export async function getUser(id: number): Promise<Usuario> {
  const response = await api.get(`/api/accounts/users/${id}`)
  return response.data
}

export async function getBalance(contaId: number): Promise<Balance> {
  const response = await api.get(`/api/accounts/balance/${contaId}`)
  return response.data
}

export async function updateBalance(contaId: number, valor: number): Promise<Conta> {
  const response = await api.put('/api/accounts/balance', { contaId, valor })
  return response.data
}

export async function listAccounts(): Promise<Conta[]> {
  const token = localStorage.getItem('acabou_mony_token')
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`
  const response = await fetch('/api/accounts', { headers })
  if (!response.ok) throw new Error('Erro ao buscar contas')
  const data = await response.json()
  return data.content
}
