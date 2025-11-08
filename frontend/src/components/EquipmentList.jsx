import React, { useEffect, useState } from 'react'
import { getAllEquipment } from '../api/equipmentApi.js'

export default function EquipmentList({onSelect, refreshKey}) {
  const [items, setItems] = useState([])
  const [query, setQuery] = useState({search:'', category:'', available:''})
  const [loading, setLoading] = useState(false)

  useEffect(()=>{
    (async()=>{
      setLoading(true)
      try{
        const data = await getAllEquipment(query)
        setItems(data)
      }catch(err){
        console.error(err)
      } finally {
        setLoading(false)
      }
    })()
  },[refreshKey, query])

  const getConditionBadge = (condition) => {
    const badges = {
      'Excellent': 'badge-success',
      'Good': 'badge-info', 
      'Fair': 'badge-warning',
      'Poor': 'badge-error'
    }
    return badges[condition] || 'badge-info'
  }

  const getAvailabilityStatus = (available, quantity) => {
    if (available === 0) return { text: 'Out of Stock', class: 'badge-error' }
    if (available < quantity * 0.3) return { text: 'Low Stock', class: 'badge-warning' }
    return { text: 'Available', class: 'badge-success' }
  }

  return (
    <div>
      {/* Search and Filters */}
      <div className="form" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="form-row">
          <div className="form-group">
            <input 
              placeholder="🔍 Search equipment..." 
              value={query.search} 
              onChange={e=>setQuery({...query, search:e.target.value})}
            />
          </div>
          <div className="form-group">
            <select 
              value={query.category} 
              onChange={e=>setQuery({...query, category:e.target.value})}
            >
              <option value="">All Categories</option>
              <option value="Electronics">Electronics</option>
              <option value="Books">Books</option>
              <option value="Lab Equipment">Lab Equipment</option>
              <option value="Sports">Sports</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* Equipment List */}
      <div className="list">
        {loading ? (
          <div className="center" style={{ padding: 'var(--space-8)' }}>
            <span className="spinner"></span>
            <p className="text-muted" style={{ marginTop: 'var(--space-3)' }}>Loading equipment...</p>
          </div>
        ) : items && items.length ? items.map(it=>{
          const availability = getAvailabilityStatus(it.available, it.quantity)
          return (
            <div className="list-item" key={it._id || it.id}>
              <div className="flex" style={{ alignItems: 'flex-start', gap: 'var(--space-4)' }}>
                <div className="flex-1">
                  <div className="flex" style={{ alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-2)' }}>
                    <h4 style={{ margin: 0 }}>{it.name}</h4>
                    <span className={`badge ${getConditionBadge(it.condition)}`}>
                      {it.condition}
                    </span>
                    <span className={`badge ${availability.class}`}>
                      {availability.text}
                    </span>
                  </div>
                  
                  <div className="flex" style={{ gap: 'var(--space-4)', marginBottom: 'var(--space-2)' }}>
                    <span className="small">
                      <strong>Category:</strong> {it.category || 'Uncategorized'}
                    </span>
                    <span className="small">
                      <strong>Total:</strong> {it.quantity}
                    </span>
                    <span className="small">
                      <strong>Available:</strong> {it.available}
                    </span>
                  </div>
                  
                  {it.description && (
                    <p className="small text-muted" style={{ margin: 0 }}>
                      {it.description}
                    </p>
                  )}
                </div>
                
                <div>
                  <button 
                    className="button button-sm" 
                    onClick={()=>onSelect && onSelect(it)}
                    disabled={it.available === 0}
                  >
                    {it.available === 0 ? 'Out of Stock' : 'Select'}
                  </button>
                </div>
              </div>
            </div>
          )
        }) : (
          <div className="center" style={{ padding: 'var(--space-8)' }}>
            <div style={{ fontSize: '3rem', marginBottom: 'var(--space-3)' }}>📦</div>
            <h4>No Equipment Found</h4>
            <p className="text-muted">Try adjusting your search criteria or check back later.</p>
          </div>
        )}
      </div>
    </div>
  )
}
