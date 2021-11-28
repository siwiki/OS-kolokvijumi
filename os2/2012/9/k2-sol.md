2012/nadoknada%20-%20septembar/SI, IR Kolokvijum 2 - Septembar 2013 - Resenja.pdf
--------------------------------------------------------------------------------
deadlock

1. Sekvenca: P2.request(R3), P1.request(R1), P2.request(R2), P3.request(R3), P2.release(R3), P1.request(R2). 
2. Proces P3 će dobiti resurs R3 kada proces P2 oslobodi resurs R2. 

\begin{figure}[H]
  \centering
  \includesvg{images/os2/2012-k2-graf}
  \caption{Graf iz stavke pod a}
\end{figure}

--------------------------------------------------------------------------------
memory
```cpp
PageNo PageClocl::removeVictim () { 
  if (hand==0) return -1; // No pages 
  while (hand->ref) { 
    hand->ref=0; hand=hand->next; 
  } 
  PageDescr* victim = hand; 
  PageNo pg = victim->page; 
  if (hand->next==hand) hand=0; 
  else hand=hand->next; 
  victim->remove(); 
  delete victim; 
  return pg; 
} 
```

--------------------------------------------------------------------------------
memory
```cpp
int pgLoad(MMFSegment* mmf, PageNo pg, void* frame) { 
  if (mmf==0 || pg<mmf->pgLow || pg>pgHigh) return -1; // Exception! 
  unsigned int offset = (pg - mmf->pgLow)*PAGEGSIZE; 
  return fread(mmf->fh,frame,offset,PAGESIZE); 
} 
```
