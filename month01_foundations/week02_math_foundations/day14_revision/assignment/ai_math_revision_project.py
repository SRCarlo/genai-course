"""
Day 14 Assignment : Student Performance Analyzer

Concepts Used:
    1. Statistics
    2. Probability
    3. Machine Learning Logic
    4. User Input Handling

"""


print("__________________________STUDENT PERFORMANCE ANALYZER__________________________\n")


# Input Section
study_hours = float(input("Enter Study Hours: "))
attendance = float(input("Enter Attendance Percentage: "))
practice_hours = float(input("Enter Practice Hours: "))

# Score Calculation
score = ( study_hours * 10 + attendance + practice_hours * 5)

# Success Probability
success_probability = min(score / 200, 1)

# Grade Calculation
if score >= 180:
    grade = "A"
elif score >= 140:
    grade = "B"
elif score >= 100:
    grade = "C"
else:
    grade = "D"

# Output
print("___________________________RESULT_________________________\n")


print(f"Performance Score : {score:.2f}")
print(f"Success Probability : {success_probability:.2%}")
print(f"Grade : {grade}")

print("\nAnalysis")

if grade == "A":
    print("Excellent Performance")
elif grade == "B":
    print("Good Performance")
elif grade == "C":
    print("Average Performance")
else:
    print("Needs Improvement")

print("_________________________________________________________")