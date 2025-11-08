import React, { useState, useContext } from 'react'
import { AuthContext } from '../context/AuthContext.jsx'

export default function SignupForm(){
  const { handleSignup } = useContext(AuthContext)
  const [form, setForm] = useState({name:'', email:'', password:'', role:'student'})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)
    
    try{
      await handleSignup(form)
      setSuccess(true)
      setForm({name:'', email:'', password:'', role:'student'})
    }catch(err){
      console.error(err)
      setError(err.response?.data?.message || 'Signup failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="center">
        <div style={{ fontSize: '3rem', marginBottom: 'var(--space-4)' }}>✅</div>
        <h3>Account Created Successfully!</h3>
        <p className="text-muted">You can now sign in with your credentials.</p>
        <button 
          className="button" 
          onClick={() => setSuccess(false)}
        >
          Create Another Account
        </button>
      </div>
    )
  }

  return (
    <form className="form" onSubmit={submit}>
      {error && (
        <div className="card" style={{ 
          background: 'var(--error-50)', 
          border: '1px solid var(--error-200)', 
          color: 'var(--error-600)',
          marginBottom: 'var(--space-4)'
        }}>
          {error}
        </div>
      )}
      
      <div className="form-group">
        <label htmlFor="signup-name" style={{ fontWeight: '500', marginBottom: 'var(--space-1)' }}>
          Full Name
        </label>
        <input 
          id="signup-name"
          placeholder="Enter your full name" 
          value={form.name} 
          onChange={e=>setForm({...form, name:e.target.value})}
          required
          disabled={loading}
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="signup-email" style={{ fontWeight: '500', marginBottom: 'var(--space-1)' }}>
          Email Address
        </label>
        <input 
          id="signup-email"
          type="email"
          placeholder="Enter your email" 
          value={form.email} 
          onChange={e=>setForm({...form, email:e.target.value})}
          required
          disabled={loading}
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="signup-password" style={{ fontWeight: '500', marginBottom: 'var(--space-1)' }}>
          Password
        </label>
        <input 
          id="signup-password"
          type="password" 
          placeholder="Create a password" 
          value={form.password} 
          onChange={e=>setForm({...form, password:e.target.value})}
          required
          minLength={6}
          disabled={loading}
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="signup-role" style={{ fontWeight: '500', marginBottom: 'var(--space-1)' }}>
          Role
        </label>
        <select 
          id="signup-role"
          value={form.role} 
          onChange={e=>setForm({...form, role:e.target.value})}
          disabled={loading}
        >
          <option value="student">🎓 Student</option>
          <option value="staff">👨‍🏫 Staff</option>
          <option value="admin">👨‍💼 Admin</option>
        </select>
      </div>
      
      <button 
        className="button button-lg" 
        type="submit" 
        disabled={loading || !form.name || !form.email || !form.password}
      >
        {loading ? (
          <>
            <span className="spinner"></span>
            Creating Account...
          </>
        ) : (
          'Create Account'
        )}
      </button>
    </form>
  )
}
