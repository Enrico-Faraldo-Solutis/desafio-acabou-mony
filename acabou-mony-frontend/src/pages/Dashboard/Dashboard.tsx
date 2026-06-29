import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../../context/AuthContext'
import { getBalance, listAccounts } from '../../api/account'
import { getCards } from '../../api/card'
import { getTransactions } from '../../api/transaction'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { formatCurrency, formatDate } from '../../utils/formatters'
import { Wallet, CreditCard, ArrowRightLeft, RefreshCw, ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Dashboard() {
  const { usuarioId, contaId, setContaId } = useAuth()

  useEffect(() => {
    if (!usuarioId || contaId) return

    listAccounts()
      .then((accounts) => {
        const userAccount = accounts.find((a) => a.usuarioId === usuarioId)
        if (userAccount) {
          setContaId(userAccount.id)
        }
      })
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .catch((_) => {})
  }, [usuarioId, contaId, setContaId])

  const { data: balance, isFetching: balanceLoading, refetch: refetchBalance } = useQuery({
    queryKey: ['balance', contaId],
    queryFn: () => getBalance(contaId!),
    enabled: !!contaId,
  })

  const { data: cards, isFetching: cardsLoading } = useQuery({
    queryKey: ['cards', contaId],
    queryFn: () => getCards(contaId!),
    enabled: !!contaId,
  })

  const { data: transactions, isFetching: txLoading } = useQuery({
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

  function Skeleton() {
    return <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-secondary">Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-3">
        <Card title="Saldo" className="relative">
          <div className="flex items-start justify-between">
            <div>
              {balanceLoading ? (
                <Skeleton />
              ) : (
                <p className={`text-3xl font-bold ${Number(balance?.saldo) < 0 ? 'text-red-600' : 'text-secondary'}`}>
                  {formatCurrency(balance?.saldo ?? 0)}
                </p>
              )}
            </div>
            <Wallet size={32} className="text-primary" />
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="mt-2"
            onClick={() => refetchBalance()}
          >
            <RefreshCw size={14} />
            Atualizar
          </Button>
        </Card>

        <Card title="Cartões">
          <div className="flex items-start justify-between">
            <div>
              {cardsLoading ? (
                <Skeleton />
              ) : (
                <p className="text-2xl font-bold text-secondary">
                  {cards?.length ?? 0} cartões
                </p>
              )}
            </div>
            <CreditCard size={32} className="text-primary" />
          </div>
          <Link
            to="/cards"
            className="mt-2 inline-flex items-center gap-1 text-sm text-primary hover:underline"
          >
            Ver todos <ExternalLink size={14} />
          </Link>
        </Card>

        <Card title="Transações">
          <div className="flex items-start justify-between">
            <div>
              {txLoading ? (
                <Skeleton />
              ) : (
                <p className="text-2xl font-bold text-secondary">
                  {transactions?.length ?? 0} movimentações
                </p>
              )}
            </div>
            <ArrowRightLeft size={32} className="text-primary" />
          </div>
          <Link
            to="/transactions"
            className="mt-2 inline-flex items-center gap-1 text-sm text-primary hover:underline"
          >
            Ver extrato <ExternalLink size={14} />
          </Link>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card title="Últimas transações">
          {txLoading ? (
            <div className="flex flex-col gap-3">
              {[1, 2, 3].map((i) => <Skeleton key={i} />)}
            </div>
          ) : transactions && transactions.length > 0 ? (
            <div className="flex flex-col gap-3">
              {transactions.slice(0, 5).map((tx) => (
                <div key={tx.id} className="flex items-center justify-between border-b border-gray-100 pb-2 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-secondary">
                      {tx.tipo} - {tx.status === 'CONCLUIDA' ? 'Concluída' : tx.status === 'PENDENTE' ? 'Pendente' : 'Falha'}
                    </p>
                    <p className="text-xs text-gray-500">{formatDate(tx.dataTransacao)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">{formatCurrency(tx.valor)}</span>
                    <Badge variant={statusVariant(tx.status)}>{tx.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">Nenhuma transação encontrada</p>
          )}
        </Card>

        <Card title="Cartões recentes">
          {cardsLoading ? (
            <div className="flex flex-col gap-3">
              {[1, 2].map((i) => <Skeleton key={i} />)}
            </div>
          ) : cards && cards.length > 0 ? (
            <div className="flex flex-col gap-3">
              {cards.slice(0, 3).map((card) => (
                <div key={card.id} className="flex items-center gap-3 border-b border-gray-100 pb-2 last:border-0">
                  <div className="flex h-12 w-20 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 text-[8px] text-white">
                    <div className="text-center leading-tight">
                      <p className="font-bold">****</p>
                      <p>{card.numeroCartao.slice(-4)}</p>
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-secondary">{card.nomeImpresso}</p>
                    <p className="text-xs text-gray-400">CVV: {card.cvv}</p>
                  </div>
                  <Badge variant={card.ativo ? 'success' : 'error'}>
                    {card.ativo ? 'ATIVO' : 'BLOQUEADO'}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <p className="text-sm text-gray-500">Nenhum cartão encontrado</p>
              <Link to="/cards/new">
                <Button size="sm">Solicitar cartão</Button>
              </Link>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
