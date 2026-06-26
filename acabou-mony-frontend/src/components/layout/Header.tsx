import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { LogOut, User, CreditCard, ArrowRightLeft, FileText, LayoutDashboard, Shield } from 'lucide-react'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/transactions', label: 'Extrato', icon: FileText },
  { to: '/transfer', label: 'Transferir', icon: ArrowRightLeft },
  { to: '/cards', label: 'Cartões', icon: CreditCard },
  { to: '/profile', label: 'Perfil', icon: User },
]

export function Header() {
  const { nomeUsuario, isAdmin, logout } = useAuth()
  const location = useLocation()

  return (
    <header className="bg-secondary text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link to="/dashboard" className="text-xl font-bold text-primary">
          Acabou o Mony
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.to || location.pathname.startsWith(item.to + '/')
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm transition-colors
                  ${isActive ? 'bg-primary/20 text-primary' : 'text-gray-300 hover:bg-white/10 hover:text-white'}`}
              >
                <Icon size={16} />
                {item.label}
              </Link>
            )
          })}
          {isAdmin && (
            <Link
              to="/auditing"
              className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm transition-colors
                ${location.pathname === '/auditing' ? 'bg-primary/20 text-primary' : 'text-gray-300 hover:bg-white/10 hover:text-white'}`}
            >
              <Shield size={16} />
              Auditoria
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-4">
          <span className="hidden text-sm text-gray-300 md:block">{nomeUsuario}</span>
          <button
            onClick={logout}
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-gray-300 transition-colors hover:bg-white/10 hover:text-white cursor-pointer"
          >
            <LogOut size={16} />
            <span className="hidden md:inline">Sair</span>
          </button>
        </div>
      </div>
    </header>
  )
}
