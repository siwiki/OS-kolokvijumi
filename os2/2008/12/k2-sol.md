--------------------------------------------------------------------------------


1/  2 
Rešenja drugog kolokvijuma iz  
Operativnih sistema 2 
Decembar 2008. 
1. (10 poena) 
int get_victim_frame() { 
  while (1) { 
    int fm = get_clock_frame(); 
    page_descr* pd = get_owner_page(fm); 
    if (*pd & 1) {  // if referenced, 
      *pd &= ~1;  // reset reference bit  
      move_clock_hand();  // and give it a new chance 
    } 
    else return fm;   
  }   
} 
2. (10 poena) 
class Cache { 
public: 
  Cache (size_t slotSize); 
   
  Slot* allocateSlot (); 
  void  freeSlot(Slot*); 
 
private: 
  Slab *head; 
  int numOfSlots; 
  size_t slotSize 
}; 
 
Cache::Cache (size_t slotSz) { 
  slotSize = slotSz; 
  numOfSlots = getOptimalNumOfSlotsInSlab(slotSize); 
  head = Slab::create(numOfSlots,slotSize); 
  if (head) head->setNext(0); 
} 
 
Slot*  Cache::allocateSlot () { 
  for (Slab* cur=head; cur!=0; cur=cur->getNext()) { 
    Slot* newSlot = cur->allocateSlot(); 
    if (newSlot) return newSlot; 
  }   
  Slab* newSlab = Slab::create(numOfSlots,slotSize); 
  if (newSlab==0) return 0; // No more memory! 
  newSlab->setNext(head); 
  head=newSlab; 
  return newSlab->allocateSlot(); 
} 
 
void Cache::freeSlot (Slot* st) { 
  Slab* sb = st->getOwnerSlab(); 
  if (sb) sb->freeSlot(st); 
} 
3. (10 poena) 

2/  2 
Kod RAID4 bit parnosti se uvek smešta na jedan isti, određeni disk. Svaki zahtev za upisom 
podataka na disk zahteva pristup do diska sa podacima, kao i do diska sa bitima parnosti koje 
treba ažurirati prilikom svake izmene podataka. Zbog toga taj disk sa bitima parnosti postaje 
usko  grlo,  pošto  se  na  njemu  gomilaju  zahtevi  za  upis  (ostali  zahtevi  za  upis  na  diskove  sa  
podacima bi se inače mogli paralelizovati). RAID5 ovaj problem rešava tako što su blokovi sa 
bitima parnosti ciklično raspoređeni po svim diskovima, pa ni jedan nije posebno usko grlo. 
4. (10 poena) 
Kopiranje fajla  Sistemska biblioteka ili program 
Kreiranje/otvaranje fajla Sistemski poziv  
Čitanje iz/upis u fajl Sistemski poziv  
Ispis niza znakova na uređaj Sistemski poziv  
Ispisivanje sadržaja txt fajla 
na standardni izlaz 
 Sistemska biblioteka ili program 
 