import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'

export default function ActionPlansList(){
  const [aps, setAps] = useState([])
  const [findingId, setFindingId] = useState('')
  const [title, setTitle] = useState('')
  const [status, setStatus] = useState('')
  const [progress, setProgress] = useState('')
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
      const resp = await api.post('/action-plans', { finding_id: findingId, title, status, progress: Number(progress) || 0 })
      setAps([resp.data.action_plan, ...aps])
      setTitle(''); setFindingId(''); setStatus(''); setProgress('')
    }catch(e){console.error(e)}
  }

  return (
    <div style={{padding:24}}>
      <h2>Planos de Ação</h2>
      <p>Acompanhe a execução das ações corretivas conectadas aos achados.</p>
      <form onSubmit={handleCreate} style={{marginBottom:20, display:'grid', gap:12, gridTemplateColumns:'repeat(auto-fit, minmax(180px, 1fr))', alignItems:'end'}}>
        <div>
          <label style={{display:'block', marginBottom:6}}>Título</label>
          <input placeholder="Título" value={title} onChange={e=>setTitle(e.target.value)} style={{width:'100%', padding:8}} />
        </div>
        <div>
          <label style={{display:'block', marginBottom:6}}>Achado</label>
          <select value={findingId} onChange={e=>setFindingId(e.target.value)} style={{width:'100%', padding:8}}>
            <option value="">Selecione achado</option>
            {findings.map(f => <option key={f.id} value={f.id}>{f.title}</option>)}
          </select>
        </div>
        <div>
          <label style={{display:'block', marginBottom:6}}>Status</label>
          <select value={status} onChange={e=>setStatus(e.target.value)} style={{width:'100%', padding:8}}>
            <option value="">Selecione status</option>
            <option value="open">Aberto</option>
            <option value="in_progress">Em andamento</option>
            <option value="completed">Concluído</option>
          </select>
        </div>
        <div>
          <label style={{display:'block', marginBottom:6}}>Progresso (%)</label>
          <input type="number" min="0" max="100" placeholder="0" value={progress} onChange={e=>setProgress(e.target.value)} style={{width:'100%', padding:8}} />
        </div>
        <button type="submit" style={{padding:'10px 14px'}}>Criar plano</button>
      </form>

      <div style={{display:'grid', gap:12}}>
        {aps.map(a => (
          <div key={a.id} style={{background:'#fff', borderRadius:12, padding:16, boxShadow:'0 1px 4px rgba(0,0,0,0.08)'}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:8}}>
              <strong>{a.title}</strong>
              <span style={{background:'#f3f4f6', padding:'4px 8px', borderRadius:999, fontSize:12}}>{a.status || 'sem status'}</span>
            </div>
            <div style={{marginTop:8, color:'#6b7280'}}>Achado: {a.finding_id}</div>
            <div style={{marginTop:4, color:'#6b7280'}}>Progresso: {a.progress ?? 0}%</div>
            <div style={{marginTop:12}}>
              <Link to={`/action-plans/${a.id}`} style={{color:'#2563eb', textDecoration:'none', fontWeight:600}}>Abrir detalhe</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
