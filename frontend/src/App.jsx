import { Route, Routes } from 'react-router-dom'
import './App.css'
import HomePage from './pages/HomePage'
import SessionDetailPage from './pages/SessionDetailPage'
import AuthPage from './pages/AuthPage'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/sessions/:id" element={<SessionDetailPage />} />
      </Routes>
    </>
  )
}

export default App