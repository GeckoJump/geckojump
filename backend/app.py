from flask import Flask, jsonify, request, render_template, send_from_directory, session, redirect, url_for
from flask_cors import CORS
import requests
from flask_restful import Resource, Api
from authlib.integrations.flask_client import OAuth
import jwt
from pymongo import MongoClient
from pymongo.server_api import ServerApi
from jwt import PyJWKClient
import os
from functools import wraps


#initialize flask stuff
app = Flask(__name__)
app.secret_key = os.environ.get('FLASK_SECRET_KEY')

#initialize rest api
api = Api(app)
CORS(app)



#initialize mongoDB stuff 
client = MongoClient(os.environ.get('MONGO_URI'),server_api=ServerApi('1'))
db = client.flask_db




#initialize oauth stuff
oauth = OAuth(app)
oauth.register(
    name='google',
    client_id= os.environ.get('GOOGLE_CLIENT_ID'),
    client_secret= os.environ.get('GOOGLE_CLIENT_SECRET'),
    #authorize_url='https://accounts.google.com/o/oauth2/auth',
    #authorize_params={},
    #access_token_url='https://accounts.google.com/o/oauth2/token',
    #access_token_params=None,
    #access_token_method='POST',
    #refresh_token_url=None,
    #refresh_token_params=None,
    redirect_uri='http://localhost:5000/auth',
    client_kwargs={'scope': 'openid email profile'},
    server_metadata_url= 'https://accounts.google.com/.well-known/openid-configuration',
)



@app.route('/api/login')
def login():
    redirect_uri = 'http://localhost:5000/api/auth'
    return oauth.google.authorize_redirect(redirect_uri)

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
        
        #process payload if authentication is successful
        email = payload.get('email'),

        #look for user in database
        user = db.users.find_one({'email': email})

        if user:
            #found user in db
            user_role = user.get('role')
            session['user'] = {'email': email, 'role': user_role}
            frontend_redirect_url = f"http://localhost:3000/dashboard?token={token['access_token']}"
            return redirect(frontend_redirect_url)
        else:
            #did not find user in db
            print('User not found in the database')
            return 'User not found', 404
    except Exception as e:
        # token validation failed
        print(e)
        return jsonify({'error': 'Token validation failed'}), 401
    


@app.route('/api/user')
def get_user_info():
    user_info = session.get('user')
    if user_info:
        return jsonify(user_info), 200
    else:
        return jsonify({'error': 'User not found'}), 404






#decorator to make sure people are authenticated before they make an api call
def login_required(role):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            if 'user' not in session:
                print('user not authenticated')
                return redirect(url_for('login'))
            user_role = session['user'].get('role')
            if user_role != role:
                print('user not authorized')
                return jsonify({'error': 'Unauthorized access'}), 403
            return func(*args, **kwargs)
        return wrapper
    return decorator








from controllers.UserController import UserController  # Import the UserController


# Initialize the UserController with the MongoDB database
user_controller = UserController(db)

# Add routes for user-related operations with login_required decorator
@app.route('/api/users', methods=['POST'])
@login_required(role='admin')  # Only admins can create users
def create_user():
    data = request.json
    email = data.get('email')
    role = data.get('role')
    if not email or not role:
        return jsonify({'error': 'Email and role are required'}), 400
    if user_controller.get_user_by_email(email):
        return jsonify({'error': 'User with this email already exists'}), 409
    user_controller.create_user(email, role)
    return jsonify({'message': 'User created successfully'}), 201

@app.route('/api/users/<email>', methods=['GET'])
@login_required(role='admin')  # Only admins can get user details
def get_user(email):
    user = user_controller.get_user_by_email(email)
    if user:
        return jsonify(user), 200
    else:
        return jsonify({'error': 'User not found'}), 404

@app.route('/api/users/<email>', methods=['PUT'])
@login_required(role='admin')  # Only admins can update user roles
def update_user(email):
    data = request.json
    new_role = data.get('role')
    if not new_role:
        return jsonify({'error': 'Role is required'}), 400
    user = user_controller.get_user_by_email(email)
    if user:
        user_controller.update_user_role(email, new_role)
        return jsonify({'message': 'User role updated successfully'}), 200
    else:
        return jsonify({'error': 'User not found'}), 404

@app.route('/api/users/<email>', methods=['DELETE'])
@login_required(role='admin')  # Only admins can delete users
def delete_user(email):
    user = user_controller.get_user_by_email(email)
    if user:
        user_controller.delete_user(email)
        return jsonify({'message': 'User deleted successfully'}), 200
    else:
        return jsonify({'error': 'User not found'}), 404
















if __name__ == "__main__":
    app.run(debug=True)