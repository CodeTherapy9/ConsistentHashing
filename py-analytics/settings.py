from os import environ 
from dotenv import load_dotenv

load_dotenv(".env")
DB_HOST = environ.get('DB_HOST')
DB_USER = environ.get('DB_USER')
DB_PASSWORD = environ.get('DB_PASSWORD')
DB_PORT = environ.get('DB_PORT')
DB_NAME = environ.get('DB_NAME')
