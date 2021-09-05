2010/drugi/SI Kolokvijum 2 - Maj 2010 - Resenja.doc
--------------------------------------------------------------------------------
semimpl
```cpp
void Semaphore::wait () {
  lock(lck);
  if (--val<0) {
    blocked.put(runningUserProcess);
    runningUserProcess = UserProcessScheduler::get();
  }
  unlock(lck);
}

void Semaphore::signal () {
  lock(lck);
  if (val++<0)
    UserProcessScheduler::put(blocked.get());
  unlock(lck);
}
```
Pomoćne operacije `block()` i `unblock()` više nisu potrebne (izbacuju se). Ostatak definicije klase `Semaphore` ostaje isti.

--------------------------------------------------------------------------------
semintr
```ada
shared var mutexA : semaphore:=N;
           mutexB, mutexC : semaphore:=1;

type P = process begin
  ...
  wait(mutexA);
    <critical section A>
    ...
    wait(mutexB);
      <critical section B>
    signal(mutexB);
    ...
    wait(mutexC);
      <critical section C>
    signal(mutexC);
    ...
  signal(mutexA);
  ...
end;
```

--------------------------------------------------------------------------------
overlay
1. Ne. Kada se iz pozivajućeg potprograma pozove onaj drugi, na isto mesto modula kome
pripada pozivajući potprogram se učitava modul u kome je pozvani potprogram. Kada se vrši
povratak iz tog pozvanog potprograma, ukoliko prevodilac generiše samo kod za jednostavni
indirektni skok preko adrese skinute sa steka, skok će biti na adresu unutar istog modula, a ne na
kod unutar pozivajućeg potprograma, jer je on u modulu koji je izbačen, što nije korekno.
Prema tome, potprogrami koji su u relaciji pozivalac-pozvani se mogu nalaziti ili u istom modulu,
ili u dva modula koji se ne preklapaju (ne učitavaju na isto mesto jedan preko drugog).
2. Obe konfiguracije su korektne, pošto je za sve grane zadovoljen uslov iz zaključka
prethodne tačke.

--------------------------------------------------------------------------------
page
1. Virtuelni adresni prostor: 4GB = $2^2 \cdot 2^{30}$B = $2^{32}$B, pa je virtuelna adresa širine 32 bita.

   Fizički adresni prostor: 4GB = $2^{32}$B, pa je fizička adresa širine 32 bita.

   Veličina stranice i okvira: 64KB = $2^6 \cdot 2^{10}$B = $2^{16}$B, pa je širina polja za pomeraj unutar stranice i okvira 16 bita.

   Odatle sledi da je širina polja unutar virtuelne adrese za broj stranice 32-16 = 16 bita, širina polja za
broj okvira unutar fizičke adrese 32-16 = 16 bita, a širina deskriptora (ulaza u PMT drugog nivoa)
isto toliko – 16 bita, odnosno 2 bajta.

   Stranica prvog nivoa ima 1K = $2^{10}$ ulaza, pa je širina polja za indeksiranje PMT prvog nivoa 10
bita, a za indeksiranje PMT drugog nivoa 16-10 = 6 bita.
Prema tome, struktura virtuelne adrese je: Page_L1(10):Page_L2(6):Offset(16).
2. Ulaz u PMT prvog nivoa sadrži adresu početka PMT drugog nivoa u fizičkoj memoriji, s
tim da vrednost 0 može da označava nekorišćeni opseg stranica (invalidan ulaz), pošto se ni PMT
drugog nivoa ne može smestiti počev od adrese 0. Prema tome, širina ulaza u PMT prvog nivoa je
najmanje jednaka širini fizičke adrese, što je 32 bita. Drugim rečima, jedan ulaz u PMT prvog nivoa
zauzima 4 bajta.
3. PMT prvog nivoa zauzima 1K ulaza po 4 bajta, dakle 4KB.

   Jedan ulaz u PMT drugog nivoa sadrži broj okvira, koji je širine 16 bita, pa zauzima 2 bajta.
PMT drugog nivoa ima $2^6$ = 64 ulaza, pa zauzima 128B.
Prema tome, PMT ukupno zauzimaju maksimalno: $4 \cdot 2^{10}$B (veličina PMT prvog nivoa) + $2^{10}$ (broj PMT drugog nivoa) $\cdot 2^7$B (veličina PMT drugog
nivoa) = $2^{12}$B + $2^{17}$B, što iznosi 132KB.
4. Dati proces ima validna samo prvih sedam i poslednji ulaz u PMT prvog nivoa, dakle za njega
postoje samo osam PMT drugog nivoa u memoriji. Ukupna veličina PMT za ovaj proces je zato: $4 \cdot 2^{10}$B (veličina PMT prvog nivoa) + 8 (broj PMT drugog nivoa) $\cdot 2^7$B (veličina PMT drugog nivoa) = $4 \cdot 2^{10}$B + $2^{10}$B =  5KB.

--------------------------------------------------------------------------------
cont
```cpp
void relocate(PCB* p, void* newPlace) {
  if (p==0) return; // Exception!
  if (newPlace==p->memLocation || p->memSize==0) return; // Nothing to do
  memcpy(newPlace,p->memLocation,p->memSize); // Move memory contents
  free(p->memLocation,p->memSize); // Free the old memory space
  p ->memLocation=newPlace;  // Move relocation register
}
```
