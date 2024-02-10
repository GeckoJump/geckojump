from flask import jsonify
from models.project_model import Project
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

    def get_project_by_id(self, project_id: str) -> Optional[Project]:
        project = self.projects_collection.find_one({'_id': ObjectId(project_id)})
        if project:
            return Project(project['title'], project['description'], project['objectives'])
        return None

    def update_project(self, project_id: str, title: str, description: str) -> bool:
        result = self.projects_collection.update_one(
            {'_id': ObjectId(project_id)},
            {'$set': {'title': title, 'description': description}}
        )
        return result.modified_count > 0

    def delete_project(self, project_id: str) -> bool:
        result = self.projects_collection.delete_one({'_id': ObjectId(project_id)})
        return result.deleted_count > 0

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
