export interface AuditLog {
  id: number
  acao: string
  usuarioId: number
  detalhes: Record<string, unknown>
  timestamp: string
}
