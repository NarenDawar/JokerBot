#name = input("Enter name here: ")
#print("Hello " + name)

list = ['0', '1', '2', '3']
list2 = ['one', 'two', 'three', 'four']
list.extend(list2) #adds a list to the original list
list[1]= '11' #changes a value in the specified index
list.append('new number') #adds new value to the end of the list
list.insert(5, 'one v2') #inserrts a value into the desired index, pushing all values to the right once to the right
print(list)

coordinates = [(3,5), (9,3), (5,2)]
print(coordinates)

def hello_function():
    print("Hello world!")

hello_function() #this prints it out in the terminal

def intro_func(name):
    print("Hello " + name)

intro_func('Lucas')