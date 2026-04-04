from flask import Flask, request
from config.config import Config
from extensions.extensoes import db, cors, jwt
#from dotenv import load_dotenv



def init_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    db.init_app(app)
    jwt.init_app(app)
    #load_dotenv()
    cors(app, 
         supports_credentials=True, 
         resources={r"/*": {
            "origins": ["http://localhost:5173","http://localhost:8080", "http://localhost:8081", "http://192.168.15.85:8080"]
    }})

    from blueprints.relatorios_bp import relatorios_bp
    from blueprints.carros_bp import carro_bp
    from blueprints.ordem_servico_bp import os_bp
    from blueprints.clientes_bp import clientes_bp
    from blueprints.obras_bp import obras_bp
    from blueprints.funcionarios_bp import funcionarios_bp
    from blueprints.funcoes_bp import funcoes_bp

    app.register_blueprint(relatorios_bp, url_prefix='/relatorios')
    app.register_blueprint(os_bp, url_prefix='/ordem_servico')
    app.register_blueprint(carro_bp, url_prefix='/carros')
    app.register_blueprint(clientes_bp, url_prefix='/clientes')
    app.register_blueprint(funcoes_bp, url_prefix='/funcoes')
    app.register_blueprint(obras_bp, url_prefix='/obras')
    app.register_blueprint(funcionarios_bp, url_prefix='/funcionarios')



    return app

app = init_app()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)