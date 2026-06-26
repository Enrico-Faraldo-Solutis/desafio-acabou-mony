import { useQuery } from '@tanstack/react-query'
import { getAuditLogs } from '../../api/auditing'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { formatDate } from '../../utils/formatters'
import { Shield, RefreshCw } from 'lucide-react'

export default function Auditing() {
  const { data: logs, isFetching, error, refetch } = useQuery({
    queryKey: ['audit-logs'],
    queryFn: getAuditLogs,
  })

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-secondary">Logs de Auditoria</h1>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          <RefreshCw size={14} />
          Atualizar
        </Button>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
          Erro ao carregar logs.{' '}
          <button onClick={() => refetch()} className="underline cursor-pointer">Tentar novamente</button>
        </div>
      )}

      {isFetching ? (
        <div className="flex flex-col gap-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-14 animate-pulse rounded-lg bg-gray-200" />
          ))}
        </div>
      ) : logs && logs.length > 0 ? (
        <Card>
          <div className="flex flex-col divide-y divide-gray-100">
            {logs.map((log) => (
              <div key={log.id} className="flex items-start gap-4 py-3 first:pt-0 last:pb-0">
                <div className="rounded-full bg-blue-100 p-2">
                  <Shield size={16} className="text-blue-700" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-secondary">{log.acao}</p>
                    <Badge variant="info">Usuário #{log.usuarioId}</Badge>
                  </div>
                  {log.detalhes && (
                    <p className="mt-1 text-xs text-gray-500">{JSON.stringify(log.detalhes)}</p>
                  )}
                  <p className="mt-0.5 text-xs text-gray-400">{formatDate(log.timestamp)}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      ) : (
        <div className="flex flex-col items-center gap-4 rounded-xl border-2 border-dashed border-gray-300 p-12">
          <Shield size={48} className="text-gray-300" />
          <p className="text-gray-500">Nenhum log de auditoria encontrado</p>
        </div>
      )}
    </div>
  )
}
