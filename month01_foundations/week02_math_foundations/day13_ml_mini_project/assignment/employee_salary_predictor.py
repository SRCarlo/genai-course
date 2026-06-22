def predict_salary(experience):
    
    return experience * 10000

def get_experience_level(experience):
    
    if experience < 3:
        return "Junior"
    
    elif experience < 7:
        return "Mid"
    
    else:
        return "Senior"
    
print("_____________ Employee Salary Predictor _____________")

experience = float(
    input("Years of Experience: ")
)

salary = predict_salary(experience)

level = get_experience_level(experience)

print(f"""
      Experience: {experience} Years
      Experience Level: {level}
      Predicted Salary: ₹{salary}
      """)