import numpy as np
import time
from operator import add

def primesfrom2to(n):
    # https://stackoverflow.com/questions/2068372/fastest-way-to-list-all-primes-below-n-in-python/3035188#3035188
    """ Input n>=6, Returns a array of primes, 2 <= p < n """
    sieve = np.ones(n/3 + (n%6==2), dtype=np.bool)
    sieve[0] = False
    for i in xrange(int(n**0.5)/3+1):
        if sieve[i]:
            k=3*i+1|1
            sieve[      ((k*k)/3)      ::2*k] = False
            sieve[(k*k+4*k-2*k*(i&1))/3::2*k] = False
    return np.r_[2,3,((3*np.nonzero(sieve)[0]+1)|1)]

def cartesian_add(arr1, arr2):
    arr1_e = np.repeat(np.expand_dims(arr1, 1), arr2.size, axis=1)
    arr2_e = np.repeat(np.expand_dims(arr2,  0), arr1.size, axis=0)
    return arr1_e + arr2_e

def main():
    start_time = time.time()
    list1 = primesfrom2to(1000000)
    list2 = 2 * list1
    list4 = np.arange(7,3000000,2)
    list4 = np.setdiff1d(list4,np.unique(cartesian_add(list1, list2)))
    print(list4)    
    print("--- %s seconds ---" % (time.time() - start_time))
  
main()