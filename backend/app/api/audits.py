from flask import Blueprint, jsonify, request
from app import db
from app.models.audit import Audit
from app.models.company import Company
from app.models.finding import Finding
from app.models.action_plan import ActionPlan
from app.utils.auth import jwt_required

bp = Blueprint('audits', __name__)


@bp.route('/', methods=['GET'])
@jwt_required
def list_audits():
    audits = Audit.query.order_by(Audit.created_at.desc()).all()
    return jsonify({'audits': [a.to_dict() for a in audits]})


@bp.route('/', methods=['POST'])
@jwt_required
def create_audit():
    data = request.get_json() or {}
    company_id = data.get('company_id')
    title = data.get('title')
    if not company_id or not title:
        return jsonify({'error': 'company_id and title are required'}), 400
    # verify company exists
    Company.query.get_or_404(company_id)
    a = Audit(company_id=company_id, title=title, description=data.get('description'), status=data.get('status'))
    db.session.add(a)
    db.session.commit()
    return jsonify({'audit': a.to_dict()}), 201


@bp.route('/<int:audit_id>', methods=['GET'])
@jwt_required
def get_audit(audit_id):
    a = Audit.query.get_or_404(audit_id)
    return jsonify({'audit': a.to_dict()})


@bp.route('/<int:audit_id>/detail', methods=['GET'])
@jwt_required
def get_audit_detail(audit_id):
    a = Audit.query.get_or_404(audit_id)
    findings = Finding.query.filter_by(audit_id=audit_id).order_by(Finding.created_at.desc()).all()
    action_plans = ActionPlan.query.join(Finding).filter(Finding.audit_id == audit_id).all()
    return jsonify({
        'audit': a.to_dict(),
        'findings': [f.to_dict() for f in findings],
        'action_plans': [ap.to_dict() for ap in action_plans],
    })


@bp.route('/<int:audit_id>', methods=['PUT', 'PATCH'])
@jwt_required
def update_audit(audit_id):
    a = Audit.query.get_or_404(audit_id)
    data = request.get_json() or {}
    a.title = data.get('title', a.title)
    a.description = data.get('description', a.description)
    a.status = data.get('status', a.status)
    a.start_date = data.get('start_date', a.start_date)
    a.end_date = data.get('end_date', a.end_date)
    db.session.commit()
    return jsonify({'audit': a.to_dict()})


@bp.route('/<int:audit_id>', methods=['DELETE'])
@jwt_required
def delete_audit(audit_id):
    a = Audit.query.get_or_404(audit_id)
    db.session.delete(a)
    db.session.commit()
    return jsonify({'message': 'deleted'})
