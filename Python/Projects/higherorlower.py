import random

print("This game is higher or lower. You will be given a number and must decide whether its higher or lower than the hidden number")

a = random.randint(1,10)
b= random.randint(1,10)

print(a)

input("Is this number higher (H) or lower (L)? : ")

if a>b and input == 'H':
    print("Correct!")
elif a>b and input == 'L':
    print("Incorrect!")
elif a<b and input == 'H':
    print("Incorrect!")
elif a<b and input == 'L':
    print("Correct!")
else:
    print("You guessed the number!")


