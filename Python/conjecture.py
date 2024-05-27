# for any odd number >= 7
from math import sqrt
import timeit
 
# Function to check if a number is
# prime or not
def isPrime(n: int) -> bool:
    if n < 2:
        return False
 
    for i in range(2, int(sqrt(n)) + 1):
        if n % i == 0:
            return False
 
    return True
 
# Representing n as p + (2 * q) to satisfy
# lemoine's conjecture

def lemoine(n: int) -> None:
    counter = 0
 
    # Declaring a map to hold pairs (p, q)
    pr = dict()
 
    # Finding various values of p for each q
    # to satisfy n = p + (2 * q)
    for q in range(1, n // 2 + 1):
        p = n - 2 * q
 
        # After finding a pair that satisfies the
        # equation, check if both p and q are
        # prime or not
        if isPrime(p) and isPrime(q):
 
            # If both p and q are prime, store
            # them in the map
            if p not in pr:
                pr[p] = q
                counter += 1
 
    # Displaying all pairs (p, q) that satisfy
    # lemoine's conjecture for the number 'n'
    for it in pr:
        print("%d = %d + (2 * %d)" % (n, it, pr[it]))
    print("Counter: " + str(counter))
 
# Driver Code
if __name__ == "__main__":
    n = 201
    print(n, "can be expressed as ")
 
    # Function calling
    start = timeit.default_timer()

    lemoine(n)

    stop = timeit.default_timer()

    print('Time: ', stop - start)