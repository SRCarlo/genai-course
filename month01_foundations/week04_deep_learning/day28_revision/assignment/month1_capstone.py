'''
# Month 1 Capstone Project
    Student Performance Predictor

 Predict whether a student will PASS or FAIL using Study Hours and Attendance

# Technologies:
    Python
    Pandas
    PyTorch
    Neural Network

'''



import os
import pandas as pd
import torch
import torch.nn as nn
import torch.optim as optim

# Create Dataset
def create_dataset():

    os.makedirs("project/data", exist_ok=True)

    data = {

        "study_hours": [
            1,2,3,4,5,
            6,7,8,9,10,
            2,3,5,7,9
        ],

        "attendance": [
            40,50,55,60,70,
            75,80,85,90,95,
            45,65,75,88,92
        ],

        "pass": [

            0,0,0,0,1,
            1,1,1,1,1,
            0,0,1,1,1

        ]

    }


    df = pd.DataFrame(data)


    df.to_csv(
        "project/data/student_data.csv",
        index=False
    )


    print("Dataset Created Successfully")




# Neural Network Model
class StudentModel(nn.Module):

    def __init__(self):

        super().__init__()


        self.network = nn.Sequential(

            nn.Linear(2,8),

            nn.ReLU(),


            nn.Linear(8,1),

            nn.Sigmoid()

        )


    def forward(self,x):

        return self.network(x)





# Training Function
def train_model():


    df = pd.read_csv(
        "project/data/student_data.csv"
    )


    X = df[
        [
            "study_hours",
            "attendance"
        ]

    ].values


    y = df["pass"].values



    X = torch.tensor(
        X,
        dtype=torch.float32
    )


    y = torch.tensor(
        y,
        dtype=torch.float32
    ).reshape(-1,1)



    model = StudentModel()



    loss_function = nn.BCELoss()


    optimizer = optim.Adam(

        model.parameters(),

        lr=0.01

    )



    epochs = 500



    print("\nTraining Started...\n")



    for epoch in range(epochs):


        prediction = model(X)


        loss = loss_function(

            prediction,

            y

        )


        optimizer.zero_grad()


        loss.backward()


        optimizer.step()



        if (epoch+1)%50==0:


            print(

                f"Epoch {epoch+1}/{epochs} "
                f"Loss : {loss.item():.4f}"

            )




    os.makedirs(

        "project/models",

        exist_ok=True

    )


    torch.save(

        model.state_dict(),

        "project/models/student_classifier.pth"

    )



    print("\nTraining Completed")

    print(
        "Model Saved Successfully"
    )




# Prediction Function

def predict_student():


    model = StudentModel()



    model.load_state_dict(

        torch.load(
            "project/models/student_classifier.pth"
        )

    )


    model.eval()



    study_hours = float(

        input(
            "Enter Study Hours : "
        )

    )


    attendance = float(

        input(
            "Enter Attendance Percentage : "
        )

    )



    sample = torch.tensor(

        [
            [
                study_hours,
                attendance
            ]
        ],

        dtype=torch.float32

    )



    with torch.no_grad():

        result = model(sample)



    probability = result.item()



    print(
        "\nPrediction Confidence:",
        round(probability,4)
    )



    if probability >=0.5:


        print(
            "Result : PASS"
        )


    else:


        print(
            "Result : FAIL"
        )




# Main Menu

def main():


    while True:


        print(
"""
 ______________________________Student Performance Predictor___________________________________

1. Create Dataset

2. Train Model

3. Predict Student

4. Exit

"""
        )


        choice=input(
            "Enter Choice : "
        )



        if choice=="1":

            create_dataset()



        elif choice=="2":

            train_model()



        elif choice=="3":

            predict_student()



        elif choice=="4":

            print(
                "Program Closed"
            )

            break



        else:

            print(
                "Invalid Choice"
            )



if __name__=="__main__":

    main()