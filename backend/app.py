from flask import Flask, request, jsonify, Response
from flask_cors import CORS
from flask_mysqldb import MySQL
import tensorflow as tf
from tensorflow.keras.models import load_model
import numpy as np
import jwt
from datetime import datetime, timedelta, timezone
from functools import wraps
import logging
from logging.handlers import RotatingFileHandler
import sys
import base64
from flask import g
from pymysql import err
from werkzeug.exceptions import BadRequest
sys.path.append('/home/deep4558/Desktop/SPE_Major/SPE_kidneyDetection/')
from cnnClassifier.utils.common import decodeImage
from cnnClassifier.pipeline.prediction import PredictionPipeline


app = Flask(__name__)


# MySQL configurations
app.config['MYSQL_HOST'] = 'localhost'  
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PORT'] = 3306
app.config['MYSQL_PASSWORD'] = 'Deepa@1997'
app.config['MYSQL_DB'] = 'kidney'

app.config['SECRET_KEY'] = 'kidney'


# Initialize MySQL
mysql = MySQL(app)


CORS(app, resources={r"/*": {"origins": "*"}})

# Set up the handler to append to a single log file
handler = logging.FileHandler('app.log')
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
handler.setFormatter(formatter)

# Configure application logger
app.logger.addHandler(handler)
app.logger.setLevel(logging.INFO)



class ClientApp:
        def __init__(self):
            self.filename = "inputImage.jpg"
            self.classifier = PredictionPipeline(self.filename)

@app.before_request
def handle_options():
    if request.method == 'OPTIONS':
        response = app.make_response()
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type,Authorization")
        response.headers.add("Access-Control-Allow-Methods", "GET,POST,OPTIONS")
        return response


def token_required(role=None):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            token = request.headers.get('Authorization')
            if not token:
                return jsonify({'message': 'Token is missing!'}), 403
            try:
            
                data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
                
                if role and data['role'] != role:
                    return jsonify({'message': 'Access denied: Incorrect role'}), 403
            except Exception as e:
                return jsonify({'message': 'An error occurred verifying the token', 'error': str(e)}), 500

            
            return f(*args, **kwargs)
        return decorated_function
    return decorator



@app.route('/register-user', methods=['POST'])
def register_user():
    try:
        app.logger.info("User Registration Page Accessed")
        user_data = request.json

        if not all(key in user_data for key in ['name', 'age', 'sex', 'email', 'password']):
            raise BadRequest('Missing required user information')

        name = user_data.get('name')
        age = user_data.get('age')
        sex = user_data.get('sex')
        email = user_data.get('email')
        password = user_data.get('password')

        cur = mysql.connection.cursor()
        cur.execute("INSERT INTO user (name, age, sex, email, password, role) VALUES (%s, %s, %s, %s, %s, 'user')", (name, age, sex, email, password))
        mysql.connection.commit()
        

        app.logger.info("User registered successfully")
        return jsonify({'message': 'User registered successfully'}), 201

    except BadRequest as e:
        app.logger.error(f"Registration failed: {e.description}")
        return jsonify({'error': e.description}), 400
    except Exception as e:
        app.logger.error(f"An unexpected error occurred: {str(e)}")
        return jsonify({'error': 'An internal error occurred, please try again later.'}), 500
    finally:
        cur.close()



@app.route('/login', methods=['POST'])
def login():
    from flask import jsonify
    import jwt
    from datetime import datetime, timedelta, timezone

    login_data = request.json
    email = login_data.get('email')
    password = login_data.get('password')

    try:
        cur = mysql.connection.cursor()
        cur.execute("SELECT id, name, 'user' as role FROM user WHERE email = %s AND password = %s UNION SELECT id, name, 'doctor' as role FROM doctor WHERE email = %s AND password = %s", (email, password, email, password))
        account = cur.fetchone()
        cur.close()

        if account:
            account_id, account_name, role = account

            cur = mysql.connection.cursor()
            cur.execute("SELECT token FROM user_tokens WHERE user_id = %s AND role = %s", (account_id, role))
            if cur.fetchone():
                cur.close()
                return jsonify({'message': 'Already logged in'}), 401

            secret_key = 'kidney'
            token = jwt.encode({
                'user_id': account_id,
                'role': role,
                'exp': datetime.now(timezone.utc) + timedelta(hours=1)
            }, secret_key, algorithm='HS256')

            cur.execute("INSERT INTO user_tokens (user_id, token, role) VALUES (%s, %s, %s)", (account_id, token, role))
            mysql.connection.commit()
            cur.close()

            return jsonify({'role': role, 'userId': account_id, 'userName': account_name, 'token': token, 'message': f'{role.capitalize()} logged in successfully'}), 200
        else:
            return jsonify({'error': 'Invalid credentials'}), 401

    except Exception as e:
        app.logger.error(f"Error during login: {e}")
        return jsonify({'error': str(e)}), 500


@app.route('/upload', methods=['POST'])
@token_required(role='user')
def upload_image():

    app.logger.info("Image trying to Upload")
    # Check if a file was uploaded
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']

    # Check if the file is empty
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    # Get user ID from request
    user_id = request.form['user_id']

    # Save the file to the database
    cur = mysql.connection.cursor()
    cur.execute("INSERT INTO prediction_data (user_id, image) VALUES (%s, %s)", (user_id, file.read()))
    mysql.connection.commit()
    cur.close()

    app.logger.info("Image uploaded successfully")
    return jsonify({'message': 'Image uploaded successfully'}), 201
    
@app.route('/user/<int:user_id>', methods=['GET'])
@token_required(role='user')
def get_user(user_id):
    try:
        app.logger.info("Trying to fetch User Details")
        cur = mysql.connection.cursor()
        cur.execute("SELECT id, name, age, sex, email FROM user WHERE id = %s", (user_id,))
        user = cur.fetchone()
        if user:
            user_details = {
                'id': user[0],
                'name': user[1],
                'age': user[2],
                'sex': user[3],
                'email': user[4]
            }
            app.logger.info("User Details fetched successfully")
            return jsonify(user_details)
        else:
            app.logger.info("User not found")
            return jsonify({'error': 'User not found'}), 404
    except Exception as e:
        app.logger.info("Error in fetching User Details")
        return jsonify({'error': str(e)}), 500
    finally:
        cur.close()

@app.route('/save_model_prediction/<int:user_id>', methods=['POST'])
@token_required(role='user')
def save_prediction(user_id):
    prediction = request.json['prediction']
    
    cursor = mysql.connection.cursor()

    try:
        
        cursor.execute('SELECT * FROM prediction_data WHERE user_id = %s AND prediction IS NULL', (user_id,))
        result = cursor.fetchone()

        
        if result:
            cursor.execute('UPDATE prediction_data SET prediction = %s WHERE user_id = %s AND prediction IS NULL', (prediction, user_id))
            mysql.connection.commit()  
            message = 'Prediction updated successfully'
        else:
            message = 'No NULL prediction to update'  
    except Exception as e:
        mysql.connection.rollback()  
        message = f'An error occurred: {str(e)}'
    finally:
        cursor.close()

    return jsonify({'status': 'success', 'message': message}), 200

@app.route('/get-doctor-suggestions/<int:user_id>', methods=['GET'])
@token_required(role='user')
def get_doctor_suggestions(user_id):
    cursor = mysql.connection.cursor()
    sql_query = """
    SELECT id, prediction, doctor_prediction, image
    FROM prediction_data
    WHERE user_id = %s AND doctor_prediction IS NOT NULL
    """
    cursor.execute(sql_query, (user_id,))
    results = cursor.fetchall()
    
    suggestions = []
    for row in results:
        image_data = row[3]  
        if image_data:
            base64_image = base64.b64encode(image_data).decode('utf-8') 
        else:
            base64_image = None
        suggestions.append({
            'id': row[0],
            'prediction': row[1],
            'doctor_prediction': row[2],
            'image': base64_image
        })

    cursor.close()
    return jsonify(suggestions)


@app.route('/logout', methods=['POST'])
def logout():
    data = request.get_json() 
    app.logger.info("Trying to logout") 
    token = data.get('token') 
    cur = mysql.connection.cursor()
    cur.execute("DELETE FROM user_tokens WHERE token = %s", (token,))
    mysql.connection.commit()
    app.logger.info("Logged out successfully")
    cur.close()
    return jsonify({'message': 'Logged out successfully'}),200


@app.route('/prediction_data', methods=['GET'])
@token_required(role='doctor')
def get_prediction_data():
    try:
        app.logger.info("Trying to fetch model prediction data")
        cur = mysql.connection.cursor()

        
        cur.execute("SELECT pd.id, pd.user_id, u.name FROM prediction_data pd INNER JOIN user u ON pd.user_id = u.id")
        prediction_data = cur.fetchall()
        
        
        user_data = []
        for row in prediction_data:
            user_id = row[1]
            user_name = row[2]
            user_data.append({'id': row[0], 'user_id': user_id, 'username': user_name})
        
        cur.close()
        app.logger.info("Model Prediction Fetched successfully")
        return jsonify(user_data)
    except Exception as e:
        app.logger.info("Error in fetching model prediction")
        return jsonify({'error': str(e)}), 500

@app.route('/case/<int:case_id>', methods=['GET'])
@token_required(role='doctor')
def get_case(case_id):
    try:
        app.logger.info("Fetching case details of patient")
        cur = mysql.connection.cursor()
        cur.execute("SELECT id,user_id,prediction,doctor_prediction,image FROM prediction_data WHERE id = %s", (case_id,))
        user = cur.fetchone()
        print(user)
        if user:
            case_details = {
                'id': user[0],
                'user_id': user[1],
                'prediction': user[2],
                'doctor_prediction':user[3],
                
               
            }
            print(case_details)
            app.logger.info("Case Details fetched successfully")
            return jsonify(case_details)
        
    except Exception as e:
        app.logger.info("Error in fetching Patient Details")
        return jsonify({'error': str(e)}), 500
    finally:
        cur.close()


@app.route('/save_doctor_prediction/<int:case_id>', methods=['POST'])
@token_required(role='doctor')
def save_doctor_prediction(case_id):
    try:
        app.logger.info("Fetching Doctor Prediction")
        
        doctor_prediction = request.json.get('doctorPrediction')

        cursor = mysql.connection.cursor()

    
        update_query = "UPDATE prediction_data SET doctor_prediction = %s WHERE id = %s"
        cursor.execute(update_query, (doctor_prediction, case_id))

        mysql.connection.commit()
        
        cursor.close()
        
        app.logger.info("Doctor Prediction saved successfully")
        return jsonify({'message': 'Doctor prediction saved successfully'})
    except Exception as e:
        app.logger.info("Error inn saving doctor prediction")
        return jsonify({'error': str(e)}), 500


@app.route('/image/<int:case_id>', methods=['GET'])
@token_required(role='doctor')
def get_image(case_id):
    try:
        app.logger.info("Fetching User Uploaded Image")
        cur = mysql.connection.cursor()
        cur.execute("SELECT image FROM prediction_data WHERE id = %s", (case_id,))
        image_data = cur.fetchone()
        
        if image_data:
            
            headers = {'Content-Type': 'image/jpeg'}
            
            app.logger.info("Image fetched successfully")
            return Response(image_data[0], headers=headers)
        else:
            return jsonify({'error': 'Image not found'}), 404
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        cur.close()


@app.route('/api-endpoint', methods=['GET'])
def handle_request():
    app.logger.info("Received request from frontend")
    return jsonify({"message": "Success"})



@app.route("/predict", methods=['POST'])
@token_required(role='user')
def predictRoute():
    app.logger.info("Prediction requested")
    image = request.json['image']
    decodeImage(image, clApp.filename)
    result = clApp.classifier.predict()
    app.logger.info(f"Prediction completed: {result}")
    return jsonify(result)




if __name__ == "__main__":
    clApp = ClientApp()

    app.run(host='0.0.0.0', port=5000)
