from app import db
from datetime import datetime

class Finding(db.Model):
    __tablename__ = 'findings'
    id = db.Column(db.Integer, primary_key=True)
    audit_id = db.Column(db.Integer, db.ForeignKey('audits.id'), nullable=False)
    process = db.Column(db.String(255))
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    severity = db.Column(db.String(50))
    criteria = db.Column(db.Text)
    condition = db.Column(db.Text)
    cause = db.Column(db.Text)
    effect = db.Column(db.Text)
    recommendation = db.Column(db.Text)
    responsible_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    due_date = db.Column(db.Date)
    status = db.Column(db.String(50), default='open')
    created_by = db.Column(db.Integer, db.ForeignKey('users.id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'audit_id': self.audit_id,
            'process': self.process,
            'title': self.title,
            'description': self.description,
            'severity': self.severity,
            'criteria': self.criteria,
            'condition': self.condition,
            'cause': self.cause,
            'effect': self.effect,
            'recommendation': self.recommendation,
            'responsible_id': self.responsible_id,
            'due_date': self.due_date.isoformat() if self.due_date else None,
            'status': self.status,
            'created_by': self.created_by,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
