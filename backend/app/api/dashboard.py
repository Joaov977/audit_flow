from datetime import date

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
        }
    })
