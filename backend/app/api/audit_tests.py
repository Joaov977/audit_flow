from flask import Blueprint, jsonify, request
from app import db
from app.models.audit_check import AuditCheck
from app.models.audit import Audit
from app.models.audit_process import AuditProcess
from app.utils.auth import jwt_required

bp = Blueprint('audit_tests', __name__)


@bp.route('/', methods=['GET'])
@jwt_required
def list_tests():
    audit_id = request.args.get('audit_id')
    process_id = request.args.get('process_id')
    q = AuditCheck.query
    if audit_id:
        q = q.filter_by(audit_id=audit_id)
    if process_id:
        q = q.filter_by(process_id=process_id)
    items = q.order_by(AuditCheck.created_at.desc()).all()
    return jsonify({'audit_tests': [t.to_dict() for t in items]})


@bp.route('/', methods=['POST'])
@jwt_required
def create_test():
    data = request.get_json() or {}
    audit_id = data.get('audit_id')
    title = data.get('title')
    if not audit_id or not title:
        return jsonify({'error': 'audit_id and title required'}), 400
    Audit.query.get_or_404(audit_id)
    if data.get('process_id'):
        AuditProcess.query.get_or_404(data.get('process_id'))
    t = AuditCheck(
        audit_id=audit_id,
        process_id=data.get('process_id'),
        title=title,
        description=data.get('description'),
        result=data.get('result'),
        evidence=data.get('evidence'),
        performed_by=data.get('performed_by'),
        performed_at=data.get('performed_at')
    )
    db.session.add(t)
    db.session.commit()
    return jsonify({'audit_test': t.to_dict()}), 201


@bp.route('/<int:tid>', methods=['GET'])
@jwt_required
def get_test(tid):
    t = AuditCheck.query.get_or_404(tid)
    return jsonify({'audit_test': t.to_dict()})


@bp.route('/<int:tid>', methods=['PUT', 'PATCH'])
@jwt_required
def update_test(tid):
    t = AuditCheck.query.get_or_404(tid)
    data = request.get_json() or {}
    t.title = data.get('title', t.title)
    t.description = data.get('description', t.description)
    t.result = data.get('result', t.result)
    t.evidence = data.get('evidence', t.evidence)
    t.performed_by = data.get('performed_by', t.performed_by)
    t.performed_at = data.get('performed_at', t.performed_at)
    db.session.commit()
    return jsonify({'audit_test': t.to_dict()})


@bp.route('/<int:tid>', methods=['DELETE'])
@jwt_required
def delete_test(tid):
    t = AuditCheck.query.get_or_404(tid)
    db.session.delete(t)
    db.session.commit()
    return jsonify({'message': 'deleted'})
