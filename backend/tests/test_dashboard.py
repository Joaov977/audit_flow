from datetime import date, timedelta

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

    open_finding = Finding(audit_id=1, title='Finding 1', severity='high', status='open')
    resolved_finding = Finding(audit_id=1, title='Finding 2', severity='medium', status='resolved')
    db.session.add_all([open_finding, resolved_finding])
    db.session.commit()

    overdue_action = ActionPlan(
        finding_id=open_finding.id,
        title='Action 1',
        status='open',
        due_date=date.today() - timedelta(days=3)
    )
    on_track_action = ActionPlan(
        finding_id=resolved_finding.id,
        title='Action 2',
        status='in_progress',
        due_date=date.today() + timedelta(days=7)
    )
    db.session.add_all([overdue_action, on_track_action])
    db.session.commit()

    resp = client.get('/api/v1/dashboard')
    assert resp.status_code == 200
    data = resp.get_json()
    assert data['totals']['companies'] == 1
    assert data['totals']['audits'] == 2
    assert data['totals']['findings'] == 2
    assert data['totals']['action_plans'] == 2
    assert data['operational']['open_findings'] == 1
    assert data['operational']['overdue_action_plans'] == 1
    assert data['risk']['high_severity_findings'] == 1
    assert data['execution']['open_action_plans'] == 1
    assert data['performance']['closure_rate'] == 50.0
    assert data['executive']['critical_items'][0]['title'] == 'Finding 1'
    assert data['executive']['at_risk_actions'][0]['title'] == 'Action 1'
    assert data['alerts'][0]['type'] == 'overdue_action_plan'
    assert data['alerts'][0]['priority'] == 'high'
