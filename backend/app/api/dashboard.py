from datetime import date, timedelta

from flask import Blueprint, jsonify
from app import db
from app.models.company import Company
from app.models.audit import Audit
from app.models.finding import Finding
from app.models.action_plan import ActionPlan

bp = Blueprint('dashboard', __name__)


@bp.route('', methods=['GET'])
@bp.route('/', methods=['GET'])
def dashboard_metrics():
    companies = Company.query.count()
    audits = Audit.query.count()
    findings = Finding.query.count()
    action_plans = ActionPlan.query.count()
    resolved_findings = Finding.query.filter_by(status='resolved').count()
    open_action_plans = ActionPlan.query.filter_by(status='open').count()
    high_severity_findings = Finding.query.filter_by(severity='high').count()

    closure_rate = round((resolved_findings / findings * 100) if findings else 0.0, 2)

    open_findings = Finding.query.filter_by(status='open').order_by(Finding.created_at.desc()).all()
    critical_items = [
        {
            'id': finding.id,
            'title': finding.title,
            'severity': finding.severity,
            'audit_id': finding.audit_id,
        }
        for finding in open_findings
        if (finding.severity or '').lower() in {'high', 'critical'}
    ][:5]

    at_risk_actions = []
    for action in ActionPlan.query.filter(ActionPlan.status.in_(['open', 'in_progress'])).all():
        is_at_risk = False
        reason = 'em andamento'
        priority = 'medium'
        if action.due_date and action.due_date < date.today():
            is_at_risk = True
            reason = 'vencido'
            priority = 'high'
        elif action.due_date and action.due_date <= date.today() + timedelta(days=7):
            is_at_risk = True
            reason = 'próximo do vencimento'
            priority = 'high'
        elif action.progress is not None and action.progress < 30:
            is_at_risk = True
            reason = 'baixo progresso'
            priority = 'medium'

        if is_at_risk:
            at_risk_actions.append({
                'id': action.id,
                'title': action.title,
                'status': action.status,
                'progress': action.progress or 0,
                'due_date': action.due_date.isoformat() if action.due_date else None,
                'reason': reason,
                'priority': priority,
            })

    alerts = []
    for action in at_risk_actions:
        alerts.append({
            'id': f"action-{action['id']}",
            'type': 'overdue_action_plan' if action['reason'] == 'vencido' else 'action_at_risk',
            'title': action['title'],
            'message': f"Plano de ação em {action['reason']}",
            'priority': action['priority'],
        })

    for finding in critical_items:
        alerts.append({
            'id': f"finding-{finding['id']}",
            'type': 'critical_finding',
            'title': finding['title'],
            'message': 'Achado crítico aberto',
            'priority': 'high',
        })

    alerts = sorted(alerts, key=lambda item: 0 if item['priority'] == 'high' else 1)[:6]

    return jsonify({
        'totals': {
            'companies': companies,
            'audits': audits,
            'findings': findings,
            'action_plans': action_plans,
        },
        'status_breakdown': {
            'audits': {
                'planned': Audit.query.filter_by(status='planned').count(),
                'in_progress': Audit.query.filter_by(status='in_progress').count(),
                'completed': Audit.query.filter_by(status='completed').count(),
            }
        },
        'operational': {
            'open_findings': Finding.query.filter_by(status='open').count(),
            'overdue_action_plans': ActionPlan.query.filter(
                ActionPlan.status == 'open',
                ActionPlan.due_date.isnot(None),
                ActionPlan.due_date < date.today()
            ).count(),
        },
        'risk': {
            'high_severity_findings': high_severity_findings,
        },
        'execution': {
            'open_action_plans': open_action_plans,
        },
        'performance': {
            'closure_rate': closure_rate,
        },
        'executive': {
            'critical_items': critical_items,
            'at_risk_actions': at_risk_actions[:5],
            'attention_required': len(critical_items) + len(at_risk_actions),
        },
        'alerts': alerts,
    })
