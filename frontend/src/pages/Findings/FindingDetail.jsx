import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../../services/api'

export default function FindingDetail() {
  const { id } = useParams()
  const [finding, setFinding] = useState(null)
  const [actionPlans, setActionPlans] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const response = await api.get(`/findings/${id}/detail`)
        setFinding(response.data.finding)
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
    return <div style={{ padding: 24 }}>Carregando achado...</div>
  }

  if (!finding) {
    return <div style={{ padding: 24 }}>Achado não encontrado.</div>
  }

  return (
    <div style={{ padding: 24 }}>
      <Link to="/findings" style={{ color: '#2563eb', textDecoration: 'none' }}>← Voltar para achados</Link>
      <h2 style={{ marginTop: 16 }}>{finding.title}</h2>
      <p style={{ color: '#6b7280' }}>{finding.description || 'Sem descrição informada.'}</p>

      <div style={{ display: 'grid', gap: 16, marginTop: 24, gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
        <div style={{ background: '#fff', borderRadius: 12, padding: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
          <h3 style={{ marginTop: 0 }}>Detalhes</h3>
          <ul>
            <li>Auditoria: {finding.audit_id || '—'}</li>
            <li>Severidade: {finding.severity || '—'}</li>
            <li>Status: {finding.status || '—'}</li>
          </ul>
        </div>

        <div style={{ background: '#fff', borderRadius: 12, padding: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
          <h3 style={{ marginTop: 0 }}>Planos de ação</h3>
          {actionPlans.length === 0 ? <p>Nenhum plano associado.</p> : actionPlans.map(plan => (
            <div key={plan.id} style={{ borderTop: '1px solid #e5e7eb', paddingTop: 8, marginTop: 8 }}>
              <strong>{plan.title}</strong>
              <div style={{ color: '#6b7280', fontSize: 13 }}>Status: {plan.status || '—'}</div>
              <div style={{ color: '#6b7280', fontSize: 13 }}>Progresso: {plan.progress ?? 0}%</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
