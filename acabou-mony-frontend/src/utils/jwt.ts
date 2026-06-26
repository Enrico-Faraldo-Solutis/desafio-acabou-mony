export function decodeToken(token: string): { sub: number; role: string; exp: number } | null {
  try {
    const payload = token.split('.')[1]
    const decoded = JSON.parse(atob(payload))
    return {
      sub: Number(decoded.sub),
      role: decoded.role ?? 'ROLE_USER',
      exp: decoded.exp,
    }
  } catch {
    return null
  }
}
