import React, { useEffect, useState } from 'react'
import api from '../../services/api'

export default function AuditsList() {
  const [audits, setAudits] = useState([])
  const [companies, setCompanies] = useState([])
  const [title, setTitle] = useState('')
  const [companyId, setCompanyId] = useState('')

  useEffect(()=>{ fetchAudits(); fetchCompanies() }, [])

  async function fetchAudits(){
    try{
      const resp = await api.get('/audits')
      setAudits(resp.data.audits || [])
    }catch(err){ console.error(err) }
  }

  async function fetchCompanies(){
    try{
      const resp = await api.get('/companies')
      setCompanies(resp.data.companies || [])
    }catch(err){ console.error(err) }
  }

  async function handleCreate(e){
    e.preventDefault()
    try{
      const resp = await api.post('/audits', { title, company_id: companyId })
      setAudits([resp.data.audit, ...audits])
      setTitle(''); setCompanyId('')
    }catch(err){ console.error(err) }
  }

  return (
    <div style={{padding: 24}}>
      <h2>Audits</h2>

      <form onSubmit={handleCreate} style={{marginBottom:16}}>
        <input placeholder="Título" value={title} onChange={e=>setTitle(e.target.value)} />
        <select value={companyId} onChange={e=>setCompanyId(e.target.value)} style={{marginLeft:8}}>
          <option value="">Selecione empresa</option>
          {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <button type="submit" style={{marginLeft:8}}>Criar</button>
      </form>

      <table border="1" cellPadding="8" style={{width:'100%'}}>
        <thead>
          <tr><th>ID</th><th>Title</th><th>Company</th><th>Created</th></tr>
        </thead>
        <tbody>
          {audits.map(a => (
            <tr key={a.id}><td>{a.id}</td><td>{a.title}</td><td>{a.company_id}</td><td>{a.created_at}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
