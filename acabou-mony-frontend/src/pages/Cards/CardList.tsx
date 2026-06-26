import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../../context/AuthContext'
import { getCards, updateCardStatus } from '../../api/card'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Link } from 'react-router-dom'
import { Plus, Ban, CheckCircle, CreditCard } from 'lucide-react'

export default function CardList() {
  const { contaId } = useAuth()
  const queryClient = useQueryClient()

  const { data: cards, isFetching, error } = useQuery({
    queryKey: ['cards', contaId],
    queryFn: () => getCards(contaId!),
    enabled: !!contaId,
  })

  const toggleMutation = useMutation({
    mutationFn: (id: number) => updateCardStatus(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cards'] }),
  })

  function handleToggleStatus(id: number) {
    toggleMutation.mutate(id)
  }

  if (isFetching) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-secondary">Cartões</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 animate-pulse rounded-xl bg-gray-200" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-secondary">Cartões</h1>
        <Link to="/cards/new">
          <Button>
            <Plus size={16} />
            Novo cartão
          </Button>
        </Link>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
          Erro ao carregar cartões. <Button variant="ghost" size="sm" onClick={() => queryClient.invalidateQueries({ queryKey: ['cards'] })}>Tentar novamente</Button>
        </div>
      )}

      {cards && cards.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <Card key={card.id} className="relative">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{card.nomeImpresso}</p>
                  <p className="mt-1 text-lg font-semibold text-secondary">{card.numeroCartao}</p>
                  <p className="mt-1 text-xs text-gray-400">Validade: {card.dataValidade}</p>
                </div>
                <CreditCard size={24} className="text-primary" />
              </div>
              <div className="mt-4 flex items-center justify-between">
                <Badge variant={card.ativo ? 'success' : 'error'}>
                  {card.ativo ? 'ATIVO' : 'BLOQUEADO'}
                </Badge>
                <Button
                  variant={card.ativo ? 'danger' : 'outline'}
                  size="sm"
                  onClick={() => handleToggleStatus(card.id)}
                  loading={toggleMutation.isPending && toggleMutation.variables === card.id}
                >
                  {card.ativo ? (
                    <><Ban size={14} /> Bloquear</>
                  ) : (
                    <><CheckCircle size={14} /> Desbloquear</>
                  )}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 rounded-xl border-2 border-dashed border-gray-300 p-12">
          <CreditCard size={48} className="text-gray-300" />
          <p className="text-gray-500">Nenhum cartão encontrado</p>
          <Link to="/cards/new">
            <Button>
              <Plus size={16} />
              Solicitar primeiro cartão
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}
