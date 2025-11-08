import React, { createContext, useState, useEffect } from 'react'
import { login, signup } from '../api/authApi.js'

export const AuthContext = createContext()

export const AuthProvider = ({ children })=>{
  const [user, setUser] = useState(null)

  useEffect(()=>{
    const stored = localStorage.getItem('user')
    if(stored) setUser(JSON.parse(stored))
  },[])

  const handleLogin = async (credentials) => {
    const res = await login(credentials)
    // expecting backend to respond { token: '...', user: { ... } }
    const token = res.token || res.data?.token
    const user = res.user || res.data?.user || res
    if(token) localStorage.setItem('token', token)
    if(user) localStorage.setItem('user', JSON.stringify(user))
    setUser(user)
    return user
  }

  const handleSignup = async (data) => {
    await signup(data)
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  return(
    <AuthContext.Provider value={{user, handleLogin, handleSignup, handleLogout: logout}}>
      {children}
    </AuthContext.Provider>
  )
}
