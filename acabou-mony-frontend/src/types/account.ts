export interface Usuario {
  id: number
  nome: string
  email: string
  cpf: string
  dataCriacao: string
}
export interface Conta {
  id: number
  usuarioId: number
  saldo: number
  status: string
  dataCriacao: string
}
export type Balance = Pick<Conta, 'id' | 'saldo'>
