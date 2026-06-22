import csv

hours = []

scores = []

with open(
    "data/student_data.csv",
    "r"
) as file:
    
    reader = csv.DictReader(file)
    
    for row in reader:
        
        hours.append(
            int(row["hours"])
        )
        
        scores.append(
            int(row["score"])
        )
        
print(hours)
print(scores)