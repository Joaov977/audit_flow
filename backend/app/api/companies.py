from flask import Blueprint, jsonify, request
from app import db
from app.models.company import Company
from app.utils.auth import jwt_required

bp = Blueprint('companies', __name__)


@bp.route('/', methods=['GET'])
@jwt_required
def list_companies():
    companies = Company.query.order_by(Company.name).all()
    return jsonify({'companies': [c.to_dict() for c in companies]})


@bp.route('/', methods=['POST'])
@jwt_required
def create_company():
    data = request.get_json() or {}
    name = data.get('name')
    tax_id = data.get('tax_id')
    if not name:
        return jsonify({'error': 'name is required'}), 400
    c = Company(name=name, tax_id=tax_id)
    db.session.add(c)
    db.session.commit()
    return jsonify({'company': c.to_dict()}), 201


@bp.route('/<int:company_id>', methods=['GET'])
@jwt_required
def get_company(company_id):
    c = Company.query.get_or_404(company_id)
    return jsonify({'company': c.to_dict()})


@bp.route('/<int:company_id>', methods=['PUT', 'PATCH'])
@jwt_required
def update_company(company_id):
    c = Company.query.get_or_404(company_id)
    data = request.get_json() or {}
    c.name = data.get('name', c.name)
    c.tax_id = data.get('tax_id', c.tax_id)
    db.session.commit()
    return jsonify({'company': c.to_dict()})


@bp.route('/<int:company_id>', methods=['DELETE'])
@jwt_required
def delete_company(company_id):
    c = Company.query.get_or_404(company_id)
    db.session.delete(c)
    db.session.commit()
    return jsonify({'message': 'deleted'})
