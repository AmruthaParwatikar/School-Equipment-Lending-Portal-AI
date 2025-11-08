import React, { useState, useContext } from 'react'
import { AuthContext } from '../context/AuthContext.jsx'
import EquipmentList from '../components/EquipmentList.jsx'
import EquipmentForm from '../components/EquipmentForm.jsx'
import { deleteEquipment } from '../api/equipmentApi.js'

export default function AdminPage(){
  const [selected, setSelected] = useState(null)
  const [refresh, setRefresh] = useState(0)
  const [deleting, setDeleting] = useState(false)
  const { user } = useContext(AuthContext)

  const onSaved = ()=> setRefresh(r=>r+1)

  const handleDelete = async () => {
    if (!selected) return
    
    const confirmed = window.confirm(
      `Are you sure you want to delete "${selected.name}"? This action cannot be undone.`
    )
    
    if (!confirmed) return
    
    setDeleting(true)
    try {
      await deleteEquipment(selected._id || selected.id)
      setSelected(null)
      onSaved()
    } catch (err) {
      console.error(err)
      alert('Failed to delete equipment')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="fade-in">
      {/* Admin Header */}
      <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="flex" style={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2>⚙️ Admin Panel</h2>
            <p className="text-muted">
              Manage equipment inventory, add new items, and update existing equipment.
            </p>
          </div>
          <div className="badge badge-info">
            {user?.role === 'admin' ? '👨‍💼 Administrator' : '👨‍🏫 Staff'}
          </div>
        </div>
      </div>

      {/* Main Admin Grid */}
      <div className="admin-grid" style={{
        display: 'grid',
        gridTemplateColumns: '1fr 450px',
        gap: 'var(--space-6)',
        alignItems: 'start'
      }}>
        {/* Equipment Management */}
        <div className="card">
          <div className="card-header">
            <h3>📚 Equipment Inventory</h3>
            <p className="text-muted">Select equipment to edit or delete</p>
          </div>
          <EquipmentList onSelect={setSelected} refreshKey={refresh} />
        </div>

        {/* Equipment Form */}
        <div className="card">
          <div className="card-header">
            <h3>{selected ? '✏️ Edit Equipment' : '➕ Add New Equipment'}</h3>
            <p className="text-muted">
              {selected ? `Editing: ${selected.name}` : 'Fill in the details to add new equipment'}
            </p>
          </div>
          
          <EquipmentForm initial={selected} onSaved={onSaved} />
          
          {selected && (
            <div style={{ marginTop: 'var(--space-6)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--gray-200)' }}>
              <h4 style={{ color: 'var(--error-600)', marginBottom: 'var(--space-3)' }}>
                ⚠️ Danger Zone
              </h4>
              <p className="text-muted" style={{ marginBottom: 'var(--space-4)' }}>
                Deleting equipment will remove it permanently from the system. 
                This action cannot be undone.
              </p>
              <button 
                className="button button-danger" 
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? (
                  <>
                    <span className="spinner"></span>
                    Deleting...
                  </>
                ) : (
                  '🗑️ Delete Equipment'
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
