from pymongo.collection import Collection
from pymongo.database import Database
from flask import jsonify
from pymongo import MongoClient
from bson import ObjectId

class ProjectController:
    def __init__(self, db: Database):
        self.projects_collection: Collection = db.projects

    def create_project(self, title: str, description: str) -> str:
        project_data = {'title': title, 'description': description, 'objectives': []}
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
        return list(self.projects_collection.find({}))







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

    def add_employee_to_project(self, project_id: str, employee_id: str) -> bool:
        result = self.projects_collection.update_one(
            {'_id': ObjectId(project_id)},
            {'$addToSet': {'employees': employee_id}}
        )
        return result.modified_count > 0

    def remove_employee_from_project(self, project_id: str, employee_id: str) -> bool:
        result = self.projects_collection.update_one(
            {'_id': ObjectId(project_id)},
            {'$pull': {'employees': employee_id}}
        )
        return result.modified_count > 0

    def add_client_to_project(self, project_id: str, client_id: str) -> bool:
        result = self.projects_collection.update_one(
            {'_id': ObjectId(project_id)},
            {'$addToSet': {'clients': client_id}}
        )
        return result.modified_count > 0

    def remove_client_from_project(self, project_id: str, client_id: str) -> bool:
        result = self.projects_collection.update_one(
            {'_id': ObjectId(project_id)},
            {'$pull': {'clients': client_id}}
        )
        return result.modified_count > 0







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
