import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { TokenResponse } from '../types/auth'
import { decodeToken } from '../utils/jwt'

interface AuthContextData {
  token: string | null
  usuarioId: number | null
  nomeUsuario: string | null
  email: string | null
  role: string | null
  contaId: number | null
  isAuthenticated: boolean
  isAdmin: boolean
  login: (data: TokenResponse) => void
  logout: () => void
  setContaId: (id: number) => void
}

const AuthContext = createContext<AuthContextData | null>(null)

function loadFromStorage<T>(key: string, parser?: (v: string) => T): T | null {
  const val = localStorage.getItem(key)
  if (!val) return null
  return parser ? parser(val) : (val as unknown as T)
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => loadFromStorage<string>('acabou_mony_token'))
  const [usuarioId, setUsuarioId] = useState<number | null>(() => loadFromStorage<number>('acabou_mony_usuarioId', Number))
  const [nomeUsuario, setNomeUsuario] = useState<string | null>(() => loadFromStorage<string>('acabou_mony_nomeUsuario'))
  const [email, setEmail] = useState<string | null>(() => loadFromStorage<string>('acabou_mony_email'))
  const [role, setRole] = useState<string | null>(() => loadFromStorage<string>('acabou_mony_role'))
  const [contaId, setContaIdState] = useState<number | null>(() => loadFromStorage<number>('acabou_mony_contaId', Number))

  const login = useCallback((data: TokenResponse) => {
    const payload = decodeToken(data.token)
    const userId = payload?.sub ?? null
    const userRole = payload?.role ?? null

    const emailFromJwt: string | null = (() => {
      try {
        const p = JSON.parse(atob(data.token.split('.')[1]))
        return typeof p.email === 'string' ? p.email : null
      } catch { return null }
    })()

    setToken(data.token)
    setUsuarioId(userId)
    setNomeUsuario(null)
    setEmail(emailFromJwt)
    setRole(userRole)

    localStorage.setItem('acabou_mony_token', data.token)
    localStorage.setItem('acabou_mony_usuarioId', String(userId))
    if (emailFromJwt) localStorage.setItem('acabou_mony_email', emailFromJwt)
    if (userRole) localStorage.setItem('acabou_mony_role', userRole)
  }, [])

  const logout = useCallback(() => {
    setToken(null)
    setUsuarioId(null)
    setNomeUsuario(null)
    setEmail(null)
    setRole(null)
    setContaIdState(null)
    localStorage.clear()
  }, [])

  const setContaId = useCallback((id: number) => {
    setContaIdState(id)
    localStorage.setItem('acabou_mony_contaId', String(id))
  }, [])

  return (
    <AuthContext.Provider
      value={{
        token,
        usuarioId,
        nomeUsuario,
        email,
        role,
        contaId,
        isAuthenticated: !!token,
        isAdmin: role === 'ROLE_ADMIN',
        login,
        logout,
        setContaId,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
