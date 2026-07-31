import React, { useEffect, useState } from 'react'
import api from '../../services/api'

export default function ActionPlansList(){
  const [aps, setAps] = useState([])
  const [findingId, setFindingId] = useState('')
  const [title, setTitle] = useState('')
  const [findings, setFindings] = useState([])

  useEffect(()=>{ fetchFindings(); fetchAps() }, [])

  async function fetchFindings(){
    try{ const resp = await api.get('/findings'); setFindings(resp.data.findings || []) }catch(e){console.error(e)}
  }

  async function fetchAps(){
    try{ const resp = await api.get('/action-plans'); setAps(resp.data.action_plans || []) }catch(e){console.error(e)}
  }

  async function handleCreate(e){
    e.preventDefault()
    try{
      const resp = await api.post('/action-plans', { finding_id: findingId, title })
      setAps([resp.data.action_plan, ...aps])
      setTitle(''); setFindingId('')
    }catch(e){console.error(e)}
  }

  return (
    <div style={{padding:24}}>
      <h2>Action Plans</h2>
      <form onSubmit={handleCreate} style={{marginBottom:16}}>
        <input placeholder="Título" value={title} onChange={e=>setTitle(e.target.value)} />
        <select value={findingId} onChange={e=>setFindingId(e.target.value)} style={{marginLeft:8}}>
          <option value="">Selecione achado</option>
          {findings.map(f => <option key={f.id} value={f.id}>{f.title}</option>)}
        </select>
        <button type="submit" style={{marginLeft:8}}>Criar</button>
      </form>

      <table border="1" cellPadding="8" style={{width:'100%'}}>
        <thead><tr><th>ID</th><th>Title</th><th>Finding</th><th>Status</th><th>Progress</th></tr></thead>
        <tbody>
          {aps.map(a => (
            <tr key={a.id}><td>{a.id}</td><td>{a.title}</td><td>{a.finding_id}</td><td>{a.status}</td><td>{a.progress}%</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
