from app import db
from datetime import datetime

class AuditTest(db.Model):
    __tablename__ = 'audit_tests'
    __table_args__ = {'extend_existing': True}
    id = db.Column(db.Integer, primary_key=True)
    audit_id = db.Column(db.Integer, db.ForeignKey('audits.id'), nullable=False)
    process_id = db.Column(db.Integer, db.ForeignKey('audit_processes.id'))
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    result = db.Column(db.String(50))
    evidence = db.Column(db.String(1024))
    performed_by = db.Column(db.Integer, db.ForeignKey('users.id'))
    performed_at = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'audit_id': self.audit_id,
            'process_id': self.process_id,
            'title': self.title,
            'description': self.description,
            'result': self.result,
            'evidence': self.evidence,
            'performed_by': self.performed_by,
            'performed_at': self.performed_at.isoformat() if self.performed_at else None,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
