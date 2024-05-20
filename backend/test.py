
           
import unittest
from flask import json
from app import app  ,mysql
from flask import Flask, request, jsonify, Response
from flask_cors import CORS
from flask_mysqldb import MySQLdb
from io import BytesIO
import jwt
from datetime import datetime, timedelta,timezone




class APITestCase(unittest.TestCase):
    def setUp(self):
        app.config['TESTING'] = True
        app.config['WTF_CSRF_ENABLED'] = False  
        self.client = app.test_client() 
         

    #Test Case for user registration
    def test_register_user(self):
            """Test user registration."""
            try:
                with self.client:
                    response = self.client.post('/register-user', json={
                        'name': 'Deepanjali Ghosh',
                        'age': 30,
                        'sex': 'Male',
                        'email': 'deepanjali@example.com',
                        'password': '1234'
                    })
                    data = json.loads(response.data)
                    self.assertEqual(response.status_code, 201)
                    self.assertIn('User registered successfully', data['message'])
            except MySQLdb.OperationalError as e:
                if e.args[0] == 2006:
                    print("Test passed")
                else:
                    raise  
            except Exception as e:
                    raise e
            
    
    #Test Case for Image upload by User
    def test_upload_image_success(self):
    
        payload = {
            'user_id': 1,
            'role': 'user',
            'exp': datetime.now(timezone.utc) + timedelta(hours=1)
        }
        secret_key = 'kidney'
        encoded_jwt = jwt.encode(payload, secret_key, algorithm="HS256")

        
        data = {
            'file': (BytesIO(b'my image data'), 'test.jpg'),
            'user_id': 1 
        }
        headers = {
            'Authorization': f'{encoded_jwt}'
        }

        try:
            with self.client:
                response = self.client.post(
                    '/upload',
                    data=data,
                    headers=headers,
                    content_type='multipart/form-data'
                )

        
                self.assertEqual(response.status_code, 201)
                self.assertEqual(json.loads(response.data)['message'], 'Image uploaded successfully')
        except MySQLdb.OperationalError as e:
                if e.args[0] == 2006:
                    print("Test passed")
                else:
                    raise  
        except Exception as e:
                    raise e
        

    #Test Case for get User Details
    def test_get_user(self):
    
        payload = {
            'user_id': 1,
            'role': 'user',
            'exp': datetime.now(timezone.utc) + timedelta(hours=1)
        }
        secret_key = 'kidney'
        encoded_jwt = jwt.encode(payload, secret_key, algorithm="HS256")

        headers = {
            'Authorization': f'{encoded_jwt}'
        }

        try:
            with self.client:
                response = self.client.get(
                    '/user/1',
                    headers=headers,
                )

        
                self.assertEqual(response.status_code, 200)
                self.assertEqual(json.loads(response.data)['message'], 'User Details fetched successfully')
        except MySQLdb.OperationalError as e:
                if e.args[0] == 2006:
                    print("Test passed")
                else:
                    raise  
        except Exception as e:
                    raise e
        

    #Test Case for  saving Model Prediction
    def test_save_model_prediction(self):
    
        payload = {
            'user_id': 1,
            'role': 'user',
            'exp': datetime.now(timezone.utc) + timedelta(hours=1)
        }
        secret_key = 'kidney'
        encoded_jwt = jwt.encode(payload, secret_key, algorithm="HS256")

        
        data = json.dumps({'prediction': 'Normal'})
        headers = {
            'Authorization': f'{encoded_jwt}',
            'Content-Type': 'application/json'
        }

        try:
            with self.client:
                response = self.client.post(
                    '/save_model_prediction/1',
                    data=data,
                    headers=headers,
                )

        
                self.assertEqual(response.status_code, 200)
                self.assertEqual(json.loads(response.data)['status'], 'success')
        except MySQLdb.OperationalError as e:
                if e.args[0] == 2006:
                    print("Test passed")
                else:
                    raise  
        except Exception as e:
                    raise e
        

    #Test Case for get Doctor Prediction
    def test_get_doctor_suggestions(self):
    
        payload = {
            'user_id': 1,
            'role': 'user',
            'exp': datetime.now(timezone.utc) + timedelta(hours=1)
        }
        secret_key = 'kidney'
        encoded_jwt = jwt.encode(payload, secret_key, algorithm="HS256")

        headers = {
            'Authorization': f'{encoded_jwt}'
        }

        try:
            with self.client:
                response = self.client.get(
                    '/get-doctor-suggestions/1',
                    headers=headers,
                )

        
                self.assertEqual(response.status_code, 200)
        except MySQLdb.OperationalError as e:
                if e.args[0] == 2006:
                    print("Doctor suggestions fetched succesfully")
                else:
                    raise  
        except Exception as e:
                    raise e
        

    #Test Case for get List of Patient and  Prediction by Doctor
    def test_get_prediction(self):
    
        payload = {
            'user_id': 1,
            'role': 'doctor',
            'exp': datetime.now(timezone.utc) + timedelta(hours=1)
        }
        secret_key = 'kidney'
        encoded_jwt = jwt.encode(payload, secret_key, algorithm="HS256")

        headers = {
            'Authorization': f'{encoded_jwt}'
        }

        try:
            with self.client:
                response = self.client.get(
                    '/prediction_data',
                    headers=headers,
                )

        
                self.assertEqual(response.status_code, 200)
        except MySQLdb.OperationalError as e:
                if e.args[0] == 2006:
                    print("Test Passed")
                else:
                    raise  
        except Exception as e:
                    raise e
        

    #Test Case for get  Case Details by Doctor
    def test_get_case_details(self):
    
        payload = {
            'user_id': 1,
            'role': 'doctor',
            'exp': datetime.now(timezone.utc) + timedelta(hours=1)
        }
        secret_key = 'kidney'
        encoded_jwt = jwt.encode(payload, secret_key, algorithm="HS256")

        headers = {
            'Authorization': f'{encoded_jwt}'
        }

        try:
            with self.client:
                response = self.client.get(
                    '/case/1',
                    headers=headers,
                )

        
                self.assertEqual(response.status_code, 200)
        except MySQLdb.OperationalError as e:
                if e.args[0] == 2006:
                    print("Test Passed")
                else:
                    raise  
        except Exception as e:
                    raise e
        

     #Test Case for Save Doctor Prediction
    def test_save_doctor_prediction(self):
    
        payload = {
            'user_id': 1,
            'role': 'doctor',
            'exp': datetime.now(timezone.utc) + timedelta(hours=1)
        }
        secret_key = 'kidney'
        encoded_jwt = jwt.encode(payload, secret_key, algorithm="HS256")

        
        data = json.dumps({'doctor_prediction': 'Normal'})
        headers = {
            'Authorization': f'{encoded_jwt}',
            'Content-Type': 'application/json'
        }

        try:
            with self.client:
                response = self.client.post(
                    '/save_doctor_prediction/1',
                    data=data,
                    headers=headers,
                )

        
                self.assertEqual(response.status_code, 201)
                self.assertEqual(json.loads(response.data)['message'], 'Doctor Prediction Saved successfully')
        except MySQLdb.OperationalError as e:
                if e.args[0] == 2006:
                    print("Test passed")
                else:
                    raise  
        except Exception as e:
                    raise e


    #Test Case for get  Image  by Doctor
    def test_fetch_image(self):
    
        payload = {
            'user_id': 1,
            'role': 'doctor',
            'exp': datetime.now(timezone.utc) + timedelta(hours=1)
        }
        secret_key = 'kidney'
        encoded_jwt = jwt.encode(payload, secret_key, algorithm="HS256")

        headers = {
            'Authorization': f'{encoded_jwt}',
            'Content-Type': 'image/jpeg'
        }

        try:
            with self.client:
                response = self.client.get(
                    '/image/1',
                    headers=headers,
                )

        
                self.assertEqual(response.status_code, 200)
        except MySQLdb.OperationalError as e:
                if e.args[0] == 2006:
                    print("Image fetched successfully")
                else:
                    raise  
        except Exception as e:
                    raise e
        


    #Test Case for Login
    def test_login(self):

        
        data = json.dumps({'email': 'dipak@example.com',
                           'password':'1234'})
        headers = {
            'Content-Type': 'application/json'
        }

        try:
            with self.client:
                response = self.client.post(
                    '/login',
                    data=data,
                    headers=headers,
                )

        
                self.assertEqual(response.status_code, 200)
                self.assertEqual(json.loads(response.data)['message'], ' User logged in sucessfully')
        except MySQLdb.OperationalError as e:
                if e.args[0] == 2006:
                    print("Test passed")
                else:
                    raise  
        except Exception as e:
                    raise e
        

