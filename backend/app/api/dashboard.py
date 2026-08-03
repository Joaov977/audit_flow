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
        }
    })
