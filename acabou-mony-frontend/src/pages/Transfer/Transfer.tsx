import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createTransaction } from '../../api/transaction'
import { transferSchema } from '../../utils/validators'
import { useAuth } from '../../context/AuthContext'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Card } from '../../components/ui/Card'
import { AlertCircle, CheckCircle } from 'lucide-react'
import type { z } from 'zod'

type TransferForm = z.infer<typeof transferSchema>

export default function Transfer() {
  const navigate = useNavigate()
  const { contaId } = useAuth()
  const queryClient = useQueryClient()
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<TransferForm>({
    resolver: zodResolver(transferSchema),
  })

  const mutation = useMutation({
    mutationFn: createTransaction,
    onSuccess: () => {
      setSuccess(true)
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      queryClient.invalidateQueries({ queryKey: ['balance'] })
      setTimeout(() => navigate('/transactions'), 1500)
    },
    onError: (err: unknown) => {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosErr = err as { response?: { data?: Record<string, unknown> } }
        const data = axiosErr.response?.data
        const msg = typeof data?.message === 'string' ? data.message : typeof data?.mensagem === 'string' ? data.mensagem : undefined
        setError(msg || 'Erro ao realizar transação')
      } else {
        setError('Serviço indisponível. Tente novamente.')
      }
    },
  })

  function onSubmit(data: TransferForm) {
    setError('')
    mutation.mutate({ ...data, contaOrigemId: contaId! })
  }

  if (success) {
    return (
      <div className="mx-auto max-w-md pt-12">
        <Card>
          <div className="flex flex-col items-center gap-4 py-8">
            <CheckCircle size={48} className="text-primary" />
            <p className="text-lg font-semibold text-secondary">Transação realizada com sucesso!</p>
            <p className="text-sm text-gray-500">Redirecionando para o extrato...</p>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-md">
      <h1 className="mb-6 text-2xl font-bold text-secondary">Nova transferência</h1>

      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input
            label="Conta de origem"
            type="number"
            value={contaId ?? ''}
            disabled
          />

          <Input
            label="Conta de destino"
            type="number"
            placeholder="ID da conta"
            error={errors.contaDestinoId?.message}
            {...register('contaDestinoId', { valueAsNumber: true })}
          />

          <Input
            label="Valor (R$)"
            type="number"
            step="0.01"
            min="0.01"
            placeholder="0,00"
            error={errors.valor?.message}
            {...register('valor', { valueAsNumber: true })}
          />

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-secondary">Tipo</label>
            <select
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              {...register('tipo')}
            >
              <option value="TRANSFERENCIA">Transferência</option>
              <option value="PAGAMENTO">Pagamento</option>
            </select>
            {errors.tipo?.message && (
              <span className="text-xs text-red-600">{errors.tipo.message}</span>
            )}
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <Button type="submit" loading={mutation.isPending} className="w-full">
            Transferir
          </Button>
        </form>
      </Card>
    </div>
  )
}
