import { Link } from 'react-router-dom'
import { Button } from '../../components/ui/Button'
import { Zap, Shield, TrendingUp, CreditCard } from 'lucide-react'

const features = [
  { icon: Zap, title: 'Pagamentos instantâneos', desc: 'Transações processadas em menos de 1 segundo para vendas durante lives.' },
  { icon: Shield, title: 'Segurança em duas etapas', desc: 'Autenticação 2FA e criptografia de dados sensíveis para sua proteção.' },
  { icon: TrendingUp, title: 'Live Commerce', desc: 'Integração perfeita com plataformas de vendas ao vivo.' },
  { icon: CreditCard, title: 'Cartões virtuais e físicos', desc: 'Gere cartões com número e CVC criptografados.' },
]

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <h1 className="text-xl font-bold text-primary">Acabou o Mony</h1>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost">Entrar</Button>
            </Link>
            <Link to="/register">
              <Button>Criar conta</Button>
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-20 text-center">
        <h2 className="text-4xl font-bold text-secondary md:text-5xl">
          Pagamentos digitais{' '}
          <span className="text-primary">rápidos e seguros</span>
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-500">
          A plataforma de pagamentos criada para empreendedores que vendem ao vivo.
          Transações instantâneas, segurança de ponta a ponta e integração com Live Commerce.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Link to="/register">
            <Button size="lg">Começar agora</Button>
          </Link>
          <Link to="/login">
            <Button variant="outline" size="lg">Já tenho conta</Button>
          </Link>
        </div>
      </section>

      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4">
          <h3 className="mb-12 text-center text-2xl font-bold text-secondary">
            Por que escolher o Acabou o Mony?
          </h3>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <div key={feature.title} className="rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Icon size={24} className="text-primary" />
                  </div>
                  <h4 className="mb-2 font-semibold text-secondary">{feature.title}</h4>
                  <p className="text-sm text-gray-500">{feature.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <footer className="border-t border-gray-100 py-8 text-center text-sm text-gray-400">
        &copy; 2026 Acabou o Mony. Todos os direitos reservados.
      </footer>
    </div>
  )
}
