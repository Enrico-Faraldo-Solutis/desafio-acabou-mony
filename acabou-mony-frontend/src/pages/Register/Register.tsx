import { useState, useCallback } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createUser } from '../../api/account'
import { registerSchema } from '../../utils/validators'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { AlertCircle, CheckCircle } from 'lucide-react'
import type { z } from 'zod'

type RegisterForm = z.infer<typeof registerSchema>

export default function Register() {
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  })

  const formatCPF = useCallback((value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 11)
    return digits
      .replace(/^(\d{3})(\d)/, '$1.$2')
      .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4')
  }, [])

  async function onSubmit(data: RegisterForm) {
    setLoading(true)
    setError('')
    try {
      await createUser(data)
      setSuccess(true)
      setTimeout(() => navigate('/login'), 2000)
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosErr = err as { response?: { data?: Record<string, unknown> } }
        const data = axiosErr.response?.data
        const msg = typeof data?.message === 'string' ? data.message : typeof data?.mensagem === 'string' ? data.mensagem : undefined
        setError(msg || 'Erro ao cadastrar')
      } else {
        setError('Serviço indisponível. Tente novamente.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-secondary">Criar conta</h1>
          <p className="mt-1 text-sm text-gray-500">Preencha os dados para se cadastrar</p>
        </div>

        {success ? (
          <div className="flex flex-col items-center gap-4">
            <CheckCircle size={48} className="text-primary" />
            <p className="text-center text-sm text-gray-600">
              Conta criada com sucesso! Redirecionando para o login...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <Input
              label="Nome completo"
              placeholder="Ana Luiza"
              error={errors.nome?.message}
              {...register('nome')}
            />

            <Input
              label="E-mail"
              type="email"
              placeholder="ana@email.com"
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              label="CPF"
              placeholder="000.000.000-00"
              error={errors.cpf?.message}
              {...register('cpf')}
              onChange={(e) => {
                const formatted = formatCPF(e.target.value)
                setValue('cpf', formatted)
              }}
            />

            <Input
              label="Senha"
              type="password"
              placeholder="Mínimo 6 caracteres"
              error={errors.senha?.message}
              {...register('senha')}
            />

            {error && (
              <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            <Button type="submit" loading={loading} className="w-full">
              Cadastrar
            </Button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-gray-500">
          Já tem conta?{' '}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Faça login
          </Link>
        </p>
      </div>
    </div>
  )
}
