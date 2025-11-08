import React, { useEffect, useState, useContext } from 'react'
import { getAllLoans, requestLoan, approveLoan, markReturned } from '../api/loanApi.js'
import { AuthContext } from '../context/AuthContext.jsx'

export default function LoanList({selectedEquipment, refreshKey}) {
  const [loans, setLoans] = useState([])
  const [qty, setQty] = useState(1)
  const [dueDate, setDueDate] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const { user } = useContext(AuthContext)

  useEffect(()=>{
    (async()=>{
      setLoading(true)
      try{
        const data = await getAllLoans()
        setLoans(data)
      }catch(err){
        console.error(err)
        setError('Failed to load loans')
      } finally {
        setLoading(false)
      }
    })()
  },[refreshKey])

  const submit = async (e)=>{
    e.preventDefault()
    if(!selectedEquipment) {
      setError('Please select equipment first')
      return
    }
    
    setSubmitting(true)
    setError('')
    
    try{
      await requestLoan({
        equipmentId: selectedEquipment._id || selectedEquipment.id, 
        quantity: qty, 
        dueDate
      })
      // Reset form
      setQty(1)
      setDueDate('')
      // Refresh loans list
      const data = await getAllLoans()
      setLoans(data)
    }catch(err){
      console.error(err)
      setError(err.response?.data?.message || 'Request failed')
    } finally {
      setSubmitting(false)
    }
  }

  const handleApprove = async (loanId) => {
    try {
      await approveLoan(loanId)
      const data = await getAllLoans()
      setLoans(data)
    } catch (err) {
      console.error(err)
      setError('Failed to approve loan')
    }
  }

  const handleMarkReturned = async (loanId) => {
    try {
      await markReturned(loanId)
      const data = await getAllLoans()
      setLoans(data)
    } catch (err) {
      console.error(err)
      setError('Failed to mark as returned')
    }
  }

  const getStatusBadge = (status) => {
    const statusMap = {
      'pending': { text: 'Pending', class: 'badge-warning' },
      'approved': { text: 'Approved', class: 'badge-info' },
      'issued': { text: 'Issued', class: 'badge-success' },
      'returned': { text: 'Returned', class: 'badge-info' },
      'overdue': { text: 'Overdue', class: 'badge-error' }
    }
    return statusMap[status] || { text: status, class: 'badge-info' }
  }

  const isOverdue = (dueDate) => {
    if (!dueDate) return false
    return new Date(dueDate) < new Date()
  }

  return (
    <div>
      {/* Loan Request Form for Students */}
      {user && user.role === 'student' && selectedEquipment && (
        <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
          <div className="card-header">
            <h4>📝 Request Loan</h4>
            <p className="text-muted">Requesting: {selectedEquipment.name}</p>
          </div>
          
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
          
          <form className="form" onSubmit={submit}>
            <div className="form-row">
              <div className="form-group">
                <label style={{ fontWeight: '500', marginBottom: 'var(--space-1)' }}>
                  Quantity
                </label>
                <input 
                  type="number" 
                  value={qty} 
                  min={1} 
                  max={selectedEquipment.available}
                  onChange={e=>setQty(parseInt(e.target.value||1))}
                  disabled={submitting}
                />
                <small className="text-muted">
                  Max available: {selectedEquipment.available}
                </small>
              </div>
              
              <div className="form-group">
                <label style={{ fontWeight: '500', marginBottom: 'var(--space-1)' }}>
                  Due Date
                </label>
                <input 
                  type="date" 
                  value={dueDate} 
                  min={new Date().toISOString().split('T')[0]}
                  onChange={e=>setDueDate(e.target.value)}
                  required
                  disabled={submitting}
                />
              </div>
            </div>
            
            <button 
              className="button button-success" 
              type="submit"
              disabled={submitting || !dueDate || qty > selectedEquipment.available}
            >
              {submitting ? (
                <>
                  <span className="spinner"></span>
                  Submitting...
                </>
              ) : (
                'Request Loan'
              )}
            </button>
          </form>
        </div>
      )}

      {/* Loans List */}
      <div>
        {loading ? (
          <div className="center" style={{ padding: 'var(--space-8)' }}>
            <span className="spinner"></span>
            <p className="text-muted" style={{ marginTop: 'var(--space-3)' }}>Loading loans...</p>
          </div>
        ) : loans && loans.length ? (
          <div className="list">
            {loans.map(l => {
              const status = l.status || l.state || 'pending'
              const statusInfo = getStatusBadge(status)
              const overdue = isOverdue(l.dueDate)
              
              return (
                <div className="list-item" key={l._id || l.id}>
                  <div className="flex" style={{ alignItems: 'flex-start', gap: 'var(--space-4)' }}>
                    <div className="flex-1">
                      <div className="flex" style={{ alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-2)' }}>
                        <h4 style={{ margin: 0 }}>
                          {l.equipmentId?.name || l.equipmentId}
                        </h4>
                        <span className={`badge ${statusInfo.class}`}>
                          {statusInfo.text}
                        </span>
                        {overdue && status === 'issued' && (
                          <span className="badge badge-error">
                            Overdue
                          </span>
                        )}
                      </div>
                      
                      <div className="flex" style={{ gap: 'var(--space-4)', marginBottom: 'var(--space-2)' }}>
                        <span className="small">
                          <strong>Quantity:</strong> {l.quantity}
                        </span>
                        <span className="small">
                          <strong>Due:</strong> {l.dueDate ? new Date(l.dueDate).toLocaleDateString() : 'N/A'}
                        </span>
                        {l.borrowerId?.name && (
                          <span className="small">
                            <strong>Borrower:</strong> {l.borrowerId.name}
                          </span>
                        )}
                      </div>
                      
                      {l.requestDate && (
                        <p className="small text-muted" style={{ margin: 0 }}>
                          Requested: {new Date(l.requestDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    
                    {/* Action Buttons */}
                    {user && (user.role === 'admin' || user.role === 'staff') && (
                      <div className="flex flex-col" style={{ gap: 'var(--space-2)' }}>
                        {status === 'pending' && (
                          <button 
                            className="button button-success button-sm"
                            onClick={() => handleApprove(l._id || l.id)}
                          >
                            ✅ Approve
                          </button>
                        )}
                        {status === 'issued' && (
                          <button 
                            className="button button-secondary button-sm"
                            onClick={() => handleMarkReturned(l._id || l.id)}
                          >
                            📥 Mark Returned
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="center" style={{ padding: 'var(--space-8)' }}>
            <div style={{ fontSize: '3rem', marginBottom: 'var(--space-3)' }}>📋</div>
            <h4>No Loans Found</h4>
            <p className="text-muted">
              {user?.role === 'student' 
                ? 'You haven\'t made any loan requests yet.' 
                : 'No loan requests have been made yet.'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
