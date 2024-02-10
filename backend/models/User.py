from mongoengine import Document, StringField

class User(Document):
    email = StringField(required=True, unique=True)
    name = StringField(required=True)
    role = StringField(required=True)