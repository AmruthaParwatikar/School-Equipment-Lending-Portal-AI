
import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function App(){
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [available, setAvailable] = useState(false);

  useEffect(()=>{
    fetchData();
  }, [search, category, available]);

  async function fetchData(){
    const res = await axios.get('http://localhost:4000/api/v1/equipment', { params: { search, category, available } });
    setItems(res.data);
  }

  return (
    <div className='p-6'>
      <h1 className='text-2xl font-bold mb-4'>Equipment List</h1>
      <input className='border p-2 mr-2' placeholder='Search...' value={search} onChange={e=>setSearch(e.target.value)}/>
      <input className='border p-2 mr-2' placeholder='Category...' value={category} onChange={e=>setCategory(e.target.value)}/>
      <label><input type='checkbox' checked={available} onChange={e=>setAvailable(e.target.checked)}/> Only available</label>
      <div className='grid grid-cols-3 gap-4 mt-4'>
        {items.map(eq=>(
          <div key={eq._id} className='border p-4 rounded shadow'>
            <h2 className='font-bold'>{eq.name}</h2>
            <p>Category: {eq.category}</p>
            <p>Condition: {eq.condition}</p>
            <p>Available: {eq.available}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
