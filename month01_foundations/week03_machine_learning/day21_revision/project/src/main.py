while True:

    print("\n__________________ MINI ML TOOLKIT_________________\n")
    print("1. Student Score Prediction")
    print("2. Student Pass Prediction")
    print("3. Customer Segmentation")
    print("4. Evaluation Metrics")
    print("5. Exit")

    choice = input("Enter Choice : ")

    if choice == "1":
        exec(open("regression.py").read())

    elif choice == "2":
        exec(open("classification.py").read())

    elif choice == "3":
        exec(open("clustering.py").read())

    elif choice == "4":
        exec(open("evaluation.py").read())

    elif choice == "5":
        print("Thank You")
        break

    else:
        print("Invalid Choice")