2012/nadoknada%20-%20septembar/SI, IR Kolokvijum 2 - Septembar 2013 - Resenja.pdf
--------------------------------------------------------------------------------


1/1 
Rešenja drugog kolokvijuma iz  
Operativnih sistema 2, septembar 2013. 
1. (10 poena) a)(7) Sekvenca: P2.request(R3), P1.request(R1), P2.request(R2), 
P3.request(R3), P2.release(R3), P1.request(R2). 
P1
P2
P3
R1
R2
R3
 
b)(3) Proces P3 će dobiti resurs R3 kada proces P2 oslobodi resurs R2. 
2. (10 poena)  
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
3. (10 poena) 
int pgLoad(MMFSegment* mmf, PageNo pg, void* frame) { 
  if (mmf==0 || pg<mmf->pgLow || pg>pgHigh) return -1; // Exception! 
  unsigned int offset = (pg - mmf->pgLow)*PAGEGSIZE; 
  return fread(mmf->fh,frame,offset,PAGESIZE); 
} 