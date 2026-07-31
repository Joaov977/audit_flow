import React, { useEffect, useState } from 'react'
import api from '../../services/api'

export default function FindingsList(){
  const [findings, setFindings] = useState([])
  const [title, setTitle] = useState('')
  const [auditId, setAuditId] = useState('')
  const [audits, setAudits] = useState([])

  useEffect(()=>{ fetchAudits(); fetchFindings() }, [])

  async function fetchAudits(){
    try{ const resp = await api.get('/audits'); setAudits(resp.data.audits || []) }catch(e){console.error(e)}
  }

  async function fetchFindings(){
    try{ const resp = await api.get('/findings'); setFindings(resp.data.findings || []) }catch(e){console.error(e)}
  }

  async function handleCreate(e){
    e.preventDefault()
    try{
      const resp = await api.post('/findings', { audit_id: auditId, title })
      setFindings([resp.data.finding, ...findings])
      setTitle(''); setAuditId('')
    }catch(e){console.error(e)}
  }

  return (
    <div style={{padding:24}}>
      <h2>Findings</h2>
      <form onSubmit={handleCreate} style={{marginBottom:16}}>
        <input placeholder="Título" value={title} onChange={e=>setTitle(e.target.value)} />
        <select value={auditId} onChange={e=>setAuditId(e.target.value)} style={{marginLeft:8}}>
          <option value="">Selecione auditoria</option>
          {audits.map(a => <option key={a.id} value={a.id}>{a.title}</option>)}
        </select>
        <button type="submit" style={{marginLeft:8}}>Criar</button>
      </form>

      <table border="1" cellPadding="8" style={{width:'100%'}}>
        <thead><tr><th>ID</th><th>Title</th><th>Audit</th><th>Severity</th><th>Status</th></tr></thead>
        <tbody>
          {findings.map(f => (
            <tr key={f.id}><td>{f.id}</td><td>{f.title}</td><td>{f.audit_id}</td><td>{f.severity}</td><td>{f.status}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
