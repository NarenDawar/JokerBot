list = [1,2,3,4,5]

for n in list:
    if n==3:
        print('Found it!')
        continue
    print(n)

list2 = [1,2,3,4,5,6]
for n in list2:
    for let in 'abc':
        print(n,let)

for i in range(5):
    print(i)


x=0

while x<10:
   if x == 5:
       break
print(x)
x+= 1
