from flask import Flask, request
from config.config import Config
from extensions.extensoes import db, cors, jwt


def init_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    db.init_app(app)
    jwt.init_app(app)
    cors(app, 
         supports_credentials=True, 
         resources={r"/*": {
            "origins": ["http://localhost:5173","http://localhost:8080", "http://localhost:8081"]
    }})

    from blueprints.relatorios_bp import relatorios_bp
    from blueprints.carros_bp import carro_bp
    from blueprints.ordem_servico_bp import os_bp
    from blueprints.clientes_bp import clientes_bp

    app.register_blueprint(relatorios_bp, url_prefix='/relatorios')
    app.register_blueprint(os_bp, url_prefix='/ordem_servico')
    app.register_blueprint(carro_bp, url_prefix='/carros')
    app.register_blueprint(clientes_bp, url_prefix='/clientes')



    return app

app = init_app()

