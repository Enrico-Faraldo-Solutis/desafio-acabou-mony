import api from './axios'
import type { LoginRequest, LoginResponse, Verify2FARequest, TokenResponse } from '../types/auth'

export async function login(data: LoginRequest): Promise<LoginResponse> {
  const response = await api.post('/api/auth/login', data)
  return response.data
}

export async function verify2FA(data: Verify2FARequest): Promise<TokenResponse> {
  const response = await api.post('/api/auth/verify-2fa', data)
  return response.data
}
