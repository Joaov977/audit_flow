from flask import Blueprint, request, jsonify, current_app
from app import db
from app.models.user import User
from app.utils.jwt_utils import create_access_token, create_refresh_token, decode_token

bp = Blueprint('auth', __name__)


@bp.route('/ping', methods=['GET'])
def ping():
    return jsonify({'status': 'ok'})


@bp.route('/register', methods=['POST'])
def register():
    data = request.get_json() or {}
    email = data.get('email')
    password = data.get('password')
    full_name = data.get('full_name')
    if not email or not password:
        return jsonify({'error': 'email and password required'}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'user exists'}), 400

    user = User(email=email, full_name=full_name)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()
    return jsonify({'message': 'user created'}), 201


@bp.route('/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    email = data.get('email')
    password = data.get('password')
    if not email or not password:
        return jsonify({'error': 'email and password required'}), 400

    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({'error': 'invalid credentials'}), 401

    identity = {'user_id': user.id, 'email': user.email}
    access = create_access_token(identity)
    refresh = create_refresh_token(identity)
    return jsonify({'access_token': access, 'refresh_token': refresh}), 200


@bp.route('/refresh', methods=['POST'])
def refresh():
    data = request.get_json() or {}
    refresh_token = data.get('refresh_token')
    if not refresh_token:
        return jsonify({'error': 'refresh_token required'}), 400
    payload = decode_token(refresh_token)
    if not payload or payload.get('type') != 'refresh':
        return jsonify({'error': 'invalid or expired token'}), 401

    identity = payload.get('sub')
    access = create_access_token(identity)
    return jsonify({'access_token': access}), 200
