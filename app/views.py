"""
Flask Documentation:     http://flask.pocoo.org/docs/
Jinja2 Documentation:    http://jinja.pocoo.org/2/documentation/
Werkzeug Documentation:  http://werkzeug.pocoo.org/documentation/
This file creates your application.
"""
import os
import datetime
from app import app, db, login_manager, csrf
from flask import render_template, request, redirect, url_for, flash, jsonify, g
from flask_login import login_user, logout_user, current_user, login_required
from app.forms import LoginForm, RegisterForm, NewCarForm
from app.models import Users, Cars
from werkzeug.utils import secure_filename
from werkzeug.security import check_password_hash


#Using JWT
import jwt
from functools import wraps
import base64


###
# Routing for your application.
###


# Create a JWT @requires_auth decorator
# This decorator can be used to denote that a specific route should check
# for a valid JWT token before displaying the contents of that route.
def requires_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth = request.headers.get('Authorization', None)
        if not auth:
            return jsonify({'code': 'authorization_header_missing', 'description': 'Authorization header is expected'}), 401

        parts = auth.split()

        if parts[0].lower() != 'bearer':
            return jsonify({'code': 'invalid_header', 'description': 'Authorization header must start with Bearer'}), 401
        elif len(parts) == 1:
            return jsonify({'code': 'invalid_header', 'description': 'Token not found'}), 401
        elif len(parts) > 2:
            return jsonify({'code': 'invalid_header', 'description': 'Authorization header must be Bearer + \s + token'}), 401

        token = parts[1]

        try:
            payload = jwt.decode(token, app.config['SECRET_KEY'])

        except jwt.ExpiredSignature:
            return jsonify({'code': 'token_expired', 'description': 'token is expired'}), 401
        except jwt.DecodeError:
            return jsonify({'code': 'token_invalid_signature', 'description': 'Token signature is invalid'}), 401

        g.current_user = user = payload
        return f(*args, **kwargs)

    return decorated




@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def index(path):
    """
    Because we use HTML5 history mode in vue-router we need to configure our
    web server to redirect all routes to index.html. Hence the additional route
    "/<path:path".

    Also we will render the initial webpage and then let VueJS take control.
    """
    #return app.send_static_file('index.html')
    return render_template('index.html')


@app.route("/api/register", methods=["POST"])
def register():
    form = RegisterForm(request.form)
    photo = request.files["photo"]
    form.photo.data = photo
    if request.method == "POST" and form.validate_on_submit() == True:
        username = form.username.data
        password = form.password.data
        name = form.name.data
        email = form.email.data
        location = form.location.data
        bio = form.biography.data
        photo = form.photo.data
        photo = uploadPhoto(form.photo.data)

        try:
            #create user object and add to database
            user = Users(username, password, name, email, location, bio, photo)
            if user is not None:
                db.session.add(user)
                db.session.commit()

                #flash message to indicate the a successful entry
                success = "User sucessfully registered"
                return jsonify(message=success), 201

        except Exception as e:
            print(e)
            db.session.rollback()
            error = "An error occured with the server. Try again!"
            return jsonify(error=error), 401

    #flash message to indicate registration failure
    failure = "Error: Invalid/Missing user information"
    return jsonify(error=failure), 401


@app.route("/api/cars", methods=["POST"])
@login_required
@requires_auth
def addNewCar():
    form= NewCarForm(request.form)
    photo = request.files["photo"]
    form.photo.data = photo
    if request.method == "POST" and form.validate_on_submit() == True:
        #Gets the user input from the form
        make = form.make.data
        model = form.model.data
        colour = form.colour.data
        year = form.year.data
        transmission = form.transmission.data
        car_type = form.car_type.data
        price = int(form.price.data)
        description = form.description.data
        photo = form.photo.data
        photo = uploadPhoto(form.photo.data)
        user_id = int(form.user_id.data)

        try:
        #create user object and add to database
            car = Cars(description, make, model, colour, year, transmission, car_type, price, photo, user_id)
            if car is not None:
                db.session.add(car)
                db.session.commit()

                #flash message to indicate the a successful entry
                success = "Car sucessfully added"
                return jsonify(message=success), 201

        except Exception as e:
            print(e)
            db.session.rollback()
            error = "An error occured with the server. Try again!"
            return jsonify(error=error), 401

    #flash message to indicate failure
    failure = "Error: Invalid/Missing information"
    return jsonify(error=failure), 401




@app.route("/api/cars", methods=["GET"])
@requires_auth
def allCars():
    try:
        cars = []
        allcars = db.session.query(Cars).order_by(Cars.id.desc()).all()

        for car in allcars:                                      

            c = {"photo": os.path.join(app.config['GET_FILE'], car.photo), "year": car.year, "make": car.make,"price":car.price, "model":car.model}
            cars.append(c)
        return jsonify(cars=cars), 201
    except Exception as e:
        print(e)

        error = "Internal server error"
        return jsonify(error=error), 401



#api route to allow the user to login into their profile on the application
@app.route("/api/auth/login", methods=["POST"])
def login():
    form = LoginForm(request.form)
    print(form.data)
    if request.method == "POST":
        # change this to actually validate the entire form submission
        # and not just one field
        if form.validate_on_submit():
            # Get the username and password values from the form.
            username = form.username.data
            password = form.password.data
           
            user = db.session.query(Users).filter_by(username=username).first()

            if user is not None and check_password_hash(user.password, password):
                # get user id, load into session
                login_user(user)

                #creates bearer token for user
                payload = {'user': user.username}
                jwt_token = jwt.encode(payload, app.config['SECRET_KEY'], algorithm = 'HS256').decode('utf-8')

                #Flash message to indicate a successful login
                success = "User successfully logged in."
                return jsonify(message=success, token=jwt_token, user_id=user.id)

            error = "Incorrect username or password"
            return jsonify(error=error), 401

        #Flash message to indicate a failed login
        failure = "Failed to login user"
        return jsonify(error=failure)


#api route to allow the user to logout
@app.route("/api/auth/logout", methods=["GET"])
@login_required
@requires_auth
def logout():
    logout_user()

    #Flash message indicating a successful logout
    success = "User successfully logged out."
    return jsonify(message=success)

#Save the uploaded photo to a folder
def uploadPhoto(upload):
    filename = secure_filename(upload.filename)
    upload.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
    return filename


@login_manager.user_loader
def load_user(user_id):
    return Users.query.get(user_id)

@login_manager.unauthorized_handler
def unauthorized_handler():
    #NOT SURE WHY ITS NOT RENDERING PROPERLY FOR EVERYTHING SO I DID THIS INSTEAD FOR THE LOGIN CHECK SO YOU CAN LOGOUT
    failure = "User not logged in to use logout option"
    return jsonify(error=failure)


# gets the details of a specific car
@app.route('api/cars/<car_id>',methods=["GET"])
def car_details(car_id):
    try:
        details =[]
        allcars= db.session.query(Cars).order_by(Cars.id.desc()).all()

        for car in allcars:
            if car_id == car.id:
                d={"photo": os.path.join(app.config['GET_FILE'], car.photo),
                "description": car.description,
                "year": car.year, "make": car.make,"model":car.model,
                "colour":car.colour, "transmission":car.transmission,
                "car_type":car.car_type,"price":car.price, "user_id":car.user_id}
                details.append(d)
            return jsonify(details=details),201
        print ("Car id not found")
    except Exception as e:
        print(e)

        error="Internal server error"
        return jsonify(error=error),401
    
    
    # gets details of a user
@app.route('/api/users/<user_id>',methods=["GET"])
def user_details(user_id):
    try:
        details =[]
        allusers= db.session.query(Users).order_by(Users.id.desc()).all()

        for user in allusers:
            if user_id == user.id:
                d={"photo": os.path.join(app.config['GET_FILE'], user.photo),
                "username": user.username,
                "name": user.name, "email": user.email,"location":user.location,
                "biography":user.biography, "date joined":user.date_joined}

                details.append(d)
            return jsonify(details=details),201
        print ("User not found")
    except Exception as e:
        print(e)

        error="Internal server error"
        return jsonify(error=error),401
    
    
###
# The functions below should be applicable to all Flask apps.
###

# Display Flask WTF errors as Flash messages
def flash_errors(form):
    for field, errors in form.errors.items():
        for error in errors:
            flash(u"Error in the %s field - %s" % (
                getattr(form, field).label.text,
                error
            ), 'danger')

@app.route('/<file_name>.txt')
def send_text_file(file_name):
    """Send your static text file."""
    file_dot_text = file_name + '.txt'
    return app.send_static_file(file_dot_text)


@app.after_request
def add_header(response):
    """
    Add headers to both force latest IE rendering engine or Chrome Frame,
    and also tell the browser not to cache the rendered page. If we wanted
    to we could change max-age to 600 seconds which would be 10 minutes.
    """
    response.headers['X-UA-Compatible'] = 'IE=Edge,chrome=1'
    response.headers['Cache-Control'] = 'public, max-age=0'
    return response


@app.errorhandler(404)
def page_not_found(error):
    """Custom 404 page."""
    return render_template('404.html'), 404


if __name__ == '__main__':
    app.run(debug=True,host="0.0.0.0",port="8080")
