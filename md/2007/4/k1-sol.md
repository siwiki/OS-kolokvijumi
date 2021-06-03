2007/april/SI Kolokvijum 1 - April 2007 - Resenja.doc
--------------------------------------------------------------------------------
io
```cpp
enum Status{OK, Error};

class DMA {
public:
//ulazni parametri: adresa bloka u memoriji, adresa registra podataka
//uređaja, adresa statusnog registra, maska za statusni registar, smjer
//operacije i velicina bloka
 virtual void start(void* mem, void* devData, void*  devStatus, int
StatusMask, int memToIO, int vel);

//rezultat: logicka vrijednost koja pokazuje da li je operacija zavrsena
 virtual int is_finished();

//zadaje kontroleru broj prekidne rutine preko koje traba da obavjesti
//sistem o kraju operacije
 virtual void setIntNo(int interruptNo);

//vraca status poslednje zavrsene operacije
 virtual Status getStatus()
}

```

--------------------------------------------------------------------------------
page

1. VA: Page(24) Offset(8)

   PA: Block(20) Offset(8)
2. ```cpp
  void setPageDescr(unsigned int* pmtp, unsigned int page, unsigned int frame){
      pmtp[page] = frame | ~((unsigned int)~0 / 2);
  }
   ```

--------------------------------------------------------------------------------
segpage

1. Potrebno je da postoji tabela svih pokrenutih programa. Za svaki program u tabeli se čuva
lista (pokazivaa na prvi u listi) PCB-ova procesa koji su pokrenuti nad tim programom. Pri
pokretanju novog, potrebno ga je uvezati u odgovarajuću listu. Ukoliko već postoji neki
proces pokrenutim nad istim programom, potrebno je u SMT i PMT tabele novog procesa
upisati trenutno stanje prisutnosti stranica u memoriji i odgovarajuće brojeve okvira. Jedan
način da to bude moguće uraditi je da se uz svaki proces pamti u koji dio virtuelnog adresnog
prostora tog procesa je učitan program.

   Kada se neka stranica učita u OM, potrebno je ažurirati deskriptore u svim PMT svih procesa
koji dijele tu stranicu. Isto je i kada neka stranica bude izbačena iz OM. Moguće je i efikasnije
rješenje (razmisliti o još po jednoj tabeli po programu u kojoj se čuvaju deskriptori njegovih
stranica, a da se u SMT/PMT procesa vrši redirekcija na ovu tabelu).
2. Opisani način se u potpunosti realizuje u OS.
3. Stek je dio konteksta svakog procesa i kao takav pravi razliku izmedju različitih
izvršavanja jednog koda. Stek je struktura podataka u koju se podaci i upisuju, a ne samo
čitaju. To znači da svaki proces ima svoj zaseban stek i iz tog razloga nije moguće djeljenje
stranica sa stekom. (Stranice su male da bi u njih moglo stati više stekova koji se neće
preklopiti).


--------------------------------------------------------------------------------
context

```cpp
typedef unsigned int PID;
#define MaxProc ... // Max number of processes
struct PCB {
  int sp;    // Saved stack pointer
  PID next;        // Next PCB in the Ready or a waiting list
  ...
};
PCB* allProcesses[MaxProc]; // Maps a PID to a PCB*
PID running; // The running process
PID ready;   // Head of Ready list

void yield(PCB* current, PCB* next){
  asm{
    push R0
    ...
    push Rn

    load R0, #current[BP]
    load #sp[R0], SP //#sp je pomjeraj odgovarajuceg polja strukture
    load R0, #next[BP]   // i u ovom slucaju je #sp=0
    load SP, #sp[R0]

    pop Rn
    ...
    pop R0
  }
  return;
}
```
Drugi način za `yield` (Neki kompajleri posjeduju registarske
pseudovarijable, pa je registrima moguće pristupiti i direktno iz C odnosno
C++ koda. Jedan od takvih je TC.):
```cpp
void yield(PCB* current, PCB* next){
  asm{
    push R0
    ...
    push Rn
  }
  current->sp = _SP;    //_SP je pseudovarijabla za SP
  _SP = next->sp;

  asm{
    pop Rn
    ...
    pop R0
  }
  return;
}


void suspend(){
  PCB* old = allProcesses[running];
  running = ready;
  ready = allProcesses[ready]->next;
  PCB* new = allProcesses[running];
  allProcesses[running]->next=0;
  yield(old, new);
  return;
}

resume(PID pid){
  int ind=(running != pid);
  for(PID i = 0;i < MaxProc;i++) if (allProcesses[i].next == pid) ind=0;
  if (ind){
    allProcesses[pid]->next = ready;
    ready = pid;
  }
}
```
--------------------------------------------------------------------------------
syscall

```cpp
#include <stdio.h>
#define N 3
int pid[N];

void main () {
  int i;
  for (i=0; i<N; i++) pid[i]=0;
  for (i=0; i<N; i++) pid[i]=fork();
  for (i=0; i<N; i++) printf(“%d ”,pid[i]);
}
```

U tri prolaza petlje u sredini kreira se 8 procesa: u prvom prolazu od 1 nastaju 2, u
drugom od svakog od ovih nastaju po 2, što je ukupno 4 i u trećem prolazu od svakog od ova
4 nastaju po 2, što je ukupno 8. Svaki od njih će imati sopstveni niz pid i ispisaće 3 broja. To
je ukupno 24 ispisana broja.

Posle svakog poziva `fork()`  ostaju po dva identična procesa (roditelj i novokreirani
potomak) koji se razlikuju samo po rezultatu `fork()`  funkcije. U prvom prolazu kroz petlju
ostaju dva procesa, jedan sa `pid[0]=0` i drugi sa `pid[0]<>0`. Pošto su u kontrolnim strukturama
ova dva procesa identicna, to znači da će od svakog od njih nastati isti broj novih procesa,
odnosno da će polovina svih procesa imati `pid[0]=0`, a druga `<>0`. Dalje, problem možemo
raščlaniti na dva koji imaju za 1 manju dimenziju problema (niz sa elementima `pid[1]`  i
`pid[2]`). To znači da će, iz istog razloga kao i u prethodnom slučaju, polovina procesa imati
`pid[1]=0`, a druga `<>0`. Ovakvim razmatranjem ili direktnim brojanjem dolazi se da je
polovina ispisanih brojeva jednaka nuli, odnosno 24/2 = 12 nula.
