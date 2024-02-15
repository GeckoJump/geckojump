from pymongo.collection import Collection
from pymongo.database import Database
from flask import jsonify
from pymongo import MongoClient
import uuid
import json

class ProjectController:
    def __init__(self, db: Database):
        self.projects_collection: Collection = db.projects
        self.db = db
    def create_project(self, title: str, description: str) -> str:

        project_id = uuid.uuid4().hex

        project_data = {
            '_id': project_id,
            'title': title,
            'description': description,
            'objectives': [],
            'clients': [],
            'employees': [],
            'progress': 0.0
        }

        self.projects_collection.insert_one(project_data)

        return project_id

    def update_project(self, project_id: str, title: str, description: str) -> bool:
        result = self.projects_collection.update_one(
            {'_id': project_id},
            {'$set': {'title': title, 'description': description}}
        )
        return result.modified_count > 0

    def delete_project(self, project_id: str) -> bool:
        #delete project from all users associated projects
        user_update_result = self.db.users.update_many(
            {},
            {'$pull': {'associated_projects': project_id}}
        )
        
        # actually delete project
        project_delete_result = self.projects_collection.delete_one({'_id': project_id})
        
        # Check if the project was successfully deleted
        return project_delete_result.acknowledged


    def get_all_projects(self) -> list[dict]:
        return list(self.projects_collection.find({}))

    def get_project_by_id(self, project_id: str) -> dict:
        project = self.projects_collection.find_one({'_id': project_id})
        if not project: return {'error': 'Project not found'}, 404
        return project, 200

    def get_user_by_id(self, user_id: str) -> dict:
        user = self.db.users.find_one({'_id': user_id})
        if user: return user
        return {}




##########################################################################################
########################## PROJECT EMPLOYEE/CLIENT ASSOCIATION ###########################
##########################################################################################


    def get_associated_employees(self, project_id: str) -> list[dict]:
        project = self.projects_collection.find_one({'_id': project_id})
        if project:
            employees = project.get('employees', [])
            return employees
        else:
            return []

    def get_associated_clients(self, project_id: str) -> list[dict]:
        project = self.projects_collection.find_one({'_id': project_id})
        if project:
            clients = project.get('clients', [])
            return clients
        else:
            return []


    def get_projects_by_user_email(self, user_email: str):
        #returns all projects that are associated with this user
        projects = self.projects_collection.find({
            '$or': [
                {'employees': user_email},
                {'clients': user_email},
                {'admins': user_email},
            ]
        })
        return list(projects)


    def add_user_to_project(self, project_id: str, user_id: str) -> bool:
        found_user = self.get_user_by_id(user_id)
        
        if found_user and 'role' in found_user:
            role_field = found_user['role'] + 's' #'employee' -> 'employees', etc.
            user_email = found_user['email']
            #add associated users to project
            project_update_result = self.projects_collection.update_one(
                {'_id': project_id},
                {'$addToSet': {role_field: user_email}}
            )
            
            #add project to user's associated projects
            user_update_result = self.db.users.update_one(
                {'_id': user_id},
                {'$addToSet': {'associated_projects': project_id}}
            )
            
            #check if both updates were successful
            return project_update_result.modified_count > 0 and user_update_result.modified_count > 0
        
        return False



    def remove_user_from_project(self, project_id: str, user_id: str) -> bool:
        found_user = self.get_user_by_id(user_id)
        user_email = found_user['email']
        if found_user and 'role' in found_user:
            role_field = found_user['role'] + 's' #'employee' -> 'employees', etc.
            
            #remove associated user from project
            project_update_result = self.projects_collection.update_one(
                {'_id': project_id},
                {'$pull': {role_field: user_email}}
            )
            
            #remove project from user's associated projects
            user_update_result = self.db.users.update_one(
                {'_id': user_id},
                {'$pull': {'associated_projects': project_id}}
            )
            
            #check if both updates were successful
            return project_update_result.modified_count > 0 and user_update_result.modified_count > 0
        
        return False


    def remove_user_from_all_projects(self, user_id: str) -> bool:
        #get user email and role
        user = self.get_user_by_id(user_id)
        if not user: return False

        user_email = user.get('email')
        user_role = user.get('role', '') + 's'  #'employee' -> 'employees'

        # update all projects
        update_result = self.projects_collection.update_many(
            {},
            {'$pull': {user_role: user_email}}
        )
        return update_result.modified_count > 0








    ##########################################################################################
    ################################ PROJECT OBJECTIVES ######################################
    ##########################################################################################


    def add_objective(self, project_id: str, title: str, description: str) -> bool:
        objective_id = uuid.uuid4().hex
        objective_data = {
            '_id': objective_id,
            'title': title,
            'description': description,
            'progress': 0.0,  #progress starts at 0
            'checklist': []
        }
        result = self.projects_collection.update_one(
            {'_id': project_id},
            {'$push': {'objectives': objective_data}}
        )
        if result.modified_count > 0:
            return self.calculate_project_progress(project_id)
        return False

    def edit_objective(self, project_id: str, objective_id: str, title: str, description: str) -> bool:
        result = self.projects_collection.update_one(
            {'_id': project_id, 'objectives._id': objective_id},
            {'$set': {'objectives.$.title': title, 'objectives.$.description': description}}
        )

        return result.acknowledged

    def delete_objective(self, project_id: str, objective_id: str) -> bool:
        result = self.projects_collection.update_one(
            {'_id': project_id},
            {'$pull': {'objectives': {'_id': objective_id}}}
        )
        if result.modified_count > 0:
            return self.calculate_project_progress(project_id)



    def calculate_project_progress(self, project_id: str) -> bool:
        project = self.projects_collection.find_one({'_id': project_id})
        if not project or 'objectives' not in project:
            return False

        total_checklist_items = 0
        completed_checklist_items = 0

        for objective in project['objectives']:
            
            checklist = objective.get('checklist', [])
            total_checklist_items += len(checklist)
            completed_checklist_items += sum(1 for item in checklist if item.get('complete', False))

        
        if total_checklist_items > 0:
            overall_progress = round((completed_checklist_items / total_checklist_items) * 100, 2)
        else:
            overall_progress = 0

       
        result = self.projects_collection.update_one(
            {'_id': project_id},
            {'$set': {'progress': overall_progress}}
        )
        return True







    ##########################################################################################
    ################################ OBJECTIVE CHECKLIST #####################################
    ##########################################################################################


    def recalculate_progress(self, project_id: str, objective_id: str) -> bool:
        objective = self.projects_collection.find_one(
            {'_id': project_id, 'objectives._id': objective_id},
            {'objectives.$': 1}
        )
        checklist = objective['objectives'][0]['checklist']
        total_items = len(checklist)
        completed_items = sum(1 for item in checklist if item.get('complete', False))
        progress = round(((completed_items / total_items) * 100),2) if total_items > 0 else 0
        #update objective with new progress
        result = self.projects_collection.update_one(
            {'_id': project_id, 'objectives._id': objective_id},
            {'$set': {'objectives.$.progress': progress}}
        )
        return self.calculate_project_progress(project_id)






    def add_checklist_item(self, project_id: str, objective_id: str, description: str) -> bool:
        checklist_item_id = uuid.uuid4().hex
        checklist_item_data = {
            '_id': checklist_item_id,
            'description': description,
            'complete': False
        }
        result = self.projects_collection.update_one(
            {'_id': project_id, 'objectives._id': objective_id},
            {'$push': {'objectives.$.checklist': checklist_item_data}}
        )
        if result.modified_count > 0:
            #recalculate progress to account for change in checklist
            return self.recalculate_progress(project_id, objective_id)
        return False




    def delete_checklist_item(self, project_id: str, objective_id: str, checklist_item_id: str) -> bool:
        result = self.projects_collection.update_one(
            {'_id': project_id, 'objectives._id': objective_id},
            {'$pull': {'objectives.$.checklist': {'_id': checklist_item_id}}}
        )
        if result.modified_count > 0:
            #recalculate progress to account for change in checklist
            return self.recalculate_progress(project_id, objective_id)
        return False




    def toggle_checklist_item(self, project_id: str, objective_id: str, checklist_item_id: str) -> bool:
        
        project = self.projects_collection.find_one(
            {"_id": project_id, "objectives._id": objective_id},
            {"objectives.$": 1}
        )
        objective = next((obj for obj in project["objectives"] if obj["_id"] == objective_id), None)
        if not objective:
            return False
        
        item = next((item for item in objective["checklist"] if item["_id"] == checklist_item_id), None)
        if not item:
            return False

        
        new_status = not item["complete"]
        result = self.projects_collection.update_one(
            {"_id": project_id, "objectives._id": objective_id, "objectives.checklist._id": checklist_item_id},
            {"$set": {"objectives.$.checklist.$[item].complete": new_status}},
            array_filters=[{"item._id": checklist_item_id}]
        )

        if result.modified_count > 0:
            return self.recalculate_progress(project_id, objective_id)
            return True
        return False
