from pymongo.collection import Collection
from pymongo.database import Database
from typing import List

class UserController:
    def __init__(self, db: Database):
        self.users: Collection = db.users

    def create_user(self, email: str, full_name: str, role: str) -> None:
        user_data = {'email': email, 'full_name': full_name, 'role': role}
        self.users.insert_one(user_data)

    def get_user_by_email(self, email: str) -> dict:
        return self.users.find_one({'email': email})

    def update_user_role(self, email: str, new_role: str) -> None:
        self.users.update_one({'email': email}, {'$set': {'role': new_role}})

    def delete_user(self, email: str) -> None:
        self.users.delete_one({'email': email})

    def get_users_by_role(self, role: str) -> List[dict]:
        return list(self.users.find({'role': role}))

    def get_all_user_emails(self) -> List[str]:
        users = self.users.find({}, {'email': 1})
        return [user['email'] for user in users]

    def get_users_by_roles(self) -> dict:
        users_by_role = {}
        all_users = self.users.find({})
        for user in all_users:
            role = user.get('role')
            if role not in users_by_role:
                users_by_role[role] = []
            users_by_role[role].append(user)
        return users_by_role

    def add_project_association(self, email: str, project_id: str) -> None:
        self.users.update_one({'email': email}, {'$push': {'associated_projects': project_id}})

    def remove_project_association(self, email: str, project_id: str) -> None:
        self.users.update_one({'email': email}, {'$pull': {'associated_projects': project_id}})
