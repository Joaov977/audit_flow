import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../../services/api'

export default function AuditDetail() {
  const { id } = useParams()
  const [audit, setAudit] = useState(null)
  const [findings, setFindings] = useState([])
  const [actionPlans, setActionPlans] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const response = await api.get(`/audits/${id}/detail`)
        setAudit(response.data.audit)
        setFindings(response.data.findings || [])
        setActionPlans(response.data.action_plans || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [id])

  if (loading) {
    return <div style={{ padding: 24 }}>Carregando auditoria...</div>
  }

  if (!audit) {
    return <div style={{ padding: 24 }}>Auditoria não encontrada.</div>
  }

  return (
    <div style={{ padding: 24 }}>
      <Link to="/audits" style={{ color: '#2563eb', textDecoration: 'none' }}>← Voltar para auditorias</Link>
      <h2 style={{ marginTop: 16 }}>{audit.title}</h2>
      <p style={{ color: '#6b7280' }}>{audit.description || 'Sem descrição informada.'}</p>

      <div style={{ display: 'grid', gap: 16, marginTop: 24, gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
        <div style={{ background: '#fff', borderRadius: 12, padding: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
          <h3 style={{ marginTop: 0 }}>Resumo</h3>
          <ul>
            <li>Status: {audit.status || 'sem status'}</li>
            <li>Início: {audit.start_date || '—'}</li>
            <li>Fim: {audit.end_date || '—'}</li>
          </ul>
        </div>

        <div style={{ background: '#fff', borderRadius: 12, padding: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
          <h3 style={{ marginTop: 0 }}>Achados</h3>
          {findings.length === 0 ? <p>Nenhum achado registrado.</p> : findings.map(f => (
            <div key={f.id} style={{ borderTop: '1px solid #e5e7eb', paddingTop: 8, marginTop: 8 }}>
              <strong>{f.title}</strong>
              <div style={{ color: '#6b7280', fontSize: 13 }}>Severidade: {f.severity || '—'}</div>
              <div style={{ color: '#6b7280', fontSize: 13 }}>Status: {f.status || '—'}</div>
            </div>
          ))}
        </div>

        <div style={{ background: '#fff', borderRadius: 12, padding: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
          <h3 style={{ marginTop: 0 }}>Planos de ação</h3>
          {actionPlans.length === 0 ? <p>Nenhum plano associado.</p> : actionPlans.map(ap => (
            <div key={ap.id} style={{ borderTop: '1px solid #e5e7eb', paddingTop: 8, marginTop: 8 }}>
              <strong>{ap.title}</strong>
              <div style={{ color: '#6b7280', fontSize: 13 }}>Status: {ap.status || '—'}</div>
              <div style={{ color: '#6b7280', fontSize: 13 }}>Progresso: {ap.progress ?? 0}%</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
