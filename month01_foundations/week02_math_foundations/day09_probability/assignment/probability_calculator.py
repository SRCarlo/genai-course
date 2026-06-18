# Day 9 Assignment
# Probability Calculator

print("\n__________________ Probability Calculator ________________")

print("\nChoose an Option:")
print("1. Coin Toss Probability")
print("2. Dice Probability")
print("3. Custom Event Probability")

choice = input("\nEnter your choice (1-3): ")

# Coin Toss Probability
if choice == "1":

    probability = 1 / 2

    print("\nCoin Toss Probability")
    print("Probability =", probability)
    print("Percentage =", probability * 100, "%")

# Dice Probability
elif choice == "2":

    print("\nProbability of getting a specific number on a dice")

    probability = 1 / 6

    print("Probability =", probability)
    print("Percentage =", round(probability * 100, 2), "%")

# Custom Event Probability
elif choice == "3":

    total_outcomes = int(
        input("Enter Total Outcomes: ")
    )

    favorable_outcomes = int(
        input("Enter Favorable Outcomes: ")
    )

    probability = (
        favorable_outcomes /
        total_outcomes
    )

    print("\nCustom Event Probability")
    print("Probability =", probability)
    print(
        "Percentage =",
        probability * 100,
        "%"
    )

else:

    print("Invalid Choice!")