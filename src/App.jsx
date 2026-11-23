import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Trilha from './pages/Trilha.jsx'
import LessonPage from './pages/LessonPage.jsx'
import Exercicios from './pages/Exercicios.jsx'
import Projects from './pages/Projects.jsx'
import ProjectPage from './pages/ProjectPage.jsx'
import Desempenho from './pages/Desempenho.jsx'
import Certificado from './pages/Certificado.jsx'
import Configuracoes from './pages/Configuracoes.jsx'
import NaoEncontrada from './pages/NaoEncontrada.jsx'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="/trilha" element={<Trilha />} />
        <Route path="/aula/:lessonId" element={<LessonPage />} />
        <Route path="/exercicios" element={<Exercicios />} />
        <Route path="/projetos" element={<Projects />} />
        <Route path="/projetos/:projectId" element={<ProjectPage />} />
        <Route path="/desempenho" element={<Desempenho />} />
        <Route path="/certificado" element={<Certificado />} />
        <Route path="/configuracoes" element={<Configuracoes />} />
        <Route path="*" element={<NaoEncontrada />} />
      </Route>
    </Routes>
  )
}
