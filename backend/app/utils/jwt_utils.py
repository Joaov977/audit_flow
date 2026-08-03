import json
import jwt
from datetime import datetime, timedelta
from flask import current_app


def _serialize_identity(identity):
    if isinstance(identity, (str, int, float, bool)):
        return str(identity)
    if isinstance(identity, dict):
        return json.dumps(identity)
    return str(identity)


def create_access_token(identity, expires_delta: int = 15):
    payload = {
        'sub': _serialize_identity(identity),
        'exp': datetime.utcnow() + timedelta(minutes=expires_delta),
        'type': 'access'
    }
    token = jwt.encode(payload, current_app.config['SECRET_KEY'], algorithm='HS256')
    return token


def create_refresh_token(identity, expires_delta: int = 60*24*7):
    payload = {
        'sub': _serialize_identity(identity),
        'exp': datetime.utcnow() + timedelta(minutes=expires_delta),
        'type': 'refresh'
    }
    token = jwt.encode(payload, current_app.config['SECRET_KEY'], algorithm='HS256')
    return token


def decode_token(token: str):
    try:
        payload = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except Exception:
        return None
