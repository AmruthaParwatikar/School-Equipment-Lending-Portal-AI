import React, { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext.jsx'
import SignupForm from '../components/SignupForm.jsx'
import LoginForm from '../components/LoginForm.jsx'

export default function HomePage(){
  const { user } = useContext(AuthContext)
  
  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="fade-in">
      {/* Hero Section */}
      <div className="center" style={{ marginBottom: 'var(--space-12)' }}>
        <h1>🏫 School Equipment Lending Portal</h1>
        <p className="text-muted" style={{ fontSize: 'var(--font-size-lg)', maxWidth: '600px', margin: '0 auto' }}>
          Streamline equipment management and lending processes for educational institutions. 
          Students and staff can easily request, track, and manage equipment loans.
        </p>
      </div>

      {/* Features Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: 'var(--space-6)', 
        marginBottom: 'var(--space-12)' 
      }}>
        <div className="card center">
          <div style={{ fontSize: '2rem', marginBottom: 'var(--space-3)' }}>📚</div>
          <h4>Equipment Management</h4>
          <p className="text-muted">Track and manage all school equipment with detailed inventory control.</p>
        </div>
        
        <div className="card center">
          <div style={{ fontSize: '2rem', marginBottom: 'var(--space-3)' }}>🔄</div>
          <h4>Loan Tracking</h4>
          <p className="text-muted">Monitor equipment loans with real-time status updates and due dates.</p>
        </div>
        
        <div className="card center">
          <div style={{ fontSize: '2rem', marginBottom: 'var(--space-3)' }}>👥</div>
          <h4>User Management</h4>
          <p className="text-muted">Role-based access for students, staff, and administrators.</p>
        </div>
      </div>

      {/* Auth Forms */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
        gap: 'var(--space-8)',
        alignItems: 'start'
      }}>
        <div className="card">
          <div className="card-header">
            <h3>🔐 Login</h3>
          </div>
          <LoginForm />
        </div>
        
        <div className="card">
          <div className="card-header">
            <h3>📝 Sign Up</h3>
          </div>
          <SignupForm />
        </div>
      </div>
    </div>
  )
}
