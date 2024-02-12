from flask import Flask, jsonify, request, render_template, send_from_directory, session, redirect, url_for
from flask_cors import CORS
from bson import json_util
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
        email = payload.get('email')
        print(email)
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
            return 'Your credentials are not associated with an account at GeckoJump. Please contact us at support@geckojump.com if you believe this is an error.', 404
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
#checks if user is any of the roles specified ['admin', 'employee']
def login_required(roles):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            if 'user' not in session:
                print('user not authenticated')
                return redirect(url_for('login'))
            user_role = session['user'].get('role')
            if user_role not in roles:
                print('user not authorized')
                return jsonify({'error': 'Unauthorized access'}), 403
            return func(*args, **kwargs)
        return wrapper
    return decorator








from controllers.UserController import UserController 

from controllers.ProjectController import ProjectController

# allows the endpoints entry into the database
project_controller = ProjectController(db)

# allows the endpoints entry into the database
user_controller = UserController(db)

@app.route('/api/users', methods=['POST'])
@login_required(roles=['admin'])  # Only admins can create users
def create_user():
    data = request.json
    email = data.get('email')
    full_name = data.get('full_name')
    role = data.get('role')
    if not email or not full_name or not role:
        return jsonify({'error': 'Email, full name, and role are required'}), 400
    if user_controller.get_user_by_email(email):
        return jsonify({'error': 'User with this email already exists'}), 409
    user_controller.create_user(email, full_name, role)
    return jsonify({'message': 'User created successfully'}), 201

@app.route('/api/users/<email>', methods=['GET'])
@login_required(roles=['admin'])  # Only admins can get user details
def get_user(email):
    user = user_controller.get_user_by_email(email)
    if user:
        return jsonify(user), 200
    else:
        return jsonify({'error': 'User not found'}), 404

@app.route('/api/users/<email>', methods=['PUT'])
@login_required(roles=['admin'])  # Only admins can update user roles
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
@login_required(roles=['admin'])  # Only admins can delete users
def delete_user(email):
    user = user_controller.get_user_by_email(email)
    if user:
        user_controller.delete_user(email)
        return jsonify({'message': 'User deleted successfully'}), 200
    else:
        return jsonify({'error': 'User not found'}), 404


@app.route('/api/users/roles', methods=['GET'])
@login_required(roles=['admin'])  # Only admins can get users by roles
def get_users_by_roles():
    users_by_role = user_controller.get_users_by_roles()
    # Convert ObjectId fields to strings
    users_by_role_json = json_util.dumps(users_by_role)
    return users_by_role_json, 200
















##########################################################################################
########################## PROJECT EMPLOYEE/CLIENT ASSOCIATION ###########################
##########################################################################################

##### ADD EMPLOYEE TO PROJECT #####
@app.route('/api/projects/add_employee', methods=['POST'])
def add_employee_to_project():
    data = request.json
    project_id = data.get('project_id')
    employee_email = data.get('employee_email')
    if not project_id or not employee_email:
        return jsonify({'error': 'Project ID and employee email are required'}), 400
    employee = user_controller.get_user_by_email(employee_email)
    if not employee:
        return jsonify({'error': 'Employee not found'}), 404
    project_controller.add_employee_to_project(project_id, employee['_id'])
    return jsonify({'message': 'Employee added to project successfully'}), 200


##### REMOVE EMPLOYEE FROM PROJECT #####
@app.route('/api/projects/remove_employee', methods=['POST'])
def remove_employee_from_project():
    data = request.json
    project_id = data.get('project_id')
    employee_email = data.get('employee_email')
    if not project_id or not employee_email:
        return jsonify({'error': 'Project ID and employee email are required'}), 400
    employee = user_controller.get_user_by_email(employee_email)
    if not employee:
        return jsonify({'error': 'Employee not found'}), 404
    project_controller.remove_employee_from_project(project_id, employee['_id'])
    return jsonify({'message': 'Employee removed from project successfully'}), 200


##### ADD CLIENT TO PROJECT #####
@app.route('/api/projects/add_client', methods=['POST'])
def add_client_to_project():
    data = request.json
    project_id = data.get('project_id')
    client_email = data.get('client_email')
    if not project_id or not client_email:
        return jsonify({'error': 'Project ID and client email are required'}), 400
    client = user_controller.get_user_by_email(client_email)
    if not client:
        return jsonify({'error': 'Client not found'}), 404
    project_controller.add_client_to_project(project_id, client['_id'])
    return jsonify({'message': 'Client added to project successfully'}), 200


##### REMOVE CLIENT FROM PROJECT #####
@app.route('/api/projects/remove_client', methods=['POST'])
def remove_client_from_project():
    data = request.json
    project_id = data.get('project_id')
    client_email = data.get('client_email')
    if not project_id or not client_email:
        return jsonify({'error': 'Project ID and client email are required'}), 400
    client = user_controller.get_user_by_email(client_email)
    if not client:
        return jsonify({'error': 'Client not found'}), 404
    project_controller.remove_client_from_project(project_id, client['_id'])
    return jsonify({'message': 'Client removed from project successfully'}), 200












###### CREATE NEW PROJECT ######
@app.route('/api/projects', methods=['POST'])
@login_required(roles=['employee','admin'])
def create_project():
    data = request.json
    title = data.get('title')
    description = data.get('description')
    if not title or not description:
        return jsonify({'error': 'Title and description are required'}), 400
    project_id = project_controller.create_project(title, description)
    return jsonify({'message': 'Project created successfully', 'project_id': project_id}), 201

##### RETURN ALL PROJECTS #####
@app.route('/api/projects', methods=['GET'])
@login_required(roles=['employee', 'admin'])
def get_projects():
    projects = project_controller.get_all_projects() 
    return jsonify(projects), 200


##### RETURN SPECIFIC PROJECT #####
@app.route('/api/projects/<project_id>', methods=['GET'])
@login_required(roles=['employee', 'client'])
def get_project(project_id):
    project = project_controller.get_project_by_id(project_id)
    if not project:
        return jsonify({'error': 'Project not found'}), 404
    return jsonify(project.to_dict())


##### UPDATE SPECIFIC PROJECT #####
@app.route('/api/projects/<project_id>', methods=['PUT'])
@login_required(roles=['employee'])
def update_project(project_id):
    data = request.json
    title = data.get('title')
    description = data.get('description')
    if not title or not description:
        return jsonify({'error': 'Title and description are required'}), 400
    if project_controller.update_project(project_id, title, description):
        return jsonify({'message': 'Project updated successfully'}), 200
    return jsonify({'error': 'Failed to update project'}), 500


##### DELETE SPECIFIC PROJECT #####
@app.route('/api/projects/<project_id>', methods=['DELETE'])
@login_required(roles=['employee'])
def delete_project(project_id):
    if project_controller.delete_project(project_id):
        return jsonify({'message': 'Project deleted successfully'}), 200
    return jsonify({'error': 'Failed to delete project'}), 500



##### ADD OBJECTIVE TO PROJECT
@app.route('/api/projects/<project_id>/objectives', methods=['POST'])
@login_required(roles=['employee'])
def add_objective(project_id):
    data = request.json
    title = data.get('title')
    description = data.get('description')
    time_to_completion = data.get('time_to_completion')
    if not title or not description or not time_to_completion:
        return jsonify({'error': 'Title, description, and time_to_completion are required'}), 400
    if project_controller.add_objective(project_id, title, description, time_to_completion):
        return jsonify({'message': 'Objective added successfully'}), 201
    return jsonify({'error': 'Failed to add objective'}), 500



##### UPDATE SPECIFIC OBJECTIVE FOR PROJECT #####
@app.route('/api/projects/<project_id>/objectives/<objective_id>', methods=['PUT'])
@login_required(roles=['employee'])
def edit_objective(project_id, objective_id):
    data = request.json
    title = data.get('title')
    description = data.get('description')
    time_to_completion = data.get('time_to_completion')
    if not title or not description or not time_to_completion:
        return jsonify({'error': 'Title, description, and time_to_completion are required'}), 400
    if project_controller.edit_objective(project_id, objective_id, title, description, time_to_completion):
        return jsonify({'message': 'Objective edited successfully'}), 200
    return jsonify({'error': 'Failed to edit objective'}), 500



##### DELETE SPECIFIC OBJECTIVE FOR PROJECT #####
@app.route('/api/projects/<project_id>/objectives/<objective_id>', methods=['DELETE'])
@login_required(roles=['employee'])
def delete_objective(project_id, objective_id):
    if project_controller.delete_objective(project_id, objective_id):
        return jsonify({'message': 'Objective deleted successfully'}), 200
    return jsonify({'error': 'Failed to delete objective'}), 500



if __name__ == "__main__":
    app.run(debug=True)