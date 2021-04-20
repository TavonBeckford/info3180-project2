from . import db
from datetime import datetime
from werkzeug.security import generate_password_hash



class Users(db.Model):
    __tablename__ = 'Users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password= db.Column(db.String(255), nullable=False)
    name = db.Column(db.String(200), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    location = db.Column(db.String(200), nullable=False)
    biography = db.Column(db.String(1000), nullable=False)
    photo = db.Column(db.String(200), nullable=False)
    date_joined = db.Column(db.DateTime, nullable=False, default=datetime.now())

    #RELATIONSHIPS

    def __init__(self, username, password, name, email, location, biography, photo):
        self.username= username
        self.password = generate_password_hash(password, method='md5')
        self.name= name
        self.email= email
        self.location= location
        self.biography= biography
        self.photo= photo


    def is_authenticated(self):
        return True

    def is_active(self):
        return True

    def is_anonymous(self):
        return False

    def get_id(self):
        try:
            return unicode(self.id)  # python 2 support
        except NameError:
            return str(self.id)  # python 3 support

    def __repr__(self):
        return '<User %r>' % (self.username)


class Cars(db.Model):
    __tablename__ = 'Cars'

    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String(1000), nullable=False)
    make = db.Column(db.String(80), nullable=False)
    model= db.Column(db.String(80), nullable=False)
    colour = db.Column(db.String(80), nullable=False)
    year = db.Column(db.String(80), nullable=False)
    transmission = db.Column(db.String(80), nullable=False)
    car_type = db.Column(db.String(100), nullable=False)
    price = db.Column(db.Float, nullable=False)
    photo = db.Column(db.String(200), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('Users.id', ondelete='CASCADE'), nullable=False)

    def __init__(self, description, make, model, colour, year, transmission, car_type, price, photo, user_id):
        self.description = description
        self.make= make
        self.model= model
        self.colour = colour
        self.year= year
        self.transmission= transmission
        self.car_type= car_type
        self.price= price
        self.photo= photo
        self.user_id= user_id

    def get_id(self):
        try:
            return unicode(self.id)  # python 2 support
        except NameError:
            return str(self.id)  # python 3 support

    def is_authenticated(self):
        return True

    def is_active(self):
        return True

    def is_anonymous(self):
        return False

    def __repr__(self):
        return '<User %r>' % (self.username)
