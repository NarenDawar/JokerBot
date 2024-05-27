import random

print("Enter a number between 1 and 10! ")
b= random.randint(1,10)
c=0

while c<5:
    d= int(input("Enter here: "))
    c += 1
    if d > b:
        print("Your guess is too high")
    elif d<b:
        print("Your guess it too low")
    else:
        break

if d == b:
    print("You guessed the number!")
else:
    print("You didnt guess the number. The number was " + str(b))

    


