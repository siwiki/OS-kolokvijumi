--------------------------------------------------------------------------------


1/1 
Rešenja drugog kolokvijuma iz  
Operativnih sistema 2, decembar 2015. 
1. (10 poena) 
int ResourceAllocator::release (int p, int r) { 
  if (p<0 || p>=np || r<0 || r>=nr) return -1; // Exception 
  if (alloc[p][r]!=acquired) return -2;// Resource not used by this process 
  alloc[p][r] = announced;  // Restore the announcement edge 
  for (int i=0; i<np; i++){ // See if other processes can now get resources 
    deblock[i]=0; 
    for (int j=0; i<nr; j++) 
      if ((alloc[i][j]==requested) && (request(i,j)==1)) 
        deblock[i]=1; 
  } 
  return 1; 
} 
2. (10 poena)  
unsigned int getVictimPage (PCB* pcb) { 
  if (pcb==0) return; // Exception! 
  while (1) { 
    if (pcb->pageCounters[pcb->clockHand]==0) return pcb->clockHand; 
    pcb->pageCounters[pcb->clockHand]--; 
    pcb->clockHand = pcb->pageFifo[pcb->clockHand]; 
  } 
} 
3. (10 poena) 
a)(5) 
n    Po
četne adrese (hex) slobodnih blokova veličine 2
n
n
 
4    - 
3    - 
2    A C0 00 
1    A A0 00 
0    - 
b)(5) 
n    Po
četne adrese (hex) slobodnih blokova veličine 2
n
n
 
4    - 
3    A 00 00 
2    A C0 00 
1    A A0 00 
0    - 
 