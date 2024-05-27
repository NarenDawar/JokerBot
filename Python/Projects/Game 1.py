import turtle
wn = turtle.Screen()
wn.title('Pong')
wn.bgcolor("black")
wn.setup(width=800, height=600)
wn.tracer(0)

#main loop
while True:
    wn.update()

    
#paddle 1
paddle_a = turtle.Turtle()
paddle_a.speed(0)
paddle_a.shape("square")
paddle_a.color("white")
paddle_a.shapsize(strecth_wid=5, stretch_len=1)
paddle_a.penup()
paddle_a.goto(-350,0)
