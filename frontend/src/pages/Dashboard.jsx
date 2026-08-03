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

  if (!metrics && !loading) {
    return (
      <div style={{ padding: 24 }}>
        <h1>Dashboard</h1>
        <p style={{ color: '#6b7280' }}>Não foi possível carregar os dados no momento. Tente novamente.</p>
      </div>
    )
  }

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
  const executive = metrics?.executive || {}
  const criticalItems = executive.critical_items || []
  const atRiskActions = executive.at_risk_actions || []
  const alerts = metrics?.alerts || []

  return (
    <div style={{ padding: 24 }}>
      <h1>Dashboard</h1>
      <p>Resumo executivo da operação de auditoria e gestão de riscos.</p>

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

      <div style={{ marginTop: 24, background: 'linear-gradient(135deg, #fff7ed 0%, #fef3c7 100%)', border: '1px solid #fdba74', borderRadius: 20, padding: 20, boxShadow: '0 10px 30px rgba(245, 158, 11, 0.12)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1.2, color: '#b45309', textTransform: 'uppercase' }}>Command Center</div>
            <h3 style={{ margin: '4px 0 0 0' }}>Atenção imediata</h3>
            <div style={{ color: '#9a2c00', marginTop: 4 }}>Priorize riscos, vencimentos e itens críticos com uma visão executiva.</div>
          </div>
          <div style={{ background: '#fff', borderRadius: 999, padding: '8px 12px', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}>
            <strong style={{ color: '#dc2626' }}>{executive.attention_required ?? 0}</strong> itens pendentes
          </div>
        </div>

        <div style={{ marginTop: 18, display: 'grid', gap: 14, gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
          <div style={{ background: 'rgba(255,255,255,0.7)', borderRadius: 14, padding: 14 }}>
            <h4 style={{ margin: '0 0 10px 0' }}>Alertas automáticos</h4>
            {alerts.length === 0 ? <div style={{ color: '#6b7280' }}>Nenhum alerta ativo.</div> : alerts.map(alert => (
              <div key={alert.id} style={{ background: '#fff', borderRadius: 12, padding: 10, marginBottom: 8, border: alert.priority === 'high' ? '1px solid #fca5a5' : '1px solid #fde68a' }}>
                <div style={{ fontWeight: 700 }}>{alert.title}</div>
                <div style={{ color: '#6b7280', fontSize: 13, marginTop: 4 }}>{alert.message}</div>
                <div style={{ color: alert.priority === 'high' ? '#b91c1c' : '#92400e', fontSize: 12, fontWeight: 700, marginTop: 6 }}>{alert.priority === 'high' ? 'Alta prioridade' : 'Média prioridade'}</div>
              </div>
            ))}
          </div>

          <div style={{ background: 'rgba(255,255,255,0.7)', borderRadius: 14, padding: 14 }}>
            <h4 style={{ margin: '0 0 10px 0' }}>Achados críticos</h4>
            {criticalItems.length === 0 ? <div style={{ color: '#6b7280' }}>Nenhum achado crítico aberto.</div> : criticalItems.map(item => (
              <div key={item.id} style={{ background: '#fff', borderRadius: 12, padding: 10, marginBottom: 8, border: '1px solid #fecaca' }}>
                <div style={{ fontWeight: 700 }}>{item.title}</div>
                <div style={{ color: '#6b7280', fontSize: 13, marginTop: 4 }}>Severidade: {item.severity || '—'}</div>
              </div>
            ))}
          </div>

          <div style={{ background: 'rgba(255,255,255,0.7)', borderRadius: 14, padding: 14 }}>
            <h4 style={{ margin: '0 0 10px 0' }}>Ações em risco</h4>
            {atRiskActions.length === 0 ? <div style={{ color: '#6b7280' }}>Nenhuma ação em risco neste momento.</div> : atRiskActions.map(action => (
              <div key={action.id} style={{ background: '#fff', borderRadius: 12, padding: 10, marginBottom: 8, border: '1px solid #fed7aa' }}>
                <div style={{ fontWeight: 700 }}>{action.title}</div>
                <div style={{ color: '#6b7280', fontSize: 13, marginTop: 4 }}>Status: {action.status || '—'}</div>
                <div style={{ color: '#6b7280', fontSize: 13 }}>Progresso: {action.progress ?? 0}%</div>
                <div style={{ color: '#b45309', fontSize: 13, marginTop: 4 }}>Motivo: {action.reason}</div>
              </div>
            ))}
          </div>
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
