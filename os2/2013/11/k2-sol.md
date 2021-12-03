2013/novembar/SI, IR Kolokvijum 2 - Novembar 2013 - Resenja.pdf
--------------------------------------------------------------------------------
allocator
```cpp
int getHolder (unsigned int rid) { 
  for (unsigned int i=0; i<numOfProc; i++) 
    if (resourceAlloc[i][rid]==-1) return i; 
  return -1; // Free 
} 
 
int getWaitedResource (unsigned int pid) { 
  for (unsigned int i=0; i<numOfRes; i++) 
    if (resourceAlloc[pid][i]==1) return i; 
  return -1; // Not waiting 
} 
 
int wouldMakeDeadlock (unsigned int pid, unsigned int rid) { 
  if (pid>=numOfProc || rid>=numOfRes) return -1; // Exception! 
  int p = pid, r = rid; 
  while (1) { 
    p = getHolder(r); 
    if (p==-1) return 0; // No deadlock 
    if (p==pid) return 1; // Deadlock 
    r = getWaitedResource(p); 
    if (r==-1) return 0; // No deadlock 
  } 
} 
```

--------------------------------------------------------------------------------
memory
```cpp
#define next(x) pcb->pagefifo[x] 
 
unsigned int getVictimPage(PCB* pcb) { 
  if (pcb==0) return -1; // Exception! 
  unsigned int victim = -1; 
  if (findBestCandidate(pcb,0)) { 
    victim = pcb->clockHand; 
    pcb->clockHand = next(victim); 
    return victim; 
  } 
  if (findBestCandidate(pcb,1)) { 
    victim = pcb->clockHand; 
    pcb->clockHand = next(victim); 
    return victim; 
  } 
  if (findBestCandidate(pcb,0)) { 
    victim = pcb->clockHand; 
    pcb->clockHand = next(victim); 
    return victim; 
  } 
  if (findBestCandidate(pcb,1)) { 
    victim = pcb->clockHand; 
    pcb->clockHand = next(victim); 
    return victim; 
  } 
  // Should never fall through here: 
  return -1; 
} 
```

--------------------------------------------------------------------------------
buddy

- Inicijalno: F256 
- Nakon A1: A1, F1, F2, F4, F8, F16, F32, F64, F128 
- Nakon A16: A1, F1, F2, F4, F8, A16, F32, F64, F128 
- Nakon A64: A1, F1, F2, F4, F8, A16, F32, A64, F128 
- Nakon A16: A1, F1, F2, F4, F8, A16, A16, F16, A64, F128 
- Nakon A64: A1, F1, F2, F4, F8, A16, A16, F16, A64, A64, F64 
- Nakon F1: F16, A16, A16, F16, A64, A64, F64 
