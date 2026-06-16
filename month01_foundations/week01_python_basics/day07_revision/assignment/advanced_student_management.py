# This project combines:  Variables, Functions, Loops, Conditions, Lists, Dictionary, Input

students = [] 

def add_student():
    
    name = input("Student Name: ")
    age = int(input("Student Age: "))
    course = input("Course: ")
    
    student = {
        "name":name,
        "age":age,
        "course":course
    }
    
    students.append(student)
    print("Student Added!")
    
def show_students():
    
    if len(students) == 0:
        print("No Students Found")
        return
    
    for student in students:
        print(
            f""" 
                 Name: {student['name']}
                 Age:{student['age']}
                 Course:{student['course']}
             """
        )
        
while True:
    
    print("\n_________________ Menu _________________")
    
    print("1. Add Student")
    print("2. Show Students")
    print("3. Exit")
    
    choice = input("Choice: ")
    
    if choice == "1":
        add_student()
        
    elif choice == "2":
        show_students()
        
    elif choice == "3":
        print("Goodbye")
        break
    
    else:
        print("Invalid Choice")