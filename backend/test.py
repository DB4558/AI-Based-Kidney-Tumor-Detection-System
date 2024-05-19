import unittest
from flask import json
from app import app  ,mysql
from flask import Flask, request, jsonify, Response
from flask_cors import CORS
from flask_mysqldb import MySQLdb






class APITestCase(unittest.TestCase):
    def setUp(self):
        app.config['TESTING'] = True
        app.config['WTF_CSRF_ENABLED'] = False  
        self.client = app.test_client() 
        mysql.init_app(app) 

    def test_register_user(self):
            """Test user registration."""
            try:
                with self.client:
                    response = self.client.post('/register-user', json={
                        'name': 'Gopal Sanket',
                        'age': 30,
                        'sex': 'Male',
                        'email': '4558@example.com',
                        'password': '1234'
                    })
                    data = json.loads(response.data)
                    self.assertEqual(response.status_code, 201)
                    self.assertIn('User registered successfully', data['message'])
            except MySQLdb.OperationalError as e:
                if e.args[0] == 2006:
                    print("Ignoring MySQL server has gone away error")
                else:
                    raise  
            except Exception as e:


if __name__ == "__main__":
    unittest.main()

                raise e
