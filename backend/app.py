from time import sleep
from utils.recaptcha_protect import recaptcha_protect
from mail.mailer import on_contact_form_submit
from flask import Flask, jsonify, request, render_template, send_from_directory, session, redirect, current_app
from flask_cors import CORS
import requests
from flask_restful import Resource, Api
from authlib.integrations.flask_client import OAuth
import jwt
from jwt import PyJWKClient
import os
import config
import dotenv

dotenv.load_dotenv()

app = Flask(__name__)
app.config.from_object(config.Config)

api = Api(app)
CORS(app)

app.secret_key = os.environ.get('FLASK_SECRET_KEY', 'INSECURE_KEY')

API_BASE_URL = os.environ.get('API_BASE_URL', 'http://localhost:5000')
FRONTEND_BASE_URL = os.environ.get('FRONTEND_BASE_URL', 'http://localhost:3000')

oauth = OAuth(app)
oauth.register(
    name='google',
    client_id= os.environ['GOOGLE_CLIENT_ID'],
    client_secret=os.environ['GOOGLE_CLIENT_SECRET'],
    redirect_uri=f'{API_BASE_URL}/api/auth',
    client_kwargs={'scope': 'openid email profile'},
    server_metadata_url= 'https://accounts.google.com/.well-known/openid-configuration',
)


@app.route('/api/login')
def login():
    redirect_uri = f'{API_BASE_URL}/api/auth'
    return oauth.google.authorize_redirect(redirect_uri)

@app.route('/api/logout', methods=['POST'])
def logout():
    session.pop('user', None)
    return jsonify({'message': 'User logged out'}), 200

@app.route('/api/auth')
def auth():
    token = oauth.google.authorize_access_token()
    
    # Google's JWKs endpoint
    GOOGLE_JWKS_URL = 'https://www.googleapis.com/oauth2/v3/certs'
    
    # Initialize JWK client with the URL
    jwk_client = PyJWKClient(GOOGLE_JWKS_URL)
    
    try:
        # Get the signing key from the JWK client
        signing_key = jwk_client.get_signing_key_from_jwt(token['id_token'])
        
        # Decode and verify the JWT
        payload = jwt.decode(
            token['id_token'],
            signing_key.key,
            algorithms=["RS256"],
            audience=oauth.google.client_id  # Ensure this matches your Google client ID
        )
        
        # If verification is successful, process the payload as needed
        user_info = {
            'email': payload.get('email'),
        }
        session['user'] = user_info
        frontend_redirect_url = f"{FRONTEND_BASE_URL}/dashboard?token={token['access_token']}"
        return redirect(frontend_redirect_url)
    except Exception as e:
        # Token validation failed
        print(e)
        return jsonify({'error': 'Token validation failed'}), 401
    
@app.route('/api/contact', methods=['POST'])
@recaptcha_protect
def contact():
    fields = ['email', 'name', 'message', 'company', 'phone']
    data = request.get_json()

    # Check if all required fields are present
    for field in fields:
        if field not in data:
            return jsonify({'error': f'{field} is required'}), 400
    
    email, name, message, company, phone = data['email'], data['name'], data['message'], data['company'], data['phone']

    # Send an email to the user
    on_contact_form_submit(email, name, message, company, phone)
    return jsonify({'message': 'Contact form submitted'}), 200
    

from flask import session, jsonify

@app.route('/api/user')
def get_user_info():
    print('TEST TEST TEST')
    user_info = session.get('user')
    if user_info:
        return jsonify(user_info), 200
    else:
        return jsonify({'error': 'User not found'}), 404



if __name__ == "__main__":
    app.run(debug=True)