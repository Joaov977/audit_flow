from flask import Blueprint, jsonify, request
from app import db
from app.models.audit_process import AuditProcess
from app.models.audit import Audit
from app.utils.auth import jwt_required

bp = Blueprint('processes', __name__)


@bp.route('/', methods=['GET'])
@jwt_required
def list_processes():
    audit_id = request.args.get('audit_id')
    q = AuditProcess.query
    if audit_id:
        q = q.filter_by(audit_id=audit_id)
    items = q.order_by(AuditProcess.name).all()
    return jsonify({'processes': [p.to_dict() for p in items]})


@bp.route('/', methods=['POST'])
@jwt_required
def create_process():
    data = request.get_json() or {}
    audit_id = data.get('audit_id')
    name = data.get('name')
    if not audit_id or not name:
        return jsonify({'error': 'audit_id and name required'}), 400
    Audit.query.get_or_404(audit_id)
    p = AuditProcess(audit_id=audit_id, name=name, description=data.get('description'), company_id=data.get('company_id'), owner_id=data.get('owner_id'))
    db.session.add(p)
    db.session.commit()
    return jsonify({'process': p.to_dict()}), 201


@bp.route('/<int:pid>', methods=['GET'])
@jwt_required
def get_process(pid):
    p = AuditProcess.query.get_or_404(pid)
    return jsonify({'process': p.to_dict()})


@bp.route('/<int:pid>', methods=['PUT', 'PATCH'])
@jwt_required
def update_process(pid):
    p = AuditProcess.query.get_or_404(pid)
    data = request.get_json() or {}
    p.name = data.get('name', p.name)
    p.description = data.get('description', p.description)
    p.owner_id = data.get('owner_id', p.owner_id)
    db.session.commit()
    return jsonify({'process': p.to_dict()})


@bp.route('/<int:pid>', methods=['DELETE'])
@jwt_required
def delete_process(pid):
    p = AuditProcess.query.get_or_404(pid)
    db.session.delete(p)
    db.session.commit()
    return jsonify({'message': 'deleted'})
