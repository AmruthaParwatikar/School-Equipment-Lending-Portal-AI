import React, { useContext } from 'react'
import { Routes, Route, Link, Navigate, useLocation } from 'react-router-dom'
import { AuthProvider, AuthContext } from './context/AuthContext.jsx'
import HomePage from './pages/HomePage.jsx'
import Dashboard from './pages/Dashboard.jsx'
import AdminPage from './pages/AdminPage.jsx'
import LoansPage from './pages/LoansPage.jsx'
import './styles.css'

function ProtectedRoute({ children, roles }) {
  const { user } = useContext(AuthContext)
  if(!user) return <Navigate to="/" replace />
  if(roles && !roles.includes(user.role)) {
    return (
      <div className="container">
        <div className="center">
          <h2>🚫 Access Denied</h2>
          <p className="text-muted">You don't have permission to access this page.</p>
          <Link to="/dashboard" className="button">Go to Dashboard</Link>
        </div>
      </div>
    )
  }
  return children
}

function Navigation() {
  const { user, handleLogout } = useContext(AuthContext)
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  return (
    <nav className="nav">
      <div className="flex flex-1">
        <Link to="/" className={`nav-brand ${isActive('/') ? 'active' : ''}`}>
          🏫 School Equipment Portal
        </Link>
        
        <div className="flex">
          <Link to="/dashboard" className={isActive('/dashboard') ? 'active' : ''}>
            📊 Dashboard
          </Link>
          {user && (user.role === 'admin' || user.role === 'staff') && (
            <Link to="/admin" className={isActive('/admin') ? 'active' : ''}>
              ⚙️ Admin
            </Link>
          )}
          <Link to="/loans" className={isActive('/loans') ? 'active' : ''}>
            📋 Loans
          </Link>
        </div>
      </div>
      
      {user && (
        <div className="flex">
          <span className="text-muted" style={{ color: 'rgba(255,255,255,0.8)' }}>
            Welcome, {user.name || user.email}
          </span>
          <button 
            onClick={handleLogout} 
            className="button button-secondary button-sm"
            style={{ marginLeft: 'var(--space-3)' }}
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  )
}

export default function App(){
  return (
    <AuthProvider>
      <Navigation />
      <main className="container fade-in">
        <Routes>
          <Route path="/" element={<HomePage/>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard/></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute roles={['admin','staff']} ><AdminPage/></ProtectedRoute>} />
          <Route path="/loans" element={<ProtectedRoute><LoansPage/></ProtectedRoute>} />
        </Routes>
      </main>
    </AuthProvider>
  )
}
