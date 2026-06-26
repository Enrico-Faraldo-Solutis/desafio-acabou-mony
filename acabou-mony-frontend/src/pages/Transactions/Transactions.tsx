import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../../context/AuthContext'
import { getTransactions } from '../../api/transaction'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { formatCurrency, formatDate } from '../../utils/formatters'
import { ArrowRightLeft, Filter } from 'lucide-react'
import { useState } from 'react'

export default function Transactions() {
  const { contaId } = useAuth()
  const [dateFilter, setDateFilter] = useState('')

  const { data: transactions, isFetching, error, refetch } = useQuery({
    queryKey: ['transactions', contaId],
    queryFn: () => getTransactions(contaId!),
    enabled: !!contaId,
  })

  function statusVariant(status: string) {
    switch (status) {
      case 'CONCLUIDA': return 'success'
      case 'PENDENTE': return 'warning'
      case 'FALHA': return 'error'
      default: return 'default'
    }
  }

  function statusLabel(status: string) {
    switch (status) {
      case 'CONCLUIDA': return 'Concluída'
      case 'PENDENTE': return 'Pendente'
      case 'FALHA': return 'Falha'
      default: return status
    }
  }

  const filtered = transactions
    ? dateFilter
      ? transactions.filter((tx) => tx.dataTransacao.startsWith(dateFilter))
      : transactions
    : []

  if (isFetching) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-secondary">Extrato</h1>
        <div className="flex flex-col gap-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 animate-pulse rounded-lg bg-gray-200" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-secondary">Extrato</h1>
      </div>

      <div className="flex items-center gap-2">
        <Filter size={16} className="text-gray-500" />
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
        {dateFilter && (
          <button
            onClick={() => setDateFilter('')}
            className="text-sm text-primary hover:underline cursor-pointer"
          >
            Limpar filtro
          </button>
        )}
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
          Erro ao carregar transações.{' '}
          <button onClick={() => refetch()} className="underline cursor-pointer">Tentar novamente</button>
        </div>
      )}

      {filtered.length > 0 ? (
        <Card>
          <div className="flex flex-col divide-y divide-gray-100">
            {filtered.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <div className={`rounded-full p-2 ${
                    tx.status === 'CONCLUIDA' ? 'bg-green-100' :
                    tx.status === 'FALHA' ? 'bg-red-100' : 'bg-yellow-100'
                  }`}>
                    <ArrowRightLeft size={16} className={
                      tx.status === 'CONCLUIDA' ? 'text-green-700' :
                      tx.status === 'FALHA' ? 'text-red-700' : 'text-yellow-700'
                    } />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-secondary">
                      {tx.tipo}
                    </p>
                    <p className="text-xs text-gray-500">{formatDate(tx.dataTransacao)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-sm font-semibold ${
                    tx.status === 'FALHA' ? 'text-red-600' : 'text-secondary'
                  }`}>
                    {tx.status === 'FALHA' ? '-' : ''}{formatCurrency(tx.valor)}
                  </span>
                  <Badge variant={statusVariant(tx.status)}>
                    {statusLabel(tx.status)}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      ) : (
        <div className="flex flex-col items-center gap-4 rounded-xl border-2 border-dashed border-gray-300 p-12">
          <ArrowRightLeft size={48} className="text-gray-300" />
          <p className="text-gray-500">
            {dateFilter ? 'Nenhuma transação encontrada para esta data' : 'Nenhuma transação encontrada'}
          </p>
        </div>
      )}
    </div>
  )
}
