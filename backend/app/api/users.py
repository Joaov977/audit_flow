from flask import Blueprint, jsonify
from app.models.user import User
from app.utils.auth import jwt_required

bp = Blueprint('users', __name__)


@bp.route('/', methods=['GET'])
@jwt_required
def list_users():
    users = User.query.order_by(User.full_name).all()
    data = [{'id': u.id, 'email': u.email, 'full_name': u.full_name or u.email} for u in users]
    return jsonify({'users': data})


@bp.route('/<int:uid>', methods=['GET'])
@jwt_required
def get_user(uid):
    u = User.query.get_or_404(uid)
    return jsonify({'user': {'id': u.id, 'email': u.email, 'full_name': u.full_name or u.email}})
