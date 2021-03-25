2011/septembar/SI, IR Kolokvijum 1 - Septembar 2011 - Resenja.doc
--------------------------------------------------------------------------------


1/  2 
Rešenja zadataka za nadoknadu prvog kolokvijuma 
iz Operativnih sistema 1  
Septembar 2011. 
1. (10 poena) 
const REG ESC = 0; 
 
void main () { 
  *io1Ctrl = 1; 
  *io2Ctrl = 1; 
 
  while (1) { 
    while (*io1Status==0); 
    REG data = *io1Data; 
  if (data==ESC) break; 
    while (*io2Status==0); 
    *io2Data = data; 
  }   
 
  *io1Ctrl = 0; 
  *io2Ctrl = 0; 
} 
2. (10 poena) 
Virtuelna adresa 222 FF32 4002D8 FE3A FE14 
Rezultat adresiranja 000023 PF MAV T CDD026 
3. (10 poena) 
interrupt void yield () { 
  if (setjmp(Thread::running->context)==0) { 
 
    if (!Thread::running->isBlocked) Scheduler::put(Thread::running); 
    Thread::running = Scheduler::get(); 
    Thread::running->isBlocked = 0; 
 
    longjmp(Thread::running->context,1); 
 
  }   
} 

2/  2 
4. (10 poena) 
int visit (Node* node) { 
  if (node==0) return; 
 
  Node* ln = node->getLeftChild(); 
  Node* rn = node->getRightChild(); 
  if (rn) { 
    if (fork()==0) { 
      visit(rn); 
      exit(); 
      // it is assumed that exit() kills only this thread, 
      // not the entire process (all threads) 
    } 
  }   
 
  node->visit(); 
 
  if (ln) visit(ln); 