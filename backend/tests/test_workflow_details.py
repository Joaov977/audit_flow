import pytest
from app import create_app, db
from app.models.action_plan import ActionPlan
from app.models.audit import Audit
from app.models.company import Company
from app.models.finding import Finding
from app.models.user import User
from app.utils.jwt_utils import create_access_token


@pytest.fixture
def client():
    app = create_app({'TESTING': True, 'SQLALCHEMY_DATABASE_URI': 'sqlite:///:memory:'})
    with app.app_context():
        db.create_all()
        yield app.test_client()
        db.session.remove()
        db.drop_all()


def test_detail_endpoints_include_related_workflow_data(client):
    user = User(email='tester@example.com')
    user.set_password('secret')
    db.session.add(user)
    db.session.commit()
    token = create_access_token({'user_id': user.id})

    company = Company(name='Acme', tax_id='123')
    db.session.add(company)
    db.session.commit()

    audit = Audit(company_id=company.id, title='Audit 1', status='in_progress')
    db.session.add(audit)
    db.session.commit()

    finding = Finding(audit_id=audit.id, title='Finding 1', severity='high', status='open')
    db.session.add(finding)
    db.session.commit()

    action_plan = ActionPlan(finding_id=finding.id, title='Plan 1', status='open')
    db.session.add(action_plan)
    db.session.commit()

    audit_resp = client.get(
        f'/api/v1/audits/{audit.id}/detail',
        headers={'Authorization': f'Bearer {token}'}
    )
    assert audit_resp.status_code == 200
    audit_data = audit_resp.get_json()
    assert audit_data['audit']['id'] == audit.id
    assert len(audit_data['findings']) == 1
    assert len(audit_data['action_plans']) == 1

    finding_resp = client.get(
        f'/api/v1/findings/{finding.id}/detail',
        headers={'Authorization': f'Bearer {token}'}
    )
    assert finding_resp.status_code == 200
    finding_data = finding_resp.get_json()
    assert finding_data['finding']['id'] == finding.id
    assert len(finding_data['action_plans']) == 1

    action_plan_resp = client.get(
        f'/api/v1/action-plans/{action_plan.id}/detail',
        headers={'Authorization': f'Bearer {token}'}
    )
    assert action_plan_resp.status_code == 200
    action_plan_data = action_plan_resp.get_json()
    assert action_plan_data['action_plan']['id'] == action_plan.id
    assert action_plan_data['finding']['id'] == finding.id
