# Login System

username = "admin"
password = "1234"

user = input("Username: ")
pwd = input("Password: ")

if user == username and pwd == password:
    print("Login Successful")
else:
    print("Invalid Credentials")