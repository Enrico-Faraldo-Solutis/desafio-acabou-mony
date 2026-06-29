export interface Cartao {
  id: number
  contaId: number
  numeroCartao: string
  nomeImpresso: string
  cvv: string
  dataValidade: string
  ativo: boolean
}
