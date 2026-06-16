#  RETURN VALUES

# Bad Example

def add(a,b):
    print(a+b)

# Problem is Cannot reuse result.

# Correct Example

def addition(a, b):
    return a + b

# Used Corect that Exa is : 
result = addition(10,20)

print(f"Additon is :  {result}")


def multify(a,b):
    return a * b

answer = multify(5,6)
print(f"Multification is : {answer}")