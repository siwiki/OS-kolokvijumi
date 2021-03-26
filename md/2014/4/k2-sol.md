2014/april/SI, IR Kolokvijum 2 - April 2014 - Resenja.pdf
--------------------------------------------------------------------------------
semaphore
```cpp
int Semaphore::wait (int toBlock) {
  lock(lck);
  int ret = 0;
  if (!toBlock && val<=0)
    ret = -1;
  else
    if (--val<0) {
      ret = 1;
      block();
    }
  unlock(lck);
  return ret;
}
```

--------------------------------------------------------------------------------
cont
```cpp
int mem_alloc(void* addr, size_t size) {
  for (FreeMem* cur=fmem_head; cur!=0; cur=cur->next) {
    if (cur!=addr || cur->size<size) continue;
    // Found
    if (cur->size-size<=sizeof(FreeMem)) {
      // No remaining fragment
      if (cur->prev) cur->prev->next = cur->next;
      else fmem_head = cur->next;
      if (cur->next) cur->next->prev = cur->prev;
      return cur->size;
    else {
      FreeMem* newfrgm = (FreeMem*)((char*)cur+size);
      if (cur->prev) cur->prev->next = newfrgm;
      else fmem_head = newfrgm;
      if (cur->next) cur->next->prev = newfrgm;
      newfrgm->prev = cur->prev;
      newfrgm->next = cur->next;
      newfrgm->size = cur->size-size;
      return size;
    }
  }
  return -1;
}
```

--------------------------------------------------------------------------------
page
1. VA(60): Page1(16):Page2(16):Page3(16):Offset(12).

   PA(42): Frame(30):Offset(12).
2. Širina PMT3 je 30+2=32 bita. Ista je i širina PMT1 i PMT2. PMT1 ima $2^{16}$ ulaza širine 32 bita (4B), što je ukupno: $2^{18}$B=256KB.
3. Ovaj proces koristio je $2^{30}$ svojih najnižih adresa, što je $2^{30-12}=2^{18}$ stranica. Jedna PMT trećeg nivoa pokriva $2^{16}$ stranica, pa je ovaj proces alocirao PMT prvog nivoa, jednu PMT drugog nivoa i četiri PMT trećeg nivoa. Zato ukupna veličina PMT iznosi $6 \cdot 256$B=1,5MB.
