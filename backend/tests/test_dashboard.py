import pytest
from app import create_app, db
from app.models.company import Company
from app.models.audit import Audit
from app.models.finding import Finding
from app.models.action_plan import ActionPlan


@pytest.fixture
def client():
    app = create_app({'TESTING': True, 'SQLALCHEMY_DATABASE_URI': 'sqlite:///:memory:'})
    with app.app_context():
        db.create_all()
        yield app.test_client()
        db.session.remove()
        db.drop_all()


def test_dashboard_metrics(client):
    company = Company(name='Acme', tax_id='123')
    db.session.add(company)
    db.session.commit()

    db.session.add(Audit(company_id=company.id, title='Audit 1', status='planned'))
    db.session.add(Audit(company_id=company.id, title='Audit 2', status='in_progress'))
    db.session.commit()

    finding = Finding(audit_id=1, title='Finding 1', severity='high', status='open')
    db.session.add(finding)
    db.session.commit()

    db.session.add(ActionPlan(finding_id=finding.id, title='Action 1', status='open'))
    db.session.commit()

    resp = client.get('/api/v1/dashboard')
    assert resp.status_code == 200
    data = resp.get_json()
    assert data['totals']['companies'] == 1
    assert data['totals']['audits'] == 2
    assert data['totals']['findings'] == 1
    assert data['totals']['action_plans'] == 1
