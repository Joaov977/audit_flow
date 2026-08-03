import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'

export default function FindingsList(){
  const [findings, setFindings] = useState([])
  const [title, setTitle] = useState('')
  const [auditId, setAuditId] = useState('')
  const [severity, setSeverity] = useState('')
  const [status, setStatus] = useState('')
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
      const resp = await api.post('/findings', { audit_id: auditId, title, severity, status })
      setFindings([resp.data.finding, ...findings])
      setTitle(''); setAuditId(''); setSeverity(''); setStatus('')
    }catch(e){console.error(e)}
  }

  return (
    <div style={{padding:24}}>
      <h2>Achados</h2>
      <p>Registre e acompanhe os achados com severidade e status operacional claros.</p>
      <form onSubmit={handleCreate} style={{marginBottom:20, display:'grid', gap:12, gridTemplateColumns:'repeat(auto-fit, minmax(180px, 1fr))', alignItems:'end'}}>
        <div>
          <label style={{display:'block', marginBottom:6}}>Título</label>
          <input placeholder="Título" value={title} onChange={e=>setTitle(e.target.value)} style={{width:'100%', padding:8}} />
        </div>
        <div>
          <label style={{display:'block', marginBottom:6}}>Auditoria</label>
          <select value={auditId} onChange={e=>setAuditId(e.target.value)} style={{width:'100%', padding:8}}>
            <option value="">Selecione auditoria</option>
            {audits.map(a => <option key={a.id} value={a.id}>{a.title}</option>)}
          </select>
        </div>
        <div>
          <label style={{display:'block', marginBottom:6}}>Severidade</label>
          <select value={severity} onChange={e=>setSeverity(e.target.value)} style={{width:'100%', padding:8}}>
            <option value="">Selecione severidade</option>
            <option value="low">Baixa</option>
            <option value="medium">Média</option>
            <option value="high">Alta</option>
          </select>
        </div>
        <div>
          <label style={{display:'block', marginBottom:6}}>Status</label>
          <select value={status} onChange={e=>setStatus(e.target.value)} style={{width:'100%', padding:8}}>
            <option value="">Selecione status</option>
            <option value="open">Aberto</option>
            <option value="in_progress">Em andamento</option>
            <option value="resolved">Resolvido</option>
          </select>
        </div>
        <button type="submit" style={{padding:'10px 14px'}}>Criar achado</button>
      </form>

      <div style={{display:'grid', gap:12}}>
        {findings.map(f => (
          <div key={f.id} style={{background:'#fff', borderRadius:12, padding:16, boxShadow:'0 1px 4px rgba(0,0,0,0.08)'}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:8}}>
              <strong>{f.title}</strong>
              <span style={{background:'#f3f4f6', padding:'4px 8px', borderRadius:999, fontSize:12}}>{f.status || 'sem status'}</span>
            </div>
            <div style={{marginTop:8, color:'#6b7280'}}>Auditoria: {f.audit_id}</div>
            <div style={{marginTop:4, color:'#6b7280'}}>Severidade: {f.severity || '—'}</div>
            <div style={{marginTop:12}}>
              <Link to={`/findings/${f.id}`} style={{color:'#2563eb', textDecoration:'none', fontWeight:600}}>Abrir detalhe</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
