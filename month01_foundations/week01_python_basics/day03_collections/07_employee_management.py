# Mini Project(Employee Management System)

employees = []

def add_employee(name, role):
    employee={
        "name": name,
        "role": role
    }
    
    employees.append(employee)

add_employee("Shubham Raut", "AI Engineer")
add_employee("Shubhuu", "Full Stack Developer")

print(employees)