2014/decembar/SI, IR Kolokvijum 2 - Decembar 2014 - Resenja.pdf
--------------------------------------------------------------------------------
deadlock

\begin{figure}[H]
\centering
\subfloat[Rešenje prve stavke]{\includesvg[width=0.45\textwidth]{images/os2/2014/k2-graf-a}}
\subfloat[Rešenje druge stavke]{\includesvg[width=0.45\textwidth]{images/os2/2014/k2-graf-b}}
\end{figure}

--------------------------------------------------------------------------------
memory
```cpp
int findBestCandidate (PCB* pcb, unsigned int modifyBit) { 
  unsigned int initClockHand = pcb->clockHand; 
  do { 
    if (refmod(pcb->clockHand) & modmask == modifyBit) { 
      if (refmod(pcb->clockHand) & refmask == 0) // If reference bit clear, 
        return 1; // this is the best candidate. 
      else // Reset the reference bit and give it a second chance: 
        refmod(pcb->clockHand) &= ~refmask; 
    } 
    pcb->clockHand = next(pcb->clockHand); // Move clockHand to the next 
  } while (pcb->clockHand!=initClockHand); 
  return 0; // Not found 
} 
```

--------------------------------------------------------------------------------
slab
```cpp
int slab_free_slot (Cache* cache, void* slot_) { 
  if (slot_==0 || cache==0) return -1; // Exception 
  Slot* slot = (Slot*)slot_; 
  Slab* slab = (Slab*)page_align(slot_); 
  if (++slab->freeSlots==N) { 
    // Slab totally free, deallocate it: 
    if (slab->prev) slab->prev->next = slab->next; 
    else cache->head = slab->next; 
    if (slab->next) slab->next->prev = slab->prev; 
    else cache->tail = slab->prev; 
    free(slab); 
  } else { 
    // Slab still not totally free, deallocate the slot only: 
    slot->prev = slab->tail; 
    slot->next = 0; 
    slab->tail = slot; 
    if (slab->head==0) slab->head = slot; 
  } 
  return 1; 
} 
```
