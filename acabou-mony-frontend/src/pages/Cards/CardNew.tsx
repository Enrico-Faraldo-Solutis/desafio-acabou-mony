import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createCard } from '../../api/card'
import { cardSchema } from '../../utils/validators'
import { useAuth } from '../../context/AuthContext'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Card } from '../../components/ui/Card'
import { AlertCircle, ArrowLeft } from 'lucide-react'
import type { z } from 'zod'

type CardForm = z.infer<typeof cardSchema>

export default function CardNew() {
  const navigate = useNavigate()
  const { contaId } = useAuth()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<CardForm>({
    resolver: zodResolver(cardSchema),
    defaultValues: { contaId: undefined, nomeImpresso: '' },
  })

  useEffect(() => {
    if (contaId) setValue('contaId', contaId)
  }, [contaId, setValue])

  async function onSubmit(data: CardForm) {
    setLoading(true)
    setError('')
    try {
      await createCard(data)
      navigate('/cards')
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosErr = err as { response?: { data?: Record<string, unknown> } }
        const data = axiosErr.response?.data
        const msg = typeof data?.message === 'string' ? data.message : typeof data?.mensagem === 'string' ? data.mensagem : undefined
        setError(msg || 'Erro ao criar cartão')
      } else {
        setError('Serviço indisponível. Tente novamente.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <div className="mb-6">
        <Link to="/cards" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-secondary">
          <ArrowLeft size={16} />
          Voltar
        </Link>
      </div>

      <Card title="Solicitar novo cartão">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input
            label="ID da conta"
            type="number"
            value={contaId ?? ''}
            disabled
          />

          <Input
            label="Nome impresso no cartão"
            placeholder="Seu nome completo"
            {...register('nomeImpresso')}
            error={errors.nomeImpresso?.message}
          />

          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <Button type="submit" loading={loading} className="w-full">
            Solicitar cartão
          </Button>
        </form>
      </Card>
    </div>
  )
}
