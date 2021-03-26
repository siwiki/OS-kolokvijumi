2019/jun/SI, IR Kolokvijum 2 - Jun 2019 - Resenja.pdf
--------------------------------------------------------------------------------
semaphore
```cpp
const int N = ...;
struct sem_t;
sem_t* semaphores[N];

void initSems () {
  semaphores[0] = sem_create(1);
  for (int i=1; i<N; i++)
    semaphores[i] = sem_create(0);
}

void threadBody (void* ps) {
  sem_t** psem = (sem_t**)ps;
  sem_wait(*psem++);
  process();
  if (psem < semaphores+N)
    sem_signal(*psem);
}

int main () {
  initSems();
  for (int i=0; i<N; i++)
    thread_create(threadBody,semaphores+i);
}
```

--------------------------------------------------------------------------------
cont
```cpp
int shrink (PCB* pcb, size_t by) {
  if (pcb==0 || by>=pcb->size) return -1; // Exception
  if (by==0) return 0; // Nothing to do
  pcb->size -= by;
  mem_free(pcb->base+pcb->size,by);
  FreeMem* above = (FreeMem*)(pcb->base+pcb->size);
  FreeMem* under = above->prev;
  if (under && ((char*)under+under->size == pcb->base)
    relocate(pcb,under);
  return 0;
}
```
--------------------------------------------------------------------------------
page
1. VA(32): Page1(9):Page2(10):Offset(13).
2. Ovaj proces adresira sledeće stranice:
   - jednu stranicu segmenta za kod, za dohvatanje instrukcija programa
   - samo jednu stranicu iz segmenta za stek, jer je to dovoljno za samo jedan poziv potprograma `main` bez automatskih objekata na steku (argumenata i lokalnih varijabli)
   - po 2 stranice za svaki niz `src` i `dst`, jer svaki niz sadrži $0x1000=2^{12}$ elemenata po 4 bajta, odnosno $2^{14}$ bajtova, što je 2 stranice po $2^{13}$ bajtova.
   
   Sve ukupno, proces adresira 6 stranica. Kako svaka od njih ostaje u memoriji nakon prvog
adresiranja i učitavanja, i pošto je procesu dodeljeno dovoljno okvira, ovaj proces će
generisati isto toliki broj (6) straničnih grešaka.
3. U memoriju će biti najpre učitana stranica segmenta za kod, stranica segmenta za stek, i
po jedna stranica segmenta za podatke, tj. prva i treća stranica tog segmenta, u kojima se
nalaze prve polovine nizova `src` i `dst`, tim redom. Kada proces bude adresirao prvi element
druge polovine niza `src`, za tu stranicu (drugu u segmentu za podatke) neće biti mesta, pa će
biti izbačena najdavnije učitana stranica, a to je stranica segmenta za kod.
