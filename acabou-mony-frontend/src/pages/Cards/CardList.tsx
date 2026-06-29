import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../../context/AuthContext'
import { getCards, updateCardStatus, deleteCard } from '../../api/card'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Link } from 'react-router-dom'
import { Plus, Ban, CheckCircle, Trash2 } from 'lucide-react'

function formatCardNumber(num: string): string {
  return num.replace(/(\d{4})(?=\d)/g, '$1 ')
}

function formatValidity(date: string): string {
  if (!date) return ''
  const d = new Date(date)
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = String(d.getFullYear()).slice(-2)
  return `${month}/${year}`
}

function CardFront({ card }: { card: { nomeImpresso: string; numeroCartao: string; cvv: string; dataValidade: string; ativo: boolean; id: number } }) {
  return (
    <div className="relative h-52 w-full rounded-xl bg-gradient-to-br from-blue-700 to-blue-900 p-5 text-white shadow-lg">
      <div className="flex items-start justify-between">
        <span className="text-xs font-medium tracking-wider opacity-80">CARTÃO DE CRÉDITO</span>
        <span className="text-lg font-bold tracking-wider">VISA</span>
      </div>

      <div className="mt-6">
        <p className="font-mono text-lg tracking-widest">{formatCardNumber(card.numeroCartao)}</p>
      </div>

      <div className="mt-4 flex gap-8">
        <div>
          <p className="text-[10px] uppercase tracking-wider opacity-70">Validade</p>
          <p className="font-mono text-sm">{formatValidity(card.dataValidade)}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider opacity-70">CVV</p>
          <p className="font-mono text-sm">{card.cvv}</p>
        </div>
      </div>

      <div className="mt-3">
        <p className="font-mono text-sm uppercase tracking-wider">{card.nomeImpresso}</p>
      </div>

      {!card.ativo && (
        <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/50">
          <span className="rounded-lg bg-red-600 px-4 py-2 text-sm font-bold uppercase">Bloqueado</span>
        </div>
      )}
    </div>
  )
}

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

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteCard(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cards'] }),
  })

  function handleToggleStatus(id: number) {
    toggleMutation.mutate(id)
  }

  function handleDelete(id: number) {
    if (window.confirm('Tem certeza que deseja excluir este cartão?')) {
      deleteMutation.mutate(id)
    }
  }

  if (isFetching) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-secondary">Cartões</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-52 animate-pulse rounded-xl bg-gray-200" />
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
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <Card key={card.id} className="relative p-0 overflow-hidden">
              <CardFront card={card} />
              <div className="flex items-center justify-between p-3">
                <Badge variant={card.ativo ? 'success' : 'error'}>
                  {card.ativo ? 'ATIVO' : 'BLOQUEADO'}
                </Badge>
                <div className="flex items-center gap-2">
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
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(card.id)}
                    loading={deleteMutation.isPending && deleteMutation.variables === card.id}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 rounded-xl border-2 border-dashed border-gray-300 p-12">
          <p className="text-gray-400 text-sm">Nenhum cartão encontrado</p>
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
