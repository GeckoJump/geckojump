import os

basedir = os.path.abspath(os.path.dirname(__file__))

class Config(object):
  APP_MODE = os.environ.get('APP_MODE', 'dev') # dev, prod
  GOOGLE_CLOUD_API_KEY = os.environ.get('GOOGLE_CLOUD_API_KEY')
  RECAPTCHA_SITE_KEY = os.environ.get('RECAPTCHA_SITE_KEY')
  SENDGRID_API_KEY = os.environ.get('SENDGRID_API_KEY')
  SENDGRID_SENDER = os.environ.get('SENDGRID_SENDER')
  GOOGLE_CLIENT_ID = os.environ.get('GOOGLE_CLIENT_ID')
  GOOGLE_CLIENT_SECRET = os.environ.get('GOOGLE_CLIENT_SECRET')
  GOOGLE_CLOUD_PROJECT_ID = os.environ.get('GOOGLE_CLOUD_PROJECT_ID')
  API_BASE_URL = os.environ.get('API_BASE_URL')
  FRONTEND_BASE_URL = os.environ.get('FRONTEND_BASE_URL')
