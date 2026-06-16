# LOGICAL OPERATORS

# AND
    # Both must be true
age = 25
salary = 50000

if age > 18 and salary> 30000:
    print("Loan Approved")
    
# MENTAL MODEL:
        # True + True = True

        # False + True = False

# --------------------------------------------------
    
# OR 
    # One must be true
if age > 18 or salary > 30000:
    print("Approved")

# MENTAL MODEL:
    # True + False = True

    # False + False = False
    
#---------------------------------------------------

# NOT 
    #Reverse result
is_blocked = False

if not is_blocked:
    print("Access Granted")