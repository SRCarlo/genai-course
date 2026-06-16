# AI Access Control System

print("__________________ AI Access Conmtrol Sysyem __________________")

# Taking User Inputs
name = input("Enter Your Name: ")
age = int(input("Enter Your Age: "))
subscription = input("Enter Subscription Type (premium/basic): ").lower()

# Validate Subscription
if subscription not in ["premium", "basic"]:
    print("Invalid Subscription Type")

# Access Rules
elif age >= 18 and subscription == "premium":
    print("\nAccess Granted")
    print(f"Welcome Premium User, {name}!")

else:
    print("\nAccess Denied")
    print("Premium subscription required and age must be 18+")