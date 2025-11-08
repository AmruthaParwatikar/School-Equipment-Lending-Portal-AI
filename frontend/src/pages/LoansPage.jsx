import React, { useContext } from 'react'
import { AuthContext } from '../context/AuthContext.jsx'
import LoanList from '../components/LoanList.jsx'

export default function LoansPage(){
  const { user } = useContext(AuthContext)

  return (
    <div className="fade-in">
      {/* Loans Page Header */}
      <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="flex" style={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2>📋 Loan Management</h2>
            <p className="text-muted">
              {user?.role === 'student' 
                ? 'View and manage your equipment loan requests and history.' 
                : 'Review, approve, and manage all equipment loan requests.'}
            </p>
          </div>
          <div className="badge badge-info">
            {user?.role === 'student' ? '🎓 Student View' : 
             user?.role === 'staff' ? '👨‍🏫 Staff View' : 
             '👨‍💼 Admin View'}
          </div>
        </div>
      </div>

      {/* Loans Content */}
      <div className="card">
        <LoanList />
      </div>
    </div>
  )
}
