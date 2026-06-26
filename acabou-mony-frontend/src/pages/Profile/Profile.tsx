import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../../context/AuthContext'
import { getUser } from '../../api/account'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { User, Mail, FileText, Shield, LogOut } from 'lucide-react'

export default function Profile() {
  const { usuarioId, nomeUsuario, email, role, logout } = useAuth()

  const { data: user, isFetching } = useQuery({
    queryKey: ['user', usuarioId],
    queryFn: () => getUser(usuarioId!),
    enabled: !!usuarioId,
  })

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold text-secondary">Meu Perfil</h1>

      <div className="flex flex-col gap-6">
        <Card>
          {isFetching ? (
            <div className="flex flex-col gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-6 w-48 animate-pulse rounded bg-gray-200" />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <User size={32} className="text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-secondary">{user?.nome || nomeUsuario}</h2>
                  <Badge variant={role === 'ROLE_ADMIN' ? 'info' : 'default'}>
                    {role === 'ROLE_ADMIN' ? 'Administrador' : 'Usuário'}
                  </Badge>
                </div>
              </div>

              <div className="grid gap-4 pt-4 md:grid-cols-2">
                <div className="flex items-center gap-3">
                  <Mail size={18} className="text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">E-mail</p>
                    <p className="text-sm text-secondary">{user?.email || email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <FileText size={18} className="text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">CPF</p>
                    <p className="text-sm text-secondary">{user?.cpf || '---'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Shield size={18} className="text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Role</p>
                    <p className="text-sm text-secondary">{role || 'ROLE_USER'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <FileText size={18} className="text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Registro desde</p>
                    <p className="text-sm text-secondary">{user?.dataCriacao ? new Date(user.dataCriacao).toLocaleDateString('pt-BR') : '---'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Card>

        <Card>
          <div className="flex justify-between">
            <div>
              <h3 className="text-lg font-semibold text-secondary">Sair da conta</h3>
              <p className="text-sm text-gray-500">Desconectar-se do sistema</p>
            </div>
            <Button variant="danger" onClick={logout}>
              <LogOut size={16} />
              Sair
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
