--------------------------------------------------------------------------------


1/  2 
Rešenja drugog kolokvijuma iz  
Operativnih sistema 2, decembar 2017. 
1. (10 poena)  
var forks : array 0..4 of semaphore = 1; 
 
task type Philosopher(i:int) 
  var left, right, first, second : 0..4; 
begin 
  left := i; right := (i+1) mod 5; 
  if left<right then 
    begin first:=left; second:=right end 
  else 
    begin first:=right; second:=left end; 
  loop 
    think; 
    forks[first].wait; 
    forks[second].wait; 
    eat; 
    forks[first].signal; 
    forks[second].signal; 
  end; 
end; 
2. (10 poena)  
uint64* getVictim () { 
  while (clockHand) { 
    uint16* pCnt = ((uint16*)clockHand) + 3; 
    if (*pCnt == 0) // Found the victim! 
      return clockHand-1; 
    (*pCnt)--; // Decrement the counter 
    // Move the clock hand to the next: 
    uint64 next = *clockHand; 
    next |= ~(uint64)0xffffffUL; 
    clockHand = (uint64*)next; 
  }   
  return 0; // No pages or another exception 
} 
3. (10 poena) 
a)(2) 
0  
1 A06000, A08000 
2 A0C000 
3  
4  
b)(4) 
0 A07000 
1 A08000 
2 A0C000 
3  
4  
c)(4) 

2/  2 
0 A07000 
1  
2  
3 A08000 
4  