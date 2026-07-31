import React, { useEffect, useState } from 'react'
import api from '../../services/api'

export default function CompaniesList() {
  const [companies, setCompanies] = useState([])
  const [name, setName] = useState('')
  const [taxId, setTaxId] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(()=>{ fetchCompanies() }, [])

  async function fetchCompanies(){
    setLoading(true)
    try{
      const resp = await api.get('/companies')
      setCompanies(resp.data.companies || [])
    }catch(err){
      console.error(err)
    }finally{ setLoading(false) }
  }

  async function handleCreate(e){
    e.preventDefault()
    try{
      const resp = await api.post('/companies', { name, tax_id: taxId })
      setCompanies([resp.data.company, ...companies])
      setName(''); setTaxId('')
    }catch(err){
      console.error(err)
    }
  }

  return (
    <div style={{padding: 24}}>
      <h2>Companies</h2>

      <form onSubmit={handleCreate} style={{marginBottom:16}}>
        <input placeholder="Nome" value={name} onChange={e=>setName(e.target.value)} />
        <input placeholder="Tax ID" value={taxId} onChange={e=>setTaxId(e.target.value)} style={{marginLeft:8}} />
        <button type="submit" style={{marginLeft:8}}>Criar</button>
      </form>

      {loading ? <div>Loading...</div> : (
        <table border="1" cellPadding="8" style={{width:'100%'}}>
          <thead>
            <tr><th>ID</th><th>Name</th><th>Tax ID</th><th>Created</th></tr>
          </thead>
          <tbody>
            {companies.map(c => (
              <tr key={c.id}><td>{c.id}</td><td>{c.name}</td><td>{c.tax_id}</td><td>{c.created_at}</td></tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
