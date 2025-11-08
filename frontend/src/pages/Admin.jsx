
import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Admin(){
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name:'', category:'', condition:'', quantity:1, available:1 });
  const token = localStorage.getItem('token');

  async function fetchData(){
    const res = await axios.get('http://localhost:4000/api/v1/equipment');
    setItems(res.data);
  }
  useEffect(()=>{ fetchData(); }, []);

  async function addItem(){
    await axios.post('http://localhost:4000/api/v1/equipment', form, { headers: { Authorization: `Bearer ${token}` } });
    fetchData();
  }
  async function deleteItem(id){
    await axios.delete('http://localhost:4000/api/v1/equipment/'+id, { headers: { Authorization: `Bearer ${token}` } });
    fetchData();
  }

  return (
    <div className='p-6'>
      <h1 className='text-xl font-bold mb-4'>Admin Panel - Equipment CRUD</h1>
      <div className='mb-4'>
        <input placeholder='Name' onChange={e=>setForm({...form,name:e.target.value})} className='border p-2 mr-2'/>
        <input placeholder='Category' onChange={e=>setForm({...form,category:e.target.value})} className='border p-2 mr-2'/>
        <input placeholder='Condition' onChange={e=>setForm({...form,condition:e.target.value})} className='border p-2 mr-2'/>
        <button onClick={addItem} className='bg-blue-500 text-white px-4 py-2'>Add</button>
      </div>
      <div className='grid grid-cols-3 gap-4'>
        {items.map(eq=>(
          <div key={eq._id} className='border p-4 rounded'>
            <h2>{eq.name}</h2>
            <button onClick={()=>deleteItem(eq._id)} className='bg-red-500 text-white px-2 mt-2'>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
