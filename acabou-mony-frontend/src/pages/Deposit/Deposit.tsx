import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../../context/AuthContext'
import { updateBalance } from '../../api/account'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Card } from '../../components/ui/Card'
import { AlertCircle, CheckCircle, Wallet } from 'lucide-react'

export default function Deposit() {
  const { contaId } = useAuth()
  const queryClient = useQueryClient()
  const [amount, setAmount] = useState('')
  const [error, setError] = useState('')

  const mutation = useMutation({
    mutationFn: (valor: number) => updateBalance(contaId!, valor),
    onSuccess: () => {
      setAmount('')
      queryClient.invalidateQueries({ queryKey: ['balance'] })
    },
    onError: (err: unknown) => {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosErr = err as { response?: { data?: Record<string, unknown> } }
        const data = axiosErr.response?.data
        const msg = typeof data?.message === 'string' ? data.message : typeof data?.mensagem === 'string' ? data.mensagem : undefined
        setError(msg || 'Erro ao realizar depósito')
      } else {
        setError('Serviço indisponível. Tente novamente.')
      }
    },
  })

  function handleDeposit() {
    setError('')
    const valor = parseFloat(amount)
    if (isNaN(valor) || valor <= 0) {
      setError('Informe um valor válido maior que zero.')
      return
    }
    mutation.mutate(valor)
  }

  return (
    <div className="mx-auto max-w-md">
      <h1 className="mb-6 text-2xl font-bold text-secondary">Depositar</h1>

      <Card>
        <div className="flex flex-col gap-4">
          <Input
            label="Conta"
            type="number"
            value={contaId ?? ''}
            disabled
          />

          <Input
            label="Valor (R$)"
            type="number"
            step="0.01"
            min="0.01"
            placeholder="0,00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          {mutation.isSuccess && (
            <div className="flex items-center gap-2 rounded-lg bg-green-50 p-3 text-sm text-green-700">
              <CheckCircle size={16} />
              Depósito realizado com sucesso!
            </div>
          )}

          <Button onClick={handleDeposit} loading={mutation.isPending} className="w-full">
            <Wallet size={16} />
            Depositar
          </Button>
        </div>
      </Card>
    </div>
  )
}