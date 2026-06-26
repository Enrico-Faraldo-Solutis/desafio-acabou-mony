import api from './axios'
import type { TransacaoRequest, Transacao } from '../types/transaction'

export async function createTransaction(data: TransacaoRequest): Promise<Transacao> {
  const response = await api.post('/api/transactions', data)
  return response.data
}

export async function getTransactions(accountId: number): Promise<Transacao[]> {
  const response = await api.get(`/api/transactions/conta/${accountId}`)
  return response.data
}
