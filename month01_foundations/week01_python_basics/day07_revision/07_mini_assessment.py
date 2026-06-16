name = input("Enter Name: ")
age = int(input("Enter Age: "))

skills = []

for i in range(3):
    skill = input("Enter Skill: ")
    
    skills.append(skill)
    
if age >= 18:
    status = "Eligible"
else:
    status = "Not Eligible"
    
print("\n___________________ Report ___________________")

print("Name:", name)
print("Age:", age)
print("Status:" ,status)

for skill in skills:
    print("Skill:", skill)