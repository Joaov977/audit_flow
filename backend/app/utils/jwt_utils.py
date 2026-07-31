import jwt
from datetime import datetime, timedelta
from flask import current_app

def create_access_token(identity: dict, expires_delta: int = 15):
    payload = {
        'sub': identity,
        'exp': datetime.utcnow() + timedelta(minutes=expires_delta),
        'type': 'access'
    }
    token = jwt.encode(payload, current_app.config['SECRET_KEY'], algorithm='HS256')
    return token

def create_refresh_token(identity: dict, expires_delta: int = 60*24*7):
    payload = {
        'sub': identity,
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
