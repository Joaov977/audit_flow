import React, { useEffect, useState } from 'react'
import api from '../../services/api'

export default function AuditsList() {
  const [audits, setAudits] = useState([])
  const [companies, setCompanies] = useState([])
  const [title, setTitle] = useState('')
  const [companyId, setCompanyId] = useState('')
  const [status, setStatus] = useState('')

  useEffect(() => { fetchAudits(); fetchCompanies() }, [])

  async function fetchAudits() {
    try {
      const resp = await api.get('/audits')
      setAudits(resp.data.audits || [])
    } catch (err) { console.error(err) }
  }

  async function fetchCompanies() {
    try {
      const resp = await api.get('/companies')
      setCompanies(resp.data.companies || [])
    } catch (err) { console.error(err) }
  }

  async function handleCreate(e) {
    e.preventDefault()
    try {
      const resp = await api.post('/audits', { title, company_id: companyId, status })
      setAudits([resp.data.audit, ...audits])
      setTitle(''); setCompanyId(''); setStatus('')
    } catch (err) { console.error(err) }
  }

  return (
    <div style={{ padding: 24 }}>
      <h2>Auditorias</h2>
      <p>Gerencie o ciclo completo das auditorias com visibilidade sobre status e relacionamento com empresas.</p>

      <form onSubmit={handleCreate} style={{ marginBottom: 20, display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', alignItems: 'end' }}>
        <div>
          <label style={{ display: 'block', marginBottom: 6 }}>Título</label>
          <input placeholder="Título" value={title} onChange={e => setTitle(e.target.value)} style={{ width: '100%', padding: 8 }} />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: 6 }}>Empresa</label>
          <select value={companyId} onChange={e => setCompanyId(e.target.value)} style={{ width: '100%', padding: 8 }}>
            <option value="">Selecione empresa</option>
            {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: 6 }}>Status</label>
          <select value={status} onChange={e => setStatus(e.target.value)} style={{ width: '100%', padding: 8 }}>
            <option value="">Selecione status</option>
            <option value="planned">Planejada</option>
            <option value="in_progress">Em andamento</option>
            <option value="completed">Concluída</option>
          </select>
        </div>
        <button type="submit" style={{ padding: '10px 14px' }}>Criar auditoria</button>
      </form>

      <div style={{ display: 'grid', gap: 12 }}>
        {audits.map(a => (
          <div key={a.id} style={{ background: '#fff', borderRadius: 12, padding: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
              <strong>{a.title}</strong>
              <span style={{ background: '#f3f4f6', padding: '4px 8px', borderRadius: 999, fontSize: 12 }}>{a.status || 'sem status'}</span>
            </div>
            <div style={{ marginTop: 8, color: '#6b7280' }}>Empresa: {a.company_id}</div>
            <div style={{ marginTop: 4, color: '#6b7280' }}>Criada em: {a.created_at || '—'}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
