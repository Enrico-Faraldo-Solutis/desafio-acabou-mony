import { Link } from 'react-router-dom'
import { Button } from '../../components/ui/Button'
import { Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-50">
      <h1 className="text-6xl font-bold text-primary">404</h1>
      <p className="text-xl text-gray-500">Página não encontrada</p>
      <Link to="/">
        <Button>
          <Home size={16} />
          Voltar ao início
        </Button>
      </Link>
    </div>
  )
}
