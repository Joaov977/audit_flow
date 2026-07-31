from app import db
from datetime import datetime

class ActionPlan(db.Model):
    __tablename__ = 'action_plans'
    id = db.Column(db.Integer, primary_key=True)
    finding_id = db.Column(db.Integer, db.ForeignKey('findings.id'), nullable=False)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    responsible_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    due_date = db.Column(db.Date)
    status = db.Column(db.String(50), default='open')
    progress = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'finding_id': self.finding_id,
            'title': self.title,
            'description': self.description,
            'responsible_id': self.responsible_id,
            'due_date': self.due_date.isoformat() if self.due_date else None,
            'status': self.status,
            'progress': self.progress,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
