import React, { useState, useEffect } from 'react'
import { addEquipment, updateEquipment } from '../api/equipmentApi.js'

export default function EquipmentForm({initial, onSaved}){
  const [form, setForm] = useState({
    name: '', 
    category: '', 
    condition: 'Good', 
    quantity: 1, 
    available: 1,
    description: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (initial) {
      setForm({
        name: initial.name || '',
        category: initial.category || '',
        condition: initial.condition || 'Good',
        quantity: initial.quantity || 1,
        available: initial.available || 1,
        description: initial.description || ''
      })
    } else {
      setForm({
        name: '', 
        category: '', 
        condition: 'Good', 
        quantity: 1, 
        available: 1,
        description: ''
      })
    }
    setError('')
    setSuccess(false)
  }, [initial])

  const submit = async (e) => {
    e && e.preventDefault && e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)
    
    try{
      if(form._id || form.id){
        await updateEquipment(form._id || form.id, form)
        setSuccess('Equipment updated successfully!')
      }else{
        await addEquipment(form)
        setSuccess('Equipment added successfully!')
        // Reset form for new equipment
        setForm({
          name: '', 
          category: '', 
          condition: 'Good', 
          quantity: 1, 
          available: 1,
          description: ''
        })
      }
      onSaved && onSaved()
    }catch(err){
      console.error(err)
      setError(err.response?.data?.message || 'Save failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleQuantityChange = (value) => {
    const newQuantity = parseInt(value || 0)
    setForm(prev => ({
      ...prev,
      quantity: newQuantity,
      available: Math.min(prev.available, newQuantity)
    }))
  }

  const handleAvailableChange = (value) => {
    const newAvailable = parseInt(value || 0)
    setForm(prev => ({
      ...prev,
      available: Math.min(newAvailable, prev.quantity)
    }))
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

      {success && (
        <div className="card" style={{ 
          background: 'var(--success-50)', 
          border: '1px solid var(--success-200)', 
          color: 'var(--success-600)',
          marginBottom: 'var(--space-4)'
        }}>
          {success}
        </div>
      )}

      <div className="form-group">
        <label htmlFor="equipment-name" style={{ fontWeight: '500', marginBottom: 'var(--space-1)' }}>
          Equipment Name *
        </label>
        <input 
          id="equipment-name"
          placeholder="Enter equipment name" 
          value={form.name} 
          onChange={e=>setForm({...form, name:e.target.value})}
          required
          disabled={loading}
        />
      </div>

      <div className="form-group">
        <label htmlFor="equipment-category" style={{ fontWeight: '500', marginBottom: 'var(--space-1)' }}>
          Category *
        </label>
        <select 
          id="equipment-category"
          value={form.category} 
          onChange={e=>setForm({...form, category:e.target.value})}
          required
          disabled={loading}
        >
          <option value="">Select a category</option>
          <option value="Electronics">Electronics</option>
          <option value="Books">Books</option>
          <option value="Lab Equipment">Lab Equipment</option>
          <option value="Sports">Sports</option>
          <option value="Furniture">Furniture</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="equipment-condition" style={{ fontWeight: '500', marginBottom: 'var(--space-1)' }}>
          Condition *
        </label>
        <select 
          id="equipment-condition"
          value={form.condition} 
          onChange={e=>setForm({...form, condition:e.target.value})}
          required
          disabled={loading}
        >
          <option value="Excellent">Excellent</option>
          <option value="Good">Good</option>
          <option value="Fair">Fair</option>
          <option value="Poor">Poor</option>
        </select>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="equipment-quantity" style={{ fontWeight: '500', marginBottom: 'var(--space-1)' }}>
            Total Quantity *
          </label>
          <input 
            id="equipment-quantity"
            type="number" 
            placeholder="Total quantity" 
            value={form.quantity} 
            min="1"
            onChange={e=>handleQuantityChange(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="equipment-available" style={{ fontWeight: '500', marginBottom: 'var(--space-1)' }}>
            Available *
          </label>
          <input 
            id="equipment-available"
            type="number" 
            placeholder="Available quantity" 
            value={form.available} 
            min="0"
            max={form.quantity}
            onChange={e=>handleAvailableChange(e.target.value)}
            required
            disabled={loading}
          />
          <small className="text-muted">
            Cannot exceed total quantity ({form.quantity})
          </small>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="equipment-description" style={{ fontWeight: '500', marginBottom: 'var(--space-1)' }}>
          Description
        </label>
        <textarea 
          id="equipment-description"
          placeholder="Enter equipment description (optional)" 
          value={form.description} 
          onChange={e=>setForm({...form, description:e.target.value})}
          rows="3"
          disabled={loading}
        />
      </div>

      <button 
        className="button button-lg" 
        type="submit"
        disabled={loading || !form.name || !form.category}
      >
        {loading ? (
          <>
            <span className="spinner"></span>
            {form._id || form.id ? 'Updating...' : 'Adding...'}
          </>
        ) : (
          <>
            {form._id || form.id ? '✏️ Update Equipment' : '➕ Add Equipment'}
          </>
        )}
      </button>
    </form>
  )
}
