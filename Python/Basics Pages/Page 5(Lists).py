a = [3,10,5] #these square brakcets represent a list
print(a)
a.append(2) #this adds the number/item in the parenthesis into the list, "a" is the name of the list, that is why it is put before the period.
print(a)
a.append("what's up")
a.append([1,2,3])
a.pop() #removes the last value that was inputted into the list, pop means to remove
a[0] #in this, the 0 represnts the INDEX. In this list, the number 3 has the index of 0. The order of the index in the list is [0,1,2,3,etc.]
print(a[0])
a[0] = 100 #this replaces the content that is in the 0 index with whatever you put after the equal sign
print(a)
# you can do this instead, IT IS MUCH EASIER
a[2],a[3] = a[3],a[2] #this switches the values of the content in index 2 and 3. The order you put them in matters on the right side of the equal sign
print(a) #prints the new modified list


