from pymongo.collection import Collection
from pymongo.database import Database
from flask import jsonify
from pymongo import MongoClient
from bson import ObjectId
import json

class ProjectController:
    def __init__(self, db: Database):
        self.projects_collection: Collection = db.projects
        self.db = db
    def create_project(self, title: str, description: str) -> str:
        project_data = {'title': title, 'description': description, 'objectives': [], 'clients': [], 'employees': []}
        result = self.projects_collection.insert_one(project_data)
        project_id = str(result.inserted_id)
        return project_id


    def update_project(self, project_id: str, title: str, description: str) -> bool:
        result = self.projects_collection.update_one(
            {'_id': ObjectId(project_id)},
            {'$set': {'title': title, 'description': description}}
        )
        return result.modified_count > 0

    def delete_project(self, project_id: str) -> bool:
        result = self.projects_collection.delete_one({'_id': ObjectId(project_id)})
        return result.deleted_count > 0

    def get_all_projects(self) -> list[dict]:
        projects = list(self.projects_collection.find({}))
        # Convert ObjectId fields to strings
        for project in projects:
            project['_id'] = str(project['_id'])
        return projects

    def get_user_by_id(self, user_id: str) -> dict:
        user = self.db.users.find_one({'_id': ObjectId(user_id)})
        if user:
            return json.dumps(user, default=str)
        else:
            return {}





##########################################################################################
########################## PROJECT EMPLOYEE/CLIENT ASSOCIATION ###########################
##########################################################################################


    def get_associated_employees(self, project_id: str) -> list[dict]:
        project = self.projects_collection.find_one({'_id': ObjectId(project_id)})
        if project:
            employees = project.get('employees', [])
            return employees
        else:
            return []

    def get_associated_clients(self, project_id: str) -> list[dict]:
        project = self.projects_collection.find_one({'_id': ObjectId(project_id)})
        if project:
            clients = project.get('clients', [])
            return clients
        else:
            return []

    def add_user_to_project(self, project_id: str, user_id: str) -> bool:
        found_user = json.loads(self.get_user_by_id(user_id))
        print(found_user)
        if found_user['role'] == 'employee':
            result = self.projects_collection.update_one(
                {'_id': ObjectId(project_id)},
                {'$addToSet': {'employees': user_id}}
            )
            return result.modified_count > 0
        elif found_user['role'] == 'client':
            result = self.projects_collection.update_one(
                {'_id': ObjectId(project_id)},
                {'$addToSet': {'clients': user_id}}
            )
            return result.modified_count > 0
        return False


    def remove_user_from_project(self, project_id: str, user_id: str) -> bool:
        found_user = json.loads(self.get_user_by_id(user_id))
        if found_user['role'] == 'employee':
            result = self.projects_collection.update_one(
                {'_id': ObjectId(project_id)},
                {'$pull': {'employees': user_id}}
            )
            return result.modified_count > 0
        elif found_user['role'] == 'client':
            result = self.projects_collection.update_one(
                {'_id': ObjectId(project_id)},
                {'$pull': {'clients': user_id}}
            )
            return result.modified_count > 0
        return False





    ##########################################################################################
    ################################ PROJECT OBJECTIVES ######################################
    ##########################################################################################


    def add_objective(self, project_id: str, title: str, description: str, time_to_completion: int) -> bool:
        objective_id = ObjectId()
        objective_data = {
            '_id': objective_id,
            'title': title,
            'description': description,
            'time_to_completion': time_to_completion
        }
        result = self.projects_collection.update_one(
            {'_id': ObjectId(project_id)},
            {'$push': {'objectives': objective_data}}
        )
        return result.modified_count > 0

    def edit_objective(self, project_id: str, objective_id: str, title: str, description: str, time_to_completion: int) -> bool:
        result = self.projects_collection.update_one(
            {'_id': ObjectId(project_id), 'objectives._id': ObjectId(objective_id)},
            {'$set': {'objectives.$.title': title, 'objectives.$.description': description, 'objectives.$.time_to_completion': time_to_completion}}
        )
        return result.modified_count > 0

    def delete_objective(self, project_id: str, objective_id: str) -> bool:
        result = self.projects_collection.update_one(
            {'_id': ObjectId(project_id)},
            {'$pull': {'objectives': {'_id': ObjectId(objective_id)}}}
        )
        return result.modified_count > 0
