import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { verify2FA } from '../../api/auth'
import { verify2FASchema } from '../../utils/validators'
import { useAuth } from '../../context/AuthContext'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { AlertCircle, Timer } from 'lucide-react'
import type { z } from 'zod'

type Verify2FAForm = z.infer<typeof verify2FASchema>

const EXPIRY_SECONDS = 300

export default function Verify2FA() {
  const { login } = useAuth()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [countdown, setCountdown] = useState(EXPIRY_SECONDS)
  const [expired, setExpired] = useState(false)

  const usuarioId = Number(localStorage.getItem('acabou_mony_temp_usuarioId'))
  const email = localStorage.getItem('acabou_mony_temp_email')

  const { register, handleSubmit, formState: { errors } } = useForm<Verify2FAForm>({
    resolver: zodResolver(verify2FASchema),
  })

  useEffect(() => {
    const rawId = localStorage.getItem('acabou_mony_temp_usuarioId')
    if (!rawId) {
      window.location.href = '/login'
    }
  }, [])

  useEffect(() => {
    if (countdown <= 0) {
      setExpired(true)
      return
    }
    const timer = setInterval(() => setCountdown((prev) => prev - 1), 1000)
    return () => clearInterval(timer)
  }, [countdown])

  function handleExpiredRedirect() {
    localStorage.removeItem('acabou_mony_temp_usuarioId')
    localStorage.removeItem('acabou_mony_temp_email')
    window.location.href = '/login'
  }

  async function onSubmit(data: Verify2FAForm) {
    setLoading(true)
    setError('')
    try {
      const tokenResponse = await verify2FA({ usuarioId, codigo: data.codigo })

      login(tokenResponse)

      localStorage.removeItem('acabou_mony_temp_usuarioId')
      localStorage.removeItem('acabou_mony_temp_email')

      window.location.href = '/dashboard'
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosErr = err as { response?: { data?: Record<string, unknown> } }
        const data = axiosErr.response?.data
        const msg = typeof data?.message === 'string' ? data.message : typeof data?.mensagem === 'string' ? data.mensagem : undefined
        setError(msg || 'Código inválido')
      } else {
        setError('Serviço indisponível. Tente novamente.')
      }
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-secondary">Verificação em duas etapas</h1>
          <p className="mt-1 text-sm text-gray-500">
            Um código de 6 dígitos foi enviado para <strong>{email}</strong>
          </p>
        </div>

        {expired ? (
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
              <AlertCircle size={16} />
              Código expirado. Faça login novamente.
            </div>
            <Button onClick={handleExpiredRedirect} className="w-full">
              Voltar para o login
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <Timer size={16} />
              Código expira em {formatTime(countdown)}
            </div>

            <Input
              label="Código de verificação"
              placeholder="000000"
              maxLength={6}
              className="text-center text-2xl tracking-[0.5em]"
              error={errors.codigo?.message}
              {...register('codigo')}
            />

            {error && (
              <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            <Button type="submit" loading={loading} className="w-full">
              Verificar
            </Button>
          </form>
        )}
      </div>
    </div>
  )
}
