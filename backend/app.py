from flask import Flask,request, jsonify,send_file,Response
from flask_cors import CORS
from flask_mysqldb import MySQL
app = Flask(__name__)

# MySQL configurations
app.config['MYSQL_HOST'] = 'localhost'  # Assuming MySQL is running locally
app.config['MYSQL_USER'] = 'ketki'
app.config['MYSQL_PASSWORD'] = 'india123@K'
app.config['MYSQL_DB'] = 'speProject'

# Initialize MySQL
mysql = MySQL(app)
CORS(app)


@app.route('/register-user', methods=['POST'])
def register_user():
    # Get user data from request
    user_data = request.json

    # Extract user information
    name = user_data.get('name')
    age = user_data.get('age')
    sex = user_data.get('sex')
    email = user_data.get('email')
    password = user_data.get('password')

    # Validate user data (optional)

    # Insert user into database
    cur = mysql.connection.cursor()
    cur.execute("INSERT INTO user (name, age, sex, email, password) VALUES (%s, %s, %s, %s, %s)", (name, age, sex, email, password))
    mysql.connection.commit()
    cur.close()

    # Return success message
    return jsonify({'message': 'User registered successfully'}), 201


@app.route('/register-doctor', methods=['POST'])
def register_doctor():
    # Get doctor data from request
    doctor_data = request.json

    # Extract doctor information
    name = doctor_data.get('name')
    qualification = doctor_data.get('qualification')
    email = doctor_data.get('email')
    password = doctor_data.get('password')

    # Validate doctor data (optional)

    # Insert doctor into database
    cur = mysql.connection.cursor()
    cur.execute("INSERT INTO doctor (name, qualification, email, password) VALUES (%s, %s, %s, %s)", (name, qualification, email, password))
    mysql.connection.commit()
    cur.close()

    # Return success message
    return jsonify({'message': 'Doctor registered successfully'}), 201


@app.route('/login', methods=['POST'])
def login():
    # Get login credentials from request
    login_data = request.json

    # Extract login information
    email = login_data.get('email')
    password = login_data.get('password')

    # Check if the user is a regular user
    user_cursor = mysql.connection.cursor()
    user_cursor.execute("SELECT id, name FROM user WHERE email = %s AND password = %s", (email, password))
    user = user_cursor.fetchone()
    user_cursor.close()

    # Check if the user is a doctor
    doctor_cursor = mysql.connection.cursor()
    doctor_cursor.execute("SELECT id, name FROM doctor WHERE email = %s AND password = %s", (email, password))
    doctor = doctor_cursor.fetchone()
    doctor_cursor.close()
    
    if user:
        user_id, user_name = user
        # Return user role, user ID, user name, and redirect URL
        return jsonify({'role': 'user', 'userId': user_id, 'userName': user_name, 'redirect_url': '/user/patient_home', 'message': 'User logged in successfully'}), 200
    elif doctor:
        doctor_id, doctor_name = doctor
        # Return doctor role, doctor ID, doctor name, and redirect URL
        return jsonify({'role': 'doctor', 'userId': doctor_id, 'userName': doctor_name, 'redirect_url': '/doctor/doctor_home', 'message': 'Doctor logged in successfully'}), 200
    else:
        # Return error message if login credentials are invalid
        return jsonify({'error': 'Invalid credentials'}), 401
 

@app.route('/upload', methods=['POST'])
def upload_image():
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

    return jsonify({'message': 'Image uploaded successfully'}), 201
    
@app.route('/user/<int:user_id>', methods=['GET'])
def get_user(user_id):
    try:
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
            return jsonify(user_details)
        else:
            return jsonify({'error': 'User not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        cur.close()

@app.route('/prediction_data', methods=['GET'])
def get_prediction_data():
    try:
        cur = mysql.connection.cursor()

        # Fetch user IDs and names from the prediction_data table
        cur.execute("SELECT pd.id, pd.user_id, u.name FROM prediction_data pd INNER JOIN user u ON pd.user_id = u.id")
        prediction_data = cur.fetchall()
        
        # Construct a list of dictionaries containing id, user_id, and username
        user_data = []
        for row in prediction_data:
            user_id = row[1]
            user_name = row[2]
            user_data.append({'id': row[0], 'user_id': user_id, 'username': user_name})
        
        cur.close()
        return jsonify(user_data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/case/<int:case_id>', methods=['GET'])
def get_case(case_id):
    try:
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
            return jsonify(case_details)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        cur.close()


@app.route('/save_doctor_prediction/<int:case_id>', methods=['POST'])
def save_doctor_prediction(case_id):
    try:
        # Get doctor prediction from request body
        doctor_prediction = request.json.get('doctorPrediction')

        cursor = mysql.connection.cursor()

        # Update the record in the database with the new doctor prediction
        update_query = "UPDATE prediction_data SET doctor_prediction = %s WHERE id = %s"
        cursor.execute(update_query, (doctor_prediction, case_id))

        mysql.connection.commit()
        # Close cursor and connection
        cursor.close()
        

        return jsonify({'message': 'Doctor prediction saved successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/image/<int:case_id>', methods=['GET'])
def get_image(case_id):
    try:
        cur = mysql.connection.cursor()
        cur.execute("SELECT image FROM prediction_data WHERE id = %s", (case_id,))
        image_data = cur.fetchone()
        
        if image_data:
            # Set the content type header to indicate that the response contains an image
            headers = {'Content-Type': 'image/jpeg'}
            # Return the image data as a response with the appropriate headers
            return Response(image_data[0], headers=headers)
        else:
            return jsonify({'error': 'Image not found'}), 404
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        cur.close()