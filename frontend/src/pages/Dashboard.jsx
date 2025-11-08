import React, { useState, useContext } from 'react'
import { AuthContext } from '../context/AuthContext.jsx'
import EquipmentList from '../components/EquipmentList.jsx'
import LoanList from '../components/LoanList.jsx'

export default function Dashboard(){
  const [selected, setSelected] = useState(null)
  const [refresh, setRefresh] = useState(0)
  const { user } = useContext(AuthContext)

  return (
    <div className="fade-in">
      {/* Dashboard Header */}
      <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="flex" style={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2>📊 Dashboard</h2>
            <p className="text-muted">
              Welcome back, {user?.name || user?.email}! 
              {user?.role === 'student' ? ' Browse and request equipment loans.' : 
               user?.role === 'staff' ? ' Manage equipment and approve loan requests.' :
               ' Full administrative access to the system.'}
            </p>
          </div>
          <div className="badge badge-info">
            {user?.role === 'student' ? '🎓 Student' : 
             user?.role === 'staff' ? '👨‍🏫 Staff' : 
             '👨‍💼 Admin'}
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="dashboard-grid" style={{
        display: 'grid',
        gridTemplateColumns: '1fr 400px',
        gap: 'var(--space-6)',
        alignItems: 'start'
      }}>
        {/* Equipment Section */}
        <div className="card">
          <div className="card-header">
            <h3>📚 Available Equipment</h3>
            <p className="text-muted">Select equipment to view details and request loans</p>
          </div>
          <EquipmentList onSelect={setSelected} refreshKey={refresh} />
        </div>

        {/* Loans Section */}
        <div className="card">
          <div className="card-header">
            <h3>📋 Loan Management</h3>
            <p className="text-muted manage-loans">
              {selected ? `Managing: ${selected.name}` : 'Select equipment to manage loans'}
            </p>
          </div>
          <LoanList selectedEquipment={selected} refreshKey={refresh} />
        </div>
      </div>
    </div>
  )
}
