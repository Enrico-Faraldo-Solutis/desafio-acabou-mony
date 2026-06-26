import api from './axios'
import type { AuditLog } from '../types/auditing'

export async function getAuditLogs(): Promise<AuditLog[]> {
  const response = await api.get('/api/auditing')
  return response.data.content
}
