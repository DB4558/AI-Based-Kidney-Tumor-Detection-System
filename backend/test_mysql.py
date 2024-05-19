import MySQLdb

try:
    connection = MySQLdb.connect(
        host='localhost',
        user='root',
        passwd='Deepa@1997',
        db='kidney'
    )
    print("Connection successful")
    cursor = connection.cursor()
    cursor.execute("SELECT DATABASE();")
    database = cursor.fetchone()
    print(f"Connected to database: {database}")
    cursor.close()
    connection.close()
except Exception as e:
    print(f"Error connecting to the database: {e}")
