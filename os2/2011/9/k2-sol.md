2011/nadoknada - septembar/SI, IR Kolokvijum 2 - Septembar 2012 - Resenja.pdf
--------------------------------------------------------------------------------
allocator
```cpp
int  allocate (int pid, int rid) { 
  if (pid>=numOfProcesses || rid>=numOfResources) return 0; // Exception! 
  if (resourceAlloc[pid][rid]) return 1; // Already allocated to this proc. 
  // Is this resource free? 
  for (unsigned i=0; i<numOfProcesses; i++) 
    if (resourceAlloc[i][rid]) return 0; // The resource is occupied 
  // Deadlock prevention: 
  for (i=0; i<rid; i++) 
    if (resourceAlloc[pid][i]) return 0; // Cannot allocate 
  // The resource can be allocated: 
  resourceAlloc[pid][rid] = 1; 
  return 1; 
} 
```

--------------------------------------------------------------------------------
memory
1: BCh, 2: ECh, 3: BCh, 4: 54h. Biće izbačena stranica 4. 

--------------------------------------------------------------------------------
thrashing
```cpp
unsigned long workingSetSize (PCB* pcb) { 
  static const unsigned int mask = ~(~0U>>1); // 100...0b 
  if (pcb==0) return -1; // Exception! 
  unsigned long size = 0; 
  for (unsigned long int i=0; i<NumOfPages; i++) 
    size += ((pcb->pmt[i] & mask)!=0); 
  return size; 
} 
```
