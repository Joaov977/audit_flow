from flask import Blueprint, jsonify, request
from app import db
from app.models.finding import Finding
from app.models.audit import Audit
from app.utils.auth import jwt_required

bp = Blueprint('findings', __name__)


@bp.route('/', methods=['GET'])
@jwt_required
def list_findings():
    audit_id = request.args.get('audit_id')
    q = Finding.query
    if audit_id:
        q = q.filter_by(audit_id=audit_id)
    items = q.order_by(Finding.created_at.desc()).all()
    return jsonify({'findings': [f.to_dict() for f in items]})


@bp.route('/', methods=['POST'])
@jwt_required
def create_finding():
    data = request.get_json() or {}
    audit_id = data.get('audit_id')
    title = data.get('title')
    if not audit_id or not title:
        return jsonify({'error': 'audit_id and title required'}), 400
    Audit.query.get_or_404(audit_id)
    f = Finding(
        audit_id=audit_id,
        title=title,
        description=data.get('description'),
        process=data.get('process'),
        severity=data.get('severity'),
        criteria=data.get('criteria'),
        condition=data.get('condition'),
        cause=data.get('cause'),
        effect=data.get('effect'),
        recommendation=data.get('recommendation'),
        responsible_id=data.get('responsible_id'),
        due_date=data.get('due_date'),
        status=data.get('status')
    )
    db.session.add(f)
    db.session.commit()
    return jsonify({'finding': f.to_dict()}), 201


@bp.route('/<int:finding_id>', methods=['GET'])
@jwt_required
def get_finding(finding_id):
    f = Finding.query.get_or_404(finding_id)
    return jsonify({'finding': f.to_dict()})


@bp.route('/<int:finding_id>', methods=['PUT', 'PATCH'])
@jwt_required
def update_finding(finding_id):
    f = Finding.query.get_or_404(finding_id)
    data = request.get_json() or {}
    f.title = data.get('title', f.title)
    f.description = data.get('description', f.description)
    f.process = data.get('process', f.process)
    f.severity = data.get('severity', f.severity)
    f.criteria = data.get('criteria', f.criteria)
    f.condition = data.get('condition', f.condition)
    f.cause = data.get('cause', f.cause)
    f.effect = data.get('effect', f.effect)
    f.recommendation = data.get('recommendation', f.recommendation)
    f.responsible_id = data.get('responsible_id', f.responsible_id)
    f.due_date = data.get('due_date', f.due_date)
    f.status = data.get('status', f.status)
    db.session.commit()
    return jsonify({'finding': f.to_dict()})


@bp.route('/<int:finding_id>', methods=['DELETE'])
@jwt_required
def delete_finding(finding_id):
    f = Finding.query.get_or_404(finding_id)
    db.session.delete(f)
    db.session.commit()
    return jsonify({'message': 'deleted'})
