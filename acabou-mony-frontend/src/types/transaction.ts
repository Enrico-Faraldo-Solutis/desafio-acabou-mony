export interface TransacaoRequest {
  contaOrigemId: number
  contaDestinoId: number
  valor: number
  tipo: string
}
export interface Transacao {
  id: number
  contaOrigemId: number
  contaDestinoId: number
  nomeOrigem: string
  nomeDestino: string
  valor: number
  tipo: string
  status: string
  dataTransacao: string
}
