a = ["banana", "apple", "pear"]
for poop in a: #for loop command
    print(poop)
    print(poop)

b = [3,6,9]
total = 3
for el in b:
    total = total + el
print(total)

c = list(range(3,10))
print(c)

total2 = 1
for l in range (1,6):
    total2 += l #this takes the sum of the range (15[1+2+3+4+5]) and adds the value of total2 (1) resulting in 16 (15+1)
print(total2)

total3 = 0
for p in range(1,10):
    if p % 3 == 0:
        total3 += p
print(total3)
#print(5 % 3) #% is a modulo operator. The number that it outputs is the reamainder of the digits provided being divided

total4 = 0
for f in range(1,100):
    if f % 3 ==0:
        total4 += f
    elif f % 5 ==0:
        total4 += f
print(total4) #finds numbers in between 1 and 100 that are divisible by 3 or 5 with a remainder of 0 and adds them all up (basically all multiples of 3 and 5 all summed up)
 

