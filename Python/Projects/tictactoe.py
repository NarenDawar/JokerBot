board = [' ' for x in range(10)]

def InsertLetter(letter,pos):
    board[pos] = letter

def spaceIsFree(pos):
    return board[pos] == ' '
    

def PrintBoard(board):
    print('   |   |')
    print(' ' + board[1] + '  |  ' + board[2] + '  |  ' + board[3])
    print('   |   |')
    print('--------------')
    print('   |   |')
    print(' ' + board[4] + '  |  ' + board[5] + '  |  ' + board[6])
    print('   |   |')
    print('--------------')
    print('   |   |')
    print(' ' + board[7] + '  |  ' + board[8] + '  |  ' + board[9])
    print('   |   |')




def isWinner(bo, le):
    return(bo[7] == le and bo[8] == le and bo[9] == le) or (bo[4] == le and bo[5] == le and bo[6] == le) or (bo[1] == le and bo[2] == le and bo[3] == le) or (bo[1] == le and bo[4] == le and bo[7] == le) or (bo[2] == le and bo[5] == le and bo[9] == le) or (bo[3] == le and bo[6] == le and bo[6] == le) or (bo[1] == le and bo[5] == le and bo[9] == le) or (bo[3] == le and bo[5] == le and bo[7] == le)
    

def playerMove():
    pass

def compMove():
    pass

def selectRandom(board):
    pass

def isBoardFull(board):
    pass

def main():
    pass

main()
