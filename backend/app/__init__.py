from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
import os

db = SQLAlchemy()
migrate = Migrate()

def create_app(config_object=None):
    app = Flask(__name__, static_folder=None)
    app.url_map.strict_slashes = False
    # load default config
    app.config.from_object('app.config.Config')

    # allow overriding with dict (useful for tests)
    if config_object:
        if isinstance(config_object, dict):
            app.config.update(config_object)
        else:
            app.config.from_object(config_object)

    db.init_app(app)
    migrate.init_app(app, db)

    # enable CORS for development
    try:
        from flask_cors import CORS
        CORS(app)
    except Exception:
        pass

    # register blueprints
    from app.api import auth as auth_bp
    from app.api import companies as companies_bp
    from app.api import audits as audits_bp
    from app.api import findings as findings_bp
    from app.api import action_plans as action_plans_bp
    from app.api import processes as processes_bp
    from app.api import audit_tests as audit_tests_bp
    from app.api import users as users_bp
    from app.api import dashboard as dashboard_bp

    app.register_blueprint(auth_bp.bp, url_prefix='/api/v1/auth')
    app.register_blueprint(companies_bp.bp, url_prefix='/api/v1/companies')
    app.register_blueprint(audits_bp.bp, url_prefix='/api/v1/audits')
    app.register_blueprint(findings_bp.bp, url_prefix='/api/v1/findings')
    app.register_blueprint(action_plans_bp.bp, url_prefix='/api/v1/action-plans')
    app.register_blueprint(processes_bp.bp, url_prefix='/api/v1/processes')
    app.register_blueprint(audit_tests_bp.bp, url_prefix='/api/v1/audit-tests')
    app.register_blueprint(users_bp.bp, url_prefix='/api/v1/users')
    app.register_blueprint(dashboard_bp.bp, url_prefix='/api/v1/dashboard')

    return app
