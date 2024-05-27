class Robot:
    def __innit__(self, name, model):
        self.name = name
        self.model = model
    def introduction(self):
        print("Hello, I am " + self.name + ". My model number is " + self.model)

r1 = Robot("Robot One", 1)
r1.introduction()

