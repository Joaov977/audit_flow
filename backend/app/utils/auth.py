from functools import wraps
from flask import request, jsonify, g
from app.utils.jwt_utils import decode_token
from app.models.user import User


def jwt_required(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        auth_header = request.headers.get('Authorization', '')
        parts = auth_header.split()
        if len(parts) != 2 or parts[0].lower() != 'bearer':
            return jsonify({'error': 'authorization_required'}), 401

        token = parts[1]
        payload = decode_token(token)
        if not payload or payload.get('type') != 'access':
            return jsonify({'error': 'invalid_or_expired_token'}), 401

        identity = payload.get('sub') or {}
        user_id = identity.get('user_id')
        if not user_id:
            return jsonify({'error': 'invalid_token_payload'}), 401

        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'user_not_found'}), 401

        g.current_user = user
        return func(*args, **kwargs)

    return wrapper
