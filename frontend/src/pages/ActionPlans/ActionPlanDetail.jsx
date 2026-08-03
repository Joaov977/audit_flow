import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../../services/api'

export default function ActionPlanDetail() {
  const { id } = useParams()
  const [actionPlan, setActionPlan] = useState(null)
  const [finding, setFinding] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const response = await api.get(`/action-plans/${id}/detail`)
        setActionPlan(response.data.action_plan)
        setFinding(response.data.finding)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [id])

  if (loading) {
    return <div style={{ padding: 24 }}>Carregando plano de ação...</div>
  }

  if (!actionPlan) {
    return <div style={{ padding: 24 }}>Plano de ação não encontrado.</div>
  }

  return (
    <div style={{ padding: 24 }}>
      <Link to="/action-plans" style={{ color: '#2563eb', textDecoration: 'none' }}>← Voltar para planos de ação</Link>
      <h2 style={{ marginTop: 16 }}>{actionPlan.title}</h2>
      <p style={{ color: '#6b7280' }}>{actionPlan.description || 'Sem descrição informada.'}</p>

      <div style={{ display: 'grid', gap: 16, marginTop: 24, gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
        <div style={{ background: '#fff', borderRadius: 12, padding: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
          <h3 style={{ marginTop: 0 }}>Execução</h3>
          <ul>
            <li>Status: {actionPlan.status || '—'}</li>
            <li>Progresso: {actionPlan.progress ?? 0}%</li>
            <li>Vencimento: {actionPlan.due_date || '—'}</li>
          </ul>
        </div>

        <div style={{ background: '#fff', borderRadius: 12, padding: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
          <h3 style={{ marginTop: 0 }}>Achado relacionado</h3>
          {finding ? (
            <>
              <strong>{finding.title}</strong>
              <div style={{ color: '#6b7280', fontSize: 13 }}>Severidade: {finding.severity || '—'}</div>
              <div style={{ color: '#6b7280', fontSize: 13 }}>Status: {finding.status || '—'}</div>
            </>
          ) : (
            <p>Nenhum achado relacionado.</p>
          )}
        </div>
      </div>
    </div>
  )
}
