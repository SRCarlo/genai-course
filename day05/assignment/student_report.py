# Student Report Generator

students = [
    {
        "name": "Nobita",
        "marks": 98
    },
    {
        "name": "Shizuka",
        "marks": 99
    },
    {
        "name": "Ninja",
        "marks": 96
    },
    {
        "name": "Ninji",
        "marks": 95
    }
]

print("_____________________ Student Report _______________________")

# Show all Students
print("\nStudent Lists:")

for student in students:
    print(
        student["name"],
        "-",
        student["marks"]
    )

# Calculate total marks
total_marks = 0

for student in students:
    total_marks += student["marks"]
    
print("\nTotal Marks:",total_marks)

# Calculate average marks
average_marks = total_marks / len(students)

print("\nAverage Marks:", average_marks)

# Find topper 
topper = students[0]

for student in students:
    if student["marks"] > topper["marks"]:
        topper = student

print(
    "\nTopper:",
    topper["name"],
    "-",
    topper["marks"]
)

# Bonus: Display ranking
print("\n___________ Ranking ___________\n")

ranked_student = sorted(
    students,
    key=lambda student: student["marks"],
    reverse=True
)

for rank, student in enumerate(
    ranked_student,
    start=1
):
    print(
        f"{rank}. {student['name']} - {student['marks']}"
    )