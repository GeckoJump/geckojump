from pymongo.collection import Collection
from pymongo.database import Database

class UserController:
    def __init__(self, db: Database):
        self.users: Collection = db.users

    def create_user(self, email: str, role: str) -> None:
        user_data = {'email': email, 'role': role}
        self.users.insert_one(user_data)

    def get_user_by_email(self, email: str) -> dict:
        return self.users.find_one({'email': email})

    def update_user_role(self, email: str, new_role: str) -> None:
        self.users.update_one({'email': email}, {'$set': {'role': new_role}})

    def delete_user(self, email: str) -> None:
        self.users.delete_one({'email': email})
