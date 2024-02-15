from flask import Flask, jsonify, request, render_template, send_from_directory, session, redirect, url_for
from utils.recaptcha_protect import recaptcha_protect
from mail.mailer import on_contact_form_submit
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
from google.oauth2 import id_token
from google_auth_oauthlib.flow import Flow
from pip._vendor import cachecontrol
import google.auth.transport.requests
import pathlib

#initialize flask stuff
app = Flask(__name__)
app.secret_key = os.environ.get('FLASK_SECRET_KEY')

#initialize rest api
api = Api(app)
CORS(app)

os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1"

#initialize mongoDB stuff 
client = MongoClient(os.environ.get('MONGO_URI'),server_api=ServerApi('1'))
db = client.flask_db
client_secrets_file = os.path.join(pathlib.Path(__file__).parent, "client_secret.json")

GOOGLE_CLIENT_ID = os.environ.get('GOOGLE_CLIENT_ID')


flow = Flow.from_client_secrets_file(
    client_secrets_file=client_secrets_file,
    scopes=["https://www.googleapis.com/auth/userinfo.profile", "https://www.googleapis.com/auth/userinfo.email", "openid"],
    redirect_uri="http://localhost:5000/api/auth"
)


# #initialize oauth stuff
# oauth = OAuth(app)
# oauth.register(
#     name='google',
#     client_id= os.environ.get('GOOGLE_CLIENT_ID'),
#     client_secret= os.environ.get('GOOGLE_CLIENT_SECRET'),
#     #authorize_url='https://accounts.google.com/o/oauth2/auth',
#     #authorize_params={},
#     #access_token_url='https://accounts.google.com/o/oauth2/token',
#     #access_token_params=None,
#     #access_token_method='POST',
#     #refresh_token_url=None,
#     #refresh_token_params=None,
#     redirect_uri='http://localhost:5000/auth',
#     client_kwargs={'scope': 'openid email profile'},
#     server_metadata_url= 'https://accounts.google.com/.well-known/openid-configuration',
# )



@app.route('/api/login')
def login():
    authorization_url, state = flow.authorization_url()
    print(authorization_url)
    session["state"] = state
    return redirect(authorization_url)

@app.route('/api/auth')
def auth():
    try: 
        flow.fetch_token(authorization_response=request.url)

        if not session["state"] == request.args["state"]:
            print('state not found')
            return 'State not found', 401

        credentials = flow.credentials
        request_session = requests.session()
        cached_session = cachecontrol.CacheControl(request_session)
        token_request = google.auth.transport.requests.Request(session=cached_session)

        id_info = id_token.verify_oauth2_token(
            id_token=credentials._id_token,
            request=token_request,
            audience=GOOGLE_CLIENT_ID,
            clock_skew_in_seconds=10,
        )

        session["google_id"] = id_info.get("sub")
        token = id_info.get("sub")
        session["name"] = id_info.get("name")
        email = id_info.get("email")
        print(email)
        #look for user in database
        user = db.users.find_one({'email': email})
        print(credentials.token)
        if user:
            #found user in db
            user_role = user.get('role')
            session['user'] = {'email': email, 'name': session["name"], 'role': user_role}
            frontend_redirect_url = f"http://localhost:3000/dashboard?token={credentials.token}"
            return redirect(frontend_redirect_url)
        else:
            #did not find user in db
            print('User not found in the database')
            return 'Your credentials are not associated with an account at GeckoJump. Please contact us at support@geckojump.com if you believe this is an error.', 404
    except Exception as e:
        # token validation failed
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
    


@app.route('/api/user', methods=['GET'])
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
    users_by_role_json = json_util.dumps(users_by_role)
    return users_by_role_json, 200





# project_controller.create_project('project gecko 1', 'very cool company project')
# project_controller.create_project('project gecko 2', 'another very cool company project')
# project_controller.create_project('project 3', 'boring')


#user_controller.create_user('toiletpancakes@gmail.com','mason hagan', 'admin')






##########################################################################################
########################## PROJECT EMPLOYEE/CLIENT ASSOCIATION ###########################
##########################################################################################

##### ADD USER TO PROJECT #####

@app.route('/api/projects/add_user', methods=['POST'])
def add_user_to_project():
    data = request.json
    project_id = data.get('project_id')
    email = data.get('email')
    if not project_id or not email:
        return jsonify({'error': 'Project ID and user email are required'}), 400
    found_user = user_controller.get_user_by_email(email)
    if not found_user:
        return jsonify({'error': 'User not found'}), 404
    project_controller.add_user_to_project(project_id, found_user['_id'])
    return jsonify({'message': 'User added to project successfully'}), 200

##### REMOVE USER FROM PROJECT #####
@app.route('/api/projects/remove_user', methods=['POST'])
def remove_user_from_project():
    data = request.json
    project_id = data.get('project_id')
    email = data.get('email')
    if not project_id or not email:
        return jsonify({'error': 'Project ID and user email are required'}), 400
    found_user = user_controller.get_user_by_email(email)
    if not found_user:
        return jsonify({'error': 'User not found'}), 404
    project_controller.remove_user_from_project(project_id, found_user['_id'])
    return jsonify({'message': 'User removed from project successfully'}), 200




@app.route('/api/projects/user/<user_email>', methods=['GET'])
@login_required(roles=['employee', 'admin', 'client'])
def get_projects_by_user(user_email):
    #does this user exist?
    user = user_controller.get_user_by_email(user_email)
    if not user:

        return jsonify({'error': 'User not found'}), 404

    projects = project_controller.get_projects_by_user_email(user_email)
    if projects is not None:
        
        projects_json = json_util.dumps(projects)
        return projects_json, 200
    else:
        return jsonify({'error': 'No projects found for this user'}), 404








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
    return projects


##### RETURN SPECIFIC PROJECT #####
@app.route('/api/projects/<project_id>', methods=['GET'])
@login_required(roles=['employee', 'client', 'admin'])
def get_project(project_id):
    project = project_controller.get_project_by_id(project_id)
    if not project:
        return jsonify({'error': 'Project not found'}), 404
    return project


##### UPDATE SPECIFIC PROJECT #####
@app.route('/api/projects/<project_id>', methods=['PUT'])
@login_required(roles=['employee', 'admin'])
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
@login_required(roles=['employee','admin'])
def delete_project(project_id):
    if project_controller.delete_project(project_id):
        return jsonify({'message': 'Project deleted successfully'}), 200
    return jsonify({'error': 'Failed to delete project'}), 500


##########################################################################################
################################ PROJECT OBJECTIVES ######################################
##########################################################################################

##### RETURN ALL OBJECTIVES OF A SPECIFIC PROJECT
@app.route('/api/projects/<project_id>/objectives', methods=['GET'])
@login_required(roles=['employee', 'admin'])
def get_project_objectives(project_id):
    project = project_controller.get_project_by_id(project_id)
    if not project:
        return jsonify({'error': 'Project not found'}), 404
    objectives = project.get('objectives', [])
    return jsonify(objectives), 200


@app.route('/api/projects/<project_id>/objectives/<objective_id>', methods=['GET'])
@login_required(roles=['employee', 'admin'])
def get_specific_objective(project_id, objective_id):
    project_response = project_controller.get_project_by_id(project_id)
    if not project_response:
        return jsonify({'error': 'Project not found'}), 404

    
    project, status_code = project_response


    if status_code != 200 or not project:
        return jsonify({'error': 'Project not found'}), status_code

    objective = next((obj for obj in project.get('objectives', []) if obj['_id'] == objective_id), None)

    if not objective:
        return jsonify({'error': 'Objective not found'}), 404

    return jsonify(objective), 200


##### ADD OBJECTIVE TO PROJECT
@app.route('/api/projects/<project_id>/objectives', methods=['POST'])
@login_required(roles=['employee','admin'])
def add_objective(project_id):
    data = request.json
    title = data.get('title')
    description = data.get('description')
    if not title or not description:
        return jsonify({'error': 'Title and description are required'}), 400
    if project_controller.add_objective(project_id, title, description):
        return jsonify({'message': 'Objective added successfully'}), 201
    return jsonify({'error': 'Failed to add objective'}), 500



##### UPDATE SPECIFIC OBJECTIVE FOR PROJECT #####
@app.route('/api/projects/<project_id>/objectives/<objective_id>', methods=['PUT'])
@login_required(roles=['employee','admin'])
def edit_objective(project_id, objective_id):
    data = request.json
    title = data.get('title')
    description = data.get('description')
    if not title or not description:
        return jsonify({'error': 'Title and description are required'}), 400
    if project_controller.edit_objective(project_id, objective_id, title, description):
        return jsonify({'message': 'Objective edited successfully'}), 200
    return jsonify({'error': 'Failed to edit objective'}), 500



##### DELETE SPECIFIC OBJECTIVE FOR PROJECT #####
@app.route('/api/projects/<project_id>/objectives/<objective_id>', methods=['DELETE'])
@login_required(roles=['employee','admin'])
def delete_objective(project_id, objective_id):
    if project_controller.delete_objective(project_id, objective_id):
        return jsonify({'message': 'Objective deleted successfully'}), 200
    return jsonify({'error': 'Failed to delete objective'}), 500






##########################################################################################
################################ OBJECTIVE CHECKLIST #####################################
##########################################################################################



##### GET CHECKLIST FOR SPECIFIC OBJECTIVE
@app.route('/api/projects/<project_id>/objectives/<objective_id>/checklist', methods=['GET'])
@login_required(roles=['employee', 'admin'])
def get_objective_checklist(project_id, objective_id):
    project = project_controller.get_project_by_id(project_id)
    if not project:
        return jsonify({'error': 'Project not found'}), 404
    objective = next((obj for obj in project.get('objectives', []) if obj['_id'] == objective_id), None)
    if not objective:
        return jsonify({'error': 'Objective not found'}), 404
    checklist = objective.get('checklist', [])
    return jsonify(checklist), 200




@app.route('/api/projects/<project_id>/objectives/<objective_id>/checklist', methods=['POST'])
@login_required(roles=['employee', 'admin'])
def add_checklist_item(project_id, objective_id):
    data = request.json
    description = data.get('description')
    if not description:
        return jsonify({'error': 'Description is required'}), 400
    if project_controller.add_checklist_item(project_id, objective_id, description):
        return jsonify({'message': 'Checklist item added successfully'}), 201
    return jsonify({'error': 'Failed to add checklist item'}), 500


@app.route('/api/projects/<project_id>/objectives/<objective_id>/checklist/<checklist_item_id>', methods=['DELETE'])
@login_required(roles=['employee', 'admin'])
def delete_checklist_item(project_id, objective_id, checklist_item_id):
    if project_controller.delete_checklist_item(project_id, objective_id, checklist_item_id):
        return jsonify({'message': 'Checklist item deleted successfully'}), 200
    return jsonify({'error': 'Failed to delete checklist item'}), 500




@app.route('/api/projects/<project_id>/objectives/<objective_id>/checklist/<checklist_item_id>/toggle', methods=['PUT'])
@login_required(roles=['employee', 'admin'])
def toggle_checklist_item(project_id, objective_id, checklist_item_id):
    if project_controller.toggle_checklist_item(project_id, objective_id, checklist_item_id):
            return jsonify({'message': 'Checklist item toggled successfully'}), 200
    else:
        return jsonify({'error': 'Failed to toggle checklist item'}), 500






if __name__ == "__main__":
    app.run(debug=True)