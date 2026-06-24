'''
What is Data Collection?

AI learns from data.

        No Data = No AI
        
'''

import csv

with open("data/student_data.csv","r") as file:

    reader = csv.reader(file)

    for row in reader:
        print(row)