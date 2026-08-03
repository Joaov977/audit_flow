import React, { useEffect, useState } from 'react'
import api from '../services/api'

export default function Dashboard() {
  const [metrics, setMetrics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const response = await api.get('/dashboard')
        setMetrics(response.data)
      } catch (err) {
        setError('Não foi possível carregar os dados do dashboard.')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  if (loading) {
    return <div style={{ padding: 24 }}>Carregando dashboard...</div>
  }

  if (error) {
    return <div style={{ padding: 24 }}>{error}</div>
  }

  const totals = metrics?.totals || {}
  const auditBreakdown = metrics?.status_breakdown?.audits || {}
  const operational = metrics?.operational || {}
  const risk = metrics?.risk || {}
  const execution = metrics?.execution || {}
  const performance = metrics?.performance || {}

  return (
    <div style={{ padding: 24 }}>
      <h1>Dashboard</h1>
      <p>Resumo executivo da operação de auditoria.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginTop: 24 }}>
        <div style={{ background: '#fff', borderRadius: 12, padding: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
          <div style={{ color: '#6b7280', fontSize: 14 }}>Empresas</div>
          <div style={{ fontSize: 28, fontWeight: 700 }}>{totals.companies ?? 0}</div>
        </div>
        <div style={{ background: '#fff', borderRadius: 12, padding: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
          <div style={{ color: '#6b7280', fontSize: 14 }}>Auditorias</div>
          <div style={{ fontSize: 28, fontWeight: 700 }}>{totals.audits ?? 0}</div>
        </div>
        <div style={{ background: '#fff', borderRadius: 12, padding: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
          <div style={{ color: '#6b7280', fontSize: 14 }}>Achados</div>
          <div style={{ fontSize: 28, fontWeight: 700 }}>{totals.findings ?? 0}</div>
        </div>
        <div style={{ background: '#fff', borderRadius: 12, padding: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
          <div style={{ color: '#6b7280', fontSize: 14 }}>Planos de Ação</div>
          <div style={{ fontSize: 28, fontWeight: 700 }}>{totals.action_plans ?? 0}</div>
        </div>
      </div>

      <div style={{ marginTop: 24, display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
        <div style={{ background: '#fff', borderRadius: 12, padding: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
          <h3 style={{ marginTop: 0 }}>Status das auditorias</h3>
          <ul>
            <li>Planejadas: {auditBreakdown.planned ?? 0}</li>
            <li>Em andamento: {auditBreakdown.in_progress ?? 0}</li>
            <li>Concluídas: {auditBreakdown.completed ?? 0}</li>
          </ul>
        </div>

        <div style={{ background: '#fff', borderRadius: 12, padding: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
          <h3 style={{ marginTop: 0 }}>Operação</h3>
          <ul>
            <li>Achados abertos: {operational.open_findings ?? 0}</li>
            <li>Planos de ação vencidos: {operational.overdue_action_plans ?? 0}</li>
          </ul>
        </div>

        <div style={{ background: '#fff', borderRadius: 12, padding: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
          <h3 style={{ marginTop: 0 }}>Risco</h3>
          <ul>
            <li>Achados de alta severidade: {risk.high_severity_findings ?? 0}</li>
          </ul>
        </div>

        <div style={{ background: '#fff', borderRadius: 12, padding: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
          <h3 style={{ marginTop: 0 }}>Execução</h3>
          <ul>
            <li>Planos de ação abertos: {execution.open_action_plans ?? 0}</li>
          </ul>
        </div>

        <div style={{ background: '#fff', borderRadius: 12, padding: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
          <h3 style={{ marginTop: 0 }}>Performance</h3>
          <ul>
            <li>Taxa de fechamento: {performance.closure_rate ?? 0}%</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
