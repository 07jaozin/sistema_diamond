import os
import datetime
import secrets

BASE_DIR = os.path.abspath(os.path.dirname(__file__))


class Config:
  
    #SECRET_KEY = os.getenv("SECRET_KEY")
    SECRET_KEY = "123"
    PERMANENT_SESSION_LIFETIME = datetime.timedelta(hours=2)

    SQLALCHEMY_DATABASE_URI = os.getenv(
        "DATABASE_URL",
        "mysql+pymysql://root:105192119@localhost:3306/diamond"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    #JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
    JWT_SECRET_KEY = "123"
    JWT_ACCESS_TOKEN_EXPIRES = datetime.timedelta(hours=2)

  
   
