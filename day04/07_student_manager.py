
# Student Manager

students = []

def add_student(name, age):
    student = {
        "name": name,
        "age" : age
    }
    
    students.append(student)
    
def show_students():
    for student in students:
        print(student)
        
add_student("Shubham",24)
add_student("Aniket",24)

show_students()