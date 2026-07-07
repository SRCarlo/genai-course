import subprocess

while True:

    print("\n_________________Student Performance Predictor______________________\n")

    print("1. Train Model")
    print("2. Predict Student")
    print("3. Exit")

    choice = input("\nEnter Choice : ")

    if choice == "1":
        subprocess.run(["python", "train.py"])

    elif choice == "2":
        subprocess.run(["python", "predict.py"])

    elif choice == "3":
        print("\nThank You!")
        break

    else:
        print("Invalid Choice")