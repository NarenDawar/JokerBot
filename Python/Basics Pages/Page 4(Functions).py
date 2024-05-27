def function1():
    print("What's up")
    print("How's it going V2")
    #This function is defined as a collection of code. This collection is these two print commands ^^
print("Outside the function")


#function1() #this calls the function
#function1 = function name
#() = value you want to plug in

def function2(x):
    return 2*x
a2 = function2(2) # this is subbing a functions definition to a variable, and then printing the variable
b2 = function2(3)
print(a2,b2) #this will print both values, (4,6)
# or you can simply do this:
print(function2(2)) #this prints the result of the equation, using the x you plugged in. In this case, 2, so the output will be 4



def function3(x, y):
    return x + y
print(function3(11,2)) 
# or 
a3 = function3(11,2) # subbing a variable for an entire value to make it quicker
print (a3) # this will print 13, since a3 = 11,12 and 11+2 = 13


def function4(x):
    print(x)
    print("Input value")
    return x*3
a4 = function4(4) #subbing for a variable

print(function4(4)) #The output of this will be both printed messages and the return value. It will look like this: (4, Input value, 12)

function4(4) #The output of this will only be the printed messages, not the return. It will look like: (4, Input value)

print(a4) #This will only print the return value. The result will look like this: (12)

#These are functions and there various applications. You can set the input to anything and still print whatever you want.
#EX: def function5(hello there), (the call command)function5(4), it will print 4 instead of "hello there".

#Colon represents the index. YOU MUST PUT A COLON AFTER A FUNCTION OR IF/ELSE STATEMENT AS SEEN ABOVE