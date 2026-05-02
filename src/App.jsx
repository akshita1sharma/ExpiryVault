import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { useState, useEffect } from 'react'
import { supabase } from './supabase'
import Navbar from './components/Navbar'
import Dashboard from './components/Dashboard'
import Login from './pages/Login'
import Signup from './pages/Signup'

function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  if (loading) return (
    <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center">
      <p className="text-white text-xl">Loading...</p>
    </div>
  )

  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={!session ? <Login /> : <Navigate to="/" />} />
          <Route path="/signup" element={!session ? <Signup /> : <Navigate to="/" />} />
          <Route path="/" element={
            session ? (
              <>
                <Navbar user={session.user} />
                <Dashboard />
              </>
            ) : (
              <Navigate to="/login" />
            )
          } />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App