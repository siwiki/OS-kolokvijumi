2009/maj/SI Kolokvijum 2 - Maj 2009 - Resenja.doc
--------------------------------------------------------------------------------
semaphore

```cpp
void Semaphore::wait () {
  lock();
  if (setjmp(Thread::runningThread->context)==0) {
    if (--val<0)
      blocked.put(Thread::runningThread);
    else
      Scheduler::put(Thread::runningThread);
    Thread::runningThread = Scheduler::get();
    longjmp(Thread::runningThread->context,1);
  }
  unlock();
}

void Semaphore::signal () {
  lock();
  if (val++<0)
    Scheduler::put(blocked.get());
  if (setjmp(Thread::runningThread->context)==0) {
    Scheduler::put(Thread::runningThread);
    Thread::runningThread = Scheduler::get();
    longjmp(Thread::runningThread->context,1);
  }
  unlock();
}
```
Pomoćne operacije `block()` i `unblock()` više nisu potrebne (izbacuju se). Ostatak definicije klase `Semaphore` ostaje isti.

--------------------------------------------------------------------------------
concurrency

Ili proizvoljno mnogo procesa tipa *A* u svojim kritičnim sekcijama i ni jedan
proces tipa *B* u svojoj, ili samo jedan proces tipa *B* i ni jedan proces tipa *A*.

Semafor `mutex` služi da obezbedi međusobno isključenje pristupa deljenoj promeljivoj `count` od
strane uporednih procesa tipa *A*. Promenjliva `count` je brojač procesa tipa *A* koji su ušli u svoju
kritičnu sekciju. Kada prvi ovakav proces ulazi u svoju kritičnu sekciju, izvršiće `wait` na semaforu
`gate` i ili proći taj semafor (i zatvoriti ga), ili se blokirati na njemu. U prvom slučaju, svi naredni
procesi tipa *A* slobodno ulaze u svoju kritičnu sekciju. U drugom slučaju, svi naredni procesi tipa *A*
koji žele da uđu u svoju kritičnu sekciju će se blokirati na semaforu `mutex`. Poslednji proces tipa *A* koji izlazi iz svoje kritične sekcije izvršiće `signal` na semaforu `gate`. Kako samo jedan proces može proći operaciju `wait` na semaforu `gate` bez blokiranja, to znači da će ili prvi proces tipa *A* ili samo jedan proces tipa *B* to moći da uradi i tako uđe u svoju kritičnu sekciju. Odatle sledi dati odgovor.

--------------------------------------------------------------------------------
dynload
```cpp
static void* module_p = NULL;

int f (int x, int y) {
  if (module_p == NULL) module_p = load_module(“p.obj”);
  int (*_f)(int,int) = (int(*)(int,int))(module_p[0]);
  if (module_p!=NULL && _f != NULL) return _f(x,y);
}

double g (double x) {
  if (module_p == NULL) module_p = load_module(“p.obj”);
  double (*_g)(double) = (double(*)(double))(module_p[1]);
  if (module_p!=NULL && _g != NULL) return _g(x);
}
```
--------------------------------------------------------------------------------
page

1. Virtuelni adresni prostor: $4GB = 2^{2}\times 2^{30}B = 2^{32}B$, pa je virtuelna adresa širine 32 bita.
Fizički adresni prostor: $1GB = 2^{30}B$, pa je fizička adresa širine 30 bita.
Veličina stranice i okvira: $16KB = 2^{4}\times 2^{10}B = 2^{14}B$, pa je širina polja za pomeraj unutar stranice i okvira 14 bita.
Odatle sledi da je širina polja unutar virtuelne adrese za broj stranice 32-14 = 18 bita, širina polja za broj okvira unutar fizičke adrese 30-14 = 16 bita, a širina deskriptora (ulaza u PMT drugog nivoa) isto toliko – 16 bita, odnosno 2 bajta.
Stranica prvog nivoa ima $2K = 2^{11}$ ulaza, pa je širina polja za indeksiranje PMT prvog nivoa 11 bita, a za indeksiranje PMT drugog nivoa 18-11 = 7 bita.
Prema tome, struktura virtuelne adrese je: Page_L1(11):Page_L2(7):Offset(14).
2. Ulaz u PMT prvog nivoa sadrži adresu početka PMT drugog nivoa u fizičkoj memoriji, s tim da vrednost 0 može da označava nekorišćeni ospeg stranica (invalidan ulaz), pošto se ni PMT drugog nivoa ne može smestiti počev od adrese 0. Prema tome, širina ulaza u PMT prvog nivoa je najmanje jednaka širini fizičke adrese, što je 30 bita. Drugim rečima, jedan ulaz u PMT prvog nivoa zauzima 4 bajta.
3. PMT prvog nivoa zauzima 2K ulaza po 4 bajta, dakle 8KB.
Jedan ulaz u PMT drugog nivoa sadrži broj okvira, koji je širine 16 bita, pa zauzima 2 bajta.
PMT drugog nivoa ima 27 = 128 ulaza, pa zauzima 256B.
Prema tome, PMT ukupno zauzimaju maksimalno:
$4\times 2^{11}B$ (veličina PMT prvog nivoa) + $2^{11}$ (broj PMT drugog nivoa) $\times  2^{8}B$ (veličina PMT drugog nivoa) $= 2^{13}B + 2^{19}B$, što iznosi 520KB.
4. Dati proces ima validna samo prvih sedam i poslednji ulaz u PMT prvog nivoa, dakle za njega postoje samo osam PMT drugog nivoa u memoriji. Ukupna veličina PMT za ovaj proces je zato:
$4\times 2^{11}B$ (veličina PMT prvog nivoa) $+ 8$ (broj PMT drugog nivoa) $\times  2^{8}B$ (veličina PMT drugog nivoa) $= 8\times 2^{10}B + 2\times 2^{10}B = 10KB$.


--------------------------------------------------------------------------------
cont

1. \begin{tabular}{|l|l|l|l|l|l|}
\hline
Proces & A & D & E & F & G \\
\hline
Adresa početka ($\times 2^{10}$) & 0 & 45 & 106 & 61 & 66 \\
\hline
\end{tabular}

2. Broj slobodnih fragmenata je 2.

   Ukupna veličina slobodne memorije je 21 KB.

   Veličina najvećeg slobodnog fragmenta je 15 KB.

   Veličina najmanjeg slobodnog fragmenta je 6 KB.
