import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  senha: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
})

export const registerSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('E-mail inválido'),
  senha: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  cpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF inválido'),
})

export const verify2FASchema = z.object({
  codigo: z.string().length(6, 'Código deve ter 6 dígitos'),
})

export const transferSchema = z.object({
  contaDestinoId: z.number().positive('Conta destino deve ser positiva'),
  valor: z.number().positive('Valor deve ser positivo'),
  tipo: z.enum(['TRANSFERENCIA', 'PAGAMENTO']),
})

export const cardSchema = z.object({
  contaId: z.number().positive(),
  nomeImpresso: z.string().min(3, 'Nome impresso deve ter no mínimo 3 caracteres'),
})
