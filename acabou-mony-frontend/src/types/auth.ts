export interface LoginRequest { email: string; senha: string }
export interface LoginResponse { usuarioId: number; email: string; mensagem: string }
export interface Verify2FARequest { usuarioId: number; codigo: string }
export interface TokenResponse {
  token: string
  tipo: string
  expiracaoMs: number
  nomeUsuario: string
  email: string
  role: string
}
