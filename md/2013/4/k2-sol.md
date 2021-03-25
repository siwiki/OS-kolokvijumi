2013/april/SI, IR Kolokvijum 2 - April 2013 - Resenja.pdf
--------------------------------------------------------------------------------


1/2
Rešenja zadataka za drugi kolokvijum iz
Operativnih sistema 1
April 2013.
1. (10 poena)
type Coord = record {
  x : integer;
  y : integer;
};

var sharedCoord : Coord;
    mutex : Semaphore = 1;

process Helicopter
var nextCoord : Coord;
begin
  loop
    computeNextCoord(nextCoord);
    mutex.wait();
    sharedCoord := nextCoord;
    mutex.signal();
  end;
end;

process PoliceCar
var nextCoord : Coord;
begin
  loop
    mutex.wait();
    nextCoord := sharedCoord;
    mutex.signal();
    moveTo(nextCoord);
  end;
end;
2. (10 poena)
Data implementacija nije dobra jer je moguće utrkivanje (race condition) između izvršavanja
istog ovog koda za isti semafor na dva (ili više) procesora. I jedan i drugi procesor mogu da
izvrše petlju while i iz nje izađu, uporedno pročitavši iz atributa lck vrednost 1,  a potom
izvrše swap i izađu iz operacije lock, odnosno uđu u operaciju semafora. Ispravljena verzija
je sledeća (ima i nešto malo efikasnijih, kako je prikazano na predavanjima):
void Semaphore::lock() {
  int zero = 0;
  mask_interrupts();
  while (!zero) swap(&zero,&(this->lck));
}
3. (10 poena)
int mem_extend (PCB* p, size_t by) {
  if (p==0 || by<0) return -1; // Error: invalid argument
  if (by==0) return 0;
  Word* tail = p->mem_base + p->mem_size;
  if (mem_alloc(tail,by)<0) return -2; // Error: allocation failed
  p->mem_size+=by; // Extend
  return 1;
}

2/2
4. (10 poena)
a)(3) VA(64): Page1(18):Page2(18):Page3(18):Offset(10).
PA(40): Frame(30):Offset(10).
b)(3) Širina PMT3 je 30+2=32 bita. Ista je i širina PMT1 i PMT2.
 PMT1 ima 2
18
 ulaza širine 32 bita (4B), što je ukupno: 2
20
B=1MB.
c)(4) Ovaj proces koristio je 2
30
 svojih najnižih adresa, što je 2
30-10
=2
20
 stranica. Jedna PMT
trećeg nivoa pokriva 2
18
 stranica, pa je ovaj proces alocirao PMT prvog nivoa, jednu PMT
drugog nivoa i četiri PMT trećeg nivoa. Zato ukupna veličina PMT iznosi 61MB=6MB.
