2011/decembar/SI, IR Kolokvijum 2 - Novembar 2011 - Resenja.pdf
--------------------------------------------------------------------------------


1/1 
Rešenja drugog kolokvijuma iz  
Operativnih sistema 2 
Novembar 2011. 
1. (10 poena)  
a) b) c) 
P1
P2
P3
R1
R2
R3
 
P1
P2
P3
R1
R2
R3
 
P1
P2
P3
R1
R2
R3
 
2. (10 poena) 
unsigned int getVictimPage (PCB* pcb) { 
  static const unsigned long mask = ~(~0UL>>1); // 100...0b 
  if (pcb==0) return -1; // Exception! 
  while (pcb->pmt[pcb->clockHand] & mask) { 
    pcb->pmt[pcb->clockHand] &= ~mask; 
    pcb->clockHand = pcb->pagefifo[pcb->clockHand]; 
  } 
  unsigned int victim = pcb->clockHand; 
  pcb->clockHand = pcb->pagefifo[pcb->clockHand]; 
  return victim; 
} 
3. (10 poena) 
X* Cache::alloc() { 
  Slab* s=this->headSlab; 
  for (; s!=0; s=s->nextSlab)  // Find a slab with a free slot 
    if (s->freeSlot) break; 
  if (s==0) // No free slot. Allocate a new slab: 
    s = new Slab(this); 
  if (s==0 || s->freeSlot==0) return 0; // Exception: no free memory 
  X* ret = s->freeSlot; 
  s->freeSlot=*(X**)s->freeSlot; 
  return ret; 
} 