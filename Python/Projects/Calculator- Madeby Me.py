

def add(a,b):
    answer=a+b
    print(answer)

def subtract(a,b):
    answer=a-b
    print(answer)

def multiply(a,b):
    answer=a*b
    print(answer)

def divide(a,b):
    answer=a/b
    print(answer)

a=int(input("Enter your first number here: "))
b=int(input("Enter your second number here: "))
op=input("Enter an operator (+, -, *, or /): ")

if op=='+':
    add(a,b)
elif op=='-':
    subtract(a,b)
elif op=='*':
    multiply(a,b)
elif op=='/':
    divide(a,b)
else:
    print("Invalid operator")


