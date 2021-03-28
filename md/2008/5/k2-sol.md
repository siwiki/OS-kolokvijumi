2008/maj/SI Kolokvijum 2 - Maj 2008 - Resenja.doc
--------------------------------------------------------------------------------
semaphore

Prva varijanta zaključava semafor (kao deljeni resurs) maskiranjem prekida i uposlenim čekanjem
(operacijom tipa *test and set*) nad jednom zajedničkom varijablom (`commonLock`) koja se koristi za sve semafore (instance klase `Semaphore`), dok druga varijanta radi to isto samo korišćenjem posebne varijable za svaki semafor (`myLock`). Prva varijanta ne dozvoljava ulaz u kod operacije nad
semaforom nekom procesoru ako je bilo koji drugi procesor ušao u kod operacije nad bilo kojim
drugim semaforom, dok su kod druge varijante moguća paralelna izvršavanja koda operacija nad
različitim semaforima. Odatle slede zaključci:

- Ukoliko kod operacija nad semaforom ne uzrokuje konflikte na deljenim strukturama koje
se koriste u izvršavanjima na različitim procesorima, onda su obe varijante korektne. U
suprotnom, ukoliko ovaj kod uzrokuje ovakve konflikte, npr. korišćenjem istog reda
spremnih procesa za različite procesore bez obezbeđenja međusobnog isključenja nad tom
strukturom, onda je samo prva varijanta korektna (pod uslovom da ne pravi konflikte sa
drugim uslugama operativnog sistema), a druge ne.
- Druga varijanta omogućava znatno veći stepen paralelizma, jer ne zaustavlja napredovanje
operacije nad jednim semaforom na jednom procesoru zbog toga što je drugi procesor ušao
u operaciju nad drugim semaforom, kako to čini prva varijanta.

--------------------------------------------------------------------------------
buffer

```cpp
class Data;
const int N = ...;

class BoundedBuffer {
public:
  BoundedBuffer();
  void put (Data*);
  Data* get (int consumerID);  // consumerID should be 1 or 2
private:
  Data* buf[N];
  int head, tail;
  Semaphore mutex, spaceAvailable, itemAvailable, gate1, gate2;
};

BoundedBuffer::BoundedBuffer () :
  head(0), tail(0),
  mutex(1), spaceAvailable(N), itemAvailable(0),
  gate1(1), gate2(0) {}

void BoundedBuffer::put (Data* d) {
    spaceAvailable.wait();
    mutex.wait();
    buf[tail]=d;
    tail=(tail+1)%N;
    mutex.signal();
    itemAvailable.signal();
}

Data* BoundedBuffer::get (int myID) {
    if (myID==1)
      gate1.wait();
    else if (myID==2)
      gate2.wait();
    else return 0; // Error

    itemAvailable.wait();
    mutex.wait();
    Data* d = buf[head];
    head=(head+1)%N;
    mutex.signal();
    spaceAvailable.signal();
    if (myID==1)
      gate2.signal();
    else if (myID==2)
      gate1.signal();
    return d;
}
```
Prikazano rešenje je napisano uz pretpostavku da se jednoj niti daje prednost, tj. unapred je
određena nit koja mora prva da uzme podatak iz bafera. To rešenje je u potpunosti ispravno i
prihvatljivo, ali je moguće dati i za nijansu bolje rešenje. U nastavku je prikazano rešenje koje ne
favorizuje nijednu nit, tj. ona nit koja prva zatraži podatak, dobija ga, a dalje se uzimanje podataka
iz bafera obavlja naizmenično. Izmene u odnosu na prethodno rešenje su posebno naznačene.

```cpp

class Data;
const int N = ...;

class BoundedBuffer
{
public:
  BoundedBuffer();
  void put (Data*);
  Data* get (int consumerID);  // consumerID should be 1 or 2
private:
  Data* buf[N];
  int head, tail, **firstTime**; // IZMENA
  Semaphore mutex, spaceAvailable, itemAvailable, gate1, gate2;
};

BoundedBuffer::BoundedBuffer () :
  head(0), tail(0), **firstTime (1)**, // IZMENA
  mutex(1), spaceAvailable(N), itemAvailable(0),
  gate1(0), gate2(0) {}

void BoundedBuffer::put (Data* d) {
    spaceAvailable.wait();
    mutex.wait();
    buf[tail]=d;
    tail=(tail+1)%N;
    mutex.signal();
    itemAvailable.signal();
}

Data* BoundedBuffer::get (int myID) {
    // IZMENA:
    if (firstTime) { //dobro zbog brzine, da se izbegne nepotrebna
                     // sinhronizacija posle prvog puta
      mutex.wait();
      if (firstTime) { //iako je vec provereno, mora se ponovo proveriti
                       // nedeljivo sa promenom
        if (myID==1)
          gate1.signal();
        else if (myID==2)
          gate2.signal();
        firstTime = 0;
      }
      mutex.signal()
    } //firstTime
    // KRAJ IZMENE

    if (myID==1)
      gate1.wait();
    else if (myID==2)
      gate2.wait();
    else return 0; // Error
    itemAvailable.wait();
    mutex.wait();
    Data* d = buf[head];
    head=(head+1)%N;
    mutex.signal();
    spaceAvailable.signal();
    if (myID==1)
      gate2.signal();
    else if (myID==2)
      gate1.signal();
    return d;
}
```
--------------------------------------------------------------------------------
linker

Iako ovakvi entiteti imaju isto *nekvalifikovano* ime u datom programu, oni imaju različita potpuno
*kvalifikovana* imena (engl. *fully qualified name*) koja se sastoje od pune staze imena njihovih
okružujućih prostora imena. Na primer, statički podatak-član `m` klase `X` ima potpuno kvalifikovano
ime `X::m`, dok istoimeni član klase `Y` ima potpuno kvalifikovano ime `Y::m`; slično važi za
ugnežđene prostore imena (npr. `P::Q::R::S::t`). Da bi se omogućilo definisanje istoimenih
simbola u različitim prostorima imena, prevodilac jednostavno kao simbol u `.obj` fajlu definiše
potpuno kvalifikovano ime, a ne nekvalifikovano ime, tako da linker vidi to jednoznačno puno ime.
Drugim rečima, linker ne poznaje pojam prostora imena niti kvalifikovanog imena, za njega su svi
simboli jednostavni nizovi znakova koji moraju biti jednoznačno definisani. Prevodilac obezbeđuje
ovu jednoznačnosti korišćenjem punih kvalifikovanih imena kao imena simbola koje ostavlja
linkeru.

--------------------------------------------------------------------------------
page

1. Virtuelni adresni prostor: $4GB = 22\times 2^{30}B = 2^{32}B$, pa je virtuelna adresa širine 32 bita.
Fizički adresni prostor: $256MB = 28\times2^{20} B = 2^{28}B$, pa je fizička adresa širine 28 bita.
Veličina stranice i okvira: $4KB = 22*2^{10}B = 2^{12}B$, pa je širina polja za pomeraj unutar stranice i okvira 12 bita.

   Odatle sledi da je širina polja unutar virtuelne adrese za broj stranice 32-12 = 20 bita, širina polja za broj okvira unutar fizičke adrese 28-12 = 16 bita, a širina deskriptora (ulaza u PMT drugog nivoa) isto toliko – 16 bita, odnosno 2 bajta.

   Stranica prvog nivoa ima $1K = 2^{10}$ ulaza, pa je širina polja za indeksiranje PMT prvog nivoa 10 bita, a za indeksiranje PMT drugog nivoa 20-10 = 10 bita.

   Prema tome, struktura virtuelne adrese je: Page_L1(10):Page_L2(10):Offset(12).
2. Ulaz u PMT prvog nivoa sadrži adresu početka PMT drugog nivoa u fizičkoj memoriji, s tim da vrednost 0 može da označava nekorišćeni ospeg stranica (invalidan ulaz), pošto se ni PMT drugog nivoa ne može smestiti počev od adrese 0. Prema tome, širina ulaza u PMT prvog nivoa je najmanje jednaka širini fizičke adrese, što je 28 bita. Drugim rečima, jedan ulaz u PMT prvog nivoa zauzima 4 bajta.
3. PMT prvog nivoa zauzima 1K ulaza po 4 bajta, dakle 4KB.
Jedan ulaz u PMT drugog nivoa sadrži broj okvira, koji je širine 16 bita, pa zauzima 2 bajta.
PMT drugog nivoa ima $2^{10} = 1K$ ulaza, pa zauzima 2KB.
Prema tome, PMT ukupno zauzimaju maksimalno:
$4\times 2^{10}B$ (veličina PMT prvog nivoa) $+ 2^{10}$ (broj PMT drugog nivoa) $\times 2^{11}B$ (veličina PMT drugog nivoa) $= 4\times 2^{10} B + 2^{21}B$, što je približno (odnosno nešto veće od) $2^{21}B= 2MB$.
4. Dati proces ima validna samo prva dva i poslednji ulaz u PMT prvog nivoa, dakle za njega postoje samo tri PMT drugog nivoa u memoriji. 
Ukupna veličina PMT za ovaj proces je zato:
$4\times2^{10}B$ (veličina PMT prvog nivoa) $+ 3$ (broj PMT drugog nivoa) $\times 2^{11}B$ (veličina PMT drugog nivoa) $= 4 \times 2^{10}B + 6 \times 2^{10}B = 10KB$.


--------------------------------------------------------------------------------
page

- Indikator da li se stranica nalazi u fizičkoj memoriji. Da
- Indikator da li je stranica uopšte dozvoljena za pristup (registrovana kao korišćeni deo virtuelnog adresnog prostora). Ne
- Indikator da li je hardveru dozvoljena upis u stranicu. Da
- Indikator da li je dozvoljen upis u stranicu, ali je ona deljena sa *copy-on-write* semantikom. Ne
- Indikator da li je stranica „prljava“, odnosno menjana od svog učitavanja. Da
- Broj okvira u koji se stranica preslikava. Da
- Broj bloka na particiji za zamenu stranica. Ne
