# VARIABLE SCOPE
    # Scope controls where variables can be used.
    
# Global Variable

name = "Shubham"

def show():
    print(name)
    
show()


# Local Variable

# def show():
#     city = "Nagpur"

# print(city)

# Error: NameError


# Exa 

compnay = "OpenAI"

def employee():
    name = "Shubham"
    
    print(name)
    print(compnay)
    
employee()