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

#r1.introduce_self()
#r2.introduce_self()

class Person:
    def __init__(self ,n, p, i):
        self.name = n 
        self.personality = p 
        self.is_sitting = i
    def sit_down(self):
        self.is_sitting: True
    def stand_up(self):
        self.is_sitting: False
p1 = Person("Mark", 'aggresive', False)
p2 = Person("Andrew", "talkative", True)
p1.robot_owned = r2
p2.robot_owned = r1
p1.robot_owned.introduce_self()