2007/maj/SI Kolokvijum 2 - Maj 2007 - Resenja.doc
--------------------------------------------------------------------------------
semaphore
```cpp
class Semaphore {
public:
  Semaphore (unsigned int value=1);
  void wait ();
  void signal();
protected:
  inline void lock();    // inline nije semantički bitan
  inline void unlock();  // inline nije semantički bitan
private:
  int lock;
  unsigned int val;
};

Semaphore::Semaphore (unsigned int v) : lock(0), val(v) {}

void Semaphore::lock () {
  set_interrupts(0);
  for (int lck=1; lck;) swap(&lck,&lock);
}

void Semaphore::unlock () {
  lock=0;
  set_interrupts(1);
}

void Semaphore::wait () {
  for (int done==0; !done; ) {
    while(val==0);
    lock();
      if (val==0) { unlock(); continue; }
      done=1;
      val--;
    unlock();
  }
}

void Semaphore::signal () {
  lock();
  val++;
  unlock();
}
```
--------------------------------------------------------------------------------
concurrency

```cpp
class BoundedBuffer {
public:
  BoundedBuffer(int capacity);
  void put (char* package, int size);
  void get (char* package, int size);
private:
  char* buf;
  int capacity, head, tail;
  Semaphore spaceAvailable, itemAvailable;
};

BoundedBuffer::BoundedBuffer (int cap) :
  buf(new char[cap]), capacity(cap), head(0), tail(0),
  spaceAvailable(cap), itemAvailable(0) {}

void BoundedBuffer::put (char* p, int n) {
  for (int i=0; i<n; i++) {
    spaceAvailable.wait();
    buf[tail]=p[i];
    tail=(tail+1)%capacity;
    itemAvailable.signal();
  }
}
```
Operacija `get` analogno.

--------------------------------------------------------------------------------
dynload
```cpp
double h (double _1, int _2) {
  typedef double (*PFUN)(double,int);
  static PFUN _my_impl = NULL;
  if (_my_impl == NULL) {
    void* _m = alloc_and_load(“m.dlm“);
    if (_m ==   NULL) exit(1);  // Error
    _my_impl = (PFUN)((int)((void**)_m)[2]+(int)_m)
  }
  return _my_impl(_1,_2);
}
```
--------------------------------------------------------------------------------
page

1. Virtuelni adresni prostor: $16EB = 2^{4} \times 2^{60} B = 2^{64} B$, pa je virtuelna adresa širine 64 bita.
Fizički adresni prostor: $1TB = 2^{40} B$, pa je fizička adresa širine 40 bita.
Veličina stranice i okvira: $16 MB = 2^{4} \times 2^{20} B = 2^{24} B$, pa je širina polja za pomeraj unutar stranice i
okvira 24 bita.

   Odatle sledi da je širina polja unutar virtuelne adrese za broj stranice 64-24 = 40 bita, širina polja za
broj okvira unutar fizičke adrese 40-24 = 16 bita, a širina deskriptora (ulaza u PMT drugog nivoa)
isto toliko – 16 bita, odnosno 2 bajta.

   Stranica prvog nivoa ima $1M = 2^{20}$ ulaza, pa je širina polja za indeksiranje PMT prvog nivoa 20
bita, a za indeksiranje PMT drugog nivoa 40 - 20 = 20 bita.
Prema tome, struktura virtuelne adrese je: Page_L1(20):Page_L2(20):Offset(24).
2. Ulaz u PMT prvog nivoa sadrži adresu početka PMT drugog nivoa u fizičkoj memoriji, s
tim da vrednost 0 može da označava nekorišćeni ospeg stranica (invalidan ulaz), pošto se ni PMT
drugog nivoa ne može smestiti počev od adrese 0. Prema tome, širina ulaza u PMT prvog nivoa je
jednaka širini fizičke adrese, što je 40 bita. Drugim rečima, jedan ulaz u PMT prvog nivoa zauzima
5 bajtova.
3. PMT prvog nivoa zauzima 1M ulaza po 5 bajtova, dakle 5MB.
Jedan ulaz u PMT drugog nivoa sadrži broj okvira, koji je širine 16 bita, pa zauzima 2 bajta.
PMT drugog nivoa ima $2^{20}$ = 1M ulaza, pa zauzima 2MB.
Prema tome, PMT ukupno zauzimaju maksimalno:
$5 \times 2^{20} B$(veličina PMT prvog nivoa) $+ 2^{20}$ (broj PMT drugog nivoa) $\times  2^{21} B$ (veličina PMT drugog nivoa) $= 5 \times 2 ^ {20} B + 2 ^{41} B$, što je približno (odnosno nešto veće od) $2^{41} B = 2TB$ (terabajta).
4. Dati proces ima validan samo prvi i poslednji ulaz u PMT prvog nivoa, dakle za njega postoje
samo dve PMT drugog nivoa u memoriji. Ukupna veličina PMT za ovaj proces je zato:
$5 \times 2^{20} B$ (veličina PMT prvog nivoa) + 2 (broj PMT drugog nivoa) $\times  2^{21} B$ (veličina PMT drugog nivoa) $= 5 \times 2 ^ {20} B + 4 \times 2 ^ {20} B = 9 MB$, što je značajno manje od fizičkog adresnog prostora.

--------------------------------------------------------------------------------
cont

1. 0770h
2. 4010h 
3. 3A0Ah
