import json
import pytest

from app import create_app, db
from app.models.user import User


@pytest.fixture
def app():
    config = {
        'TESTING': True,
        'SQLALCHEMY_DATABASE_URI': 'sqlite:///:memory:',
        'SECRET_KEY': 'test-secret'
    }
    app = create_app(config)
    with app.app_context():
        db.create_all()
    yield app
    # teardown
    with app.app_context():
        db.session.remove()
        db.drop_all()


@pytest.fixture
def client(app):
    return app.test_client()


def test_register_login_and_protected_companies(client):
    # register
    resp = client.post('/api/v1/auth/register', json={'email': 'test@example.com', 'password': 'secret'})
    assert resp.status_code == 201

    # login
    resp = client.post('/api/v1/auth/login', json={'email': 'test@example.com', 'password': 'secret'})
    assert resp.status_code == 200
    data = resp.get_json()
    assert 'access_token' in data and 'refresh_token' in data
    access = data['access_token']
    refresh = data['refresh_token']

    # unauthenticated request to companies should fail
    resp = client.get('/api/v1/companies')
    assert resp.status_code == 401

    # authenticated request should succeed (empty list)
    resp = client.get('/api/v1/companies', headers={'Authorization': f'Bearer {access}'})
    assert resp.status_code == 200
    data = resp.get_json()
    assert 'companies' in data and isinstance(data['companies'], list)

    # create a company
    resp = client.post('/api/v1/companies', json={'name': 'ACME', 'tax_id': '123'}, headers={'Authorization': f'Bearer {access}'})
    assert resp.status_code == 201
    data = resp.get_json()
    assert 'company' in data and data['company']['name'] == 'ACME'

    # list now returns one company
    resp = client.get('/api/v1/companies', headers={'Authorization': f'Bearer {access}'})
    data = resp.get_json()
    assert len(data['companies']) == 1

    # refresh token endpoint
    resp = client.post('/api/v1/auth/refresh', json={'refresh_token': refresh})
    assert resp.status_code == 200
    data = resp.get_json()
    assert 'access_token' in data
