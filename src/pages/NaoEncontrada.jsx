import { Link } from 'react-router-dom'
import { Compass } from 'lucide-react'

export default function NaoEncontrada() {
  return (
    <div className="page fade-in">
      <div className="empty">
        <Compass size={42} />
        <h1 className="empty__title">Página não encontrada</h1>
        <p>O endereço acessado não existe na plataforma.</p>
        <div className="row" style={{ gap: 10, justifyContent: 'center' }}>
          <Link className="btn btn--primary" to="/">
            Ir para o dashboard
          </Link>
          <Link className="btn btn--ghost" to="/trilha">
            Ver trilha
          </Link>
        </div>
      </div>
    </div>
  )
}
