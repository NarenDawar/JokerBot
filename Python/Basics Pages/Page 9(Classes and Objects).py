class Robot:
   def  __init__(self, name, color, weight):
    self.name = name
    self.color = color
    self.weight = weight
#SPACING MATTERS!
   def introduce_self(self):
    print("My name is " + self.name)
#r1 = Robot()
#r1.name = "Roger"
#r1.color = "Red"
#r1.weight = 40
#r1.introduce_self()

#r2 = Robot()
#r2.name = "Tom"
#r2.color = "Blue"
#r2.weight = 38
#r2.introduce_self()

r1 = Robot("Roger", "red", 40)
r2 = Robot("Tom", "blue", 30)

r1.introduce_self()
r2.introduce_self()