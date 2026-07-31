from flask import Blueprint, jsonify, request
from app import db
from app.models.action_plan import ActionPlan
from app.models.finding import Finding
from app.utils.auth import jwt_required

bp = Blueprint('action_plans', __name__)


@bp.route('/', methods=['GET'])
@jwt_required
def list_action_plans():
    finding_id = request.args.get('finding_id')
    q = ActionPlan.query
    if finding_id:
        q = q.filter_by(finding_id=finding_id)
    items = q.order_by(ActionPlan.created_at.desc()).all()
    return jsonify({'action_plans': [a.to_dict() for a in items]})


@bp.route('/', methods=['POST'])
@jwt_required
def create_action_plan():
    data = request.get_json() or {}
    finding_id = data.get('finding_id')
    title = data.get('title')
    if not finding_id or not title:
        return jsonify({'error': 'finding_id and title required'}), 400
    Finding.query.get_or_404(finding_id)
    a = ActionPlan(
        finding_id=finding_id,
        title=title,
        description=data.get('description'),
        responsible_id=data.get('responsible_id'),
        due_date=data.get('due_date'),
        status=data.get('status'),
        progress=data.get('progress', 0)
    )
    db.session.add(a)
    db.session.commit()
    return jsonify({'action_plan': a.to_dict()}), 201


@bp.route('/<int:ap_id>', methods=['GET'])
@jwt_required
def get_action_plan(ap_id):
    a = ActionPlan.query.get_or_404(ap_id)
    return jsonify({'action_plan': a.to_dict()})


@bp.route('/<int:ap_id>', methods=['PUT', 'PATCH'])
@jwt_required
def update_action_plan(ap_id):
    a = ActionPlan.query.get_or_404(ap_id)
    data = request.get_json() or {}
    a.title = data.get('title', a.title)
    a.description = data.get('description', a.description)
    a.responsible_id = data.get('responsible_id', a.responsible_id)
    a.due_date = data.get('due_date', a.due_date)
    a.status = data.get('status', a.status)
    a.progress = data.get('progress', a.progress)
    db.session.commit()
    return jsonify({'action_plan': a.to_dict()})


@bp.route('/<int:ap_id>', methods=['DELETE'])
@jwt_required
def delete_action_plan(ap_id):
    a = ActionPlan.query.get_or_404(ap_id)
    db.session.delete(a)
    db.session.commit()
    return jsonify({'message': 'deleted'})
