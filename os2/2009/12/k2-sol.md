2009/decembar/SI Kolokvijum 2 - Decembar 2009 - Resenja.doc
--------------------------------------------------------------------------------
memory
```cpp
int FramePool::getFrame (PID proc, PgID page, FID& frame) { 
  if (head==0) return -1; // No free frames 
  // Try to find the same one to reuse: 
  int found = 0; 
  for (FPElem* cur=head; cur!=0; cur=cur->next) 
    if (cur->proc==proc && cur->page==page) {     
      found = 1; break; // Found the same! 
    } 
  if (found==0) cur=head; // Take the first one 
  frame=cur->frame; 
  // Now remove the FPElem: 
  if (cur->prev) cur->prev->next=cur->next; 
  else head=cur->next; 
  if (cur->next) cur->next->prev=cur->prev; 
  else tail=cur->prev; 
  delete cur; 
  return ret; 
} 
```

--------------------------------------------------------------------------------
buddy
64, 512, 8, 16, 128, 64, 256 

--------------------------------------------------------------------------------
disk
```cpp
DiskOpReq* DiskQueue::getReq () { 
  if (nextToServe==0) return 0; // Queue empty 
  DiskOpReq* cur = nextToServe; 
  nextToServe = nextToServe->next; 
  // Remove the pending request: 
  if (cur->prev) cur->prev->next=cur->next; 
  else head=cur->next; 
  if (cur->next) cur->next->prev=cur->prev; 
  else tail=cur->prev; 
  i  f (nextToServe==0) nextToServe=head; 
  return cur; 
} 
 
void DiskQueue::addReq (DiskOpReq* req) { 
  if (req==0) return; // Error 
  if (head==0) { // Queue empty 
    nextToServe=head=tail=req; 
    return; 
  }   
  // Insert the request to keep the list sorted 
  for (DiskOpReq* cur=head; cur!=0; cur=cur->next) { 
    if (cur->cyl<=req->cyl) continue; 
    if (cur->prev) { 
      req->prev = cur->prev; 
      req->next = cur; 
      req->prev->next=req; 
      req->next->prev = req; 
    } else { 
      // Add to the head: 
      req->prev = 0; 
      req->next = cur; 
      head=req; 
      req->next->prev = req; 
    } 
    return; 
  }   
  // Add to the tail: 
  req->prev = tail; 
  req->next = 0; 
  req->prev->next=req; 
  tail = req; 
} 
```

--------------------------------------------------------------------------------
syscall
1. Deljenjem stranica. Stranice sa kodom i podacima kernela preslikavaju se u fiksni deo virtuelnog  adresnog  prostora  svakog  procesa  (npr.  najniži deo)   , a okviri sa tim sadržajem se dele između procesa. Ovo obezbeđuje sam kernel prilikom kreiranja procesa. 
2. ```cpp
   typedef int (*SYS_CALL)(void*); 
   SYS_CALL sys_call_table[...]; // Table of pointers to sys call functions 
   const unsigned int SYS_CALL_TABLE_SIZE = ...; 
   
   int sys_call (unsigned int id, void* params) { 
     if (id>=SYS_CALL_TABLE_SIZE) return -1; // Error 
     return sys_call_table[id](params); 
   } 
```
