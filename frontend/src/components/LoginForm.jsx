import React, { useState, useContext } from 'react'
import { AuthContext } from '../context/AuthContext.jsx'

export default function LoginForm(){
  const { handleLogin } = useContext(AuthContext)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try{
      await handleLogin({email, password})
      // Success handled by AuthContext redirect
    }catch(err){
      console.error(err)
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
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
        <label htmlFor="email" style={{ fontWeight: '500', marginBottom: 'var(--space-1)' }}>
          Email Address
        </label>
        <input 
          id="email"
          type="email"
          placeholder="Enter your email" 
          value={email} 
          onChange={e=>setEmail(e.target.value)}
          required
          disabled={loading}
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="password" style={{ fontWeight: '500', marginBottom: 'var(--space-1)' }}>
          Password
        </label>
        <input 
          id="password"
          type="password" 
          placeholder="Enter your password" 
          value={password} 
          onChange={e=>setPassword(e.target.value)}
          required
          disabled={loading}
        />
      </div>
      
      <button 
        className="button button-lg" 
        type="submit" 
        disabled={loading || !email || !password}
      >
        {loading ? (
          <>
            <span className="spinner"></span>
            Signing In...
          </>
        ) : (
          'Sign In'
        )}
      </button>
    </form>
  )
}
