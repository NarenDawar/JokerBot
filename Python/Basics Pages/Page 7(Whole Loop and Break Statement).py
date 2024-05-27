total = 0
j = 1
while j < 6:
    total += j
    j += 1
print(total)

given_list = [6,4,2,1,-2,-5]

total2 = 0
p = 0
while given_list[p] > 0:
    total2 += given_list[p]
    p += 1
print(total2)

given_list2 = [6,4,2,1]

total3 = 0
q = 0
while q < len(given_list2) and given_list2[q] > 0: #must us 'and' if all values already satisfy the while loop
    total3 += given_list2[q]
    q += 1
print(total3)

given_list3 = [7,5,4,2,1,0,-3,-6,-7]
total4 = 0
for element in given_list3:
    if element <= 0:
        break #breaks if the next number is less than zero. List will look like [7,5,4,2,1,0] and add up all those values
    total4 += element #(0 + 19)
print(total4)

given_list3 = [7,5,4,2,1,0,-3,-6,-7] #HW
total5 = 0
for i in given_list3:
    if i < 0:
        total5 += i
print(total5)
    
