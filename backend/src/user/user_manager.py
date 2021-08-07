from src.user.user import User
class UserManager:

    def __init__(self):
        self.users = {}

    def store_user(self, user: User):
        self.users[user.get_id()] = user

    def get_user(self, user_id: str):
        return self.users.get(user_id)
